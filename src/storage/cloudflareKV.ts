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
  private async getItemByKey(key: string): Promise<StorageItem | null> {
    const value = await WhenThoNameSpace.get(key);
    if (!value) {
      return null;
    }
    const storageKey = StorageClient.parseKey(key);
    return { ...storageKey, value };
  }
  async getItem(storageKey: StorageKey): Promise<StorageItem | null> {
    const key = StorageClient.stringifyKey(storageKey);
    return this.getItemByKey(key);
  }
  async listScope(scope: string): Promise<StorageItem[]> {
    let list_complete = false;
    let cursor: string | undefined = undefined;
    const itemMaybePromises = [];

    while (!list_complete) {
      // have to use promise intermediary because TS 3.8 has type deduction bug
      const listResultPromise = WhenThoNameSpace.list({
        prefix: scope,
        cursor,
      });
      const listResult = await listResultPromise;
      const { keys } = listResult;

      for (const key of keys) {
        itemMaybePromises.push(this.getItemByKey(key.name));
      }

      cursor = listResult.cursor;
      list_complete = listResult.list_complete;
    }

    const maybeItems = await Promise.all(itemMaybePromises);
    const allItems = [];

    for (const item of maybeItems) {
      if (item) {
        allItems.push(item);
      }
    }

    return allItems;
  }
}
