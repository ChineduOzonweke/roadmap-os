import type { PersistenceAdapter } from "./adapter";
import { browserKV, type KV } from "./kv";

/** Storage key for the main progress document. Never rename: existing users' progress lives here. */
export const STATE_KEY = "roadmap-os:state:v1";

const isQuota = (e: unknown) => (e instanceof Error && e.name === "QuotaExceededError") || /quota/i.test(String(e));

function message(e: unknown): string {
  const name = e instanceof Error ? e.name : "";
  if (isQuota(e)) return "Browser storage is full.";
  if (name === "SecurityError") return "This browser is blocking site storage (private mode or a privacy setting).";
  return e instanceof Error ? e.message : String(e);
}

export function createBrowserAdapter(getKv: () => KV): PersistenceAdapter {
  return {
    kind: "browser",
    description: "Saved in this browser on this device. Export a backup to move progress between devices.",
    async load() {
      let raw: string | null;
      try {
        raw = getKv().get(STATE_KEY);
      } catch (e) {
        return { status: "error", error: message(e) };
      }
      if (raw === null || raw === "") return { status: "empty" };
      try {
        return { status: "found", doc: JSON.parse(raw) };
      } catch (e) {
        return { status: "unreadable", raw, error: message(e) };
      }
    },
    async save(state) {
      try {
        getKv().set(STATE_KEY, JSON.stringify(state));
        return { ok: true };
      } catch (e) {
        return { ok: false, error: message(e), quota: isQuota(e) };
      }
    },
    subscribe(onRemoteChange) {
      if (typeof window === "undefined") return () => {};
      const handler = (e: StorageEvent) => {
        if (e.key !== STATE_KEY || !e.newValue) return;
        try {
          onRemoteChange(JSON.parse(e.newValue));
        } catch {
          /* ignore malformed payloads; this tab keeps its own state */
        }
      };
      window.addEventListener("storage", handler);
      return () => window.removeEventListener("storage", handler);
    },
  };
}

export const browserAdapter = createBrowserAdapter(browserKV);
