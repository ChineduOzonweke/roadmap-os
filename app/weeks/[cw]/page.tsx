import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCheckpoint, getConcept, getProject, getStage, getTopic, getWeek, weeks } from "@/lib/data";
import type { WeekSlice } from "@/types/curriculum";
import { Markdown } from "@/components/Markdown";
import { PageHeader, Section, Chip } from "@/components/ui";
import { RefId } from "@/components/Ref";
import { AiModeLine } from "@/components/AiModeLine";
import { ConceptChecklist, NotesEditor, SingleCheck, TopicStatus, WeekControls } from "@/components/progress";

export const dynamicParams = false;
export function generateStaticParams() {
  return weeks.map((w) => ({ cw: String(w.cw) }));
}

type Props = { params: Promise<{ cw: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { cw } = await params;
  return { title: `Week ${cw}` };
}

function SliceView({ slice, cw }: { slice: WeekSlice; cw: number }) {
  if (slice.kind === "topic") {
    const t = getTopic(slice.topicId);
    if (!t) return null;
    const ids = slice.conceptIds ?? t.conceptIds;
    return (
      <div className="space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Link href={`/topics/${t.id}`} className="font-medium hover:text-accent">
            {slice.title} <RefId id={t.id} />
          </Link>
          {t.kind === "concepts" && <TopicStatus topicId={t.id} />}
        </div>
        {slice.detail && <p className="text-sm text-muted">{slice.detail}</p>}
        {t.kind === "concepts" && ids.length > 0 && (
          <ConceptChecklist items={ids.map((id) => ({ id, text: getConcept(id)?.text ?? id }))} />
        )}
        {t.kind === "concepts" && ids.length === 0 && (
          <>
            {t.blocks.map((b, i) => (b.t === "md" ? <Markdown key={i} md={b.md} className="text-sm" /> : null))}
            <SingleCheck id={t.id} label="Worked through this component" />
          </>
        )}
        {t.kind !== "concepts" && t.blocks.map((b, i) => (b.t === "md" ? <Markdown key={i} md={b.md} className="text-sm" /> : null))}
      </div>
    );
  }
  if (slice.kind === "project") {
    const p = getProject(slice.projectId);
    if (!p) return null;
    const ms = p.milestones.filter((m) => m.cw === cw);
    return (
      <div>
        <Link href={`/projects/${p.id}`} className="font-medium hover:text-accent">{p.title} <RefId id={p.id} /></Link>
        <p className="text-sm text-muted">Project build week{ms.length ? `: milestone ${ms.map((m) => m.id).join(", ")}` : ""}. Track milestones on the project page.</p>
      </div>
    );
  }
  return <p>{slice.title}</p>;
}

export default async function Page({ params }: Props) {
  const { cw: raw } = await params;
  const cw = Number(raw);
  const w = getWeek(cw);
  if (!w) notFound();
  const stage = getStage(w.stage);
  const main = getStage(w.mainStage);
  const gate = w.gate ? getCheckpoint(w.gate) : null;
  const req = w.requiredGate ? getCheckpoint(w.requiredGate) : null;
  return (
    <>
      <PageHeader
        meta={
          <>
            <Link href="/weeks" className="hover:text-accent">Weeks</Link>
            <span aria-hidden>/</span>
            <span>{main?.name}{stage && stage.id !== main?.id ? `, ${stage.name}` : ""}</span>
          </>
        }
        title={`Week ${cw}`}
        lead={w.title}
      >
        <WeekControls cw={cw} />
      </PageHeader>

      <div className="mb-4"><AiModeLine cw={cw} /></div>

      <div className="mb-6 flex flex-wrap gap-2 text-sm">
        <Chip>{w.type === "study" ? "Study week" : w.type === "project" ? "Project build week" : w.type === "consolidation" ? "Consolidation week" : "Open work"}</Chip>
        {w.conceptCount > 0 && <Chip>{w.conceptCount} checklist items scheduled</Chip>}
        {req && <Chip>After the <Link className="ml-1 text-accent" href={`/checkpoints/${req.id}`}>{req.kind === "competency" ? `${req.title} checkpoint` : req.title}</Link></Chip>}
        {gate && <Chip>Checkpoint week: <Link className="ml-1 text-accent" href={`/checkpoints/${gate.id}`}>{gate.kind === "competency" ? `${gate.title} checkpoint` : gate.title}</Link></Chip>}
      </div>

      {w.dayPlan && (
        <Section title={`Master 14-day plan (days ${w.dayPlan.days} this week)`}>
          <ul className="divide-y divide-rule rounded-md border border-rule bg-surface text-sm">
            {w.dayPlan.plan.map((d) => (
              <li key={d.days} className="flex gap-3 px-3 py-2"><span className="w-24 shrink-0 text-muted">{d.days}</span>{d.focus}</li>
            ))}
          </ul>
        </Section>
      )}

      <Section title="Primary">
        <div className="space-y-6">
          {w.primary.map((sl) => <SliceView key={sl.ref} slice={sl} cw={cw} />)}
        </div>
      </Section>

      {w.supporting.length > 0 && (
        <Section title="Supporting" aside="Only with spare capacity">
          <div className="space-y-6">
            {w.supporting.map((sl) => <SliceView key={sl.ref} slice={sl} cw={cw} />)}
          </div>
        </Section>
      )}

      <Section title="Build and evidence">
        <p>{w.build}</p>
        {w.note && <p className="mt-2 text-sm text-muted">Note: {w.note}</p>}
      </Section>

      {w.dsaLane && (
        <Section title="DSA lane" aside={<Link className="text-accent hover:underline" href="/dsa">DSA journal</Link>}>
          {w.dsaLane.slices.length > 0 ? (
            <ul className="list-disc pl-5 text-sm">
              {w.dsaLane.slices.map((s) => (
                <li key={s.ref}>{s.kind === "topic" ? <Link href={`/topics/${s.topicId}`} className="hover:text-accent">{s.title}</Link> : s.title}</li>
              ))}
            </ul>
          ) : null}
          <p className="mt-1 text-sm text-muted">{w.dsaLane.note}</p>
        </Section>
      )}

      {gate && (
        <Section title={gate.kind === "competency" ? `${gate.title} checkpoint` : gate.title} aside={<Link className="text-accent hover:underline" href={`/checkpoints/${gate.id}`}>Open</Link>}>
          {gate.practicalGate && <p className="text-sm"><span className="font-medium">Practical gate.</span> {gate.practicalGate}</p>}
        </Section>
      )}

      <Section>
        <NotesEditor entityId={`week:${cw}`} title="Notes for this week" />
      </Section>

      <nav className="flex justify-between border-t border-rule pt-4 text-sm" aria-label="Week navigation">
        {cw > 1 ? <Link className="text-accent hover:underline" href={`/weeks/${cw - 1}`}>Week {cw - 1}</Link> : <span />}
        {cw < 206 ? <Link className="text-accent hover:underline" href={`/weeks/${cw + 1}`}>Week {cw + 1}</Link> : <span />}
      </nav>
    </>
  );
}
