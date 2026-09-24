import type { Metadata } from "next";
import Link from "next/link";
import { checkpoints } from "@/lib/data";
import { PageHeader, Section } from "@/components/ui";
import { GateBadge } from "@/components/progress";

export const metadata: Metadata = { title: "Checkpoints" };

export default function Page() {
  const competency = checkpoints.filter((c) => c.kind !== "stage");
  const stage = checkpoints.filter((c) => c.kind === "stage");
  const Row = ({ c }: { c: (typeof checkpoints)[number] }) => (
    <li className="flex flex-wrap items-center gap-x-3 gap-y-1 px-3 py-2.5">
      <Link href={`/checkpoints/${c.id}`} className="min-w-0 flex-1 hover:text-accent">
        <span className="font-mono text-sm text-muted">{c.id}</span> <span className="font-medium">{c.title}</span>
        <span className="block text-xs text-muted">{c.gateWeek ? `Planned at week ${c.gateWeek}` : "Calendar-driven, near recruiting periods"}{c.criteria.length ? `, ${c.criteria.length} pass criteria` : ""}</span>
      </Link>
      <GateBadge gateId={c.id} />
    </li>
  );
  return (
    <>
      <PageHeader
        title="Checkpoints"
        lead="Later work is unlocked by capability evidence, not calendar time. G0 and the seven master checkpoints are the authoritative gates; stage gates apply the master's phase-gating rule at stage boundaries."
      />
      <Section title="G0 and competency checkpoints C1–C7">
        <ol className="divide-y divide-rule rounded-md border border-rule bg-surface">{competency.map((c) => <Row key={c.id} c={c} />)}</ol>
        <p className="mt-2 text-xs text-muted">C4 is placed before C3 in the schedule: C4&apos;s required build is the first ML project, which comes before the cloud project that C3 requires.</p>
      </Section>
      <Section title="Stage gates">
        <ol className="divide-y divide-rule rounded-md border border-rule bg-surface">{stage.map((c) => <Row key={c.id} c={c} />)}</ol>
      </Section>
    </>
  );
}
