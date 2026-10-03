import { describe, expect, it } from "vitest";
import { emptyState, STATE_VERSION, type UserState } from "@/types/state";
import {
  buildExport, exportFilename, exportIsStale, hasProgress, parseImport, serializeExport, summarize,
} from "@/lib/persistence/portable";
import { createBackupStore, SNAPSHOTS_KEY } from "@/lib/persistence/backups";
import { createBrowserAdapter, STATE_KEY } from "@/lib/persistence/browser";
import { memoryKV } from "@/lib/persistence/kv";
import v1json from "./fixtures/v1-state.json";

const v1 = v1json as unknown as UserState;
const V2 = { ...v1json, version: 2, sessions: [] } as unknown as UserState;
const CUR = { md5: "c85d55c0e1916af940605fe1467edc3c", generated: "2026-10-03" };

describe("export / import", () => {
  it("round-trips through a versioned, readable envelope", () => {
    const at = new Date("2026-10-03T12:34:00Z");
    const text = serializeExport(buildExport(V2, CUR, at));
    const env = JSON.parse(text);
    expect(env).toMatchObject({ app: "roadmap-os", kind: "progress-backup", schemaVersion: STATE_VERSION, exportedAt: at.toISOString(), curriculum: CUR });
    expect(env.readme.length).toBeGreaterThan(0);
    expect(text).toContain('\n  "state": {'); // pretty-printed
    const p = parseImport(text, CUR.md5);
    expect(p.ok).toBe(true);
    if (!p.ok) return;
    expect(p.format).toBe("backup");
    expect(p.state).toEqual(V2);
    expect(p.exportedAt).toBe(at.toISOString());
    expect(p.curriculumMismatch).toBe(false);
    expect(p.summary).toEqual(summarize(V2));
  });

  it("still accepts bare v1 exports (the original Settings export format)", () => {
    const p = parseImport(JSON.stringify(v1, null, 1));
    expect(p.ok && p.format).toBe("legacy");
    expect(p.ok && p.state).toEqual(V2);
    expect(p.ok && p.schemaVersion).toBe(1);
  });

  it("rejects invalid input with a clear message and never throws", () => {
    expect(parseImport("{not json")).toMatchObject({ ok: false, error: expect.stringMatching(/not valid JSON/) });
    expect(parseImport("[1,2]")).toMatchObject({ ok: false });
    expect(parseImport('{"hello":"world"}')).toMatchObject({ ok: false, error: expect.stringMatching(/no progress data/) });
    expect(parseImport('{"app":"roadmap-os","kind":"something-else","state":{}}')).toMatchObject({ ok: false });
    expect(parseImport(JSON.stringify({ ...v1, version: STATE_VERSION + 1 }))).toMatchObject({ ok: false, error: expect.stringMatching(/newer version/) });
  });

  it("reports damaged entries instead of failing the whole import", () => {
    const p = parseImport(JSON.stringify({ ...v1, dsa: [v1.dsa[0], "junk"] }));
    expect(p.ok && p.state.dsa).toHaveLength(1);
    expect(p.ok && p.issues.filter((i) => i.dropped)).toHaveLength(1);
  });

  it("flags a curriculum mismatch without blocking", () => {
    const p = parseImport(serializeExport(buildExport(v1, { md5: "old", generated: "x" })), CUR.md5);
    expect(p.ok && p.curriculumMismatch).toBe(true);
  });

  it("summarises and detects progress", () => {
    expect(hasProgress(emptyState())).toBe(false);
    expect(hasProgress(v1)).toBe(true);
    expect(summarize(v1)).toMatchObject({ ticks: 2, topicsTracked: 2, demonstrated: 1, gatesPassed: 1, weeksDone: 1, dsa: 1, notes: 1 });
  });

  it("names files with the date and time, and knows when an export is stale", () => {
    expect(exportFilename(new Date(2026, 9, 3, 9, 5))).toBe("roadmap-os-backup-2026-10-03-0905.json");
    const now = new Date("2026-10-20T00:00:00Z");
    expect(exportIsStale(null, 14, now)).toBe(true);
    expect(exportIsStale("2026-10-10T00:00:00Z", 14, now)).toBe(false);
    expect(exportIsStale("2026-10-01T00:00:00Z", 14, now)).toBe(true);
  });
});

describe("backup store", () => {
  it("keeps a ring of the newest snapshots, newest first", () => {
    const b = createBackupStore(memoryKV(), { maxSnapshots: 3 });
    for (let i = 1; i <= 5; i++) b.add("manual", { ...v1, currentWeek: i }, new Date(2026, 0, i));
    const list = b.list();
    expect(list.map((m) => m.summary.currentWeek)).toEqual([5, 4, 3]);
    expect(b.get(list[0].id)?.state.currentWeek).toBe(5);
    expect(b.device().lastSnapshotAt).toBe(new Date(2026, 0, 5).toISOString());
  });

  it("drops older snapshots to fit a full store, and fails clearly when even one cannot fit", () => {
    const one = JSON.stringify([{ id: "x", state: v1, summary: summarize(v1), at: "", reason: "manual", schemaVersion: 1 }]).length;
    const kv = memoryKV({}, one * 2.5);
    const b = createBackupStore(kv, { maxSnapshots: 5 });
    for (let i = 0; i < 4; i++) expect(b.add("manual", v1).ok).toBe(true);
    expect(b.list().length).toBeLessThan(4);
    const tiny = createBackupStore(memoryKV({}, 100));
    expect(tiny.add("manual", v1)).toMatchObject({ ok: false });
  });

  it("dropOldest frees space one snapshot at a time", () => {
    const kv = memoryKV();
    const b = createBackupStore(kv);
    b.add("manual", v1);
    b.add("weekly", v1);
    expect(b.dropOldest()).toBe(true);
    expect(b.list().map((m) => m.reason)).toEqual(["weekly"]);
    expect(b.dropOldest()).toBe(true);
    expect(kv.get(SNAPSHOTS_KEY)).toBeNull();
    expect(b.dropOldest()).toBe(false);
  });

  it("quarantines raw text once, capped", () => {
    const b = createBackupStore(memoryKV(), { maxQuarantine: 2 });
    expect(b.quarantine("{broken", "x")).toBe(true);
    expect(b.quarantine("{broken", "x")).toBe(true);
    expect(b.quarantined()).toHaveLength(1);
    b.quarantine("a", "x");
    b.quarantine("b", "x");
    expect(b.quarantined().map((q) => q.raw)).toEqual(["a", "b"]);
  });

  it("survives its own keys being corrupted", () => {
    const b = createBackupStore(memoryKV({ [SNAPSHOTS_KEY]: "garbage", "roadmap-os:device:v1": "[]" }));
    expect(b.list()).toEqual([]);
    expect(b.device()).toEqual({});
    expect(b.add("manual", v1).ok).toBe(true);
  });
});

describe("browser adapter", () => {
  it("uses the existing storage key", () => {
    expect(STATE_KEY).toBe("roadmap-os:state:v1");
  });

  it("distinguishes empty, found, unreadable and unavailable storage", async () => {
    expect(await createBrowserAdapter(() => memoryKV()).load()).toEqual({ status: "empty" });
    expect(await createBrowserAdapter(() => memoryKV({ [STATE_KEY]: JSON.stringify(v1) })).load()).toEqual({ status: "found", doc: v1 });
    expect(await createBrowserAdapter(() => memoryKV({ [STATE_KEY]: "{trunc" })).load()).toMatchObject({ status: "unreadable", raw: "{trunc" });
    const blocked = createBrowserAdapter(() => { throw Object.assign(new Error("denied"), { name: "SecurityError" }); });
    expect(await blocked.load()).toMatchObject({ status: "error", error: expect.stringMatching(/blocking/) });
  });

  it("reports save failures instead of swallowing them", async () => {
    const kv = memoryKV({}, 10);
    expect(await createBrowserAdapter(() => kv).save(v1)).toMatchObject({ ok: false, error: "Browser storage is full." });
    expect(await createBrowserAdapter(() => memoryKV()).save(v1)).toEqual({ ok: true });
  });
});
