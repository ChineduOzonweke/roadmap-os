/**
 * Minimal synchronous key-value boundary. The browser adapter and the local
 * backup store both sit on top of this, so tests can swap in memory storage.
 * `set` throws when the write fails (quota, private mode); callers decide.
 */
export interface KV {
  get(key: string): string | null;
  set(key: string, value: string): void;
  remove(key: string): void;
}

export function browserKV(): KV {
  return {
    get: (key) => window.localStorage.getItem(key),
    set: (key, value) => window.localStorage.setItem(key, value),
    remove: (key) => window.localStorage.removeItem(key),
  };
}

/** In-memory KV for tests. `quota` (in characters across all keys) simulates a full store. */
export function memoryKV(initial: Record<string, string> = {}, quota = Infinity): KV & { dump(): Record<string, string> } {
  const data = new Map(Object.entries(initial));
  const size = () => [...data.entries()].reduce((n, [k, v]) => n + k.length + v.length, 0);
  return {
    get: (key) => data.get(key) ?? null,
    set: (key, value) => {
      const before = data.get(key);
      data.set(key, value);
      if (size() > quota) {
        if (before === undefined) data.delete(key);
        else data.set(key, before);
        throw new Error("QuotaExceededError: storage is full");
      }
    },
    remove: (key) => void data.delete(key),
    dump: () => Object.fromEntries(data),
  };
}
