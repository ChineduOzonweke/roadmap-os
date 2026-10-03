import { STATE_VERSION, type UserState } from "@/types/state";
import { sanitizeState, type Issue } from "./sanitize";

type Doc = Record<string, unknown>;
export type Migration = (doc: Doc) => Doc;

/**
 * Schema migrations, keyed by the version they upgrade FROM. Each one takes a
 * document at version N and returns a new document at version N + 1. Rules:
 * never mutate the input, never drop fields you do not understand, and add a
 * test with a real document of the old shape. Bump STATE_VERSION alongside.
 *
 * Example for the first schema change:
 *   1: (doc) => ({ ...doc, version: 2, newField: defaultFor(doc) }),
 */
export const MIGRATIONS: Record<number, Migration> = {
  // v1 -> v2 (phase C): Daily Work Unit sessions.
  1: (doc) => ({ ...doc, version: 2, sessions: Array.isArray(doc.sessions) ? doc.sessions : [] }),
};

export type MigrateResult =
  | { ok: true; doc: Doc; from: number; applied: number[] }
  | { ok: false; reason: "newer"; version: number };

/** Documents without a usable version predate versioning and are treated as v1. */
export function docVersion(doc: Doc): number {
  const v = Number(doc.version);
  return Number.isInteger(v) && v >= 1 ? v : 1;
}

export function migrate(doc: Doc, migrations: Record<number, Migration> = MIGRATIONS, target = STATE_VERSION): MigrateResult {
  const from = docVersion(doc);
  if (from > target) return { ok: false, reason: "newer", version: from };
  let cur = doc;
  const applied: number[] = [];
  for (let v = from; v < target; v++) {
    const step = migrations[v];
    if (!step) throw new Error(`No migration registered from schema v${v} to v${v + 1}`);
    cur = step(cur);
    applied.push(v);
  }
  return { ok: true, doc: cur, from, applied };
}

export type ReadResult =
  | { ok: true; state: UserState; issues: Issue[]; from: number; migrated: boolean }
  | { ok: false; reason: "newer" | "not-object"; version?: number };

/** The one path every stored, synced or imported document goes through: migrate, then validate/repair. */
export function readDocument(input: unknown, migrations: Record<number, Migration> = MIGRATIONS, target = STATE_VERSION): ReadResult {
  if (!input || typeof input !== "object" || Array.isArray(input)) return { ok: false, reason: "not-object" };
  const m = migrate(input as Doc, migrations, target);
  if (!m.ok) return { ok: false, reason: "newer", version: m.version };
  const { state, issues } = sanitizeState(m.doc);
  return { ok: true, state, issues, from: m.from, migrated: m.applied.length > 0 };
}
