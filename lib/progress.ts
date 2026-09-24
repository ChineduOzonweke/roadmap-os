// Derived progress. Everything here is computed from the curriculum index plus
// the user's raw state (checks, mastery, gates). Nothing stores percentages.
import indexJson from "@/data/client-index.json";
import type { ClientIndex } from "@/types/curriculum";
import type { UserState } from "@/types/state";

export const idx = indexJson as unknown as ClientIndex;
export type IndexTopic = ClientIndex["topics"][number];
export type IndexWeek = ClientIndex["weeks"][number];
export type IndexGate = ClientIndex["gates"][number];

export const topicById = new Map(idx.topics.map((t) => [t.id, t]));
export const phaseById = new Map(idx.phases.map((p) => [p.id, p]));
export const gateById = new Map(idx.gates.map((g) => [g.id, g]));
export const projectById = new Map(idx.projects.map((p) => [p.id, p]));
export const weekByCw = (cw: number) => idx.weeks[cw - 1];
export const orderedGates = [...idx.gates].sort((a, b) => (a.w ?? 999) - (b.w ?? 999));

export type Status = "locked" | "available" | "in_progress" | "completed" | "mastered";

export const STATUS_LABEL: Record<Status, string> = {
  locked: "Locked",
  available: "Available",
  in_progress: "In progress",
  completed: "Checklist complete",
  mastered: "Mastered",
};

/** Checklist units: concept IDs, or the topic ID itself when the master lists no items. */
export function unitsOf(t: IndexTopic): string[] {
  if (t.n === 0) return [];
  if (idx.ct[`${t.id}#1`] !== undefined) return Array.from({ length: t.n }, (_, i) => `${t.id}#${i + 1}`);
  return [t.id];
}

export const gatePassed = (s: UserState, id: string | null | undefined) => !id || s.gates[id]?.status === "passed";

export function topicComplete(s: UserState, topicId: string) {
  const t = topicById.get(topicId);
  if (!t) return true;
  const u = unitsOf(t);
  return u.length > 0 && u.every((x) => !!s.checks[x]);
}

export type TopicView = {
  id: string;
  done: number;
  total: number;
  pct: number;
  mastery: number;
  depth: number | null;
  cleared: boolean;
  blockers: string[];
  status: Status;
};

export function topicView(s: UserState, t: IndexTopic): TopicView {
  const units = unitsOf(t);
  const done = units.filter((u) => !!s.checks[u]).length;
  const tp = s.topics[t.id];
  const mastery = tp?.mastery ?? 0;
  const blockers: string[] = [];
  if (t.g && !gatePassed(s, t.g)) blockers.push(t.g);
  t.pre.forEach((p) => { if (!topicComplete(s, p)) blockers.push(p); });
  const cleared = blockers.length === 0;
  const total = units.length;
  let status: Status;
  if (total > 0 && done === total && mastery >= 4) status = "mastered";
  else if (total > 0 && done === total) status = "completed";
  else if (done > 0 || mastery >= 1) status = "in_progress";
  else status = cleared ? "available" : "locked";
  return { id: t.id, done, total, pct: total ? done / total : 0, mastery, depth: tp?.depth ?? null, cleared, blockers, status };
}

/** Concept-level lock (component edges that point at a single concept, e.g. P16.0#7 needs P19.1). */
export function conceptBlocker(s: UserState, conceptId: string): string | null {
  const topicId = conceptId.split("#")[0];
  const t = topicById.get(topicId);
  if (!t) return null;
  const hit = t.cpre.find(([to, from]) => to === conceptId && !topicComplete(s, from));
  return hit ? hit[1] : null;
}

export type Rollup = { done: number; total: number; pct: number; mastered: number; topics: number; status: Status };

function rollup(s: UserState, topics: IndexTopic[]): Rollup {
  let done = 0, total = 0, mastered = 0, anyProgress = false, anyCleared = false, allMastered = topics.length > 0, allDone = topics.length > 0;
  topics.forEach((t) => {
    const v = topicView(s, t);
    done += v.done;
    total += v.total;
    if (v.status === "mastered") mastered += 1;
    if (v.status !== "mastered") allMastered = false;
    if (!(v.status === "completed" || v.status === "mastered")) allDone = false;
    if (v.status === "in_progress" || v.done > 0) anyProgress = true;
    if (v.cleared) anyCleared = true;
  });
  const status: Status = allMastered ? "mastered" : allDone ? "completed" : anyProgress ? "in_progress" : anyCleared ? "available" : "locked";
  return { done, total, pct: total ? done / total : 0, mastered, topics: topics.length, status };
}

export function phaseRollup(s: UserState, phaseId: string): Rollup {
  const p = phaseById.get(phaseId);
  return rollup(s, (p?.topics ?? []).map((id) => topicById.get(id)!).filter(Boolean));
}

export function overallRollup(s: UserState): Rollup {
  return rollup(s, idx.topics.filter((t) => !t.od));
}

export type WeekView = { cw: number; done: number; total: number; pct: number; complete: boolean; cleared: boolean; status: Status };

export function weekView(s: UserState, w: IndexWeek): WeekView {
  const done = w.u.filter((u) => !!s.checks[u]).length;
  const total = w.u.length;
  const complete = !!s.weeks[w.cw]?.done;
  const cleared = gatePassed(s, w.rg);
  const gatePassedHere = w.g ? gatePassed(s, w.g) : false;
  let status: Status;
  if (complete || gatePassedHere) status = "completed";
  else if (done > 0) status = "in_progress";
  else status = cleared ? "available" : "locked";
  return { cw: w.cw, done, total, pct: total ? done / total : complete ? 1 : 0, complete: complete || gatePassedHere, cleared, status };
}

export function weeksCompleted(s: UserState) {
  return idx.weeks.filter((w) => weekView(s, w).complete).length;
}

/** The first gate at or after the current week that is not passed, or an earlier unpassed gate blocking it. */
export function approachingGate(s: UserState) {
  const cw = s.currentWeek;
  const blocking = orderedGates.find((g) => g.w != null && g.w < cw && !gatePassed(s, g.id));
  if (blocking) return { gate: blocking, blocking: true };
  const next = orderedGates.find((g) => g.w != null && g.w >= cw && !gatePassed(s, g.id));
  return next ? { gate: next, blocking: false } : null;
}

export function gateCriteriaDone(s: UserState, g: IndexGate) {
  const c = s.gates[g.id]?.criteria ?? {};
  return Array.from({ length: g.n }, (_, i) => !!c[i]).filter(Boolean).length;
}

export const COMPETENCY_GATES = ["G0", "C1", "C2", "C3", "C4", "C5", "C6", "C7"];

/** Topics cleared to work on but not finished, in schedule order. */
export function availableTopics(s: UserState, limit = 8) {
  return idx.topics
    .filter((t) => t.w != null)
    .sort((a, b) => (a.w ?? 0) - (b.w ?? 0))
    .map((t) => ({ t, v: topicView(s, t) }))
    .filter(({ v }) => v.cleared && (v.status === "available" || v.status === "in_progress"))
    .slice(0, limit);
}

/** Spaced re-tests due (master spaced-retest rule), for topics at Demonstrated or above. */
export function dueReviews(s: UserState, at = new Date()) {
  const out: { topicId: string; due: Date; count: number }[] = [];
  Object.entries(s.topics).forEach(([id, tp]) => {
    if (tp.mastery < 4 || !tp.demonstratedAt) return;
    const count = tp.reviews?.count ?? 0;
    if (count >= idx.retest.length) return;
    const base = new Date(tp.reviews?.last ?? tp.demonstratedAt);
    const due = new Date(base.getTime() + idx.retest[count] * 86400000);
    if (due <= at) out.push({ topicId: id, due, count });
  });
  return out.sort((a, b) => a.due.getTime() - b.due.getTime());
}

export function nextReviewDate(s: UserState, topicId: string): Date | null {
  const tp = s.topics[topicId];
  if (!tp || tp.mastery < 4 || !tp.demonstratedAt) return null;
  const count = tp.reviews?.count ?? 0;
  if (count >= idx.retest.length) return null;
  const base = new Date(tp.reviews?.last ?? tp.demonstratedAt);
  return new Date(base.getTime() + idx.retest[count] * 86400000);
}

/** Next unchecked units of a week's primary work, in order. */
export function nextUnits(s: UserState, w: IndexWeek, limit = 3) {
  return w.pu.filter((u) => !s.checks[u]).slice(0, limit);
}

export function stageOfWeek(cw: number) {
  const w = weekByCw(cw);
  return idx.stages.find((st) => st.id === w?.s);
}

export function unitLabel(u: string) {
  return idx.ct[u] ?? topicById.get(u)?.t ?? u;
}

export function pct(n: number) {
  return `${Math.round(n * 100)}%`;
}
