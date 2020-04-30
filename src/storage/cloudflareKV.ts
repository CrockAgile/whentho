import { KVNamespace } from '@cloudflare/workers-types';
import { StorageClient, StorageItem, StorageKey } from './client';

declare global {
  const WhenThoNameSpace: KVNamespace;
}

export class CloudflareKVStorageClient extends StorageClient {
  private ttl: number;
  constructor(ttl: number) {
    super();
    this.ttl = ttl;
  }
  async putItem(item: StorageItem): Promise<void> {
    const key = StorageClient.stringifyKey(item);
    await WhenThoNameSpace.put(key, item.value, { expirationTtl: this.ttl });
  }
  async getItem(storageKey: StorageKey): Promise<StorageItem | null> {
    const key = StorageClient.stringifyKey(storageKey);
    const value = await WhenThoNameSpace.get(key);
    if (!value) {
      return null;
    }
    return { ...storageKey, value };
  }
  async listScope(scope: string): Promise<StorageItem[]> {
    const allItems: StorageItem[] = [];

    let list_complete = false;
    let cursor: string | undefined = undefined;

    while (!list_complete) {
      // have to use promise intermediary because TS 3.8 has type deduction bug
      const listResultPromise = WhenThoNameSpace.list({
        prefix: scope,
        cursor,
      });
      const listResult = await listResultPromise;
      const { keys } = listResult;

      const itemsPromise = keys.map(async ({ name }) => {
        const value = await WhenThoNameSpace.get(name);
        const storageKey = StorageClient.parseKey(name);
        return {
          ...storageKey,
          value,
        };
      });

      const items = await Promise.all(itemsPromise);

      for (const item of items) {
        if (item.value) {
          allItems.push(item as StorageItem);
        }
      }

      cursor = listResult.cursor;
      list_complete = listResult.list_complete;
    }

    return allItems;
  }
}
