import { afterEach, describe, expect, it, vi } from "vitest";
import type { UserState } from "@/types/state";
import { createStore } from "@/lib/store";
import { createBrowserAdapter, STATE_KEY } from "@/lib/persistence/browser";
import { createBackupStore, QUARANTINE_KEY } from "@/lib/persistence/backups";
import { memoryKV, type KV } from "@/lib/persistence/kv";
import type { PersistenceAdapter } from "@/lib/persistence";
import v1json from "./fixtures/v1-state.json";

const v1 = v1json as unknown as UserState;

function setup(initial: Record<string, string> = {}, quota = Infinity) {
  const kv = memoryKV(initial, quota);
  const adapter = createBrowserAdapter(() => kv);
  const backups = createBackupStore(kv);
  const store = createStore();
  return { kv, adapter, backups, store };
}

afterEach(() => vi.useRealTimers());

describe("store load", () => {
  it("upgrades existing v1 progress: snapshot of the original first, then the migrated document is saved", async () => {
    const { store, kv, adapter, backups } = setup({ [STATE_KEY]: JSON.stringify(v1) });
    await store.init(adapter, backups);
    const V2 = { ...v1, version: 2, sessions: [] };
    expect(store.getState()).toEqual(V2);
    expect(store.getStatus()).toMatchObject({ load: null, readOnly: false });
    expect(store.getStatus().snapshots.map((m) => m.reason)).toEqual(["before-migration"]); // counts as this week's snapshot
    const original = backups.get(backups.list().find((m) => m.reason === "before-migration")!.id)!;
    expect(original.state).toEqual(v1);
    expect(JSON.parse(kv.get(STATE_KEY)!)).toEqual(V2);
  });

  it("leaves current-version progress untouched until the user changes something", async () => {
    const V2 = JSON.stringify({ ...v1, version: 2, sessions: [] });
    const { store, kv, adapter, backups } = setup({ [STATE_KEY]: V2 });
    await store.init(adapter, backups);
    expect(store.getStatus().snapshots.map((m) => m.reason)).toEqual(["weekly"]);
    expect(kv.get(STATE_KEY)).toBe(V2);
  });

  it("does not snapshot an empty first run", async () => {
    const { store, adapter, backups } = setup();
    await store.init(adapter, backups);
    expect(store.getStatus().snapshots).toEqual([]);
  });

  it("quarantines unreadable stored JSON instead of letting the next save destroy it", async () => {
    vi.useFakeTimers();
    const { store, kv, adapter, backups } = setup({ [STATE_KEY]: '{"checks":{"a"' });
    await store.init(adapter, backups);
    expect(store.getStatus().load?.kind).toBe("quarantined");
    expect(backups.quarantined()[0].raw).toBe('{"checks":{"a"');
    store.update((s) => ({ ...s, currentWeek: 2 }));
    await vi.runAllTimersAsync();
    expect(JSON.parse(kv.get(STATE_KEY)!).currentWeek).toBe(2);
    expect(JSON.parse(kv.get(QUARANTINE_KEY)!)[0].raw).toBe('{"checks":{"a"'); // original still recoverable
  });

  it("refuses to save when unreadable data cannot be quarantined", async () => {
    vi.useFakeTimers();
    const raw = '{"broken":' + "x".repeat(200);
    const { store, kv, adapter, backups } = setup({ [STATE_KEY]: raw }, raw.length + STATE_KEY.length + 20);
    await store.init(adapter, backups);
    expect(store.getStatus()).toMatchObject({ readOnly: true, load: { kind: "blocked" } });
    store.update((s) => ({ ...s, currentWeek: 3 }));
    await vi.runAllTimersAsync();
    expect(kv.get(STATE_KEY)).toBe(raw);
  });

  it("repairs malformed entries, keeps the original in quarantine, then writes the clean document", async () => {
    const bad = { ...v1, dsa: [...v1.dsa, "junk"] };
    const { store, kv, adapter, backups } = setup({ [STATE_KEY]: JSON.stringify(bad) });
    await store.init(adapter, backups);
    expect(store.getStatus().load?.kind).toBe("repaired");
    expect(store.getState().dsa).toHaveLength(1);
    expect(JSON.parse(backups.quarantined()[0].raw).dsa).toHaveLength(2);
    expect(JSON.parse(kv.get(STATE_KEY)!).dsa).toHaveLength(1);
  });

  it("shows newer-schema data read-only and never writes over it", async () => {
    vi.useFakeTimers();
    const newer = JSON.stringify({ ...v1, version: 99, fromTheFuture: true });
    const { store, kv, adapter, backups } = setup({ [STATE_KEY]: newer });
    await store.init(adapter, backups);
    expect(store.getStatus()).toMatchObject({ readOnly: true, load: { kind: "newer" } });
    expect(store.getState().currentWeek).toBe(12);
    store.update((s) => ({ ...s, currentWeek: 1 }));
    await store.flush();
    await vi.runAllTimersAsync();
    expect(kv.get(STATE_KEY)).toBe(newer);
  });

  it("does not write when storage could not be read at all", async () => {
    const blocked: KV = { get: () => { throw new Error("denied"); }, set: vi.fn(), remove: vi.fn() };
    const store = createStore();
    await store.init(createBrowserAdapter(() => blocked), null);
    expect(store.getStatus()).toMatchObject({ readOnly: true, load: { kind: "blocked" } });
    store.update((s) => ({ ...s, currentWeek: 5 }));
    await store.flush();
    expect(blocked.set).not.toHaveBeenCalled();
  });
});

describe("store saving", () => {
  it("debounces saves and flush writes immediately", async () => {
    vi.useFakeTimers();
    const { store, kv, adapter, backups } = setup();
    await store.init(adapter, backups);
    store.update((s) => ({ ...s, currentWeek: 7 }));
    expect(store.getStatus().save.state).toBe("pending");
    expect(kv.get(STATE_KEY)).toBeNull();
    await store.flush();
    expect(JSON.parse(kv.get(STATE_KEY)!).currentWeek).toBe(7);
    expect(store.getStatus().save.state).toBe("saved");
  });

  it("surfaces a failed save and retries on the next flush", async () => {
    let fail = true;
    const saved: UserState[] = [];
    const adapter: PersistenceAdapter = {
      kind: "browser",
      description: "test",
      load: async () => ({ status: "empty" }),
      save: async (s) => (fail ? { ok: false, error: "Browser storage is full." } : (saved.push(s), { ok: true })),
    };
    const store = createStore();
    await store.init(adapter, null);
    store.update((s) => ({ ...s, currentWeek: 9 }));
    expect(await store.flush()).toBe(false);
    expect(store.getStatus().save).toMatchObject({ state: "failed", error: "Browser storage is full." });
    fail = false;
    expect(await store.flush()).toBe(true);
    expect(saved[0].currentWeek).toBe(9);
    expect(store.getStatus().save.state).toBe("saved");
  });

  it("sacrifices old automatic backups before failing the main save", async () => {
    const big = { ...v1, notes: { big: { text: "x".repeat(4000), updatedAt: "" } } } as UserState;
    const kv = memoryKV({}, 3 * JSON.stringify(big).length);
    const backups = createBackupStore(kv);
    backups.add("manual", big);
    backups.add("manual", big);
    const store = createStore();
    await store.init(createBrowserAdapter(() => kv), backups);
    store.update(() => ({ ...big, currentWeek: 20 }));
    expect(await store.flush()).toBe(true);
    expect(JSON.parse(kv.get(STATE_KEY)!).currentWeek).toBe(20);
    expect(store.getStatus().snapshots.length).toBe(1); // the newest automatic backup is always kept
  });

  it("never drops automatic backups for failures that are not a full store", async () => {
    const kv = memoryKV();
    const backups = createBackupStore(kv);
    backups.add("manual", v1);
    backups.add("manual", v1);
    const adapter: PersistenceAdapter = {
      kind: "browser",
      description: "test",
      load: async () => ({ status: "empty" }),
      save: async () => ({ ok: false, error: "blocked" }),
    };
    const store = createStore();
    await store.init(adapter, backups);
    store.update((s) => ({ ...s, currentWeek: 2 }));
    expect(await store.flush()).toBe(false);
    expect(backups.list()).toHaveLength(2);
  });

  it("applies valid changes from another tab and ignores invalid ones", async () => {
    let push: ((doc: unknown) => void) | null = null;
    const adapter: PersistenceAdapter = {
      kind: "browser",
      description: "test",
      load: async () => ({ status: "found", doc: v1 }),
      save: async () => ({ ok: true }),
      subscribe: (cb) => ((push = cb), () => {}),
    };
    const store = createStore();
    await store.init(adapter, null);
    push!({ ...v1, currentWeek: 30 });
    expect(store.getState().currentWeek).toBe(30);
    push!({ version: 99 });
    push!("garbage");
    expect(store.getState().currentWeek).toBe(30);
  });
});
