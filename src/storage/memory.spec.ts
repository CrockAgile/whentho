import { StorageItem } from './client';
import { MemoryStorageClient } from './memory';

const client = new MemoryStorageClient();

describe('memory storage client', () => {
  it('stores items', async () => {
    const items: StorageItem[] = [
      {
        kind: 'meeting',
        scope: '1100AABB',
        value: JSON.stringify({ name: 'Movie Night' }),
      },
    ];

    await client.put(items);

    const retrieved = await client.get(items);
    expect(retrieved).toEqual(items);
  });
  it('lists items', async () => {
    const items: StorageItem[] = [
      {
        kind: 'meeting',
        scope: '1100AABB',
        value: JSON.stringify({ name: 'Movie Night' }),
      },
    ];

    await client.put(items);

    const retrieved = await client.list([items[0].scope]);
    expect(retrieved).toEqual(items);
  });
});
