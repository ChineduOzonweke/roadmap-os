"use client";

import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { useHydrated, useUserState } from "@/lib/store";
import { setResourceStatus } from "@/lib/actions";
import type { Resource, Tool } from "@/types/curriculum";
import type { ResourceStatus } from "@/types/state";
import { ExternalLink, InlineText, cx } from "./ui";

const STATUS_OPTIONS: { id: ResourceStatus | ""; label: string }[] = [
  { id: "", label: "Not marked" },
  { id: "todo", label: "To use" },
  { id: "using", label: "Using" },
  { id: "done", label: "Done" },
];

export function ResourceBrowser({ resources, tools, phases }: { resources: Resource[]; tools: Tool[]; phases: { id: string; title: string }[] }) {
  const params = useSearchParams();
  const s = useUserState();
  const ready = useHydrated();
  const [phase, setPhase] = useState(params.get("phase") ?? "all");
  const [label, setLabel] = useState("all");
  const [status, setStatus] = useState("all");
  const [linksOnly, setLinksOnly] = useState(false);
  const [q, setQ] = useState("");
  const [tab, setTab] = useState<"resources" | "tools">("resources");

  const labels = useMemo(() => Array.from(new Set(resources.map((r) => r.label))).sort(), [resources]);
  const list = useMemo(() => {
    const query = q.trim().toLowerCase();
    return resources.filter((r) => {
      if (phase !== "all" && (phase === "general" ? r.phaseId !== null : r.phaseId !== phase)) return false;
      if (label !== "all" && r.label !== label) return false;
      if (linksOnly && !r.url) return false;
      const st: string = s.resources[r.id] ?? "";
      if (status !== "all" && (status === "unmarked" ? st !== "" : st !== status)) return false;
      if (query && !`${r.id} ${r.name} ${r.note} ${r.group} ${r.url ?? ""}`.toLowerCase().includes(query)) return false;
      return true;
    });
  }, [resources, phase, label, linksOnly, status, q, s.resources]);

  const phaseTitle = new Map(phases.map((p) => [p.id, p.title]));

  return (
    <div>
      <div className="mb-4 flex gap-2" role="tablist" aria-label="Registry">
        {(["resources", "tools"] as const).map((t) => (
          <button key={t} role="tab" type="button" aria-selected={tab === t} onClick={() => setTab(t)} className={cx("rounded-md border px-3 py-1.5 text-sm", tab === t ? "border-accent bg-accent-soft text-accent" : "border-rule bg-surface")}>
            {t === "resources" ? `Resources (${resources.length})` : `Tools (${tools.length})`}
          </button>
        ))}
      </div>

      {tab === "resources" ? (
        <>
          <div className="mb-4 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
            <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Filter by name, note or URL" aria-label="Filter resources" className="rounded-md border border-rule bg-surface px-3 py-2 text-sm sm:col-span-2 lg:col-span-4" />
            <select aria-label="Phase" value={phase} onChange={(e) => setPhase(e.target.value)} className="rounded-md border border-rule bg-surface px-2 py-2 text-sm">
              <option value="all">All phases</option>
              <option value="general">General (not phase-specific)</option>
              {phases.map((p) => <option key={p.id} value={p.id}>{p.id} {p.title}</option>)}
            </select>
            <select aria-label="Type" value={label} onChange={(e) => setLabel(e.target.value)} className="rounded-md border border-rule bg-surface px-2 py-2 text-sm">
              <option value="all">All types</option>
              {labels.map((l) => <option key={l} value={l}>{l}</option>)}
            </select>
            <select aria-label="Status" value={status} onChange={(e) => setStatus(e.target.value)} className="rounded-md border border-rule bg-surface px-2 py-2 text-sm">
              <option value="all">Any status</option>
              <option value="unmarked">Not marked</option>
              <option value="todo">To use</option>
              <option value="using">Using</option>
              <option value="done">Done</option>
            </select>
            <label className="flex items-center gap-2 rounded-md border border-rule bg-surface px-3 py-2 text-sm">
              <input type="checkbox" className="h-4 w-4 accent-[var(--accent)]" checked={linksOnly} onChange={(e) => setLinksOnly(e.target.checked)} />
              Links only
            </label>
          </div>
          <p className="mb-2 text-xs text-muted">{list.length} shown. Entries without a link are the master&apos;s written guidance (for example practice instructions), kept as-is.</p>
          {list.length === 0 ? (
            <p className="rounded-md border border-dashed border-rule px-4 py-6 text-center text-sm">No resources match these filters. Clear a filter to see more.</p>
          ) : (
            <ul className="divide-y divide-rule rounded-lg border border-rule bg-surface">
              {list.map((r) => (
                <li key={r.id} className="flex flex-col gap-2 px-3 py-2.5 sm:flex-row sm:items-start sm:gap-4">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-muted">
                      <span className="font-mono">{r.id}</span>, {r.label}
                      {r.phaseId ? `, ${r.phaseId} ${phaseTitle.get(r.phaseId) ?? ""}` : ", general"}
                      {r.group ? `, ${r.group}` : ""}
                    </p>
                    <p className="mt-0.5">{r.url ? <ExternalLink href={r.url}>{r.name || r.url}</ExternalLink> : <InlineText text={r.name} />}</p>
                    {r.note && <p className="text-sm text-muted">{r.note}</p>}
                    {r.url && r.name && <p className="truncate text-xs text-faint">{r.url}</p>}
                  </div>
                  <select
                    aria-label={`Status of ${r.id}`}
                    disabled={!ready}
                    value={ready ? s.resources[r.id] ?? "" : ""}
                    onChange={(e) => setResourceStatus(r.id, (e.target.value || null) as ResourceStatus | null)}
                    className="shrink-0 self-start rounded-md border border-rule bg-surface px-2 py-1 text-sm"
                  >
                    {STATUS_OPTIONS.map((o) => <option key={o.id} value={o.id}>{o.label}</option>)}
                  </select>
                </li>
              ))}
            </ul>
          )}
        </>
      ) : (
        <ul className="divide-y divide-rule rounded-lg border border-rule bg-surface">
          {tools.map((t) => (
            <li key={t.id} className="px-3 py-2.5">
              <p className="text-xs text-muted"><span className="font-mono">{t.id}</span>, {t.activation}</p>
              <p className="font-medium">{t.url ? <ExternalLink href={t.url}>{t.name}</ExternalLink> : t.name}</p>
              <p className="text-sm text-muted">{t.route}{!t.url && t.reference ? `. ${t.reference}` : ""}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
