import type { UserState } from "@/types/state";

/** What a load found. `doc` is untrusted: the store migrates and validates it before use. */
export type LoadResult =
  | { status: "empty" }
  | { status: "found"; doc: unknown }
  /** Something is stored but cannot be parsed. `raw` must be kept (quarantined) before anything overwrites it. */
  | { status: "unreadable"; raw: string; error: string }
  /** Storage itself could not be read (blocked, unavailable). The store will not write over what it could not read. */
  | { status: "error"; error: string };

/** `quota` marks a full store, the one failure that freeing space (dropping old automatic backups) can fix. */
export type SaveResult = { ok: true } | { ok: false; error: string; quota?: boolean };

/**
 * Storage boundary for user progress. The app never touches storage directly;
 * it talks to one adapter. Today: browser storage. Next stage: a cloud adapter
 * (see docs/PERSISTENCE.md) that loads/saves the same UserState document for
 * the signed-in user, so progress follows you across devices.
 */
export interface PersistenceAdapter {
  readonly kind: "browser" | "cloud";
  readonly description: string;
  load(): Promise<LoadResult>;
  /**
   * Persist the whole document. Must report failure instead of swallowing it.
   * Should perform the write synchronously when it can, so the flush on
   * `pagehide` completes before the page is frozen.
   */
  save(state: UserState): Promise<SaveResult>;
  /** Optional: notify when state changes elsewhere (another tab or device). The payload is untrusted. */
  subscribe?(onRemoteChange: (doc: unknown) => void): () => void;
}
