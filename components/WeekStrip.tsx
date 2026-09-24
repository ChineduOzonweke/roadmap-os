"use client";

import Link from "next/link";
import { useHydrated, useUserState } from "@/lib/store";
import { idx, weekView, type Status } from "@/lib/progress";
import { cx } from "./ui";

const CELL: Record<Status, string> = {
  completed: "bg-ok",
  mastered: "bg-ok",
  in_progress: "bg-warn",
  available: "bg-accent-soft border border-accent/40",
  locked: "bg-surface-2",
};

/**
 * The execution map: one row per stage, one cell per curriculum week.
 * Gate weeks carry a notch; the current week is outlined.
 */
export function WeekStrip({ compact = false }: { compact?: boolean }) {
  const s = useUserState();
  const ready = useHydrated();
  const top = idx.stages.filter((st) => !st.p);
  return (
    <div className="space-y-1.5" aria-label="206-week execution map">
      {top.map((st) => {
        const weeks = idx.weeks.filter((w) => w.cw >= st.r[0] && w.cw <= st.r[1]);
        const done = ready ? weeks.filter((w) => weekView(s, w).complete).length : 0;
        return (
          <div key={st.id} className="grid grid-cols-[3.2rem_minmax(0,1fr)] items-start gap-2 sm:grid-cols-[13rem_minmax(0,1fr)]">
            <div className="pt-px text-xs leading-tight">
              <span className="font-mono text-muted">{st.id}</span>
              {!compact && <span className="ml-1.5 hidden text-ink sm:inline">{st.n}</span>}
              <span className="ml-1.5 hidden tabular-nums text-faint sm:inline">{done}/{weeks.length}</span>
            </div>
            <ol className="flex flex-wrap gap-[3px]">
              {weeks.map((w) => {
                const v = ready ? weekView(s, w) : null;
                const current = ready && s.currentWeek === w.cw;
                const status: Status = v ? v.status : "locked";
                return (
                  <li key={w.cw} className="relative">
                    <Link
                      href={`/weeks/${w.cw}`}
                      aria-label={`Week ${w.cw}${w.g ? `, gate ${w.g}` : ""}${v ? `, ${status.replace("_", " ")}` : ""}${current ? ", current week" : ""}`}
                      title={`Week ${w.cw}: ${w.t}`}
                      className={cx(
                        "block h-3.5 w-3.5 rounded-[3px] sm:h-3 sm:w-3",
                        CELL[status],
                        current && "ring-2 ring-ink ring-offset-1 ring-offset-bg",
                      )}
                    />
                    {w.g && <span aria-hidden className="pointer-events-none absolute -bottom-1 left-1/2 h-1 w-[2px] -translate-x-1/2 bg-ink/70" />}
                  </li>
                );
              })}
            </ol>
          </div>
        );
      })}
      {!compact && (
        <div className="flex flex-wrap gap-x-4 gap-y-1 pt-2 text-xs text-muted">
          <Legend className="bg-ok" label="Complete" />
          <Legend className="bg-warn" label="In progress" />
          <Legend className="border border-accent/40 bg-accent-soft" label="Cleared" />
          <Legend className="bg-surface-2" label="Behind a gate" />
          <span className="inline-flex items-center gap-1.5"><span className="relative h-3 w-3 rounded-[3px] bg-surface-2"><span className="absolute -bottom-1 left-1/2 h-1 w-[2px] -translate-x-1/2 bg-ink/70" /></span>Gate week</span>
        </div>
      )}
    </div>
  );
}

function Legend({ className, label }: { className: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={cx("h-3 w-3 rounded-[3px]", className)} />
      {label}
    </span>
  );
}
