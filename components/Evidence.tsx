"use client";

import { useState } from "react";
import { useHydrated, useUserState } from "@/lib/store";
import { deleteEvidence, saveEvidence } from "@/lib/actions";
import { EVIDENCE_KINDS, evidenceFor, isUrl, kindLabel } from "@/lib/evidence";
import type { EvidenceItem, EvidenceKind } from "@/types/state";
import { ExternalLink, cx } from "./ui";

type SubjectOption = { id: string; label: string };
type Draft = { id?: string; createdAt?: string; kind: EvidenceKind; subject: string; title: string; url: string; detail: string };

function EvidenceForm({ initial, subjects, onDone }: { initial: Draft; subjects?: SubjectOption[]; onDone: () => void }) {
  const [d, setD] = useState<Draft>(initial);
  const [error, setError] = useState<string | null>(null);
  const hint = EVIDENCE_KINDS.find((k) => k.id === d.kind)?.hint;
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!d.title.trim() && !d.url.trim()) return setError("Add a short title or a link.");
    if (d.url.trim() && !isUrl(d.url)) return setError("Links need to start with http:// or https://");
    saveEvidence({ ...d, title: d.title.trim(), url: d.url.trim(), detail: d.detail.trim() });
    onDone();
  };
  return (
    <form onSubmit={submit} className="space-y-2 rounded-lg border border-rule bg-surface-2/40 p-3">
      <div className="grid gap-2 sm:grid-cols-2">
        <label className="text-sm">
          <span className="mb-1 block text-muted">Kind</span>
          <select className="input text-sm" value={d.kind} onChange={(e) => setD({ ...d, kind: e.target.value as EvidenceKind })}>
            {EVIDENCE_KINDS.map((k) => <option key={k.id} value={k.id}>{k.label}</option>)}
          </select>
        </label>
        {subjects && subjects.length > 1 && (
          <label className="text-sm">
            <span className="mb-1 block text-muted">Proves</span>
            <select className="input text-sm" value={d.subject} onChange={(e) => setD({ ...d, subject: e.target.value })}>
              {subjects.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
            </select>
          </label>
        )}
      </div>
      <label className="block text-sm">
        <span className="mb-1 block text-muted">Title</span>
        <input className="input text-sm" value={d.title} onChange={(e) => setD({ ...d, title: e.target.value })} placeholder={hint || "What this shows"} />
      </label>
      <label className="block text-sm">
        <span className="mb-1 block text-muted">Link (optional)</span>
        <input className="input text-sm" type="url" inputMode="url" value={d.url} onChange={(e) => setD({ ...d, url: e.target.value })} placeholder="https://github.com/..." />
      </label>
      <label className="block text-sm">
        <span className="mb-1 block text-muted">Details (optional)</span>
        <textarea className="input text-sm" rows={2} value={d.detail} onChange={(e) => setD({ ...d, detail: e.target.value })} placeholder="Numbers, what was checked, what it demonstrates" />
      </label>
      {error && <p className="text-sm text-danger">{error}</p>}
      <div className="flex gap-2">
        <button type="submit" className="btn btn-primary btn-sm">{d.id ? "Save" : "Add evidence"}</button>
        <button type="button" className="btn btn-quiet btn-sm" onClick={onDone}>Cancel</button>
      </div>
    </form>
  );
}

export function EvidenceRow({ e, subjectName, onEdit }: { e: EvidenceItem; subjectName?: React.ReactNode; onEdit?: () => void }) {
  return (
    <li className="py-2.5 text-sm">
      <div className="flex flex-wrap items-baseline gap-x-2">
        <span className="rounded bg-surface-2 px-1.5 py-0.5 text-xs text-muted">{kindLabel(e.kind)}</span>
        <span className="min-w-0 flex-1 font-medium">
          {e.url && isUrl(e.url) ? <ExternalLink href={e.url}>{e.title || e.url}</ExternalLink> : e.title}
        </span>
        <span className="text-xs tabular-nums text-faint">{e.createdAt.slice(0, 10)}</span>
      </div>
      {subjectName && <p className="mt-0.5 text-xs text-muted">{subjectName}</p>}
      {e.detail && <p className="mt-1 whitespace-pre-line text-muted">{e.detail}</p>}
      {onEdit && (
        <div className="mt-1 flex gap-1">
          <button type="button" className="btn btn-quiet btn-sm" onClick={onEdit}>Edit</button>
          <button type="button" className="btn btn-quiet btn-sm text-muted" onClick={() => { if (window.confirm("Delete this evidence item? This cannot be undone (an exported backup keeps a copy).")) deleteEvidence(e.id); }}>Delete</button>
        </div>
      )}
    </li>
  );
}

/**
 * Evidence attached to one or more subjects, with an add form. `subjects` lists
 * what an item can prove; the first one is the default.
 */
export function EvidenceList({ subjects, title = "Evidence", hint, compact = false }: {
  subjects: SubjectOption[];
  title?: string;
  hint?: string;
  compact?: boolean;
}) {
  const s = useUserState();
  const ready = useHydrated();
  const [editing, setEditing] = useState<Draft | null>(null);
  if (!ready) return null;
  const ids = subjects.map((x) => x.id);
  const items = evidenceFor(s, ids);
  const nameOf = (id: string) => subjects.find((x) => x.id === id)?.label ?? id;
  const blank: Draft = { kind: "repo", subject: ids[0], title: "", url: "", detail: "" };
  return (
    <div className={cx(!compact && "space-y-1")}>
      <div className="flex items-baseline justify-between gap-3">
        <p className="text-sm font-medium">{title}{items.length > 0 && <span className="ml-1.5 text-xs tabular-nums text-muted">{items.length}</span>}</p>
        {!editing && <button type="button" className="btn btn-quiet btn-sm" onClick={() => setEditing(blank)}>Add evidence</button>}
      </div>
      {hint && !items.length && !editing && <p className="text-xs text-muted">{hint}</p>}
      {editing && <EvidenceForm key={editing.id ?? "new"} initial={editing} subjects={subjects} onDone={() => setEditing(null)} />}
      {items.length > 0 && (
        <ul className="divide-y divide-rule">
          {items.map((e) => (
            <EvidenceRow
              key={e.id}
              e={e}
              subjectName={subjects.length > 1 ? nameOf(e.subject) : undefined}
              onEdit={() => setEditing({ id: e.id, createdAt: e.createdAt, kind: e.kind, subject: e.subject, title: e.title, url: e.url, detail: e.detail })}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
