import {
  emptyState, STATE_VERSION,
  type AiLogEntry, type Application, type DailySession, type SessionStage, type DepthLevel, type DsaProblem, type GateProgress, type MasteryLevel,
  type Note, type ProjectProgress, type ResourceStatus, type Story, type TopicProgress, type UserState,
} from "@/types/state";

/**
 * Validate and repair a stored or imported state document without new runtime
 * dependencies. Rules:
 * - Unknown fields are preserved (top level and inside records), so data written
 *   by a newer build survives a round trip through this one.
 * - Wrong-typed values are coerced when the intent is clear (a numeric string
 *   mastery, a note stored as a bare string).
 * - Records that cannot be repaired are dropped and reported with `dropped: true`;
 *   the caller keeps the original raw document (quarantine) whenever that happens.
 */

export type Issue = { path: string; problem: string; dropped: boolean };

type Obj = Record<string, unknown>;
const EPOCH = new Date(0).toISOString();

const isObj = (v: unknown): v is Obj => !!v && typeof v === "object" && !Array.isArray(v);
const str = (v: unknown, d = ""): string => (typeof v === "string" ? v : typeof v === "number" ? String(v) : d);
const optStr = (v: unknown): string | undefined => (typeof v === "string" && v ? v : undefined);
const oneOf = <T extends string>(v: unknown, allowed: readonly T[], d: T): T => (allowed.includes(v as T) ? (v as T) : d);

function int(v: unknown, min: number, max: number): number | null {
  const n = typeof v === "string" && v.trim() !== "" ? Number(v) : v;
  if (typeof n !== "number" || !Number.isFinite(n)) return null;
  return Math.min(max, Math.max(min, Math.round(n)));
}

function boolMap(v: unknown): Record<string, boolean> {
  if (!isObj(v)) return {};
  const out: Record<string, boolean> = {};
  for (const [k, x] of Object.entries(v)) out[k] = !!x;
  return out;
}

class Ctx {
  issues: Issue[] = [];
  note(path: string, problem: string, dropped = false) {
    this.issues.push({ path, problem, dropped });
  }
}

function record<T>(c: Ctx, input: unknown, path: string, fix: (v: unknown, key: string) => T | undefined): Record<string, T> {
  if (input === undefined || input === null) return {};
  if (!isObj(input)) {
    c.note(path, "expected an object", true);
    return {};
  }
  const out: Record<string, T> = {};
  for (const [k, v] of Object.entries(input)) {
    const fixed = fix(v, k);
    if (fixed === undefined) c.note(`${path}.${k}`, "unreadable entry", true);
    else out[k] = fixed;
  }
  return out;
}

function list<T>(c: Ctx, input: unknown, path: string, fix: (v: Obj, i: number) => T): T[] {
  if (input === undefined || input === null) return [];
  if (!Array.isArray(input)) {
    c.note(path, "expected a list", true);
    return [];
  }
  const out: T[] = [];
  input.forEach((v, i) => {
    if (!isObj(v)) c.note(`${path}[${i}]`, "unreadable entry", true);
    else out.push(fix(v, i));
  });
  return out;
}

function topic(c: Ctx, v: unknown, path: string): TopicProgress | undefined {
  if (!isObj(v)) return undefined;
  const mastery = int(v.mastery, 0, 5);
  if (mastery === null && v.mastery !== undefined) c.note(path, "mastery was not a number; set to 0");
  const depth = v.depth === null || v.depth === undefined ? null : int(v.depth, 0, 5);
  const rv = isObj(v.reviews) ? v.reviews : {};
  const reviews: TopicProgress["reviews"] = { ...rv, count: int(rv.count, 0, 1000) ?? 0 };
  const last = optStr(rv.last);
  if (last) reviews.last = last;
  else delete reviews.last;
  const out: TopicProgress = {
    ...v,
    mastery: (mastery ?? 0) as MasteryLevel,
    depth: depth as DepthLevel | null,
    evidence: str(v.evidence),
    reviews,
    updatedAt: str(v.updatedAt, EPOCH),
  };
  const dem = optStr(v.demonstratedAt);
  if (dem) out.demonstratedAt = dem;
  else delete out.demonstratedAt;
  return out;
}

function gate(v: unknown): GateProgress | undefined {
  if (!isObj(v)) return undefined;
  const out: GateProgress = {
    ...v,
    status: oneOf(v.status, ["not_attempted", "attempting", "passed"] as const, "not_attempted"),
    criteria: boolMap(v.criteria),
    evidence: str(v.evidence),
  };
  const passedAt = optStr(v.passedAt);
  if (passedAt) out.passedAt = passedAt;
  else delete out.passedAt;
  return out;
}

function project(v: unknown): ProjectProgress | undefined {
  if (!isObj(v)) return undefined;
  return {
    ...v,
    status: oneOf(v.status, ["not_started", "in_progress", "complete"] as const, "not_started"),
    milestones: boolMap(v.milestones),
    quality: boolMap(v.quality),
    repoUrl: str(v.repoUrl),
  };
}

function dsa(v: Obj, i: number): DsaProblem {
  return {
    ...v,
    id: str(v.id) || `dsa-recovered-${i}`,
    title: str(v.title),
    url: str(v.url),
    source: str(v.source),
    difficulty: oneOf(v.difficulty, ["easy", "medium", "hard"] as const, "medium"),
    status: oneOf(v.status, ["todo", "attempted", "solved_with_help", "solved"] as const, "todo"),
    patterns: Array.isArray(v.patterns) ? v.patterns.filter((p): p is string => typeof p === "string") : [],
    missed: str(v.missed),
    why: str(v.why),
    better: str(v.better),
    notes: str(v.notes),
    revisitOn: optStr(v.revisitOn) ?? null,
    attempts: int(v.attempts, 0, 100000) ?? 0,
    createdAt: str(v.createdAt, EPOCH),
    updatedAt: str(v.updatedAt, EPOCH),
  };
}

function story(v: Obj, i: number): Story {
  return {
    ...v,
    id: str(v.id) || `story-recovered-${i}`,
    theme: str(v.theme),
    title: str(v.title),
    situation: str(v.situation),
    action: str(v.action),
    result: str(v.result),
    updatedAt: str(v.updatedAt, EPOCH),
  };
}

function application(v: Obj, i: number): Application {
  return {
    ...v,
    id: str(v.id) || `app-recovered-${i}`,
    organisation: str(v.organisation),
    role: str(v.role),
    kind: oneOf(v.kind, ["internship", "new-grad", "research", "other"] as const, "other"),
    stage: oneOf(v.stage, ["planned", "applied", "interviewing", "offer", "closed"] as const, "planned"),
    date: str(v.date),
    url: str(v.url),
    notes: str(v.notes),
    updatedAt: str(v.updatedAt, EPOCH),
  };
}

function aiEntry(v: Obj, i: number): AiLogEntry {
  return {
    ...v,
    id: str(v.id) || `ai-recovered-${i}`,
    missionId: optStr(v.missionId) ?? null,
    task: str(v.task),
    attemptedFirst: !!v.attemptedFirst,
    aiDid: str(v.aiDid),
    verified: str(v.verified),
    aiErrorCaught: !!v.aiErrorCaught,
    canDoAlone: oneOf(v.canDoAlone, ["yes", "partly", "no"] as const, "partly"),
    createdAt: str(v.createdAt, EPOCH),
    updatedAt: str(v.updatedAt, EPOCH),
  };
}

function session(v: Obj, i: number): DailySession {
  const stages: SessionStage[] = Array.isArray(v.stages)
    ? v.stages.filter(isObj).map((st, j) => {
        const out: SessionStage = { ...st, key: str(st.key) || `step-${j + 1}`, label: str(st.label), minutes: str(st.minutes), note: str(st.note) };
        for (const k of ["startedAt", "endedAt"] as const) {
          const t = optStr(st[k]);
          if (t) out[k] = t;
          else delete out[k];
        }
        if (st.skipped !== undefined) out.skipped = !!st.skipped;
        return out;
      })
    : [];
  const log = isObj(v.log) ? v.log : {};
  const ids = (x: unknown) => (Array.isArray(x) ? x.filter((y): y is string => typeof y === "string") : []);
  const out: DailySession = {
    ...v,
    id: str(v.id) || `session-recovered-${i}`,
    date: str(v.date),
    week: int(v.week, 1, 206) ?? 1,
    plan: oneOf(v.plan, ["full", "short"] as const, "full"),
    status: oneOf(v.status, ["active", "completed", "abandoned"] as const, "completed"),
    startedAt: str(v.startedAt, EPOCH),
    stage: Math.min(int(v.stage, 0, 100) ?? 0, Math.max(0, stages.length - 1)),
    stages,
    focus: ids(v.focus),
    ticked: ids(v.ticked),
    log: { ...log, learned: str(log.learned), stuck: str(log.stuck), next: str(log.next) },
    updatedAt: str(v.updatedAt, EPOCH),
  };
  const endedAt = optStr(v.endedAt);
  if (endedAt) out.endedAt = endedAt;
  else delete out.endedAt;
  return out;
}

/** Repair a document that is already at STATE_VERSION (run migrations first). */
export function sanitizeState(input: unknown): { state: UserState; issues: Issue[] } {
  const c = new Ctx();
  const base = emptyState();
  if (!isObj(input)) {
    if (input !== null && input !== undefined) c.note("", "state is not an object", true);
    return { state: base, issues: c.issues };
  }
  const cw = int(input.currentWeek, 1, 206);
  const state: UserState = {
    ...base,
    ...input,
    version: STATE_VERSION,
    updatedAt: str(input.updatedAt, EPOCH),
    currentWeek: cw ?? 1,
    checks: record(c, input.checks, "checks", (v) => (typeof v === "string" ? v : v ? EPOCH : undefined)),
    topics: record(c, input.topics, "topics", (v, k) => topic(c, v, `topics.${k}`)),
    gates: record(c, input.gates, "gates", gate),
    weeks: record(c, input.weeks, "weeks", (v) => {
      if (typeof v === "boolean") return { done: v };
      if (!isObj(v)) return undefined;
      const doneAt = optStr(v.doneAt);
      return { ...v, done: !!v.done, ...(doneAt ? { doneAt } : {}) };
    }),
    projects: record(c, input.projects, "projects", project),
    resources: record(c, input.resources, "resources", (v) =>
      ["todo", "using", "done"].includes(v as string) ? (v as ResourceStatus) : undefined),
    flags: record(c, input.flags, "flags", (v) => !!v),
    notes: record(c, input.notes, "notes", (v): Note | undefined => {
      if (typeof v === "string") return { text: v, updatedAt: EPOCH };
      if (!isObj(v) || typeof v.text !== "string") return undefined;
      return { ...v, text: v.text, updatedAt: str(v.updatedAt, EPOCH) };
    }),
    dsa: list(c, input.dsa, "dsa", dsa),
    stories: list(c, input.stories, "stories", story),
    applications: list(c, input.applications, "applications", application),
    aiLog: list(c, input.aiLog, "aiLog", aiEntry),
    sessions: list(c, input.sessions, "sessions", session),
  };
  return { state, issues: c.issues };
}
