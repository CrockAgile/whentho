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
          id,
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
          id,
          value,
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
        };
      }
    }
  }

  async createMeeting(meeting: Meeting): Promise<void> {
    const { start, end, interval } = meeting;
    if (start + interval > end) {
      throw new Error('Time range must allow one interval');
    }
    if (start % interval !== 0) {
      throw new Error('Start time must align to interval');
    }
    if (end % interval !== 0) {
      throw new Error('End time must align to interval');
    }
    const item = ModelAPI.toItem(meeting);
    await this.client.putItem(item);
  }

  vote(votes: Vote[]): Promise<void> {
    const items = votes.map(ModelAPI.toItem);
    return this.client.put(items);
  }

  async getMeetingVotes(ids: string[]): Promise<MeetingWithVotes[]> {
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
      return {
        votes,
        ...meeting,
      };
    });
  }
}
