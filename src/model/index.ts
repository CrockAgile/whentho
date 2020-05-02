import { isUuid } from 'uuidv4';
import { StorageClient, StorageItem } from '../storage';

export type Meeting = {
  kind: 'meeting';
  id: string;
  interval: number;
  start: number;
  end: number;
  name?: string;
};

export interface MeetingWithVotes extends Meeting {
  votes: Vote[];
}

const VOTE_ID_SEPARATOR = '#';
const RESERVED_CHARACTER_REGEX = /[#:]/mu;
const MEETING_BASE_INTERVAL = 60 * 5;
export const MAX_ITEM_TTL = 60 * 60 * 24 * 180;

export type Vote = {
  kind: 'vote';
  meetingId: string;
  name: string;
  time: number;
};

export type Model = Meeting | Vote;

export class ModelAPI {
  private client: StorageClient;
  constructor(client: StorageClient) {
    this.client = client;
  }

  private static fromItem(item: StorageItem): Model {
    const { scope, value, id } = item;
    switch (item.kind) {
      case 'meeting': {
        const rest: Omit<Meeting, 'kind' | 'id'> = JSON.parse(value);
        return {
          kind: item.kind,
          // scope and ID are the same for meetings
          id: scope,
          ...rest,
        };
      }
      case 'vote': {
        const [timeStr, name] = id.split(VOTE_ID_SEPARATOR);
        const time = parseInt(timeStr);
        return {
          kind: item.kind,
          meetingId: scope,
          name,
          time,
        };
      }
    }
  }

  private static toItem(model: Model): StorageItem {
    switch (model.kind) {
      case 'meeting': {
        const { kind, end, id, interval, start, name } = model;
        const value = JSON.stringify({ end, interval, start, name });
        return {
          kind,
          scope: id,
          // set empty meeting ID since meeting ID is also scope
          id: '0',
          value,
          expiration: end,
        };
      }
      case 'vote': {
        const { kind, meetingId, name, time } = model;
        const id = [time, name].join(VOTE_ID_SEPARATOR);
        return {
          kind,
          scope: meetingId,
          id,
          value: '{}',
          expiration: time,
        };
      }
    }
  }

  private nowUnixSeconds(): number {
    return Math.floor(Date.now() / 1000);
  }

  private assertInstantIsWithinValidTimeRange(instants: number[]) {
    const now = this.nowUnixSeconds();
    const isWithinMinimumTTL = instants.every(i => i >= now);
    if (!isWithinMinimumTTL) {
      throw new Error('Time is not within minimum TTL');
    }

    const max = now + this.getMaxTTL();
    const isWithinMaxTTL = instants.every(i => i <= max);
    if (!isWithinMaxTTL) {
      throw new Error('Time is not within maximum TTL');
    }
  }

  getMaxTTL(): number {
    return MAX_ITEM_TTL;
  }

  async createMeeting(meeting: Meeting): Promise<void> {
    const { start, end, interval } = meeting;
    this.assertInstantIsWithinValidTimeRange([start, end]);

    if (start + interval > end) {
      throw new Error('Time range must allow one interval');
    }
    if (start % interval !== 0) {
      throw new Error('Start time must align to interval');
    }
    if (end % interval !== 0) {
      throw new Error('End time must align to interval');
    }
    if (interval % MEETING_BASE_INTERVAL !== 0) {
      throw new Error(
        `Meeting interval must be multiple of ${MEETING_BASE_INTERVAL} seconds`,
      );
    }
    const item = ModelAPI.toItem(meeting);
    await this.client.putItem(item);
  }

  async vote(votes: Vote[]): Promise<void> {
    this.assertInstantIsWithinValidTimeRange(votes.map(v => v.time));

    const isValidName = votes.every(
      v => !RESERVED_CHARACTER_REGEX.test(v.name),
    );
    if (!isValidName) {
      throw new Error('Vote name cannot include reserved characters');
    }
    const items = votes.map(ModelAPI.toItem);
    return await this.client.put(items);
  }

  async deleteVote(votes: Vote[]): Promise<void> {
    const items = votes.map(ModelAPI.toItem);
    return await this.client.delete(items);
  }

  async getMeetingVotes(ids: string[]): Promise<MeetingWithVotes[]> {
    const isValidId = ids.every(isUuid);
    if (!isValidId) {
      throw new Error('Invalid meeting ID');
    }
    const items = await this.client.list(ids);
    const parsed = items.map(ModelAPI.fromItem);

    const meetings: Meeting[] = [];
    const votes: Vote[] = [];

    for (const item of parsed) {
      if (item.kind === 'meeting') {
        meetings.push(item);
      } else if (item.kind === 'vote') {
        votes.push(item);
      }
    }

    const votesByMeetingId = votes.reduce((map, vote) => {
      const votes = map.get(vote.meetingId) || [];
      votes.push(vote);
      return map.set(vote.meetingId, votes);
    }, new Map<string, Vote[]>());

    return meetings.map(meeting => {
      const votes = votesByMeetingId.get(meeting.id) || [];
      const votesInRange = votes.filter(
        v =>
          v.time >= meeting.start &&
          v.time < meeting.end &&
          v.time % meeting.interval === 0,
      );
      return {
        votes: votesInRange,
        ...meeting,
      };
    });
  }
}
