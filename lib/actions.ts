"use client";

import { update, replaceState } from "@/lib/store";
import { newId } from "@/lib/ids";
import {
  emptyState,
  type AiLogEntry,
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
export function setCheck(id: string, value: boolean) {
  update((s) => {
    const checks = { ...s.checks };
    if (value) checks[id] = now();
    else delete checks[id];
    return { ...s, checks };
  });
}

export function setChecks(ids: string[], value: boolean) {
  update((s) => {
    const checks = { ...s.checks };
    ids.forEach((id) => {
      if (value) checks[id] = checks[id] ?? now();
      else delete checks[id];
    });
    return { ...s, checks };
  });
}

// ---- mastery and depth
export function setMastery(topicId: string, mastery: MasteryLevel) {
  update((s) => {
    const t = topicOf(s, topicId);
    const next: TopicProgress = { ...t, mastery, updatedAt: now() };
    if (mastery >= 4 && !t.demonstratedAt) next.demonstratedAt = now();
    if (mastery < 4) {
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

/** Record a passed spaced re-test (master spaced-retest rule). */
export function recordReview(topicId: string) {
  update((s) => {
    const t = topicOf(s, topicId);
    const reviews = { count: t.reviews.count + 1, last: now() };
    const mastery: MasteryLevel = t.mastery >= 4 ? 5 : t.mastery;
    return { ...s, topics: { ...s.topics, [topicId]: { ...t, reviews, mastery, updatedAt: now() } } };
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

// ---- whole-state operations
export function importState(json: string): { ok: true } | { ok: false; error: string } {
  try {
    const parsed = JSON.parse(json);
    if (!parsed || typeof parsed !== "object" || !("checks" in parsed)) {
      return { ok: false, error: "This file is not a Roadmap OS export: it has no progress data." };
    }
    replaceState(parsed as UserState);
    return { ok: true };
  } catch {
    return { ok: false, error: "This file is not valid JSON. Export a fresh copy and try again." };
  }
}

export function resetState() {
  replaceState(emptyState());
}
