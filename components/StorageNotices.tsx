"use client";

import Link from "next/link";
import { useState } from "react";
import { useHydrated, useStorageStatus, useUserState } from "@/lib/store";
import { retrySave } from "@/lib/actions";
import { exportIsStale, hasProgress } from "@/lib/persistence/portable";
import { ago } from "./BackupPanel";

const NUDGE_AFTER_DAYS = 14;

/** App-wide notice when progress is not being saved, or stored data needed recovery. Silent otherwise. */
export function StorageBanner() {
  const st = useStorageStatus();
  const [dismissed, setDismissed] = useState<string | null>(null);
  const failed = st.save.state === "failed" && !st.readOnly;
  const notice = failed
    ? { key: "failed", tone: "danger" as const, text: `Changes are not being saved: ${st.save.error ?? "storage error"} Export a backup so nothing is lost.` }
    : st.load
      ? { key: st.load.kind, tone: st.load.kind === "repaired" || st.load.kind === "quarantined" ? ("warn" as const) : ("danger" as const), text: st.load.message }
      : null;
  if (!notice || dismissed === notice.key) return null;
  const canDismiss = notice.key === "repaired" || notice.key === "quarantined";
  return (
    <div role="alert" className={notice.tone === "danger" ? "border-b border-danger/30 bg-danger-soft" : "border-b border-warn/30 bg-warn-soft"}>
      <div className="mx-auto flex max-w-4xl flex-wrap items-center gap-x-3 gap-y-1 px-4 py-2.5 text-sm sm:px-6 lg:px-10">
        <p className="min-w-0 flex-1">{notice.text}</p>
        <div className="flex shrink-0 items-center gap-1">
          {failed && <button type="button" className="btn btn-quiet btn-sm" onClick={() => void retrySave()}>Try again</button>}
          <Link href="/settings#backup" className="btn btn-quiet btn-sm">Backup</Link>
          {canDismiss && <button type="button" className="btn btn-quiet btn-sm" onClick={() => setDismissed(notice.key)}>Dismiss</button>}
        </div>
      </div>
    </div>
  );
}

/** One calm line on Today when there is progress worth protecting and no recent exported backup. */
export function BackupNudge() {
  const s = useUserState();
  const ready = useHydrated();
  const st = useStorageStatus();
  if (!ready || !hasProgress(s)) return null;
  const last = st.lastExportAt;
  if (!exportIsStale(last, NUDGE_AFTER_DAYS)) return null;
  return (
    <p className="text-sm text-muted">
      Last exported backup: <span className="text-ink">{ago(last)}</span>.{" "}
      <Link href="/settings#backup" className="text-accent underline-offset-2 hover:underline">Export one</Link> so your progress survives a cleared browser.
    </p>
  );
}
