import type { DailySession, DsaProblem, SessionStage, UserState } from "@/types/state";

/**
 * Pure planning for Today and the Daily Work Unit. No React, no storage, no
 * clock reads except through the `now` argument, so it is deterministic in tests.
 */

// ------------------------------------------------------------------ dates
/** Local calendar day, YYYY-MM-DD (sessions belong to the day you sat down, not to UTC). */
export function localDay(d: Date = new Date()): string {
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

// ------------------------------------------------------------------ session plans
export type StepTemplate = { minutes: string; step: string };

/** Keys for the master's six-step daily unit, in order. Templates of other lengths fall back to step-N. */
const STEP_KEYS = ["recall", "study", "code", "debug", "explain", "log"];

const LABELS: Record<string, string> = {
  recall: "Recall",
  study: "Study",
  code: "Code it yourself",
  debug: "Test and debug",
  explain: "Explain from memory",
  log: "Log and next step",
};

/** Busy-day version of the unit: same shape, smaller blocks. Debug folds into coding. */
const SHORT_MINUTES: Record<string, string | null> = { recall: "5", study: "15-20", code: "15-20", debug: null, explain: "5", log: "5" };

export function sessionStages(template: StepTemplate[], plan: "full" | "short" = "full"): SessionStage[] {
  return template
    .map((t, i) => {
      const key = template.length === STEP_KEYS.length ? STEP_KEYS[i] : `step-${i + 1}`;
      const label = LABELS[key] ?? t.step.charAt(0).toUpperCase() + t.step.slice(1);
      const minutes = plan === "short" && key in SHORT_MINUTES ? SHORT_MINUTES[key] : t.minutes;
      return minutes === null ? null : { key, label, minutes, note: "" };
    })
    .filter((s): s is SessionStage => s !== null);
}

/** "30-45" -> [30, 45]; "10" -> [10, 10]. */
export function minuteRange(m: string): [number, number] {
  const [a, b] = m.split(/[-–]/).map((x) => Number.parseInt(x, 10));
  const lo = Number.isFinite(a) ? a : 0;
  return [lo, Number.isFinite(b) ? b : lo];
}

export function planMinutes(stages: { minutes: string }[]): [number, number] {
  return stages.reduce<[number, number]>(([lo, hi], s) => {
    const [a, b] = minuteRange(s.minutes);
    return [lo + a, hi + b];
  }, [0, 0]);
}

// ------------------------------------------------------------------ session queries
export function activeSession(s: UserState): DailySession | null {
  return s.sessions.find((x) => x.status === "active") ?? null;
}

export function lastCompletedSession(s: UserState): DailySession | null {
  return s.sessions.find((x) => x.status === "completed") ?? null;
}

export function sessionsOn(s: UserState, day: string): DailySession[] {
  return s.sessions.filter((x) => x.date === day && x.status === "completed");
}

/** Minutes spent in a session (or one stage), using `now` for anything still running. */
export function elapsedMinutes(from: string | undefined, to: string | undefined, now: Date): number {
  if (!from) return 0;
  const end = to ? new Date(to).getTime() : now.getTime();
  return Math.max(0, Math.round((end - new Date(from).getTime()) / 60000));
}

export function sessionMinutes(x: DailySession, now: Date): number {
  return x.stages.reduce((n, st) => n + (st.skipped ? 0 : elapsedMinutes(st.startedAt, st.endedAt, now)), 0);
}

// ------------------------------------------------------------------ today's plan (cardinal rule)
export type ProjectInfo = { id: string; title: string; weeks: number[]; milestones: { id: string; cw: number; text: string }[] };

export type TodayPlan = {
  /** ONE primary learning block: the next unticked items of this week's primary work. */
  primary: { next: string[]; remaining: number; topicId: string | null };
  /** AT MOST ONE supporting item. */
  supporting: string | null;
  /** Small maintenance track. */
  maintenance: { reviewsDue: number; dsaDue: DsaProblem[] };
  /** ONE active project milestone. */
  project: { id: string; title: string; milestone: { id: string; text: string } | null; why: "in-progress" | "this-week" } | null;
  /** A gate that should be passed before this week's work (shown as a warning), and this week's own gate. */
  checkpoints: { blocking: string | null; thisWeek: string | null };
  leftOff: { next: string; date: string } | null;
};

type WeekLike = { cw: number; pu: string[]; u: string[]; pj: string | null; g: string | null; rg: string | null };

export function topicOfUnit(unit: string): string {
  return unit.split("#")[0];
}

export function pickProject(s: UserState, cw: number, projects: ProjectInfo[]): TodayPlan["project"] {
  const inProgress = projects.find((p) => s.projects[p.id]?.status === "in_progress");
  const thisWeek = projects.find((p) => p.weeks.includes(cw) && s.projects[p.id]?.status !== "complete");
  const p = inProgress ?? thisWeek;
  if (!p) return null;
  const done = s.projects[p.id]?.milestones ?? {};
  const m = p.milestones.find((x) => !done[x.id]);
  return { id: p.id, title: p.title, milestone: m ? { id: m.id, text: m.text } : null, why: inProgress ? "in-progress" : "this-week" };
}

export function todayPlan(
  s: UserState,
  w: WeekLike,
  opts: { projects: ProjectInfo[]; reviewsDue: number; gatePassed: (id: string) => boolean; now: Date; nextCount?: number },
): TodayPlan {
  const open = w.pu.filter((u) => !s.checks[u]);
  const next = open.slice(0, opts.nextCount ?? 5);
  const supporting = w.u.find((u) => !w.pu.includes(u) && !s.checks[u]) ?? null;
  const dsaDue = s.dsa.filter((p) => p.revisitOn && new Date(p.revisitOn) <= opts.now);
  const checkpoints = {
    blocking: w.rg && !opts.gatePassed(w.rg) ? w.rg : null,
    thisWeek: w.g && !opts.gatePassed(w.g) ? w.g : null,
  };
  const last = lastCompletedSession(s);
  return {
    primary: { next, remaining: open.length, topicId: next[0] ? topicOfUnit(next[0]) : null },
    supporting,
    maintenance: { reviewsDue: opts.reviewsDue, dsaDue },
    project: pickProject(s, w.cw, opts.projects),
    checkpoints,
    leftOff: last && last.log.next.trim() ? { next: last.log.next.trim(), date: last.date } : null,
  };
}
