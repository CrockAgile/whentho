import { ModelAPI, Meeting, Vote } from './index';
import { MemoryStorageClient } from '../storage';

describe('model API', () => {
  const client = new MemoryStorageClient();
  const api = new ModelAPI(client);
  const id = '010239012';
  const interval = 1800;
  const start = interval;
  const end = start + 10 * interval;
  const meeting: Meeting = { kind: 'meeting', start, end, interval, id };

  beforeEach(() => {
    client.clear();
  });

  it('creates meeting', async () => {
    await api.createMeeting(meeting);

    const retrieved = await api.getMeetingVotes([id]);
    expect(retrieved).toEqual([{ ...meeting, votes: [] }]);
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
  });
});
