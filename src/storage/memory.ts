import { StorageClient, StorageItem, StorageKey } from './client';

export class MemoryStorageClient extends StorageClient {
  private storage = new Map<string, string>();
  async putItem(item: StorageItem): Promise<void> {
    const key = StorageClient.stringifyKey(item);
    this.storage.set(key, item.value);
  }
  async getItem(storageKey: StorageKey): Promise<StorageItem | null> {
    const key = StorageClient.stringifyKey(storageKey);
    const value = this.storage.get(key);
    if (!value) {
      return null;
    }
    return { ...storageKey, value };
  }
  // bad performance but only used for testing
  async listScope(scope: string): Promise<StorageItem[]> {
    const found = [];
    for (const [stringKey, value] of this.storage) {
      if (stringKey.startsWith(scope)) {
        const key = StorageClient.parseKey(stringKey);
        found.push({ ...key, value });
      }
    }
    return found;
  }
}
