import { describe, expect, it } from "vitest";
import { emptyState, type UserState } from "@/types/state";
import { ACTIVE_MODES, effectiveMode, modeDef, suggestedMode, switchMode } from "@/lib/modes";
import { sessionStages, todayPlan } from "@/lib/today";
import { migrate } from "@/lib/persistence/migrate";
import { sanitizeState } from "@/lib/persistence/sanitize";

const week = { cw: 13, pu: ["P01.1a#1", "P01.1a#2", "P01.1a#3"], u: ["P01.1a#1", "P01.1a#2", "P01.1a#3", "P02.1#1"], pj: "PR01", g: null, rg: null };
const projects = [{ id: "PR01", title: "CLI Tool", weeks: [13], milestones: [{ id: "PR01-M1", cw: 13, text: "design" }] }];
const NOW = new Date("2026-10-03T12:00:00Z");
const dsaDue = { id: "d", revisitOn: "2026-10-01" } as UserState["dsa"][number];
const plan = (id: "A" | "B" | "C" | "D" | "E" | "F") =>
  todayPlan({ ...emptyState(), dsa: [dsaDue] }, week, { projects, reviewsDue: 1, gatePassed: () => false, now: NOW, policy: modeDef(id).policy });

describe("Active Mode", () => {
  it("defines the six master modes in order", () => {
    expect(ACTIVE_MODES.map((m) => m.id)).toEqual(["A", "B", "C", "D", "E", "F"]);
  });

  it("is not guessed by the migration; a suggestion is shown until one is chosen", () => {
    const r = migrate({ version: 2, checks: {} });
    expect(r.ok && r.doc).toMatchObject({ version: 3, activeMode: null, modeHistory: [] });
    expect(suggestedMode(1)).toBe("A");
    expect(suggestedMode(40)).toBe("B");
    expect(effectiveMode({ ...emptyState(), currentWeek: 40 })).toMatchObject({ chosen: false, since: null, def: { id: "B" } });
  });

  it("switching closes the previous period into history; re-selecting is a no-op", () => {
    let s: UserState = { ...emptyState(), ...switchMode(emptyState(), "B", new Date("2026-09-01T00:00:00Z")) };
    expect(s.activeMode).toEqual({ id: "B", since: "2026-09-01T00:00:00.000Z" });
    expect(s.modeHistory).toEqual([]);
    s = { ...s, ...switchMode(s, "D", new Date("2026-10-01T00:00:00Z")) };
    expect(s.activeMode?.id).toBe("D");
    expect(s.modeHistory).toEqual([{ id: "B", since: "2026-09-01T00:00:00.000Z", until: "2026-10-01T00:00:00.000Z" }]);
    expect(switchMode(s, "D", NOW)).toEqual({ activeMode: s.activeMode, modeHistory: s.modeHistory });
    expect(effectiveMode(s)).toMatchObject({ chosen: true, def: { id: "D", name: "Exams" } });
  });

  it("changes the recommended workload", () => {
    const b = plan("B");
    expect(b.primary.next).toHaveLength(3);
    expect(b.supporting).toBe("P02.1#1");
    expect(b.project?.id).toBe("PR01");
    expect(b.maintenance.dsaDue).toHaveLength(1);

    const a = plan("A");
    expect([a.supporting, a.project, a.maintenance.dsaDue.length]).toEqual([null, null, 0]);
    expect(a.primary.next).toHaveLength(3);

    const c = plan("C");
    expect(c.primary.next).toHaveLength(2);
    expect([c.supporting, c.project]).toEqual([null, null]);
    expect(c.policy.session).toBe("short");

    const d = plan("D");
    expect(d.primary.next).toEqual([]); // new roadmap work paused
    expect(d.primary.remaining).toBe(3); // but where you are is kept
    expect(d.maintenance.reviewsDue).toBe(1); // reviews stay
    expect(d.policy.session).toBe("review");

    const e = plan("E");
    expect(e.project?.id).toBe("PR01"); // project/career evidence preserved
    expect(e.supporting).toBeNull();

    const f = plan("F");
    expect(f.supporting).toBe("P02.1#1");
  });

  it("offers a review-only session plan for exams", () => {
    expect(sessionStages([], "review").map((s) => s.key)).toEqual(["recall", "retest", "log"]);
  });

  it("validates stored modes and reports unknown ones", () => {
    const { state, issues } = sanitizeState({ activeMode: { id: "Z", since: "x" }, modeHistory: [{ id: "B", since: "a", until: "b" }, { id: "Q" }] });
    expect(state.activeMode).toBeNull();
    expect(state.modeHistory).toEqual([{ id: "B", since: "a", until: "b" }]);
    expect(issues.filter((i) => i.dropped).map((i) => i.path)).toEqual(["activeMode", "modeHistory[1]"]);
  });
});
