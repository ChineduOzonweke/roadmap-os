import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { checkpointName, checkpoints, getCheckpoint, getPhase, meta, topicsUnlockedBy, weeks } from "@/lib/data";
import { PageHeader, Section } from "@/components/ui";
import { GateControls, NotesEditor, TopicStatus } from "@/components/progress";
import { RefId } from "@/components/Ref";

export const dynamicParams = false;
export function generateStaticParams() {
  return checkpoints.map((c) => ({ id: c.id }));
}
type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const c = getCheckpoint(id);
  return { title: c ? checkpointName(c.id) : "Checkpoint" };
}

export default async function Page({ params }: Props) {
  const { id } = await params;
  const c = getCheckpoint(id);
  if (!c) notFound();
  const unlocked = topicsUnlockedBy(c.id);
  const order = meta.gateOrder;
  const i = order.indexOf(c.id);
  const nextGate = i >= 0 && i < order.length - 1 ? getCheckpoint(order[i + 1]) : null;
  const range = c.gateWeek ? [c.gateWeek + 1, nextGate?.gateWeek ? nextGate.gateWeek : 206] : null;
  const byPhase = new Map<string, typeof unlocked>();
  unlocked.forEach((t) => byPhase.set(t.phaseId, [...(byPhase.get(t.phaseId) ?? []), t]));
  return (
    <>
      <PageHeader
        meta={<><Link href="/checkpoints" className="hover:text-accent">Checkpoints</Link><RefId id={c.id} /></>}
        title={checkpointName(c.id)}
        lead={<>{c.gateWeek ? <>Planned at <Link className="text-accent hover:underline" href={`/weeks/${c.gateWeek}`}>week {c.gateWeek}</Link>. </> : "Calendar-driven. "}{c.source}.</>}
      />

      {c.practicalGate && (
        <Section title={c.kind === "stage" ? "What this covers" : "Practical check"}>
          <p className="max-w-[72ch] rounded-lg border border-rule bg-surface p-4">{c.practicalGate}</p>
        </Section>
      )}
      {c.note && <p className="mb-6 max-w-[72ch] text-sm text-muted">{c.note}</p>}

      <Section title="Your record">
        <GateControls gateId={c.id} criteria={c.criteria} requires={c.requires} />
      </Section>

      <Section title="What passing it clears" aside={range ? `Weeks ${range[0]}–${range[1]}` : undefined}>
        {unlocked.length ? (
          <div className="space-y-3">
            {[...byPhase.entries()].map(([ph, ts]) => (
              <div key={ph}>
                <p className="text-sm font-medium"><Link href={`/phases/${ph}`} className="hover:text-accent">{ph} {getPhase(ph)?.title}</Link></p>
                <ul className="mt-1 space-y-1">
                  {ts.map((t) => (
                    <li key={t.id} className="flex flex-wrap items-center gap-2 text-sm">
                      <Link href={`/topics/${t.id}`} className="min-w-0 flex-1 hover:text-accent"><RefId id={t.id} /> {t.label}</Link>
                      <TopicStatus topicId={t.id} />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted">No topics start directly behind this checkpoint{c.id === "C7" ? "; this is the interview-readiness checkpoint." : "."}</p>
        )}
        {range && <p className="mt-3 text-sm text-muted">Weeks in that range: {weeks.slice(range[0] - 1, range[1]).length}.</p>}
      </Section>

      <Section><NotesEditor entityId={c.id} title="Gate notes" /></Section>
    </>
  );
}
