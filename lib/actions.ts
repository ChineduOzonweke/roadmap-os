"use client";

import { backupStore, flushSave, getState, refreshBackups, replaceState, takeSnapshot, update } from "@/lib/store";
import type { SnapshotReason } from "@/lib/persistence";
import { readDocument } from "@/lib/persistence/migrate";
import {
  buildExport, exportFilename, hasProgress, parseImport, serializeExport, type ImportPreview,
} from "@/lib/persistence/portable";
import { newId } from "@/lib/ids";
import { localDay } from "@/lib/today";
import { applyReview, undoReview } from "@/lib/reviews";
import { idx } from "@/lib/progress";
import {
  emptyState,
  type AiLogEntry, type DailySession, type SessionStage,
  type Application, type DepthLevel, type DsaProblem, type GateStatus, type MasteryLevel,
  type ProjectProgress, type ProjectStatus, type ResourceStatus, type Story, type TopicProgress, type UserState,
} from "@/types/state";

const now = () => new Date().toISOString();

function topicOf(s: UserState, id: string): TopicProgress {
  return s.topics[id] ?? { mastery: 0, depth: null, evidence: "", reviews: { count: 0 }, updatedAt: now() };
}

function projectOf(s: UserState, id: string): ProjectProgress {
  return s.projects[id] ?? { status: "not_started", milestones: {}, quality: {}, repoUrl: "" };
}

// ---- checklists
/** Items ticked while a session is running are recorded on that session as part of its log. */
function noteTicks(s: UserState, ids: string[], value: boolean): UserState["sessions"] {
  const active = s.sessions.find((x) => x.status === "active");
  if (!active) return s.sessions;
  const ticked = value ? [...new Set([...active.ticked, ...ids])] : active.ticked.filter((x) => !ids.includes(x));
  return s.sessions.map((x) => (x === active ? { ...x, ticked, updatedAt: now() } : x));
}

export function setCheck(id: string, value: boolean) {
  update((s) => {
    const checks = { ...s.checks };
    if (value) checks[id] = now();
    else delete checks[id];
    return { ...s, checks, sessions: noteTicks(s, [id], value) };
  });
}

export function setChecks(ids: string[], value: boolean) {
  update((s) => {
    const checks = { ...s.checks };
    ids.forEach((id) => {
      if (value) checks[id] = checks[id] ?? now();
      else delete checks[id];
    });
    return { ...s, checks, sessions: noteTicks(s, ids, value) };
  });
}

// ---- mastery and depth
export function setMastery(topicId: string, mastery: MasteryLevel) {
  update((s) => {
    const t = topicOf(s, topicId);
    const next: TopicProgress = { ...t, mastery, updatedAt: now() };
    if (mastery >= 4 && !t.demonstratedAt) next.demonstratedAt = now();
    if (mastery < 4 && t.mastery >= 4) {
      // Keep the finished re-test cycle as history; a new cycle starts when the topic is demonstrated again.
      if (t.reviews.count > 0 || t.demonstratedAt) {
        const cycle = { ...t.reviews, ...(t.demonstratedAt ? { demonstratedAt: t.demonstratedAt } : {}), endedAt: now() };
        next.pastReviews = [...(t.pastReviews ?? []), cycle];
      }
      delete next.demonstratedAt;
      next.reviews = { count: 0 };
    }
    return { ...s, topics: { ...s.topics, [topicId]: next } };
  });
}

export function setDepth(topicId: string, depth: DepthLevel | null) {
  update((s) => ({ ...s, topics: { ...s.topics, [topicId]: { ...topicOf(s, topicId), depth, updatedAt: now() } } }));
}

export function setEvidence(topicId: string, evidence: string) {
  update((s) => ({ ...s, topics: { ...s.topics, [topicId]: { ...topicOf(s, topicId), evidence, updatedAt: now() } } }));
}

/** Record a spaced re-test result (see lib/reviews.ts for the rules). */
export function recordReview(topicId: string, result: "pass" | "fail" = "pass", note = "") {
  update((s) => {
    const t = s.topics[topicId];
    if (!t) return s;
    return { ...s, topics: { ...s.topics, [topicId]: applyReview(t, result, idx.retest, new Date(), note) } };
  });
}

/** Undo the most recent re-test result for a topic. */
export function undoLastReview(topicId: string) {
  update((s) => {
    const t = s.topics[topicId];
    if (!t) return s;
    return { ...s, topics: { ...s.topics, [topicId]: undoReview(t, new Date()) } };
  });
}

// ---- gates
export function setGateStatus(id: string, status: GateStatus) {
  update((s) => {
    const g = s.gates[id] ?? { status: "not_attempted", criteria: {}, evidence: "" };
    return {
      ...s,
      gates: { ...s.gates, [id]: { ...g, status, passedAt: status === "passed" ? now() : undefined } },
    };
  });
}

export function setGateCriterion(id: string, index: number, value: boolean) {
  update((s) => {
    const g = s.gates[id] ?? { status: "not_attempted" as GateStatus, criteria: {}, evidence: "" };
    return { ...s, gates: { ...s.gates, [id]: { ...g, criteria: { ...g.criteria, [index]: value } } } };
  });
}

export function setGateEvidence(id: string, evidence: string) {
  update((s) => {
    const g = s.gates[id] ?? { status: "not_attempted" as GateStatus, criteria: {}, evidence: "" };
    return { ...s, gates: { ...s.gates, [id]: { ...g, evidence } } };
  });
}

// ---- weeks
export function setWeekDone(cw: number, done: boolean) {
  update((s) => ({ ...s, weeks: { ...s.weeks, [cw]: done ? { done, doneAt: now() } : { done: false } } }));
}

export function setCurrentWeek(cw: number) {
  update((s) => ({ ...s, currentWeek: Math.min(206, Math.max(1, cw)) }));
}

// ---- projects
export function setProjectStatus(id: string, status: ProjectStatus) {
  update((s) => ({ ...s, projects: { ...s.projects, [id]: { ...projectOf(s, id), status } } }));
}

export function setProjectFlag(id: string, group: "milestones" | "quality", key: string, value: boolean) {
  update((s) => {
    const p = projectOf(s, id);
    const next = { ...p, [group]: { ...p[group], [key]: value } };
    if (group === "milestones" && value && p.status === "not_started") next.status = "in_progress";
    return { ...s, projects: { ...s.projects, [id]: next } };
  });
}

export function setProjectRepo(id: string, repoUrl: string) {
  update((s) => ({ ...s, projects: { ...s.projects, [id]: { ...projectOf(s, id), repoUrl } } }));
}

// ---- resources, flags, notes
export function setResourceStatus(id: string, status: ResourceStatus | null) {
  update((s) => {
    const resources = { ...s.resources };
    if (status) resources[id] = status;
    else delete resources[id];
    return { ...s, resources };
  });
}

export function setFlag(id: string, value: boolean) {
  update((s) => {
    const flags = { ...s.flags };
    if (value) flags[id] = true;
    else delete flags[id];
    return { ...s, flags };
  });
}

export function setNote(entityId: string, text: string) {
  update((s) => {
    const notes = { ...s.notes };
    if (text.trim()) notes[entityId] = { text, updatedAt: now() };
    else delete notes[entityId];
    return { ...s, notes };
  });
}

// ---- DSA journal, stories, applications
export function saveDsa(p: Omit<DsaProblem, "id" | "createdAt" | "updatedAt"> & { id?: string; createdAt?: string }) {
  update((s) => {
    const id = p.id ?? newId("dsa");
    const item: DsaProblem = { ...p, id, createdAt: p.createdAt ?? now(), updatedAt: now() };
    const exists = s.dsa.some((x) => x.id === id);
    return { ...s, dsa: exists ? s.dsa.map((x) => (x.id === id ? item : x)) : [item, ...s.dsa] };
  });
}
export function deleteDsa(id: string) {
  update((s) => ({ ...s, dsa: s.dsa.filter((x) => x.id !== id) }));
}

export function saveStory(p: Omit<Story, "id" | "updatedAt"> & { id?: string }) {
  update((s) => {
    const id = p.id ?? newId("story");
    const item: Story = { ...p, id, updatedAt: now() };
    const exists = s.stories.some((x) => x.id === id);
    return { ...s, stories: exists ? s.stories.map((x) => (x.id === id ? item : x)) : [item, ...s.stories] };
  });
}
export function deleteStory(id: string) {
  update((s) => ({ ...s, stories: s.stories.filter((x) => x.id !== id) }));
}

export function saveApplication(p: Omit<Application, "id" | "updatedAt"> & { id?: string }) {
  update((s) => {
    const id = p.id ?? newId("app");
    const item: Application = { ...p, id, updatedAt: now() };
    const exists = s.applications.some((x) => x.id === id);
    return { ...s, applications: exists ? s.applications.map((x) => (x.id === id ? item : x)) : [item, ...s.applications] };
  });
}
export function deleteApplication(id: string) {
  update((s) => ({ ...s, applications: s.applications.filter((x) => x.id !== id) }));
}

// ---- AI practice log (overlay missions and everyday AI use)
export function saveAiLog(p: Omit<AiLogEntry, "id" | "createdAt" | "updatedAt"> & { id?: string; createdAt?: string }) {
  update((s) => {
    const id = p.id ?? newId("ai");
    const item: AiLogEntry = { ...p, id, createdAt: p.createdAt ?? now(), updatedAt: now() };
    const exists = s.aiLog.some((x) => x.id === id);
    return { ...s, aiLog: exists ? s.aiLog.map((x) => (x.id === id ? item : x)) : [item, ...s.aiLog] };
  });
}
export function deleteAiLog(id: string) {
  update((s) => ({ ...s, aiLog: s.aiLog.filter((x) => x.id !== id) }));
}

// ---- Daily Work Unit sessions
function patchSession(id: string, fn: (x: DailySession) => DailySession) {
  update((s) => ({ ...s, sessions: s.sessions.map((x) => (x.id === id ? { ...fn(x), updatedAt: now() } : x)) }));
}

/** Start a session, or return the one already running (only one at a time). */
export function startSession(opts: { week: number; focus: string[]; stages: SessionStage[]; plan: "full" | "short" }): string {
  const running = getState().sessions.find((x) => x.status === "active");
  if (running) return running.id;
  const id = newId("session");
  const t = now();
  const stages = opts.stages.map((st, i) => ({ ...st, ...(i === 0 ? { startedAt: t } : {}) }));
  const session: DailySession = {
    id, date: localDay(), week: opts.week, plan: opts.plan, status: "active", startedAt: t, stage: 0, stages,
    focus: opts.focus, ticked: [], log: { learned: "", stuck: "", next: "" }, updatedAt: t,
  };
  update((s) => ({ ...s, sessions: [session, ...s.sessions] }));
  return id;
}

/** Move to stage `to` (forward or back). The current stage is closed; `skip` marks it skipped instead of done. */
export function goToStage(id: string, to: number, skip = false) {
  patchSession(id, (x) => {
    if (to < 0 || to >= x.stages.length || to === x.stage) return x;
    const t = now();
    const stages = x.stages.map((st, i) => {
      if (i === x.stage) {
        const out: SessionStage = { ...st, endedAt: t };
        if (skip) out.skipped = true;
        else delete out.skipped;
        return out;
      }
      if (i === to) {
        // Reopening a stage keeps its first start time.
        const out: SessionStage = { ...st, startedAt: st.startedAt ?? t };
        delete out.endedAt;
        delete out.skipped;
        return out;
      }
      return st;
    });
    return { ...x, stage: to, stages };
  });
}

export function setStageNote(id: string, index: number, note: string) {
  patchSession(id, (x) => ({ ...x, stages: x.stages.map((st, i) => (i === index ? { ...st, note } : st)) }));
}

export function setSessionLog(id: string, patch: Partial<DailySession["log"]>) {
  patchSession(id, (x) => ({ ...x, log: { ...x.log, ...patch } }));
}

/** Finish the session: close the running stage and keep the whole record as the day's log. */
export function completeSession(id: string) {
  patchSession(id, (x) => {
    const t = now();
    return { ...x, status: "completed", endedAt: t, stages: x.stages.map((st, i) => (i === x.stage && !st.endedAt ? { ...st, endedAt: t } : st)) };
  });
}

/** Stop without completing. The record is kept (never deleted) and marked abandoned. */
export function abandonSession(id: string) {
  patchSession(id, (x) => {
    const t = now();
    return { ...x, status: "abandoned", endedAt: t, stages: x.stages.map((st, i) => (i === x.stage && !st.endedAt ? { ...st, endedAt: t } : st)) };
  });
}

// ---- whole-state operations (backup, import, reset). Each one that replaces progress
// takes an automatic local backup first and refuses to continue if that fails,
// unless the caller explicitly passes `force` after the user has agreed.
type Result = { ok: true } | { ok: false; error: string; needsForce?: boolean };

function backupFirst(reason: SnapshotReason, force: boolean): Result {
  const current = getState();
  if (!hasProgress(current)) return { ok: true };
  const r = takeSnapshot(reason, current);
  if (r.ok || force) return { ok: true };
  return { ok: false, error: `${r.error} Export a backup file first, or continue without an automatic backup.`, needsForce: true };
}

/** Build the backup file for the current progress and remember when this device last exported. */
export function exportBackup(curriculum: { md5: string; generated: string } | null): { filename: string; json: string } {
  const at = new Date();
  const json = serializeExport(buildExport(getState(), curriculum, at));
  backupStore()?.setDevice({ lastExportAt: at.toISOString() });
  refreshBackups();
  return { filename: exportFilename(at), json };
}

/** Validate a backup file without changing anything. */
export function previewImport(text: string, currentMd5?: string): ImportPreview {
  return parseImport(text, currentMd5);
}

export function applyImport(preview: Extract<ImportPreview, { ok: true }>, force = false): Result {
  const b = backupFirst("before-import", force);
  if (!b.ok) return b;
  replaceState(preview.state);
  void flushSave();
  return { ok: true };
}

export function restoreSnapshot(id: string, force = false): Result {
  const snap = backupStore()?.get(id);
  if (!snap) return { ok: false, error: "That automatic backup no longer exists." };
  const doc = readDocument(snap.state);
  if (!doc.ok) return { ok: false, error: "That automatic backup cannot be read by this version of Roadmap OS." };
  const b = backupFirst("before-restore", force);
  if (!b.ok) return b;
  replaceState(doc.state);
  void flushSave();
  return { ok: true };
}

export function snapshotNow(): Result {
  const r = takeSnapshot("manual");
  return r.ok ? { ok: true } : r;
}

/** A stored automatic backup as a standard backup file, so it can be kept outside the browser. */
export function snapshotFile(id: string, curriculum: { md5: string; generated: string } | null): { filename: string; json: string } | null {
  const snap = backupStore()?.get(id);
  if (!snap) return null;
  const at = new Date(snap.at);
  return { filename: exportFilename(at).replace("backup", `auto-${snap.reason}`), json: serializeExport(buildExport(snap.state, curriculum, at)) };
}

/** Raw text of quarantined (unreadable or repaired) stored progress, for manual recovery. */
export function quarantineFile(index: number): { filename: string; text: string } | null {
  const q = backupStore()?.quarantined()[index];
  if (!q) return null;
  return { filename: `roadmap-os-recovered-${q.at.slice(0, 10)}.json`, text: q.raw };
}

export function resetState(force = false): Result {
  const b = backupFirst("before-reset", force);
  if (!b.ok) return b;
  replaceState(emptyState());
  void flushSave();
  return { ok: true };
}

/** Retry a failed save (for example after freeing browser storage). */
export function retrySave(): Promise<boolean> {
  return flushSave();
}
