"use client";

import { useSyncExternalStore } from "react";
import { emptyState, STATE_VERSION, type UserState } from "@/types/state";
import type { PersistenceAdapter } from "@/lib/persistence";

const SERVER_STATE = emptyState();
let state: UserState = SERVER_STATE;
let hydrated = false;
let adapter: PersistenceAdapter | null = null;
let saveTimer: ReturnType<typeof setTimeout> | null = null;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function scheduleSave() {
  if (!adapter || !hydrated) return;
  if (saveTimer) clearTimeout(saveTimer);
  const a = adapter;
  saveTimer = setTimeout(() => {
    void a.save(state);
  }, 300);
}

/** Merge a loaded document with defaults so older or partial documents stay valid. */
export function normalize(input: Partial<UserState> | null | undefined): UserState {
  const base = emptyState();
  if (!input || typeof input !== "object") return base;
  const cw = Number(input.currentWeek);
  return {
    ...base,
    ...input,
    version: STATE_VERSION,
    currentWeek: Number.isFinite(cw) ? Math.min(206, Math.max(1, Math.round(cw))) : 1,
    checks: { ...(input.checks ?? {}) },
    topics: { ...(input.topics ?? {}) },
    gates: { ...(input.gates ?? {}) },
    weeks: { ...(input.weeks ?? {}) },
    projects: { ...(input.projects ?? {}) },
    resources: { ...(input.resources ?? {}) },
    flags: { ...(input.flags ?? {}) },
    notes: { ...(input.notes ?? {}) },
    dsa: Array.isArray(input.dsa) ? input.dsa : [],
    stories: Array.isArray(input.stories) ? input.stories : [],
    applications: Array.isArray(input.applications) ? input.applications : [],
  };
}

export function getState() {
  return state;
}

export function update(mutator: (draft: UserState) => UserState) {
  state = { ...mutator(state), updatedAt: new Date().toISOString() };
  emit();
  scheduleSave();
}

export function replaceState(next: UserState, persist = true) {
  state = normalize(next);
  emit();
  if (persist) scheduleSave();
}

export async function initStore(a: PersistenceAdapter) {
  if (adapter) return () => {};
  adapter = a;
  const loaded = await a.load();
  state = normalize(loaded);
  hydrated = true;
  emit();
  const unsub = a.subscribe?.((remote) => {
    state = normalize(remote);
    emit();
  });
  return () => unsub?.();
}

export function persistenceInfo() {
  return adapter ? { kind: adapter.kind, description: adapter.description } : null;
}

export function useUserState(): UserState {
  return useSyncExternalStore(subscribe, () => state, () => SERVER_STATE);
}

export function useHydrated(): boolean {
  return useSyncExternalStore(subscribe, () => hydrated, () => false);
}
