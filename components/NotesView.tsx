"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useHydrated, useUserState } from "@/lib/store";
import { setNote } from "@/lib/actions";
import { gateById, idx, phaseById, projectById, topicById } from "@/lib/progress";
import { hrefFor } from "@/lib/ids";

function describe(id: string): { kind: string; title: string; href: string } {
  if (id.startsWith("week:")) return { kind: "Week", title: `Week ${id.slice(5)}`, href: `/weeks/${id.slice(5)}` };
  const href = hrefFor(id) ?? "/notes";
  if (phaseById.has(id)) return { kind: "Phase", title: `${id} ${phaseById.get(id)!.t}`, href };
  if (topicById.has(id)) return { kind: "Topic", title: `${id} ${topicById.get(id)!.t}`, href };
  if (idx.ct[id] !== undefined) return { kind: "Concept", title: `${id} ${idx.ct[id]}`, href };
  if (gateById.has(id)) return { kind: "Checkpoint", title: `${id} ${gateById.get(id)!.t}`, href };
  if (projectById.has(id)) return { kind: "Project", title: `${id} ${projectById.get(id)!.t}`, href };
  return { kind: "Note", title: id, href };
}

export function NotesView() {
  const s = useUserState();
  const ready = useHydrated();
  const [q, setQ] = useState("");
  const [kind, setKind] = useState("All");
  const notes = useMemo(
    () => Object.entries(s.notes).map(([id, n]) => ({ id, ...n, ...describe(id) })).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)),
    [s.notes],
  );
  if (!ready) return <div className="h-40 animate-pulse rounded-lg bg-surface-2" aria-label="Loading notes" />;
  const kinds = ["All", ...Array.from(new Set(notes.map((n) => n.kind)))];
  const query = q.trim().toLowerCase();
  const list = notes.filter((n) => (kind === "All" || n.kind === kind) && (!query || `${n.title} ${n.text}`.toLowerCase().includes(query)));

  const download = () => {
    const md = notes.map((n) => `## ${n.title}\n\n_${n.kind}, updated ${new Date(n.updatedAt).toLocaleString()}_\n\n${n.text}\n`).join("\n");
    const url = URL.createObjectURL(new Blob([`# Roadmap OS notes\n\n${md}`], { type: "text/markdown" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `roadmap-os-notes-${new Date().toISOString().slice(0, 10)}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (notes.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-rule px-4 py-8 text-center">
        <p className="font-medium">No notes yet</p>
        <p className="mt-1 text-sm text-muted">Every phase, topic, concept, week, checkpoint and project page has a notes box at the bottom. Start with <Link className="text-accent underline" href="/today">today&apos;s week</Link>.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Filter notes" aria-label="Filter notes" className="min-w-0 flex-1 input" />
        <select aria-label="Note type" value={kind} onChange={(e) => setKind(e.target.value)} className="w-auto input">
          {kinds.map((k) => <option key={k}>{k}</option>)}
        </select>
        <button type="button" onClick={download} className="btn btn-secondary btn-sm">Download as Markdown</button>
      </div>
      <p className="mb-2 text-xs text-muted">{list.length} of {notes.length} notes</p>
      <ul className="space-y-3">
        {list.map((n) => (
          <li key={n.id} className="card p-3">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <Link href={n.href} className="font-medium hover:text-accent">{n.title}</Link>
              <span className="text-xs text-muted">{n.kind}, {new Date(n.updatedAt).toLocaleString()}</span>
            </div>
            <p className="mt-2 whitespace-pre-wrap text-sm">{n.text}</p>
            <button type="button" className="mt-2 text-xs text-danger hover:underline" onClick={() => { if (window.confirm("Delete this note?")) setNote(n.id, ""); }}>Delete note</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
