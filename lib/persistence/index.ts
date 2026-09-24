import type { PersistenceAdapter } from "./adapter";
import { browserAdapter } from "./browser";

/**
 * Single switch point for persistence. When cloud sync is added, return the
 * Supabase adapter here when the user is signed in (and keep browserAdapter as
 * the offline fallback). No UI component needs to change.
 */
export function getAdapter(): PersistenceAdapter {
  return browserAdapter;
}

export type { PersistenceAdapter } from "./adapter";
