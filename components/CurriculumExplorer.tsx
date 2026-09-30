"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useHydrated, useUserState } from "@/lib/store";
import { phaseRollup, topicById, topicView, weekByCw, type Status } from "@/lib/progress";
import { Bar, StatusGlyph, StatusPill, cx } from "./ui";
import { IconChevron } from "./icons";
import { RefId } from "./Ref";

export type ExplorerPhase = {
  id: string;
  title: string;
  priority: string;
  target: string;
  description: string;
  weekRange: [number, number] | null;
  stages: string[];
  placement: string;
  topics: { id: string; label: string; depth: string; firstWeek: number | null; items: number; indent: boolean }[];
};
export type ExplorerStage = { id: string; name: string; range: [number, number] };

const STATUS_FILTERS: { id: "all" | Status | "done"; label: string }[] = [
  { id: "all", label: "All phases" },
  { id: "in_progress", label: "In progress" },
  { id: "available", label: "Ready to start" },
  { id: "done", label: "Done" },
  { id: "locked", label: "Later" },
];

/**
 * The roadmap as a map: stages in order, the phases that begin in each stage,
 * and topics inside a phase on demand. The phase you are in is marked and open.
 */
export function CurriculumExplorer({ phases, stages }: { phases: ExplorerPhase[]; stages: ExplorerStage[] }) {
  const s = useUserState();
  const ready = useHydrated();
  const [status, setStatus] = useState<string>("all");
  const [q, setQ] = useState("");
  const [open, setOpen] = useState<Record<string, boolean>>({});

  const currentPhase = ready ? (weekByCw(s.currentWeek)?.pu[0] ?? "").split(".")[0] : "";

  const rows = useMemo(() => {
    const query = q.trim().toLowerCase();
    return phases
      .map((p) => ({ p, r: ready ? phaseRollup(s, p.id) : null }))
      .filter(({ p, r }) => {
        if (status !== "all" && r) {
          if (status === "done" && !(r.status === "completed" || r.status === "mastered")) return false;
          if (status !== "done" && r.status !== status) return false;
        }
        if (query && !`${p.id} ${p.title} ${p.description} ${p.topics.map((t) => t.label).join(" ")}`.toLowerCase().includes(query)) return false;
        return true;
      });
  }, [phases, s, ready, status, q]);

  const groups = useMemo(() => {
    const byStage = stages.map((st) => ({
      st,
      rows: rows
        .filter(({ p }) => p.weekRange && p.weekRange[0] >= st.range[0] && p.weekRange[0] <= st.range[1])
        .sort((a, b) => a.p.weekRange![0] - b.p.weekRange![0]),
    }));
    const later = rows.filter(({ p }) => !p.weekRange);
    return { byStage: byStage.filter((g) => g.rows.length), later };
  }, [rows, stages]);

  const filtered = rows.length !== phases.length;
  const isOpen = (id: string) => open[id] ?? (id === currentPhase && !q && status === "all");

  const PhaseRow = ({ p, r }: { p: ExplorerPhase; r: ReturnType<typeof phaseRollup> | null }) => {
    const here = p.id === currentPhase;
    const o = isOpen(p.id);
    return (
      <li className={cx("card overflow-hidden", here && "border-accent/60")}>
        <button
          type="button"
          onClick={() => setOpen({ ...open, [p.id]: !o })}
          aria-expanded={o}
          aria-controls={`ph-${p.id}`}
          className="flex w-full items-start gap-3 px-4 py-4 text-left hover:bg-surface-2/60 active:bg-surface-2"
        >
          <span className="min-w-0 flex-1">
            {here && <span className="mb-1 block text-xs font-medium text-accent">You are here</span>}
            <span className="block font-semibold leading-snug">{p.title} <RefId id={p.id} /></span>
            {p.description && <span className="mt-1 line-clamp-2 text-sm text-muted">{p.description}</span>}
            {r && r.total > 0 && (
              <span className="mt-3 flex items-center gap-3">
                <Bar value={r.pct} className="flex-1" tone={r.status === "completed" || r.status === "mastered" ? "ok" : "accent"} label={`${p.title} progress`} />
                <span className="shrink-0 text-xs tabular-nums text-muted">{r.done} of {r.total}</span>
              </span>
            )}
          </span>
          <IconChevron className={cx("mt-1 shrink-0 text-faint transition-transform duration-150", o && "rotate-90")} width={18} height={18} />
        </button>
        {o && (
          <div id={`ph-${p.id}`} className="border-t border-rule">
            <ul>
              {p.topics.map((t) => {
                const it = topicById.get(t.id);
                const v = it && ready ? topicView(s, it) : null;
                return (
                  <li key={t.id} className="border-b border-rule last:border-b-0">
                    <Link href={`/topics/${t.id}`} className={cx("flex min-h-12 items-center gap-3 py-2.5 pr-4 hover:bg-surface-2/60 active:bg-surface-2", t.indent ? "pl-8" : "pl-4")}>
                      {v && <StatusGlyph status={v.status} />}
                      <span className="min-w-0 flex-1">
                        <span className="block leading-snug">{t.label} <RefId id={t.id} /></span>
                        <span className="block text-xs text-muted">{t.firstWeek ? `From week ${t.firstWeek}` : "When needed"}{t.items > 1 ? `, ${t.items} items` : ""}</span>
                      </span>
                      {v && v.done > 0 && <span className="shrink-0 text-xs tabular-nums text-muted">{v.done}/{v.total}</span>}
                    </Link>
                  </li>
                );
              })}
            </ul>
            <div className="flex items-center justify-between gap-3 border-t border-rule px-4 py-2.5">
              {r && <StatusPill status={r.status} />}
              <Link href={`/phases/${p.id}`} className="btn btn-quiet btn-sm -mr-2">Phase overview</Link>
            </div>
          </div>
        )}
      </li>
    );
  };

  return (
    <div>
      <div className="mb-6 space-y-3">
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Find a phase or topic"
          className="input"
          aria-label="Find a phase or topic"
        />
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 scroll-thin sm:mx-0 sm:flex-wrap sm:px-0" role="group" aria-label="Filter by status">
          {STATUS_FILTERS.map((x) => (
            <button key={x.id} type="button" aria-pressed={status === x.id} onClick={() => setStatus(x.id)} className="chip">
              {x.label}
            </button>
          ))}
        </div>
        {filtered && <p className="text-sm text-muted">{rows.length} of {phases.length} phases match.</p>}
      </div>

      {groups.byStage.map(({ st, rows: rs }) => (
        <section key={st.id} className="mb-8" aria-labelledby={`st-${st.id}`}>
          <div className="mb-3 flex items-baseline justify-between gap-3 border-b border-rule pb-2">
            <h2 id={`st-${st.id}`} className="h-section">{st.name} <RefId id={st.id} /></h2>
            <span className="shrink-0 text-sm tabular-nums text-muted">Weeks {st.range[0]}–{st.range[1]}</span>
          </div>
          <ol className="space-y-3 lg:grid lg:grid-cols-2 lg:items-start lg:gap-3 lg:space-y-0">{rs.map(({ p, r }) => <PhaseRow key={p.id} p={p} r={r} />)}</ol>
        </section>
      ))}

      {groups.later.length > 0 && (
        <section className="mb-8" aria-labelledby="st-later">
          <div className="mb-3 border-b border-rule pb-2">
            <h2 id="st-later" className="h-section">When you need them</h2>
          </div>
          <ol className="space-y-3 lg:grid lg:grid-cols-2 lg:items-start lg:gap-3 lg:space-y-0">{groups.later.map(({ p, r }) => <PhaseRow key={p.id} p={p} r={r} />)}</ol>
        </section>
      )}

      {rows.length === 0 && <p className="card px-4 py-6 text-center text-muted">No phase matches. Try another word or show all phases.</p>}
    </div>
  );
}
