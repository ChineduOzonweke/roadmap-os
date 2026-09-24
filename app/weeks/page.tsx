import type { Metadata } from "next";
import Link from "next/link";
import { stages, weeks } from "@/lib/data";
import { PageHeader } from "@/components/ui";
import { WeekStatusPill } from "@/components/progress";
import { CurrentWeekLink } from "@/components/CurrentWeekLink";

export const metadata: Metadata = { title: "Weeks" };

const TYPE_LABEL: Record<string, string> = { study: "Study", project: "Project build", consolidation: "Consolidation", open: "Open work" };

export default function Page() {
  const top = stages.filter((s) => !s.parent);
  return (
    <>
      <PageHeader
        title="206 weeks"
        lead="The execution layer. Each week is one planning unit at normal-semester capacity. Weeks are undated on purpose: calendar dates come later, from your real university calendar."
      >
        <CurrentWeekLink />
      </PageHeader>
      {top.map((st) => {
        const subs = stages.filter((x) => x.parent === st.id);
        const groups = subs.length ? subs : [st];
        return (
          <section key={st.id} className="mb-10" aria-labelledby={`st-${st.id}`}>
            <h2 id={`st-${st.id}`} className="text-lg font-semibold"><span className="font-mono text-base text-muted">{st.id}</span> {st.name}</h2>
            <p className="mb-3 text-sm text-muted">Weeks {st.range[0]}–{st.range[1]}. Exit: {st.exit}.</p>
            {groups.map((g) => (
              <div key={g.id} className="mb-5">
                {subs.length > 0 && <h3 className="mb-2 text-sm font-medium"><span className="font-mono text-muted">{g.id}</span> {g.name} <span className="font-normal text-muted">(weeks {g.range[0]}–{g.range[1]}, exit {g.exit})</span></h3>}
                <ol className="divide-y divide-rule rounded-md border border-rule bg-surface">
                  {weeks.filter((w) => w.cw >= g.range[0] && w.cw <= g.range[1]).map((w) => (
                    <li key={w.cw}>
                      <Link href={`/weeks/${w.cw}`} className="flex flex-col gap-1 px-3 py-2 hover:bg-surface-2 sm:flex-row sm:items-center sm:gap-4">
                        <span className="w-20 shrink-0 font-medium tabular-nums">Week {w.cw}</span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate">{w.primary.map((p) => p.label.split(" · ")[0]).join(" + ")}</span>
                          <span className="block truncate text-xs text-muted">{TYPE_LABEL[w.type]}{w.gate ? `, gate ${w.gate}` : ""}{w.conceptCount ? `, ${w.conceptCount} items` : ""}</span>
                        </span>
                        <span className="shrink-0"><WeekStatusPill cw={w.cw} /></span>
                      </Link>
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </section>
        );
      })}
    </>
  );
}
