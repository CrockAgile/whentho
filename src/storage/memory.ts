import { StorageClient, StorageItem, StorageKey } from './client';

export class MemoryStorageClient extends StorageClient {
  public storage = new Map<string, { value: string; expiration: number }>();
  async putItem(item: StorageItem): Promise<void> {
    const key = StorageClient.stringifyKey(item);
    const { value, expiration } = item;
    this.storage.set(key, { value, expiration });
  }
  async deleteItem(item: StorageItem): Promise<void> {
    const key = StorageClient.stringifyKey(item);
    this.storage.delete(key);
  }
  async getItem(storageKey: StorageKey): Promise<StorageItem | null> {
    const key = StorageClient.stringifyKey(storageKey);
    const value = this.storage.get(key);
    if (!value) {
      return null;
    }
    return { ...storageKey, ...value };
  }
  // bad performance but only used for testing
  async listScope(scope: string): Promise<StorageItem[]> {
    const found = [];
    for (const [stringKey, value] of this.storage) {
      if (stringKey.startsWith(scope)) {
        const key = StorageClient.parseKey(stringKey);
        found.push({ ...key, ...value });
      }
    }
    return found;
  }
  clear() {
    this.storage.clear();
  }
}
