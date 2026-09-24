import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  checkpointsForTopic, dependentsOfPhase, getCheckpoint, getConcept, getPhase, getTopic, getWeek, meta, projectsForTopic,
  refLabel, resourcesForPhase, resourcesForTopic, topics,
} from "@/lib/data";
import { Markdown } from "@/components/Markdown";
import { Chip, ExternalLink, InlineText, PageHeader, Section } from "@/components/ui";
import {
  ChecklistSummary, ClearanceNotice, ConceptChecklist, GateBadge, MasteryPanel, NotesEditor, SingleCheck, TopicStatus,
} from "@/components/progress";
import { DsaForTopic } from "@/components/DsaForTopic";

export const dynamicParams = false;
export function generateStaticParams() {
  return topics.map((t) => ({ id: t.id }));
}
type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const t = getTopic(id);
  return { title: t ? `${t.id} ${t.label}` : "Topic" };
}

const LANE: Record<string, string> = { primary: "primary", supporting: "supporting", dsa: "DSA lane" };

export default async function Page({ params }: Props) {
  const { id } = await params;
  const t = getTopic(id);
  if (!t) notFound();
  const phase = getPhase(t.phaseId)!;
  const isChecklist = t.kind === "concepts";
  const target: [number, number] | null = t.depth ? [t.depth.min, t.depth.max] : null;
  const mastery = t.masteryStatements.map((m) => getTopic(m)!).filter(Boolean);
  const ckpts = checkpointsForTopic(t.id);
  const projects = projectsForTopic(t.id);
  const primaryWeeks = t.weeks.filter((w) => w.lane === "primary");
  const buildTexts = Array.from(new Set(primaryWeeks.map((w) => getWeek(w.cw)?.build).filter(Boolean))) as string[];
  const unlocks = meta.componentEdges.filter((e) => e.from === t.id);
  const phaseDependents = dependentsOfPhase(t.phaseId);
  const ownRes = resourcesForTopic(t);
  const phaseRes = resourcesForPhase(t.phaseId);
  const isDsa = t.phaseId === "P04";
  const gate = t.requiredGate ? getCheckpoint(t.requiredGate) : null;
  const units = t.conceptIds;

  return (
    <>
      <PageHeader
        meta={
          <>
            <Link href="/curriculum" className="hover:text-accent">Curriculum</Link><span aria-hidden>/</span>
            <Link href={`/phases/${phase.id}`} className="hover:text-accent">{phase.id} {phase.title}</Link><span aria-hidden>/</span>
            <span className="font-mono">{t.id}</span>
          </>
        }
        title={t.label}
        lead={t.meta ? t.meta : undefined}
      >
        {isChecklist && <TopicStatus topicId={t.id} showBar />}
      </PageHeader>

      <div className="mb-6 grid grid-cols-1 gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
        <div><p className="text-xs text-muted">Priority (phase)</p><p>{phase.priority}</p></div>
        <div><p className="text-xs text-muted">Depth target</p><p>{t.depth ? t.depth.raw : "Not stated in the master"}</p></div>
        <div><p className="text-xs text-muted">Scheduled</p><p>{t.firstWeek ? `From week ${t.firstWeek}` : t.onDemand ? "On demand" : "Not scheduled"}</p></div>
        <div><p className="text-xs text-muted">Required gate</p><p>{gate ? <Link className="hover:text-accent" href={`/checkpoints/${gate.id}`}>{gate.id} {gate.title}</Link> : "None"}</p></div>
      </div>

      {t.onDemand && <p className="mb-4 rounded-md border border-rule bg-surface px-3 py-2 text-sm"><span className="font-medium">On demand.</span> {t.onDemand}</p>}
      {isChecklist && <div className="mb-8"><ClearanceNotice topicId={t.id} /></div>}

      {isChecklist && (
        <Section title="Before you call this mastered">
          <div className="space-y-4 rounded-lg border border-rule bg-surface p-4 text-sm">
            <p>Mastered means the checklist below is complete <em>and</em> you have reached the Demonstrated stage: you built something with it, debugged it, documented it and passed a practical check without tutorial dependence.</p>
            {mastery.map((m) => (
              <div key={m.id}>
                <p className="font-medium">{m.label} <span className="font-mono text-xs text-muted">{m.id}</span></p>
                {m.blocks.map((b, i) => (b.t === "md" ? <Markdown key={i} md={b.md} /> : null))}
              </div>
            ))}
            {target && (
              <div>
                <p className="font-medium">Target depth</p>
                <ul className="mt-1 space-y-1">
                  {meta.depthModel.filter((d) => d.level >= target[0] && d.level <= target[1]).map((d) => (
                    <li key={d.level}><span className="font-mono">D{d.level}</span> {d.name}: {d.definition}</li>
                  ))}
                </ul>
              </div>
            )}
            {buildTexts.length > 0 && (
              <div>
                <p className="font-medium">Evidence the schedule asks for</p>
                <ul className="mt-1 list-disc space-y-1 pl-5">{buildTexts.map((b) => <li key={b}>{b}</li>)}</ul>
              </div>
            )}
            {ckpts.filter((c) => c.practicalGate).map((c) => (
              <div key={c.id}>
                <p className="font-medium">Practical gate: <Link className="hover:text-accent" href={`/checkpoints/${c.id}`}>{c.id} {c.title}</Link></p>
                <p className="mt-1">{c.practicalGate}</p>
              </div>
            ))}
            <details>
              <summary className="cursor-pointer font-medium">Master evidence loop</summary>
              <ol className="mt-1 list-decimal space-y-0.5 pl-5">{meta.evidenceLoop.map((x) => <li key={x}>{x}</li>)}</ol>
            </details>
          </div>
        </Section>
      )}

      <Section title={isChecklist ? "Checklist" : "Master text"} aside={isChecklist && units.length > 0 ? `${units.length} items` : undefined}>
        {isChecklist && units.length > 0 && <div className="mb-3"><ChecklistSummary ids={units} /></div>}
        <div className="space-y-3">
          {t.blocks.map((b, i) =>
            b.t === "md" ? (
              <Markdown key={i} md={b.md} />
            ) : (
              <ConceptChecklist key={i} items={b.ids.map((cid) => ({ id: cid, text: getConcept(cid)?.text ?? cid }))} />
            ),
          )}
          {isChecklist && units.length === 0 && (
            <div>
              <p className="mb-2 text-sm text-muted">The master lists no separate items for this component, so it has one checkpoint of its own.</p>
              <SingleCheck id={t.id} label="Worked through this component" />
            </div>
          )}
        </div>
      </Section>

      {isChecklist && (
        <Section title="Your mastery">
          <MasteryPanel topicId={t.id} states={meta.masteryStates} depths={meta.depthModel} target={target} />
        </Section>
      )}

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <Section title="Needs first">
          <ul className="space-y-1.5 text-sm">
            {gate && <li className="flex flex-wrap items-center gap-2">Gate <Link className="hover:text-accent" href={`/checkpoints/${gate.id}`}>{gate.id} {gate.title}</Link> <GateBadge gateId={gate.id} /></li>}
            {t.predecessors.map((e) => {
              const r = refLabel(e.from);
              return <li key={e.from + e.to}>{r.href ? <Link className="hover:text-accent" href={r.href}>{r.label}</Link> : r.label}{e.to !== t.id && <span className="text-muted"> (for {e.to})</span>}<span className="block text-xs text-muted">{e.reason}</span></li>;
            })}
            {phase.prerequisites.map((q) => {
              const r = refLabel(q.id);
              return <li key={q.id}>Phase prerequisite {r.href ? <Link className="hover:text-accent" href={r.href}>{r.label}</Link> : r.label}</li>;
            })}
            {!gate && t.predecessors.length === 0 && phase.prerequisites.length === 0 && <li className="text-muted">Nothing. This is a starting point.</li>}
          </ul>
        </Section>
        <Section title="Unlocks and supports">
          <ul className="space-y-1.5 text-sm">
            {unlocks.map((e) => {
              const r = refLabel(e.to);
              return <li key={e.to}>{r.href ? <Link className="hover:text-accent" href={r.href}>{r.label}</Link> : r.label}<span className="block text-xs text-muted">{e.reason}</span></li>;
            })}
            {ckpts.map((c) => <li key={c.id}>Counts toward <Link className="hover:text-accent" href={`/checkpoints/${c.id}`}>{c.id} {c.title}</Link></li>)}
            {phaseDependents.slice(0, 8).map((d) => <li key={d.id}>Phase <Link className="hover:text-accent" href={`/phases/${d.id}`}>{d.id} {d.title}</Link> builds on {phase.id}</li>)}
            {unlocks.length + ckpts.length + phaseDependents.length === 0 && <li className="text-muted">No later item depends on this directly.</li>}
          </ul>
        </Section>
      </div>

      {t.weeks.length > 0 && (
        <Section title="Where it sits in the 206 weeks">
          <ul className="flex flex-wrap gap-2 text-sm">
            {t.weeks.map((w, i) => (
              <li key={i}>
                <Link href={`/weeks/${w.cw}`} className="inline-flex rounded-md border border-rule bg-surface px-2 py-1 hover:border-accent">
                  Week {w.cw}{w.cwEnd ? `–${w.cwEnd}` : w.lane === "dsa" && w.cwEnd === null ? " onward" : ""}
                  <span className="ml-1.5 text-muted">{LANE[w.lane]}{w.conceptIds ? `, #${w.conceptIds[0].split("#")[1]}–${w.conceptIds[w.conceptIds.length - 1].split("#")[1]}` : ""}</span>
                </Link>
              </li>
            ))}
          </ul>
        </Section>
      )}

      <Section title="Resources" aside={<Link href={`/resources?phase=${phase.id}`} className="text-accent hover:underline">Phase registry</Link>}>
        {ownRes.length + phaseRes.length === 0 ? (
          <p className="text-sm text-muted">No resources listed for this topic in the master.</p>
        ) : (
          <ul className="space-y-1.5 text-sm">
            {[...ownRes, ...phaseRes].map((r) => (
              <li key={r.id}>
                <span className="mr-2 text-xs text-muted">{r.label}{ownRes.includes(r) ? "" : ", phase-wide"}</span>
                {r.url ? <ExternalLink href={r.url}>{r.name || r.url}</ExternalLink> : <InlineText text={r.name} />}
                {r.note && <span className="text-muted"> ({r.note})</span>}
              </li>
            ))}
          </ul>
        )}
      </Section>

      {projects.length > 0 && (
        <Section title="Projects that use it">
          <ul className="space-y-1 text-sm">
            {projects.map((p) => <li key={p.id}><Link className="hover:text-accent" href={`/projects/${p.id}`}><span className="font-mono text-xs text-muted">{p.id}</span> {p.title}</Link> <Chip>build weeks {p.buildWeeks[0]}–{p.buildWeeks[p.buildWeeks.length - 1]}</Chip></li>)}
          </ul>
        </Section>
      )}

      {isDsa && isChecklist && (
        <Section title="DSA problems practising this" aside={<Link href="/dsa" className="text-accent hover:underline">DSA journal</Link>}>
          <DsaForTopic conceptIds={units} />
        </Section>
      )}

      <Section><NotesEditor entityId={t.id} title="Topic notes" /></Section>
    </>
  );
}
