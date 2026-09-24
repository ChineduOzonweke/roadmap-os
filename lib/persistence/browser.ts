import type { UserState } from "@/types/state";
import type { PersistenceAdapter } from "./adapter";

const KEY = "roadmap-os:state:v1";

export const browserAdapter: PersistenceAdapter = {
  kind: "browser",
  description: "Saved in this browser only. Cloud sync across devices is the next stage.",
  async load() {
    try {
      const raw = window.localStorage.getItem(KEY);
      return raw ? (JSON.parse(raw) as UserState) : null;
    } catch {
      return null;
    }
  },
  async save(state) {
    try {
      window.localStorage.setItem(KEY, JSON.stringify(state));
    } catch {
      // Storage full or blocked (private mode). Progress stays in memory for this session.
    }
  },
  subscribe(onRemoteChange) {
    const handler = (e: StorageEvent) => {
      if (e.key !== KEY || !e.newValue) return;
      try {
        onRemoteChange(JSON.parse(e.newValue) as UserState);
      } catch {
        /* ignore malformed payloads */
      }
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  },
};
