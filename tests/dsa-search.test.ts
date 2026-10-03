import { describe, expect, it } from "vitest";
import { emptyState, type DsaProblem, type UserState } from "@/types/state";
import { cleanStreak, dueResolves, logAttempt, mistakeCounts } from "@/lib/dsa";
import { fold, personalEntries, search } from "@/lib/search";
import { sanitizeState } from "@/lib/persistence/sanitize";
import { localDay } from "@/lib/today";

const T0 = new Date(2026, 9, 1, 10, 0); // local time, 1 Oct 2026
const at = (days: number) => new Date(T0.getTime() + days * 86400000);
const problem = (over: Partial<DsaProblem> = {}): DsaProblem => ({
  id: "p1", title: "Two Sum", url: "", source: "", difficulty: "easy", status: "todo", patterns: [], missed: "", why: "", better: "",
  notes: "", revisitOn: null, attempts: 0, createdAt: "", updatedAt: "", ...over,
});

describe("DSA re-solve queue", () => {
  it("a failed problem returns in 3 days until it is solved cleanly", () => {
    let p = logAttempt(problem(), { outcome: "failed", mistake: "edge-case", minutes: 40, note: "empty input" }, T0);
    expect(p).toMatchObject({ status: "attempted", attempts: 1, revisitOn: localDay(at(3)) });
    expect(p.attemptLog![0]).toMatchObject({ outcome: "failed", mistake: "edge-case", minutes: 40, note: "empty input" });
    expect(p.cleanSolvedAt).toBeUndefined();
    p = logAttempt(p, { outcome: "with_help" }, at(3));
    expect(p).toMatchObject({ status: "solved_with_help", revisitOn: localDay(at(6)) });
  });

  it("clean solves space out 14 then 30 days, and three in a row retire the problem", () => {
    let p = logAttempt(problem(), { outcome: "failed" }, T0);
    p = logAttempt(p, { outcome: "clean", mistake: "pattern" }, at(3));
    expect(p.attemptLog![1].mistake).toBeUndefined(); // no mistake on a clean solve
    expect(p).toMatchObject({ status: "solved", revisitOn: localDay(at(17)), cleanSolvedAt: at(3).toISOString() });
    p = logAttempt(p, { outcome: "clean" }, at(17));
    expect(p.revisitOn).toBe(localDay(at(47)));
    p = logAttempt(p, { outcome: "clean" }, at(47));
    expect(p.revisitOn).toBeNull();
    expect(cleanStreak(p.attemptLog)).toBe(3);
  });

  it("a slip after clean solves resets the streak", () => {
    let p = logAttempt(problem(), { outcome: "clean" }, T0);
    p = logAttempt(p, { outcome: "clean" }, at(14));
    p = logAttempt(p, { outcome: "failed" }, at(44));
    expect(cleanStreak(p.attemptLog)).toBe(0);
    expect(p.revisitOn).toBe(localDay(at(47)));
    expect(p.cleanSolvedAt).toBe(at(14).toISOString()); // the last clean solve date is kept
  });

  it("lists due problems with not-yet-clean ones first, and counts mistakes by type", () => {
    const a = problem({ id: "a", status: "solved", revisitOn: "2026-10-01" });
    const b = problem({ id: "b", status: "attempted", revisitOn: "2026-10-02", attemptLog: [{ at: "x", outcome: "failed", mistake: "off-by-one" }, { at: "y", outcome: "failed", mistake: "off-by-one" }] });
    const c = problem({ id: "c", status: "attempted", revisitOn: "2026-10-09", attemptLog: [{ at: "x", outcome: "with_help", mistake: "pattern" }] });
    expect(dueResolves([a, b, c], "2026-10-03").map((p) => p.id)).toEqual(["b", "a"]);
    expect(mistakeCounts([a, b, c])).toEqual([["off-by-one", 2], ["pattern", 1]]);
  });

  it("validates attempt logs and reports unreadable entries", () => {
    const { state, issues } = sanitizeState({ dsa: [{ title: "x", attemptLog: [{ at: "t", outcome: "clean", minutes: "12", mistake: "nope" }, { outcome: "bad" }], cleanSolvedAt: "t" }] });
    expect(state.dsa[0].attemptLog).toEqual([{ at: "t", outcome: "clean", minutes: 12 }]);
    expect(state.dsa[0].cleanSolvedAt).toBe("t");
    expect(issues.filter((i) => i.dropped).map((i) => i.path)).toEqual(["dsa[0].attemptLog"]);
  });
});

describe("search", () => {
  const entries = [
    { k: "Topic", id: "P06.2", t: "PostgreSQL", s: "relational database", h: "/topics/P06.2" },
    { k: "Concept", id: "P06.2#3", t: "Normalisation", s: "normal forms", h: "/concepts/P06.2-3" },
    { k: "Go to", id: "", t: "Settings", s: "System /settings", h: "/settings" },
  ];

  it("folds spellings and ranks by id, title and kind", () => {
    expect(fold("Normalisation")).toBe("normalization");
    expect(search(entries, "normalization").map((h) => h.id)).toEqual(["P06.2#3"]);
    expect(search(entries, "p06.2")[0].id).toBe("P06.2");
    expect(search(entries, "settings")[0].k).toBe("Go to");
    expect(search(entries, "   ")).toEqual([]);
    expect(search(entries, "p06", 1)).toHaveLength(1);
  });

  it("includes the user's own records", () => {
    const s: UserState = {
      ...emptyState(),
      notes: { "week:3": { text: "loops finally clicked\nmore", updatedAt: "" } },
      evidence: [{ id: "e", kind: "repo", subject: "PR03-M1", title: "pr03 repo", url: "https://x", detail: "", createdAt: "", updatedAt: "" }],
    };
    const p = personalEntries(s);
    expect(p).toContainEqual(expect.objectContaining({ k: "Note", t: "loops finally clicked", h: "/weeks/3" }));
    expect(p).toContainEqual(expect.objectContaining({ k: "Evidence", t: "pr03 repo", h: "/projects/PR03" }));
  });
});
