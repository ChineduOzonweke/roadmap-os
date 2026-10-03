import type { PersistenceAdapter } from "./adapter";
import { browserAdapter } from "./browser";
import { createBackupStore, type BackupStore } from "./backups";
import { browserKV } from "./kv";

/**
 * Single switch point for persistence. When cloud sync is added, return the
 * cloud adapter here when the user is signed in (and keep browserAdapter as
 * the offline fallback). No UI component needs to change. See docs/PERSISTENCE.md.
 */
export function getAdapter(): PersistenceAdapter {
  return browserAdapter;
}

/** Local automatic backups and quarantine. Always device-local, whichever adapter is active. */
export function getBackupStore(): BackupStore {
  return createBackupStore(browserKV());
}

export type { PersistenceAdapter, LoadResult, SaveResult } from "./adapter";
export type { BackupStore, SnapshotMeta, SnapshotReason, QuarantineEntry } from "./backups";
