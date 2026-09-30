import type { Metadata } from "next";
import Link from "next/link";
import { checkpointName, checkpoints } from "@/lib/data";
import { PageHeader, Section } from "@/components/ui";
import { GateBadge } from "@/components/progress";
import { RefId } from "@/components/Ref";

export const metadata: Metadata = { title: "Checkpoints" };

export default function Page() {
  const competency = checkpoints.filter((c) => c.kind !== "stage");
  const stage = checkpoints.filter((c) => c.kind === "stage");
  const Row = ({ c }: { c: (typeof checkpoints)[number] }) => (
    <li className="flex flex-wrap items-center gap-x-3 gap-y-1 px-3 py-2.5">
      <Link href={`/checkpoints/${c.id}`} className="min-w-0 flex-1 hover:text-accent">
        <span className="font-medium">{checkpointName(c.id)}</span> <RefId id={c.id} />
        <span className="block text-xs text-muted">{c.gateWeek ? `Planned at week ${c.gateWeek}` : "Calendar-driven, near recruiting periods"}{c.criteria.length ? `, ${c.criteria.length} pass criteria` : ""}</span>
      </Link>
      <GateBadge gateId={c.id} />
    </li>
  );
  return (
    <>
      <PageHeader
        title="Checkpoints"
        lead="Later work unlocks when you can show the skill, not when time passes. The initial Python gate and seven competency checkpoints are the main milestones; stage gates mark the end of each stage."
      />
      <Section title="Competency checkpoints">
        <ol className="divide-y divide-rule rounded-md border border-rule bg-surface">{competency.map((c) => <Row key={c.id} c={c} />)}</ol>
        <p className="mt-2 text-xs text-muted">C4 is placed before C3 in the schedule: C4&apos;s required build is the first ML project, which comes before the cloud project that C3 requires.</p>
      </Section>
      <Section title="Stage gates">
        <ol className="divide-y divide-rule rounded-md border border-rule bg-surface">{stage.map((c) => <Row key={c.id} c={c} />)}</ol>
      </Section>
    </>
  );
}
