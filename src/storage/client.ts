export interface StorageKey {
  scope: string;
  kind: 'meeting' | 'vote';
  id: string;
}

export interface StorageItem extends StorageKey {
  value: string;
}

export abstract class StorageClient {
  static stringifyKey(storageKey: StorageKey): string {
    const { kind, scope, id } = storageKey;
    return [scope, kind, id].join(':');
  }
  static parseKey(stringKey: string): StorageKey {
    const [scope, kind, id] = stringKey.split(':');
    return { scope, kind, id } as StorageKey;
  }
  public abstract putItem(item: StorageItem): Promise<void>;
  public async put(items: StorageItem[]): Promise<void> {
    const putItems = items.map(i => this.putItem(i));
    await Promise.all(putItems);
  }
  public abstract getItem(key: StorageKey): Promise<StorageItem | null>;
  public async get(keys: StorageKey[]): Promise<StorageItem[]> {
    const getItems = keys.map(k => this.getItem(k));
    const items = await Promise.all(getItems);
    const found = [];
    for (const item of items) {
      if (item) {
        found.push(item);
      }
    }
    return found;
  }
  public abstract listScope(scope: string): Promise<StorageItem[]>;
  public async list(scopes: string[]): Promise<StorageItem[]> {
    const items = scopes.map(s => this.listScope(s));
    const allItems = await Promise.all(items);
    return allItems.flat();
  }
}
