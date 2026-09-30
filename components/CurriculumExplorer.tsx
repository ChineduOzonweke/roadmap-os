"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useHydrated, useUserState } from "@/lib/store";
import { phaseRollup, topicById, topicView, type Status } from "@/lib/progress";
import { Bar, StatusPill, cx } from "./ui";
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

const STAGES = ["S0", "S1", "S2", "S3", "S4", "S5", "S6", "S7", "S8"];
const STATUS_FILTERS: { id: "all" | Status | "done"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "available", label: "Available" },
  { id: "in_progress", label: "In progress" },
  { id: "done", label: "Done" },
  { id: "locked", label: "Locked" },
];

export function CurriculumExplorer({ phases }: { phases: ExplorerPhase[] }) {
  const s = useUserState();
  const ready = useHydrated();
  const [stage, setStage] = useState<string>("all");
  const [status, setStatus] = useState<string>("all");
  const [q, setQ] = useState("");
  const [open, setOpen] = useState<Record<string, boolean>>({});

  const rows = useMemo(() => {
    const query = q.trim().toLowerCase();
    return phases
      .map((p) => ({ p, r: ready ? phaseRollup(s, p.id) : null }))
      .filter(({ p, r }) => {
        if (stage !== "all" && !p.stages.some((x) => x.startsWith(stage))) return false;
        if (status !== "all" && r) {
          if (status === "done" && !(r.status === "completed" || r.status === "mastered")) return false;
          if (status !== "done" && r.status !== status) return false;
        }
        if (query && !`${p.id} ${p.title} ${p.description} ${p.topics.map((t) => t.label).join(" ")}`.toLowerCase().includes(query)) return false;
        return true;
      });
  }, [phases, s, ready, stage, status, q]);

  const allOpen = rows.length > 0 && rows.every(({ p }) => open[p.id]);

  return (
    <div>
      <div className="mb-4 space-y-3">
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Filter phases and topics"
          className="w-full rounded-md border border-rule bg-surface px-3 py-2"
          aria-label="Filter phases and topics"
        />
        <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label="Stage filter">
          <span className="mr-1 text-xs text-muted">Stage</span>
          {["all", ...STAGES].map((x) => (
            <button key={x} type="button" aria-pressed={stage === x} onClick={() => setStage(x)} className={cx("rounded-md border px-2 py-1 text-xs", stage === x ? "border-accent bg-accent-soft text-accent" : "border-rule bg-surface")}>
              {x === "all" ? "All" : x.slice(1)}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label="Status filter">
          <span className="mr-1 text-xs text-muted">Status</span>
          {STATUS_FILTERS.map((x) => (
            <button key={x.id} type="button" aria-pressed={status === x.id} onClick={() => setStatus(x.id)} className={cx("rounded-md border px-2 py-1 text-xs", status === x.id ? "border-accent bg-accent-soft text-accent" : "border-rule bg-surface")}>
              {x.label}
            </button>
          ))}
          <button type="button" className="ml-auto text-xs text-accent hover:underline" onClick={() => setOpen(allOpen ? {} : Object.fromEntries(rows.map(({ p }) => [p.id, true])))}>
            {allOpen ? "Collapse all" : "Expand all"}
          </button>
        </div>
        <p className="text-xs text-muted">{rows.length} of {phases.length} phases shown</p>
      </div>

      <ol className="divide-y divide-rule rounded-lg border border-rule bg-surface">
        {rows.map(({ p, r }) => {
          const isOpen = !!open[p.id];
          return (
            <li key={p.id}>
              <div className="flex items-start gap-2 px-3 py-3">
                <button
                  type="button"
                  onClick={() => setOpen({ ...open, [p.id]: !isOpen })}
                  aria-expanded={isOpen}
                  aria-controls={`ph-${p.id}`}
                  aria-label={`${isOpen ? "Collapse" : "Expand"} ${p.id}`}
                  className="mt-0.5 rounded p-0.5 text-muted hover:bg-surface-2"
                >
                  <IconChevron className={cx("transition-transform", isOpen && "rotate-90")} width={18} height={18} />
                </button>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-baseline gap-x-2">
                    <Link href={`/phases/${p.id}`} className="font-medium hover:text-accent"><RefId id={p.id} /> {p.title}</Link>
                    <span className="text-xs text-muted">{p.priority}, target {p.target.replace(/[🔴🟠🟡🟢⚪]/gu, "").trim()}</span>
                  </div>
                  <p className="mt-0.5 text-xs text-muted">{p.weekRange ? `Weeks ${p.weekRange[0]}–${p.weekRange[1]}` : p.placement}</p>
                  {r && r.total > 0 && (
                    <div className="mt-1.5 flex items-center gap-2">
                      <Bar value={r.pct} className="max-w-48" tone={r.status === "completed" || r.status === "mastered" ? "ok" : "accent"} label={`${p.id} progress`} />
                      <span className="text-xs tabular-nums text-muted">{r.done}/{r.total}</span>
                    </div>
                  )}
                </div>
                {r && <StatusPill status={r.status} className="shrink-0" />}
              </div>
              {isOpen && (
                <div id={`ph-${p.id}`} className="border-t border-rule bg-bg/40 px-3 pb-3 pt-2 sm:pl-10">
                  {p.description && <p className="mb-2 text-sm text-muted">{p.description}</p>}
                  <ul className="space-y-1">
                    {p.topics.map((t) => {
                      const it = topicById.get(t.id);
                      const v = it && ready ? topicView(s, it) : null;
                      return (
                        <li key={t.id} className={cx("flex flex-wrap items-center gap-x-3 gap-y-1 rounded px-1 py-1 hover:bg-surface-2", t.indent && "pl-5")}>
                          <Link href={`/topics/${t.id}`} className="min-w-0 flex-1 hover:text-accent">
                            <RefId id={t.id} /> {t.label}
                          </Link>
                          <span className="text-xs text-muted">{t.depth}{t.firstWeek ? `, wk ${t.firstWeek}` : ""}{t.items > 1 ? `, ${t.items} items` : ""}</span>
                          {v && <StatusPill status={v.status} />}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
