import { uuid } from 'uuidv4';
import { ModelAPI, Meeting, Vote } from './index';
import { MemoryStorageClient } from '../storage';

describe('model API', () => {
  const client = new MemoryStorageClient();
  const api = new ModelAPI(client);
  const id = uuid();
  const interval = 1800;
  const start = 1622505600;
  const end = start + 10 * interval;
  const meeting: Meeting = { kind: 'meeting', start, end, interval, id };

  const nowSpy = jest.spyOn(global.Date, 'now');

  const mockNowSec = start - 10 * interval;
  const mockNowMilli = mockNowSec * 1000;
  nowSpy.mockImplementation(() => mockNowMilli);

  afterAll(() => {
    nowSpy.mockRestore();
  });

  beforeEach(() => {
    client.clear();
  });

  it('gets maxmimum TTL', () => {
    expect(api.getMaxTTL()).toMatchInlineSnapshot(`15552000`);
  });

  it('creates meeting', async () => {
    await api.createMeeting(meeting);

    const retrieved = await api.getMeetingVotes([id]);
    expect(retrieved).toEqual([{ ...meeting, votes: [] }]);
  });

  it('fails to create meeting beyond max TTL', async () => {
    const beyondEnd = mockNowSec + api.getMaxTTL() + interval;
    const result = api.createMeeting({
      ...meeting,
      start: mockNowSec,
      end: beyondEnd,
    });
    expect(result).rejects.toThrowErrorMatchingInlineSnapshot(
      `"Time is not within maximum TTL"`,
    );
  });

  it('fails to create meeting that ends before now', async () => {
    const beforeNow = mockNowSec - interval;
    const result = api.createMeeting({
      ...meeting,
      start: mockNowSec,
      end: beforeNow,
    });
    expect(result).rejects.toThrowErrorMatchingInlineSnapshot(
      `"Time is not within minimum TTL"`,
    );
  });

  it('fails to list meeawait ting not using full UUID prefix', async () => {
    // try to enumerate all meetings beginning with 'a'
    const result = api.getMeetingVotes(['a']);
    expect(result).rejects.toThrowErrorMatchingInlineSnapshot(
      `"Invalid meeting ID"`,
    );
  });

  it('fails to create meeting without start aligned to interval', async () => {
    const result = api.createMeeting({ ...meeting, start: start - 1 });
    expect(result).rejects.toThrowErrorMatchingInlineSnapshot(
      `"Start time must align to interval"`,
    );
  });

  it('fails to create meeting without end aligned to interval', async () => {
    const result = api.createMeeting({ ...meeting, end: end + 1 });
    expect(result).rejects.toThrowErrorMatchingInlineSnapshot(
      `"End time must align to interval"`,
    );
  });

  it('fails to create a meeting without one interval in time range', async () => {
    const result = api.createMeeting({ ...meeting, end: start });
    expect(result).rejects.toThrowErrorMatchingInlineSnapshot(
      `"Time range must allow one interval"`,
    );
  });

  it('fails to create a meeting with invalid interval', async () => {
    const interval = 60;
    const start = mockNowSec + interval;
    const end = start + interval;
    const result = api.createMeeting({ ...meeting, interval, start, end });
    expect(result).rejects.toThrowErrorMatchingInlineSnapshot(
      `"Meeting interval must be multiple of 300 seconds"`,
    );
  });

  describe('votes', () => {
    const name = 'Jeff';

    const time = start + interval;

    const vote: Vote = { kind: 'vote', meetingId: id, name, time };
    const votes = [vote];

    it('votes for meeting', async () => {
      await api.createMeeting(meeting);
      await api.vote(votes);

      const retrieved = await api.getMeetingVotes([id]);
      expect(retrieved).toEqual([{ ...meeting, votes }]);
    });

    it('deletes votes for meeting', async () => {
      await api.createMeeting(meeting);
      await api.vote(votes);

      const retrieved = await api.getMeetingVotes([id]);
      expect(retrieved).toEqual([{ ...meeting, votes }]);

      await api.deleteVote(votes);

      const empty = await api.getMeetingVotes([id]);
      expect(empty).toEqual([{ ...meeting, votes: [] }]);
    });

    it('votes for meeting with multiple names', async () => {
      await api.createMeeting(meeting);

      const bountyVotes = [
        {
          ...vote,
          name: 'Jango',
        },
        {
          ...vote,
          name: 'Boba',
        },
      ];

      await api.vote(bountyVotes);
      const retrieved = await api.getMeetingVotes([id]);
      expect(retrieved).toEqual([{ ...meeting, votes: bountyVotes }]);
    });

    it('ignores votes without meeting', async () => {
      await api.vote(votes);
      const retrieved = await api.getMeetingVotes([id]);
      expect(retrieved).toEqual([]);
    });

    it('ignores votes before start of interval', async () => {
      await api.createMeeting(meeting);
      await api.vote([{ ...vote, time: start - interval }]);
      const retrieved = await api.getMeetingVotes([id]);
      expect(retrieved).toEqual([{ ...meeting, votes: [] }]);
    });

    it('ignores votes at end of interval', async () => {
      await api.createMeeting(meeting);
      await api.vote([{ ...vote, time: end }]);
      const retrieved = await api.getMeetingVotes([id]);
      expect(retrieved).toEqual([{ ...meeting, votes: [] }]);
    });

    it('fails to vote with name including reserved ":" character', async () => {
      const result = api.vote([{ ...vote, name: 'Star Wars: A New Hope' }]);
      expect(result).rejects.toThrowErrorMatchingInlineSnapshot(
        `"Vote name cannot include reserved characters"`,
      );
    });

    it('fails to vote with name including reserved "#" character', async () => {
      const result = api.vote([{ ...vote, name: 'Mambo #5' }]);
      expect(result).rejects.toThrowErrorMatchingInlineSnapshot(
        `"Vote name cannot include reserved characters"`,
      );
    });

    it('fails to vote before now', async () => {
      const result = api.vote([{ ...vote, time: mockNowSec - interval }]);
      expect(result).rejects.toThrowErrorMatchingInlineSnapshot(
        `"Time is not within minimum TTL"`,
      );
    });

    it('fails to vote after max TTL', async () => {
      const result = api.vote([
        { ...vote, time: mockNowSec + api.getMaxTTL() + interval },
      ]);
      expect(result).rejects.toThrowErrorMatchingInlineSnapshot(
        `"Time is not within maximum TTL"`,
      );
    });
  });
});
