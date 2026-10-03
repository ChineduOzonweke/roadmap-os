"use client";

import { useSyncExternalStore } from "react";
import { emptyState, type UserState } from "@/types/state";
import type { BackupStore, PersistenceAdapter, QuarantineEntry, SnapshotMeta, SnapshotReason } from "@/lib/persistence";
import { readDocument } from "@/lib/persistence/migrate";
import { sanitizeState } from "@/lib/persistence/sanitize";
import { hasProgress } from "@/lib/persistence/portable";

const SAVE_DELAY_MS = 300;
const WEEKLY_SNAPSHOT_MS = 7 * 86400000;

export type LoadNotice =
  /** Stored progress could not be parsed; the raw text was quarantined and the app started empty. */
  | { kind: "quarantined"; message: string }
  /** Some stored entries were malformed and skipped; the original was quarantined. */
  | { kind: "repaired"; message: string }
  /** Storage could not be read, or held unreadable data that could not be quarantined. Saving is off. */
  | { kind: "blocked"; message: string }
  /** Stored progress came from a newer schema. Shown read-only so this build cannot damage it. */
  | { kind: "newer"; message: string };

export type StorageStatus = {
  save: { state: "idle" | "pending" | "saved" | "failed"; at?: string; error?: string };
  load: LoadNotice | null;
  /** True when this tab must not write the main document (see LoadNotice "blocked" and "newer"). */
  readOnly: boolean;
  snapshots: SnapshotMeta[];
  quarantined: QuarantineEntry[];
  lastExportAt: string | null;
};

const INITIAL_STATUS: StorageStatus = { save: { state: "idle" }, load: null, readOnly: false, snapshots: [], quarantined: [], lastExportAt: null };

/** Merge a loaded document with defaults so older, partial or malformed documents stay valid. */
export function normalize(input: unknown): UserState {
  return sanitizeState(input).state;
}

export function createStore() {
  const SERVER_STATE = emptyState();
  let state: UserState = SERVER_STATE;
  let status: StorageStatus = INITIAL_STATUS;
  let hydrated = false;
  let adapter: PersistenceAdapter | null = null;
  let backups: BackupStore | null = null;
  let saveTimer: ReturnType<typeof setTimeout> | null = null;
  let dirty = false;
  const listeners = new Set<() => void>();

  const emit = () => listeners.forEach((l) => l());
  const subscribe = (listener: () => void) => {
    listeners.add(listener);
    return () => void listeners.delete(listener);
  };

  function setStatus(patch: Partial<StorageStatus>) {
    status = { ...status, ...patch };
    emit();
  }

  function refreshBackups() {
    if (!backups) return;
    setStatus({ snapshots: backups.list(), quarantined: backups.quarantined(), lastExportAt: backups.device().lastExportAt ?? null });
  }

  /**
   * Write now. Returns once the adapter has answered. When storage is full, the
   * oldest automatic backups are dropped to make room (the live document wins),
   * but the newest one is always kept.
   */
  async function flush(): Promise<boolean> {
    if (saveTimer) {
      clearTimeout(saveTimer);
      saveTimer = null;
    }
    if (!adapter || !hydrated || status.readOnly || !dirty) return true;
    dirty = false;
    const snapshot = state;
    let r = await adapter.save(snapshot);
    let freed = false;
    while (!r.ok && r.quota && backups && backups.list().length > 1 && backups.dropOldest()) {
      freed = true;
      r = await adapter.save(snapshot);
    }
    if (freed) refreshBackups();
    if (r.ok) {
      setStatus({ save: { state: "saved", at: new Date().toISOString() } });
      return true;
    }
    dirty = true;
    setStatus({ save: { state: "failed", at: status.save.at, error: r.error } });
    return false;
  }

  function scheduleSave() {
    if (!adapter || !hydrated || status.readOnly) return;
    dirty = true;
    if (saveTimer) clearTimeout(saveTimer);
    if (status.save.state !== "pending") setStatus({ save: { ...status.save, state: "pending" } });
    saveTimer = setTimeout(() => void flush(), SAVE_DELAY_MS);
  }

  function update(mutator: (draft: UserState) => UserState) {
    state = { ...mutator(state), updatedAt: new Date().toISOString() };
    emit();
    scheduleSave();
  }

  function replaceState(next: UserState, persist = true) {
    state = normalize(next);
    emit();
    if (persist) scheduleSave();
  }

  function snapshot(reason: SnapshotReason, s: UserState = state) {
    if (!backups) return { ok: false as const, error: "Automatic backups are not available yet." };
    const r = backups.add(reason, s);
    refreshBackups();
    return r;
  }

  async function init(a: PersistenceAdapter, b: BackupStore | null = null) {
    if (adapter) return () => {};
    adapter = a;
    backups = b;
    const loaded = await a.load();
    let load: LoadNotice | null = null;
    let readOnly = false;
    let needsSave = false;
    let next = emptyState();

    if (loaded.status === "error") {
      readOnly = true;
      load = { kind: "blocked", message: `Stored progress could not be read (${loaded.error}). Changes in this tab will not be saved, so nothing stored is overwritten.` };
    } else if (loaded.status === "unreadable") {
      if (b?.quarantine(loaded.raw, `unreadable: ${loaded.error}`)) {
        load = { kind: "quarantined", message: "Stored progress was damaged and could not be read. The original was kept: in Settings > Backup you can download it, restore an automatic backup, or import an exported file." };
      } else {
        readOnly = true;
        load = { kind: "blocked", message: "Stored progress was damaged and there was no room to keep a copy. Saving is off so it is not overwritten. Free browser storage, or import an exported backup." };
      }
    } else if (loaded.status === "found") {
      const r = readDocument(loaded.doc);
      if (!r.ok) {
        next = normalize(loaded.doc);
        readOnly = true;
        load = r.reason === "newer"
          ? { kind: "newer", message: `Progress here was saved by a newer version of Roadmap OS (schema v${r.version}). It is shown read-only; changes in this tab will not be saved.` }
          : { kind: "blocked", message: "Stored progress is not in a recognised format. Saving is off so it is not overwritten." };
        if (r.reason !== "newer") b?.quarantine(JSON.stringify(loaded.doc), "not an object");
      } else {
        next = r.state;
        // Only write a migrated document back once the pre-migration original is safely snapshotted.
        if (r.migrated) needsSave = !!b?.add("before-migration", loaded.doc as UserState).ok;
        const dropped = r.issues.filter((i) => i.dropped);
        if (dropped.length) {
          if (b?.quarantine(JSON.stringify(loaded.doc), `repaired: ${dropped.length} unreadable entries skipped`)) {
            needsSave = true;
            load = { kind: "repaired", message: `${dropped.length} stored ${dropped.length === 1 ? "entry was" : "entries were"} unreadable and skipped. The original data was kept in Settings > Backup.` };
          } else {
            readOnly = true;
            load = { kind: "blocked", message: "Some stored entries were unreadable and there was no room to keep a copy. Saving is off so nothing is lost." };
          }
        }
      }
    }

    state = next;
    hydrated = true;
    status = { ...status, load, readOnly };
    if (b) {
      const last = b.device().lastSnapshotAt;
      if (!readOnly && hasProgress(state) && (!last || Date.now() - new Date(last).getTime() > WEEKLY_SNAPSHOT_MS)) b.add("weekly", state);
      refreshBackups();
    }
    emit();
    // Write the migrated/repaired document back once its original is safe in quarantine or a snapshot.
    if (needsSave && !readOnly) {
      dirty = true;
      await flush();
    }

    const unsub = a.subscribe?.((remote) => {
      const r = readDocument(remote);
      if (!r.ok) return;
      state = r.state;
      emit();
    });

    const onHide = () => void flush();
    const onVisibility = () => document.visibilityState === "hidden" && void flush();
    const hasWindow = typeof window !== "undefined";
    if (hasWindow) {
      window.addEventListener("pagehide", onHide);
      document.addEventListener("visibilitychange", onVisibility);
    }
    return () => {
      unsub?.();
      if (hasWindow) {
        window.removeEventListener("pagehide", onHide);
        document.removeEventListener("visibilitychange", onVisibility);
      }
    };
  }

  return {
    SERVER_STATE,
    subscribe,
    getState: () => state,
    getStatus: () => status,
    isHydrated: () => hydrated,
    update,
    replaceState,
    flush,
    snapshot,
    init,
    refreshBackups,
    backups: () => backups,
    persistenceInfo: () => (adapter ? { kind: adapter.kind, description: adapter.description } : null),
  };
}

const store = createStore();

export const getState = store.getState;
export const update = store.update;
export const replaceState = store.replaceState;
export const flushSave = store.flush;
export const takeSnapshot = store.snapshot;
export const refreshBackups = store.refreshBackups;
export const backupStore = store.backups;
export const persistenceInfo = store.persistenceInfo;
export const initStore = store.init;
export const getStorageStatus = store.getStatus;

export function useUserState(): UserState {
  return useSyncExternalStore(store.subscribe, store.getState, () => store.SERVER_STATE);
}

export function useHydrated(): boolean {
  return useSyncExternalStore(store.subscribe, store.isHydrated, () => false);
}

export function useStorageStatus(): StorageStatus {
  return useSyncExternalStore(store.subscribe, store.getStatus, () => INITIAL_STATUS);
}
