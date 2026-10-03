import { describe, expect, it } from "vitest";
import { STATE_VERSION } from "@/types/state";
import { sanitizeState } from "@/lib/persistence/sanitize";
import { migrate, readDocument, type Migration } from "@/lib/persistence/migrate";
import v1 from "./fixtures/v1-state.json";

/** What a v1 document becomes after migration: identical plus empty session log and no Active Mode chosen. */
const V2 = { ...v1, version: 3, sessions: [], activeMode: null, modeHistory: [] };

describe("sanitizeState", () => {
  it("passes a current-version document through unchanged", () => {
    const { state, issues } = sanitizeState(V2);
    expect(issues).toEqual([]);
    expect(state).toEqual(V2);
  });

  it("fills defaults for a partial document (older builds without aiLog)", () => {
    const { aiLog: _drop, ...older } = v1;
    void _drop;
    const { state, issues } = sanitizeState(older);
    expect(state.aiLog).toEqual([]);
    expect(issues).toEqual([]);
  });

  it("preserves unknown fields at the top level and inside records", () => {
    const doc = {
      ...v1,
      futureTopLevel: { a: 1 },
      topics: { "P01.1a": { ...v1.topics["P01.1a"], futureField: "keep me" } },
      dsa: [{ ...v1.dsa[0], futureDsa: [1, 2] }],
    };
    const { state } = sanitizeState(doc);
    expect((state as unknown as Record<string, unknown>).futureTopLevel).toEqual({ a: 1 });
    expect((state.topics["P01.1a"] as unknown as Record<string, unknown>).futureField).toBe("keep me");
    expect((state.dsa[0] as unknown as Record<string, unknown>).futureDsa).toEqual([1, 2]);
  });

  it("coerces repairable values without reporting them as dropped", () => {
    const { state, issues } = sanitizeState({
      currentWeek: "300",
      checks: { a: true },
      topics: { T: { mastery: "3", depth: 9, reviews: { count: "2" } } },
      notes: { n: "bare string note" },
      weeks: { "3": true },
    });
    expect(state.currentWeek).toBe(206);
    expect(state.checks.a).toBe(new Date(0).toISOString());
    expect(state.topics.T.mastery).toBe(3);
    expect(state.topics.T.depth).toBe(5);
    expect(state.topics.T.reviews.count).toBe(2);
    expect(state.notes.n.text).toBe("bare string note");
    expect(state.weeks["3"]).toEqual({ done: true });
    expect(issues.filter((i) => i.dropped)).toEqual([]);
  });

  it("drops unreadable records and reports each one, keeping the rest", () => {
    const { state, issues } = sanitizeState({
      ...v1,
      topics: { ...v1.topics, bad: "nope" },
      dsa: [v1.dsa[0], null, 42],
      notes: { ...v1.notes, broken: { nope: 1 } },
      resources: { ok: "done", bad: "weird" },
      stories: "not a list",
    });
    expect(Object.keys(state.topics)).toEqual(["P01.1a", "P01.1b"]);
    expect(state.dsa).toHaveLength(1);
    expect(state.notes.broken).toBeUndefined();
    expect(state.resources).toEqual({ ok: "done" });
    expect(state.stories).toEqual([]);
    expect(issues.filter((i) => i.dropped).map((i) => i.path).sort()).toEqual(
      ["dsa[1]", "dsa[2]", "notes.broken", "resources.bad", "stories", "topics.bad"].sort(),
    );
  });

  it("gives malformed list entries safe defaults so derived code cannot crash", () => {
    const { state } = sanitizeState({ dsa: [{ title: "x", patterns: "not array", attempts: "many" }] });
    expect(state.dsa[0]).toMatchObject({ id: "dsa-recovered-0", patterns: [], attempts: 0, status: "todo", difficulty: "medium", revisitOn: null });
  });

  it("returns an empty state for non-objects", () => {
    expect(sanitizeState("x").issues[0].dropped).toBe(true);
    expect(sanitizeState(null).issues).toEqual([]);
  });
});

describe("migrate", () => {
  const steps: Record<number, Migration> = {
    1: (d) => ({ ...d, version: 2, added: "by v2" }),
    2: (d) => ({ ...d, version: 3, renamed: d.added }),
  };

  it("migrates a real v1 document to the current schema without changing any existing field", () => {
    const r = migrate({ ...v1 });
    expect(r).toMatchObject({ ok: true, from: 1, applied: [1, 2] });
    expect(r.ok && r.doc).toEqual(V2);
    const kept = readDocument({ ...v1, sessions: [{ id: "s1", status: "completed", stages: [] }] });
    expect(kept.ok && kept.state.sessions[0].id).toBe("s1");
  });

  it("is a no-op at the current version", () => {
    const r = migrate({ ...V2 });
    expect(r).toMatchObject({ ok: true, from: STATE_VERSION, applied: [] });
  });

  it("applies each step in order without mutating the input", () => {
    const input = { version: 1, keep: true };
    const r = migrate(input, steps, 3);
    expect(r.ok && r.doc).toEqual({ version: 3, keep: true, added: "by v2", renamed: "by v2" });
    expect(r.ok && r.applied).toEqual([1, 2]);
    expect(input).toEqual({ version: 1, keep: true });
  });

  it("treats a missing or invalid version as v1", () => {
    const r = migrate({ checks: {} }, steps, 2);
    expect(r.ok && r.from).toBe(1);
  });

  it("refuses documents from a newer schema", () => {
    expect(migrate({ version: STATE_VERSION + 1 })).toEqual({ ok: false, reason: "newer", version: STATE_VERSION + 1 });
  });

  it("throws when a step is missing, rather than skipping it", () => {
    expect(() => migrate({ version: 1 }, { 2: steps[2] }, 3)).toThrow(/v1 to v2/);
  });

  it("readDocument migrates then validates", () => {
    const r = readDocument(v1);
    expect(r.ok && r.state.currentWeek).toBe(12);
    expect(r.ok && r.migrated).toBe(true);
    expect(readDocument([1, 2])).toEqual({ ok: false, reason: "not-object" });
    expect(readDocument({ version: 99 })).toMatchObject({ ok: false, reason: "newer" });
  });
});
