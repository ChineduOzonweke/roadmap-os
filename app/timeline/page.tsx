import type { Metadata } from "next";
import Link from "next/link";
import { checkpoints, meta, stages } from "@/lib/data";
import { PageHeader, Section } from "@/components/ui";
import { WeekStrip } from "@/components/WeekStrip";
import { GateBadge } from "@/components/progress";

export const metadata: Metadata = { title: "Timeline" };

export default function Page() {
  const top = stages.filter((s) => !s.parent);
  const gates = checkpoints.filter((c) => c.gateWeek).sort((a, b) => a.gateWeek! - b.gateWeek!);
  return (
    <>
      <PageHeader
        title="Timeline"
        lead="Nine stages across 206 undated weeks. The university calendar is tracked separately; calendar dates will be attached later from a real Week 1 start date, not invented here."
      />
      <Section title="Execution map"><WeekStrip /></Section>

      <Section title="Stages">
        <ol className="list-card">
          {top.map((s) => (
            <li key={s.id} className="px-3 py-3">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <p className="font-medium"><span className="font-mono text-sm text-muted">{s.id}</span> {s.name}</p>
                <Link href={`/weeks/${s.range[0]}`} className="text-sm text-accent hover:underline">Weeks {s.range[0]}–{s.range[1]}</Link>
              </div>
              <p className="mt-1 text-sm text-muted">{s.basis}</p>
              <p className="mt-1 text-sm">Entry: {s.entry}. Exit: {s.exit}.</p>
              {stages.filter((x) => x.parent === s.id).map((sub) => (
                <p key={sub.id} className="mt-1 pl-3 text-sm"><span className="font-mono text-xs text-muted">{sub.id}</span> {sub.name}, weeks {sub.range[0]}–{sub.range[1]}, exit {sub.exit}</p>
              ))}
            </li>
          ))}
        </ol>
      </Section>

      <Section title="Gate sequence">
        <ol className="space-y-1.5">
          {gates.map((g) => (
            <li key={g.id} className="flex flex-wrap items-center gap-3 text-sm">
              <span className="w-20 tabular-nums text-muted">Week {g.gateWeek}</span>
              <Link href={`/checkpoints/${g.id}`} className="min-w-0 flex-1 hover:text-accent"><span className="font-mono text-xs text-muted">{g.id}</span> {g.title}</Link>
              <GateBadge gateId={g.id} />
            </li>
          ))}
          <li className="flex flex-wrap items-center gap-3 text-sm">
            <span className="w-20 text-muted">Calendar</span>
            <Link href="/checkpoints/C7" className="min-w-0 flex-1 hover:text-accent"><span className="font-mono text-xs text-muted">C7</span> Top-tier candidate</Link>
            <GateBadge gateId="C7" />
          </li>
        </ol>
      </Section>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <Section title="Dependency spine (master)">
          <ol className="list-decimal space-y-0.5 pl-5 text-sm">{meta.dependencySpine.map((x) => <li key={x}>{x}</li>)}</ol>
        </Section>
        <Section title="Enforced order (decision 5)">
          <ol className="list-decimal space-y-0.5 pl-5 text-sm">{meta.decision5.map((x) => <li key={x}>{x}</li>)}</ol>
          <p className="mt-2 text-sm text-muted">See <Link className="text-accent underline" href="/graph">dependencies</Link> for the full phase graph.</p>
        </Section>
      </div>
    </>
  );
}
