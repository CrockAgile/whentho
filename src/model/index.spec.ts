import { ModelAPI, Meeting } from './index';
import { MemoryStorageClient } from '../storage';

describe('model API', () => {
  const client = new MemoryStorageClient();
  const api = new ModelAPI(client);
  it('creates meeting', async () => {
    const id = '010239012';
    const interval = 1800;
    const start = interval;
    const end = start + 10 * interval;
    const meetings: Meeting[] = [{ kind: 'meeting', start, end, interval, id }];
    await api.put(meetings);

    const retrieved = await api.list([id]);
    expect(retrieved).toEqual(meetings.map(m => ({ ...m, votes: [] })));
  });
});
