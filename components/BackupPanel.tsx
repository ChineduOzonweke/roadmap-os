"use client";

import { useRef, useState } from "react";
import { useHydrated, useStorageStatus, useUserState } from "@/lib/store";
import {
  applyImport, exportBackup, previewImport, quarantineFile, resetState, restoreSnapshot, snapshotFile, snapshotNow,
} from "@/lib/actions";
import { describeSummary, summarize, type ImportPreview } from "@/lib/persistence/portable";
import type { SnapshotReason } from "@/lib/persistence";
import { cx } from "./ui";

type Curriculum = { md5: string; generated: string };
type Msg = { ok: boolean; text: string } | null;

export function downloadText(filename: string, text: string) {
  const url = URL.createObjectURL(new Blob([text], { type: "application/json" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function ago(iso: string | null | undefined, now = Date.now()): string {
  if (!iso) return "never";
  const days = Math.floor((now - new Date(iso).getTime()) / 86400000);
  if (days <= 0) return "today";
  if (days === 1) return "yesterday";
  return `${days} days ago`;
}

const when = (iso: string) => new Date(iso).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });

const REASON: Record<SnapshotReason, string> = {
  "before-import": "Before an import",
  "before-reset": "Before a reset",
  "before-restore": "Before a restore",
  "before-migration": "Before a data upgrade",
  weekly: "Weekly",
  manual: "Saved by you",
};

export function BackupPanel({ curriculum }: { curriculum: Curriculum }) {
  const s = useUserState();
  const ready = useHydrated();
  const st = useStorageStatus();
  const file = useRef<HTMLInputElement>(null);
  const [msg, setMsg] = useState<Msg>(null);
  const [preview, setPreview] = useState<Extract<ImportPreview, { ok: true }> | null>(null);
  const [force, setForce] = useState<null | { label: string; run: () => void }>(null);

  const onExport = () => {
    const { filename, json } = exportBackup(curriculum);
    downloadText(filename, json);
    setMsg({ ok: true, text: `Saved ${filename}. Keep it outside this browser (cloud drive, email to yourself); import it on another device to carry progress over.` });
  };

  const onFile = async (f: File) => {
    setForce(null);
    const p = previewImport(await f.text(), curriculum.md5);
    if (!p.ok) {
      setPreview(null);
      setMsg({ ok: false, text: p.error });
      return;
    }
    setMsg(null);
    setPreview(p);
  };

  /** Run a replacing action; if the automatic backup failed, offer an explicit second step instead of failing silently. */
  const guarded = (label: string, run: (force: boolean) => { ok: true } | { ok: false; error: string; needsForce?: boolean }, done: string) => {
    const r = run(false);
    if (r.ok) {
      setForce(null);
      setPreview(null);
      setMsg({ ok: true, text: done });
    } else if (r.needsForce) {
      setMsg({ ok: false, text: r.error });
      setForce({ label, run: () => { run(true); setForce(null); setPreview(null); setMsg({ ok: true, text: done }); } });
    } else {
      setMsg({ ok: false, text: r.error });
    }
  };

  const current = summarize(s);
  const btn = "btn btn-secondary btn-sm";
  const saveLine =
    st.readOnly ? "Saving is off in this tab (see the notice above)."
    : st.save.state === "failed" ? `Last save failed: ${st.save.error}`
    : st.save.at ? `Saved on this device at ${new Date(st.save.at).toLocaleTimeString(undefined, { timeStyle: "short" })}.`
    : "Saved on this device.";

  return (
    <div className="space-y-5">
      <div>
        <p className={cx("text-sm", st.save.state === "failed" && "text-danger")}>{ready ? saveLine : "Loading."}</p>
        <p className="mt-1 text-sm text-muted">
          Last exported from this device: <span className="font-medium text-ink">{ready ? ago(st.lastExportAt) : "…"}</span>
          {st.lastExportAt && <span className="text-faint"> ({when(st.lastExportAt)})</span>}.
          {" "}Progress lives in this browser only; clearing site data deletes it. An exported file is the backup that survives.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <button type="button" onClick={onExport} disabled={!ready} className="btn btn-primary btn-sm">Export backup</button>
          <button type="button" onClick={() => file.current?.click()} disabled={!ready || st.readOnly} className={btn}>Import backup…</button>
          <input ref={file} type="file" accept="application/json,.json" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) void onFile(f); e.target.value = ""; }} />
        </div>
      </div>

      {preview && (
        <div className="card space-y-3 p-4" role="region" aria-label="Import preview">
          <div>
            <p className="font-medium">Replace this browser&apos;s progress with the backup?</p>
            <p className="mt-1 text-sm text-muted">
              {preview.format === "legacy" ? "Older export file" : `Backup made ${preview.exportedAt ? when(preview.exportedAt) : "at an unknown time"}`}.
            </p>
          </div>
          <dl className="grid gap-2 text-sm sm:grid-cols-2">
            <div className="rounded-lg bg-surface-2 p-3"><dt className="text-xs text-muted">In the backup</dt><dd className="mt-0.5">{describeSummary(preview.summary)}</dd></div>
            <div className="rounded-lg bg-surface-2 p-3"><dt className="text-xs text-muted">In this browser now</dt><dd className="mt-0.5">{describeSummary(current)}</dd></div>
          </dl>
          {preview.issues.some((i) => i.dropped) && (
            <p className="text-sm text-warn">{preview.issues.filter((i) => i.dropped).length} damaged entries in the file will be skipped; everything else imports.</p>
          )}
          {preview.curriculumMismatch && (
            <p className="text-sm text-muted">The backup was made against a different curriculum build. Progress for items that still exist carries over; nothing is deleted.</p>
          )}
          <p className="text-sm text-muted">Current progress is saved as an automatic backup first, so you can undo this from the list below.</p>
          <div className="flex flex-wrap gap-2">
            <button type="button" className="btn btn-primary btn-sm" onClick={() => guarded("Import without automatic backup", (f) => applyImport(preview, f), "Imported. Your previous progress is in the automatic backups below.")}>Replace progress</button>
            <button type="button" className={btn} onClick={() => setPreview(null)}>Cancel</button>
          </div>
        </div>
      )}

      {msg && <p role="status" className={cx("rounded-md px-3 py-2 text-sm", msg.ok ? "bg-ok-soft text-ok" : "bg-danger-soft text-danger")}>{msg.text}</p>}
      {force && (
        <div className="flex flex-wrap gap-2">
          <button type="button" className={btn} onClick={onExport}>Export backup first</button>
          <button type="button" className="btn btn-danger btn-sm" onClick={force.run}>{force.label}</button>
        </div>
      )}

      {st.quarantined.length > 0 && (
        <div className="rounded-xl border border-warn/30 bg-warn-soft px-4 py-3 text-sm">
          <p className="font-medium">Recovered data</p>
          <p className="mt-1 text-muted">Stored progress that could not be read in full was kept here, untouched. Download it to recover it by hand or to send for help.</p>
          <ul className="mt-2 space-y-1">
            {st.quarantined.map((q, i) => (
              <li key={q.at + i} className="flex flex-wrap items-center gap-2">
                <span>{when(q.at)}</span>
                <button type="button" className="btn btn-quiet btn-sm" onClick={() => { const f = quarantineFile(i); if (f) downloadText(f.filename, f.text); }}>Download</button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div>
        <h3 className="t-eyebrow">Automatic backups on this device</h3>
        <p className="mt-1 text-sm text-muted">Taken weekly and before every import, restore or reset. The newest five are kept, in this browser only.</p>
        {ready && st.snapshots.length === 0 && <p className="mt-2 text-sm text-faint">None yet.</p>}
        <ul className="mt-2 divide-y divide-rule">
          {st.snapshots.map((m) => (
            <li key={m.id} className="flex flex-col gap-2 py-2.5 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0 text-sm">
                <p><span className="font-medium">{when(m.at)}</span> <span className="text-muted">· {REASON[m.reason] ?? m.reason}</span></p>
                <p className="truncate text-xs text-muted">{describeSummary(m.summary)}</p>
              </div>
              <div className="flex shrink-0 gap-1">
                <button type="button" className="btn btn-quiet btn-sm" disabled={st.readOnly} onClick={() => {
                  if (!window.confirm(`Restore the backup from ${when(m.at)}? Current progress is backed up first.`)) return;
                  guarded("Restore without automatic backup", (f) => restoreSnapshot(m.id, f), `Restored the backup from ${when(m.at)}.`);
                }}>Restore</button>
                <button type="button" className="btn btn-quiet btn-sm" onClick={() => { const f = snapshotFile(m.id, curriculum); if (f) downloadText(f.filename, f.json); }}>Download</button>
              </div>
            </li>
          ))}
        </ul>
        <button type="button" className={cx(btn, "mt-2")} disabled={!ready || st.readOnly} onClick={() => { const r = snapshotNow(); setMsg(r.ok ? { ok: true, text: "Automatic backup saved on this device." } : { ok: false, text: r.error }); }}>
          Back up now (this device)
        </button>
      </div>

      <div>
        <h3 className="t-eyebrow">Reset</h3>
        <p className="mt-1 text-sm text-muted">Clears every tick, mastery stage, gate record, note and journal entry in this browser. The curriculum is untouched, and current progress is saved as an automatic backup first.</p>
        <button type="button" disabled={!ready || st.readOnly} className="btn btn-danger btn-sm mt-2" onClick={() => {
          if (!window.confirm("Clear all progress in this browser? It is saved as an automatic backup first.")) return;
          guarded("Reset without automatic backup", (f) => resetState(f), "Progress cleared. The previous progress is in the automatic backups above.");
        }}>Reset all progress</button>
      </div>
    </div>
  );
}
