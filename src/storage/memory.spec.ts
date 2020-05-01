import { StorageItem } from './client';
import { MemoryStorageClient } from './memory';

const client = new MemoryStorageClient();

describe('memory storage client', () => {
  beforeEach(() => {
    client.clear();
  });
  const id = '1100AABB';

  const items: StorageItem[] = [
    {
      id,
      kind: 'meeting',
      scope: id,
      value: JSON.stringify({ name: 'Movie Night' }),
    },
  ];

  it('stores items', async () => {
    await client.put(items);

    const retrieved = await client.get(items);
    expect(retrieved).toEqual(items);
  });

  it('lists items', async () => {
    await client.put(items);

    const retrieved = await client.list([items[0].scope]);
    expect(retrieved).toEqual(items);
  });

  it('deletes items', async () => {
    await client.put(items);
    await client.delete(items);
    const retrieved = await client.list([items[0].scope]);
    expect(retrieved).toEqual([]);
  });
});
