import { STATE_VERSION, type UserState } from "@/types/state";
import type { KV } from "./kv";
import { summarize, type StateSummary } from "./portable";

/**
 * Local safety net, kept beside (never inside) the main progress document:
 * - snapshots: a small ring of automatic backups taken before import, reset and
 *   restore, plus one a week. They live in this browser, so they do not survive
 *   clearing site data; exported files are the real backup.
 * - quarantine: raw text of stored progress that could not be read or had to be
 *   repaired, kept so it can be downloaded and recovered by hand.
 * - device: per-device facts such as when progress was last exported.
 */

export const SNAPSHOTS_KEY = "roadmap-os:snapshots:v1";
export const QUARANTINE_KEY = "roadmap-os:quarantine:v1";
export const DEVICE_KEY = "roadmap-os:device:v1";

export type SnapshotReason = "before-import" | "before-reset" | "before-restore" | "before-migration" | "weekly" | "manual";
export type SnapshotMeta = { id: string; at: string; reason: SnapshotReason; schemaVersion: number; summary: StateSummary };
export type Snapshot = SnapshotMeta & { state: UserState };
export type QuarantineEntry = { at: string; reason: string; raw: string };
export type DeviceMeta = {
  lastExportAt?: string;
  lastSnapshotAt?: string;
  /** Tutor access token for this device (ROADMAP_AI_ACCESS_TOKEN). Device-local: never part of UserState or exports. */
  aiAccessToken?: string;
};

export type BackupStore = ReturnType<typeof createBackupStore>;

function readJson<T>(kv: KV, key: string, fallback: T): T {
  try {
    const raw = kv.get(key);
    if (!raw) return fallback;
    const v = JSON.parse(raw);
    return (v ?? fallback) as T;
  } catch {
    return fallback;
  }
}

export function createBackupStore(kv: KV, opts: { maxSnapshots?: number; maxQuarantine?: number } = {}) {
  const maxSnapshots = opts.maxSnapshots ?? 5;
  const maxQuarantine = opts.maxQuarantine ?? 3;

  const all = (): Snapshot[] => {
    const v = readJson<unknown>(kv, SNAPSHOTS_KEY, []);
    return Array.isArray(v) ? v.filter((x): x is Snapshot => !!x && typeof x === "object" && typeof x.id === "string" && !!x.state) : [];
  };

  /** Write a list, dropping the oldest entries until it fits. Returns how many entries were kept, or 0 on failure. */
  function writeTrimmed<T>(key: string, items: T[], min: number): number {
    let list = items;
    while (list.length >= min) {
      try {
        kv.set(key, JSON.stringify(list));
        return list.length;
      } catch {
        if (list.length === min) break;
        list = list.slice(1);
      }
    }
    return 0;
  }

  const device = (): DeviceMeta => {
    const v = readJson<unknown>(kv, DEVICE_KEY, {});
    return v && typeof v === "object" && !Array.isArray(v) ? (v as DeviceMeta) : {};
  };

  const setDevice = (patch: Partial<DeviceMeta>): boolean => {
    try {
      kv.set(DEVICE_KEY, JSON.stringify({ ...device(), ...patch }));
      return true;
    } catch {
      return false;
    }
  };

  return {
    /** Newest first, without the state payload. */
    list(): SnapshotMeta[] {
      return all()
        .map((x): SnapshotMeta => ({ id: x.id, at: x.at, reason: x.reason, schemaVersion: x.schemaVersion, summary: x.summary }))
        .reverse();
    },

    get(id: string): Snapshot | null {
      return all().find((s) => s.id === id) ?? null;
    },

    add(reason: SnapshotReason, state: UserState, at = new Date()): { ok: true; meta: SnapshotMeta } | { ok: false; error: string } {
      const meta: SnapshotMeta = {
        id: `snap-${at.getTime().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
        at: at.toISOString(),
        reason,
        schemaVersion: STATE_VERSION,
        summary: summarize(state),
      };
      const next = [...all(), { ...meta, state }].slice(-maxSnapshots);
      if (!writeTrimmed(SNAPSHOTS_KEY, next, 1)) {
        return { ok: false, error: "Browser storage is full, so an automatic backup could not be saved." };
      }
      setDevice({ lastSnapshotAt: meta.at });
      return { ok: true, meta };
    },

    remove(id: string) {
      writeTrimmed(SNAPSHOTS_KEY, all().filter((s) => s.id !== id), 0);
    },

    /**
     * Free space for the main document, which always wins over automatic backups.
     * Removes the oldest snapshot; returns false when there is nothing left to drop.
     */
    dropOldest(): boolean {
      const list = all();
      if (!list.length) return false;
      try {
        if (list.length === 1) kv.remove(SNAPSHOTS_KEY);
        else kv.set(SNAPSHOTS_KEY, JSON.stringify(list.slice(1)));
        return true;
      } catch {
        try {
          kv.remove(SNAPSHOTS_KEY);
          return true;
        } catch {
          return false;
        }
      }
    },

    quarantine(raw: string, reason: string, at = new Date()): boolean {
      const prev = readJson<unknown>(kv, QUARANTINE_KEY, []);
      const list = Array.isArray(prev) ? (prev as QuarantineEntry[]) : [];
      // Identical raw text is already kept; do not fill storage with copies on every reload.
      if (list.some((q) => q.raw === raw)) return true;
      const next = [...list, { at: at.toISOString(), reason, raw }].slice(-maxQuarantine);
      return writeTrimmed(QUARANTINE_KEY, next, 1) > 0;
    },

    quarantined(): QuarantineEntry[] {
      const v = readJson<unknown>(kv, QUARANTINE_KEY, []);
      return Array.isArray(v) ? (v as QuarantineEntry[]).filter((q) => q && typeof q.raw === "string") : [];
    },

    device,
    setDevice,
  };
}
