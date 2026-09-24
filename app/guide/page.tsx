import type { Metadata } from "next";
import Link from "next/link";
import { meta } from "@/lib/data";
import { Markdown } from "@/components/Markdown";
import { PageHeader, Section } from "@/components/ui";

export const metadata: Metadata = { title: "How it works" };

const STATUS_RULES: [string, string][] = [
  ["Locked", "You can read it, but it sits behind a gate you have not passed, or a named predecessor topic is unfinished."],
  ["Available", "Cleared to work on: its required gate is passed (or it needs none) and its predecessor topics are complete."],
  ["In progress", "At least one checklist item is ticked or a mastery stage is set."],
  ["Checklist done", "Every checklist item is ticked. Exposure is covered; mastery is not yet shown."],
  ["Mastered", "Checklist done and the mastery stage is Demonstrated or Retained."],
];

export default function Page() {
  return (
    <>
      <PageHeader title="How Roadmap OS works" lead="The rules below come from the master roadmap. Where the app had to make an implementation decision, it says so." />

      <Section title="The hierarchy">
        <p className="max-w-[72ch] text-sm">Master curriculum, then 46 phases (P01–P46), then topics (components such as P13.2), then checklist items (concepts such as P13.2#4). The 206-week mapping schedules those items; gates decide when later work is cleared; projects and checkpoints demand evidence. Every ID is stable, so notes and progress survive wording changes in the master.</p>
      </Section>

      <Section title="Status and unlocking">
        <dl className="divide-y divide-rule rounded-lg border border-rule bg-surface text-sm">
          {STATUS_RULES.map(([k, v]) => <div key={k} className="grid grid-cols-1 gap-1 px-4 py-2 sm:grid-cols-[9rem_1fr]"><dt className="font-medium">{k}</dt><dd>{v}</dd></div>)}
        </dl>
        <p className="mt-3 max-w-[72ch] text-sm text-muted">
          Implementation decision: a topic&apos;s required gate is the last gate before its first scheduled week. The master unlocks later phases by capability evidence at gates, and the reconciled schedule already respects every phase prerequisite, so gating on the schedule enforces the dependency spine without locking a topic behind a phase that is intentionally spread across stages (for example P10 mathematics). Named component edges (for example P10.1d before P13.5) are enforced directly. On-demand topics use: P05.4 after C2, P41 and P43 after C5, P46 always available. Locks never disable checkboxes; they only tell you what is and is not your current work.
        </p>
      </Section>

      <Section title="Mastery stages" id="mastery">
        <ol className="divide-y divide-rule rounded-lg border border-rule bg-surface text-sm">
          {meta.masteryStates.map((m) => <li key={m.id} className="grid grid-cols-1 gap-1 px-4 py-2 sm:grid-cols-[9rem_1fr]"><span className="font-medium"><span className="font-mono text-muted">{m.level}</span> {m.name}</span><span>{m.master}</span></li>)}
        </ol>
        <p className="mt-2 max-w-[72ch] text-sm text-muted">These stages are the master evidence loop grouped into steps. Recording a passed spaced re-test moves a Demonstrated topic to Retained.</p>
      </Section>

      <Section title="Depth model" id="depth">
        <ol className="divide-y divide-rule rounded-lg border border-rule bg-surface text-sm">
          {meta.depthModel.map((d) => <li key={d.level} className="grid grid-cols-1 gap-1 px-4 py-2 sm:grid-cols-[11rem_1fr]"><span className="font-medium"><span className="font-mono">D{d.level}</span> {d.name}</span><span>{d.definition}</span></li>)}
        </ol>
        {meta.depthNotes.length > 0 && <p className="mt-2 max-w-[72ch] text-sm text-muted">{meta.depthNotes.join(" ")}</p>}
        <p className="mt-2 max-w-[72ch] text-sm text-muted">Target depth comes from each topic&apos;s master annotation (or its phase). Current depth is yours to set honestly on the topic page.</p>
      </Section>

      <Section title="Priority model">
        <ul className="divide-y divide-rule rounded-lg border border-rule bg-surface text-sm">
          {meta.priorityModel.map((p) => <li key={p.name} className="grid grid-cols-1 gap-1 px-4 py-2 sm:grid-cols-[13rem_1fr]"><span className="font-medium">{p.symbol} {p.name}</span><span>{p.definition}</span></li>)}
        </ul>
      </Section>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <Section title="Evidence loop">
          <ol className="list-decimal space-y-0.5 pl-5 text-sm">{meta.evidenceLoop.map((x) => <li key={x}>{x}</li>)}</ol>
        </Section>
        <Section title="Phase-gating rule">
          <ul className="list-disc space-y-0.5 pl-5 text-sm">{meta.phaseGatingRule.map((x) => <li key={x}>{x}</li>)}</ul>
          <p className="mt-2 text-sm text-muted">Spaced re-tests: {meta.spacedRetestDays.join(", ")} days (master: 1–3 days, 7 days, 30 days, 90 days, 6 months).</p>
        </Section>
      </div>

      <Section title="Daily work unit">
        <ol className="grid grid-cols-1 gap-1.5 text-sm sm:grid-cols-3">{meta.dailyWorkUnit.map((d) => <li key={d.step} className="rounded-md border border-rule bg-surface px-3 py-2"><span className="tabular-nums text-muted">{d.minutes} min</span> {d.step}</li>)}</ol>
      </Section>

      <Section title="Master operating rules">
        {[["Operating system rules", meta.operatingRulesMd], ["Weekly execution model", meta.weeklyModelMd], ["Monthly review", meta.monthlyReviewMd], ["Foundation recovery", meta.recoveryMd]].map(([t, md]) => (
          <details key={t} className="mb-2 rounded-lg border border-rule bg-surface">
            <summary className="cursor-pointer px-4 py-2.5 font-medium">{t}</summary>
            <div className="border-t border-rule px-4 py-3 text-sm"><Markdown md={md} /></div>
          </details>
        ))}
      </Section>

      <Section title="Data source">
        <div className="text-sm [overflow-wrap:anywhere]">
          <p>Master file <span className="font-mono text-xs">{meta.source.file}</span>, MD5 <span className="font-mono text-xs">{meta.source.md5}</span>, data generated {meta.source.generated}.</p>
          <p className="mt-1">Validation at generation: {String(meta.validation.conceptCoverage)} concepts mapped (mapped, schedulable); dependency, edge, checkpoint and project violations all {Number(meta.validation.phaseDependencyViolations) + Number(meta.validation.componentEdgeViolations) + Number(meta.validation.checkpointViolations) + Number(meta.validation.projectViolations)}.</p>
          {meta.resourceNotes.length > 0 && (
            <>
              <p className="mt-2 font-medium">Source inconsistency reported, not silently changed</p>
              <p className="text-muted">The master resource map lists the Java and JavaScript/TypeScript resource groups under Phase 7. They are kept under P07 in the registry and also shown on topics P01.2 and P01.3 by matching title.</p>
            </>
          )}
          <p className="mt-2"><Link className="text-accent underline" href="/settings">Settings</Link> shows where your progress is stored.</p>
        </div>
      </Section>
    </>
  );
}
