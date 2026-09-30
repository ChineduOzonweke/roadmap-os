import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { concepts, getConcept, getPhase, getTopic, meta } from "@/lib/data";
import { conceptIdFromSlug, conceptSlug } from "@/lib/ids";
import { InlineText, PageHeader, Section } from "@/components/ui";
import { ClearanceNotice, NotesEditor, SingleCheck, TopicStatus } from "@/components/progress";
import { RefId } from "@/components/Ref";

export const dynamicParams = false;
export function generateStaticParams() {
  return concepts.map((c) => ({ slug: conceptSlug(c.id) }));
}
type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const c = getConcept(conceptIdFromSlug(slug));
  return { title: c ? `${c.id} ${c.text.replace(/`/g, "")}` : "Concept" };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const c = getConcept(conceptIdFromSlug(slug));
  if (!c) notFound();
  const t = getTopic(c.topicId)!;
  const p = getPhase(c.phaseId)!;
  const prev = c.index > 1 ? `${t.id}#${c.index - 1}` : null;
  const next = c.index < t.conceptIds.length ? `${t.id}#${c.index + 1}` : null;
  const depth = t.depth ? meta.depthModel.filter((d) => d.level >= t.depth!.min && d.level <= t.depth!.max) : [];
  return (
    <>
      <PageHeader
        meta={
          <>
            <Link href={`/phases/${p.id}`} className="hover:text-accent">{p.title}</Link><span aria-hidden>/</span>
            <Link href={`/topics/${t.id}`} className="hover:text-accent">{t.label}</Link><span aria-hidden>/</span>
            <RefId id={c.id} />
          </>
        }
        title={<InlineText text={c.text} />}
        lead={`Item ${c.index} of ${t.conceptIds.length} in ${t.label}.`}
      >
        <SingleCheck id={c.id} label="I can do this without the tutorial open" />
      </PageHeader>

      <div className="mb-6"><ClearanceNotice topicId={t.id} /></div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <Section title="Scheduled">
          {c.weeks.length ? (
            <ul className="flex flex-wrap gap-2 text-sm">
              {c.weeks.map((w) => <li key={w}><Link className="inline-flex rounded-md border border-rule bg-surface px-2 py-1 hover:border-accent" href={`/weeks/${w}`}>Week {w}</Link></li>)}
            </ul>
          ) : <p className="text-sm text-muted">{c.onDemand ?? t.onDemand ?? "Not placed in a week."}</p>}
        </Section>
        <Section title="Topic progress">
          <TopicStatus topicId={t.id} showBar />
          {depth.length > 0 && <p className="mt-2 text-sm text-muted">Topic target: {depth.map((d) => `D${d.level} ${d.name}`).join(" to ")}.</p>}
        </Section>
      </div>

      <Section title="How to prove it">
        <p className="text-sm">Use the master evidence loop on this one item: explain it without notes, implement a small version or solve a targeted exercise, then use it inside something you build. Record the artifact on the <Link className="text-accent underline" href={`/topics/${t.id}`}>topic page</Link>.</p>
      </Section>

      <Section><NotesEditor entityId={c.id} title="Concept notes" /></Section>

      <nav className="flex justify-between gap-4 border-t border-rule pt-4 text-sm" aria-label="Concept navigation">
        {prev ? <Link className="text-accent hover:underline" href={`/concepts/${conceptSlug(prev)}`}>{prev}</Link> : <span />}
        <Link className="text-accent hover:underline" href={`/topics/${t.id}`}>All of {t.id}</Link>
        {next ? <Link className="text-accent hover:underline" href={`/concepts/${conceptSlug(next)}`}>{next}</Link> : <span />}
      </nav>
    </>
  );
}
