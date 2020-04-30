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
    const { scope, value } = item;
    switch (item.kind) {
      case 'meeting': {
        const rest: Omit<Meeting, 'kind' | 'id'> = JSON.parse(value);
        return {
          kind: item.kind,
          id: scope,
          ...rest,
        };
      }
      case 'vote': {
        const rest: Omit<Vote, 'kind' | 'meetingId'> = JSON.parse(value);
        return {
          kind: item.kind,
          meetingId: scope,
          ...rest,
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
          value,
        };
      }
      case 'vote': {
        const { kind, meetingId, name, time } = model;
        const value = JSON.stringify({ name, time });
        return {
          kind,
          scope: meetingId,
          value,
        };
      }
    }
  }

  put(models: Model[]): Promise<void> {
    const items = models.map(ModelAPI.toItem);
    return this.client.put(items);
  }

  async list(ids: string[]): Promise<MeetingWithVotes[]> {
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
