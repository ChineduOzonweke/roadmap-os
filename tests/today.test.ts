import { describe, expect, it } from "vitest";
import { emptyState, type UserState } from "@/types/state";
import {
  activeSession, elapsedMinutes, lastCompletedSession, localDay, minuteRange, pickProject, planMinutes, sessionMinutes,
  sessionStages, todayPlan, type ProjectInfo,
} from "@/lib/today";

const TEMPLATE = [
  { minutes: "10", step: "recall" },
  { minutes: "30-45", step: "learn one small concept" },
  { minutes: "30-45", step: "write code yourself" },
  { minutes: "10-15", step: "debug / test" },
  { minutes: "5-10", step: "explain from memory" },
  { minutes: "5", step: "record the next step" },
];

const PROJECTS: ProjectInfo[] = [
  { id: "PR01", title: "CLI Tool", weeks: [13, 14], milestones: [{ id: "PR01-M1", cw: 13, text: "design" }, { id: "PR01-M2", cw: 14, text: "finish" }] },
  { id: "PR02", title: "Web App", weeks: [30], milestones: [{ id: "PR02-M1", cw: 30, text: "api" }] },
];

const week = (over: Partial<{ cw: number; pu: string[]; u: string[]; pj: string | null; g: string | null; rg: string | null }> = {}) => ({
  cw: 13, pu: ["P01.1a#1", "P01.1a#2", "P01.1a#3"], u: ["P01.1a#1", "P01.1a#2", "P01.1a#3", "P02.1#1", "P02.1#2"], pj: "PR01", g: null, rg: null, ...over,
});

const NOW = new Date("2026-10-03T12:00:00Z");

describe("session plans", () => {
  it("maps the master's six-step daily unit to keyed stages, durations from the template", () => {
    const st = sessionStages(TEMPLATE);
    expect(st.map((s) => s.key)).toEqual(["recall", "study", "code", "debug", "explain", "log"]);
    expect(st[1]).toEqual({ key: "study", label: "Study", minutes: "30-45", note: "" });
    expect(planMinutes(st)).toEqual([90, 130]);
  });

  it("has a shorter busy-day plan without the separate debug block", () => {
    const st = sessionStages(TEMPLATE, "short");
    expect(st.map((s) => s.key)).toEqual(["recall", "study", "code", "explain", "log"]);
    expect(planMinutes(st)).toEqual([45, 55]);
  });

  it("accepts templates of other shapes (future configurability)", () => {
    const st = sessionStages([{ minutes: "20", step: "read" }, { minutes: "40", step: "build" }]);
    expect(st.map((s) => [s.key, s.label])).toEqual([["step-1", "Read"], ["step-2", "Build"]]);
  });

  it("parses minute ranges", () => {
    expect(minuteRange("30-45")).toEqual([30, 45]);
    expect(minuteRange("10")).toEqual([10, 10]);
    expect(minuteRange("x")).toEqual([0, 0]);
  });

  it("measures elapsed time, excluding skipped stages", () => {
    expect(elapsedMinutes("2026-10-03T11:30:00Z", undefined, NOW)).toBe(30);
    expect(elapsedMinutes("2026-10-03T11:30:00Z", "2026-10-03T11:40:00Z", NOW)).toBe(10);
    expect(elapsedMinutes(undefined, undefined, NOW)).toBe(0);
    const x = {
      stages: [
        { key: "a", label: "", minutes: "", note: "", startedAt: "2026-10-03T11:00:00Z", endedAt: "2026-10-03T11:10:00Z" },
        { key: "b", label: "", minutes: "", note: "", startedAt: "2026-10-03T11:10:00Z", endedAt: "2026-10-03T11:20:00Z", skipped: true },
        { key: "c", label: "", minutes: "", note: "", startedAt: "2026-10-03T11:50:00Z" },
      ],
    } as UserState["sessions"][number];
    expect(sessionMinutes(x, NOW)).toBe(20);
  });

  it("uses the local calendar day", () => {
    expect(localDay(new Date(2026, 0, 5, 23, 59))).toBe("2026-01-05");
  });
});

describe("today's plan (cardinal rule)", () => {
  const base = { projects: PROJECTS, reviewsDue: 0, gatePassed: () => false, now: NOW };

  it("has one primary block, at most one supporting item, and the project milestone of the week", () => {
    const s = { ...emptyState(), checks: { "P01.1a#1": "t", "P02.1#1": "t" } };
    const p = todayPlan(s, week(), base);
    expect(p.primary).toEqual({ next: ["P01.1a#2", "P01.1a#3"], remaining: 2, topicId: "P01.1a" });
    expect(p.supporting).toBe("P02.1#2");
    expect(p.project).toEqual({ id: "PR01", title: "CLI Tool", milestone: { id: "PR01-M1", text: "design" }, why: "this-week" });
  });

  it("prefers an in-progress project and its next unticked milestone", () => {
    const s: UserState = { ...emptyState(), projects: { PR02: { status: "in_progress", milestones: {}, quality: {}, repoUrl: "" }, PR01: { status: "not_started", milestones: { "PR01-M1": true }, quality: {}, repoUrl: "" } } };
    expect(pickProject(s, 13, PROJECTS)).toMatchObject({ id: "PR02", why: "in-progress", milestone: { id: "PR02-M1" } });
    const s2: UserState = { ...emptyState(), projects: { PR01: { status: "in_progress", milestones: { "PR01-M1": true }, quality: {}, repoUrl: "" } } };
    expect(pickProject(s2, 50, PROJECTS)?.milestone?.id).toBe("PR01-M2");
    expect(pickProject(emptyState(), 50, PROJECTS)).toBeNull();
  });

  it("reports the blocking checkpoint and this week's checkpoint separately, hiding passed ones", () => {
    expect(todayPlan(emptyState(), week({ rg: "C1", g: "C2" }), base).checkpoints).toEqual({ blocking: "C1", thisWeek: "C2" });
    expect(todayPlan(emptyState(), week({ rg: "C1", g: "C2" }), { ...base, gatePassed: (id) => id === "C1" }).checkpoints).toEqual({ blocking: null, thisWeek: "C2" });
    expect(todayPlan(emptyState(), week({ g: "C2" }), { ...base, gatePassed: () => true }).checkpoints).toEqual({ blocking: null, thisWeek: null });
  });

  it("collects maintenance: due reviews and DSA revisits", () => {
    const due = { id: "d", revisitOn: "2026-10-01" } as UserState["dsa"][number];
    const later = { id: "e", revisitOn: "2026-12-01" } as UserState["dsa"][number];
    const p = todayPlan({ ...emptyState(), dsa: [due, later] }, week(), { ...base, reviewsDue: 2 });
    expect(p.maintenance.reviewsDue).toBe(2);
    expect(p.maintenance.dsaDue.map((x) => x.id)).toEqual(["d"]);
  });

  it("shows where you left off from the last finished session", () => {
    const mk = (id: string, status: "active" | "completed" | "abandoned", next: string) => ({
      id, status, date: "2026-10-02", week: 13, plan: "full" as const, startedAt: "", stage: 0, stages: [], focus: [], ticked: [], log: { learned: "", stuck: "", next }, updatedAt: "",
    });
    const s = { ...emptyState(), sessions: [mk("a", "active", ""), mk("b", "abandoned", "ignored"), mk("c", "completed", "  write tests  ")] };
    expect(activeSession(s)?.id).toBe("a");
    expect(lastCompletedSession(s)?.id).toBe("c");
    expect(todayPlan(s, week(), base).leftOff).toEqual({ next: "write tests", date: "2026-10-02" });
  });
});
