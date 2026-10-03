import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  checkpointsForTopic, dependentsOfPhase, getCheckpoint, getConcept, getPhase, getTopic, getWeek, meta, projectsForTopic,
  checkpointName, refLabel, resourcesForPhase, resourcesForTopic, topics,
} from "@/lib/data";
import { Markdown } from "@/components/Markdown";
import { Tutor } from "@/components/Tutor";
import { Chip, Disclosure, ExternalLink, InlineText, PageHeader, Section } from "@/components/ui";
import {
  ChecklistSummary, ClearanceNotice, ConceptChecklist, GateBadge, MasteryPanel, NotesEditor, SingleCheck, TopicStatus,
} from "@/components/progress";
import { DsaForTopic } from "@/components/DsaForTopic";
import { RefId } from "@/components/Ref";

export const dynamicParams = false;
export function generateStaticParams() {
  return topics.map((t) => ({ id: t.id }));
}
type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const t = getTopic(id);
  return { title: t ? t.label : "Topic" };
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

  const resourcesAll = [...ownRes, ...phaseRes];
  const gateLabel = gate ? checkpointName(gate.id) : null;

  return (
    <>
      <PageHeader
        meta={
          <>
            <Link href="/curriculum" className="hover:text-accent">Roadmap</Link><span aria-hidden>/</span>
            <Link href={`/phases/${phase.id}`} className="hover:text-accent">{phase.title}</Link>
            <RefId id={t.id} />
          </>
        }
        title={t.label}
      >
        {isChecklist && <TopicStatus topicId={t.id} />}
      </PageHeader>

      {t.onDemand && <p className="mb-4 rounded-xl bg-surface-2 px-4 py-3 text-sm"><span className="font-medium">On demand.</span> {t.onDemand}</p>}
      {isChecklist && <ClearanceNotice topicId={t.id} />}

      <Section title={isChecklist ? "What to learn" : "From the master roadmap"}>
        {isChecklist && units.length > 0 && <div className="mb-4"><ChecklistSummary ids={units} /></div>}
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

      <div className="space-y-3">
        <Tutor scope={{ topicId: t.id }} />
        {isChecklist && (
          <Disclosure title="Your mastery and evidence" hint="Mastery stage, depth, evidence and re-tests">
            <MasteryPanel topicId={t.id} states={meta.masteryStates} depths={meta.depthModel} target={target} />
          </Disclosure>
        )}

        {isChecklist && (
          <Disclosure title="What mastered means here" hint="Mastery statements, target depth and the practical check">
            <div className="space-y-4 text-sm">
              <p>Mastered means the checklist is complete <em>and</em> you reached the Demonstrated stage: you built something with it, debugged it, documented it and passed a practical check without tutorial dependence.</p>
              {mastery.map((m) => (
                <div key={m.id}>
                  <p className="font-medium">{m.label} <RefId id={m.id} /></p>
                  {m.blocks.map((b, i) => (b.t === "md" ? <Markdown key={i} md={b.md} /> : null))}
                </div>
              ))}
              {target && (
                <div>
                  <p className="font-medium">Target depth</p>
                  <ul className="mt-1 space-y-1">
                    {meta.depthModel.filter((d) => d.level >= target[0] && d.level <= target[1]).map((d) => (
                      <li key={d.level}>{d.name}: {d.definition}</li>
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
                  <p className="font-medium">Practical check: <Link className="hover:text-accent" href={`/checkpoints/${c.id}`}>{checkpointName(c.id)}</Link></p>
                  <p className="mt-1">{c.practicalGate}</p>
                </div>
              ))}
              <div>
                <p className="font-medium">Evidence loop</p>
                <ol className="mt-1 list-decimal space-y-0.5 pl-5">{meta.evidenceLoop.map((x) => <li key={x}>{x}</li>)}</ol>
              </div>
            </div>
          </Disclosure>
        )}

        <Disclosure title="Resources" hint={resourcesAll.length ? `${resourcesAll.length} listed` : "None listed in the master"}>
          {resourcesAll.length === 0 ? (
            <p className="text-sm text-muted">No resources listed for this topic in the master.</p>
          ) : (
            <ul className="-mx-4 -my-1">
              {resourcesAll.map((r) => (
                <li key={r.id} className="border-b border-rule px-4 py-3 last:border-b-0">
                  <span className="block text-xs text-muted">{r.label}{ownRes.includes(r) ? "" : ", for the whole phase"}</span>
                  <span className="block leading-snug">{r.url ? <ExternalLink href={r.url}>{r.name || r.url}</ExternalLink> : <InlineText text={r.name} />}</span>
                  {r.note && <span className="mt-0.5 block text-sm text-muted">{r.note}</span>}
                </li>
              ))}
            </ul>
          )}
          <p className="mt-3 text-sm"><Link href={`/resources?phase=${phase.id}`} className="text-accent hover:underline">All resources for {phase.title}</Link></p>
        </Disclosure>

        <Disclosure title="How it connects" hint="What comes before, what builds on it, when it is scheduled">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <p className="mb-2 text-sm font-medium">Needs first</p>
              <ul className="space-y-1.5 text-sm">
                {gate && <li className="flex flex-wrap items-center gap-2"><Link className="hover:text-accent" href={`/checkpoints/${gate.id}`}>{gateLabel}</Link> <GateBadge gateId={gate.id} /></li>}
                {t.predecessors.map((e) => {
                  const r = refLabel(e.from);
                  return <li key={e.from + e.to}>{r.href ? <Link className="hover:text-accent" href={r.href}>{r.label}</Link> : r.label}<span className="block text-xs text-muted">{e.reason}</span></li>;
                })}
                {phase.prerequisites.map((q) => {
                  const r = refLabel(q.id);
                  return <li key={q.id}>{r.href ? <Link className="hover:text-accent" href={r.href}>{r.label}</Link> : r.label}</li>;
                })}
                {!gate && t.predecessors.length === 0 && phase.prerequisites.length === 0 && <li className="text-muted">Nothing. This is a starting point.</li>}
              </ul>
            </div>
            <div>
              <p className="mb-2 text-sm font-medium">Builds on this</p>
              <ul className="space-y-1.5 text-sm">
                {unlocks.map((e) => {
                  const r = refLabel(e.to);
                  return <li key={e.to}>{r.href ? <Link className="hover:text-accent" href={r.href}>{r.label}</Link> : r.label}<span className="block text-xs text-muted">{e.reason}</span></li>;
                })}
                {ckpts.map((c) => <li key={c.id}>Counts toward the <Link className="hover:text-accent" href={`/checkpoints/${c.id}`}>{checkpointName(c.id)}</Link></li>)}
                {phaseDependents.slice(0, 8).map((d) => <li key={d.id}><Link className="hover:text-accent" href={`/phases/${d.id}`}>{d.title}</Link></li>)}
                {unlocks.length + ckpts.length + phaseDependents.length === 0 && <li className="text-muted">No later item depends on this directly.</li>}
              </ul>
            </div>
          </div>
          {t.weeks.length > 0 && (
            <>
              <p className="mb-2 mt-5 text-sm font-medium">Scheduled in</p>
              <ul className="flex flex-wrap gap-2 text-sm">
                {t.weeks.map((w, i) => (
                  <li key={i}>
                    <Link href={`/weeks/${w.cw}`} className="inline-flex min-h-10 items-center rounded-xl border border-rule bg-surface px-3 hover:border-accent">
                      Week {w.cw}{w.cwEnd ? `–${w.cwEnd}` : w.lane === "dsa" && w.cwEnd === null ? " onward" : ""}
                      {w.lane !== "primary" && <span className="ml-1.5 text-muted">{LANE[w.lane]}</span>}
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          )}
          <dl className="mt-5 grid grid-cols-1 gap-3 text-sm sm:grid-cols-3">
            <div><dt className="text-xs text-muted">Priority</dt><dd>{phase.priority}{t.meta ? `, ${t.meta}` : ""}</dd></div>
            <div><dt className="text-xs text-muted">Depth target</dt><dd>{t.depth ? t.depth.raw : "Not stated in the master"}</dd></div>
            <div><dt className="text-xs text-muted">Scheduled</dt><dd>{t.firstWeek ? `From week ${t.firstWeek}` : t.onDemand ? "On demand" : "Not scheduled"}</dd></div>
          </dl>
        </Disclosure>

        {projects.length > 0 && (
          <Disclosure title="Projects that use it" hint={`${projects.length} project${projects.length > 1 ? "s" : ""}`}>
            <ul className="space-y-1.5 text-sm">
              {projects.map((p) => <li key={p.id}><Link className="hover:text-accent" href={`/projects/${p.id}`}>{p.title}</Link> <RefId id={p.id} /> <Chip>weeks {p.buildWeeks[0]}–{p.buildWeeks[p.buildWeeks.length - 1]}</Chip></li>)}
            </ul>
          </Disclosure>
        )}

        {isDsa && isChecklist && (
          <Disclosure title="DSA problems practising this" hint="From your DSA journal">
            <DsaForTopic conceptIds={units} />
            <p className="mt-2 text-sm"><Link href="/dsa" className="text-accent hover:underline">Open the DSA journal</Link></p>
          </Disclosure>
        )}

        <Disclosure title="Notes">
          <NotesEditor entityId={t.id} title="Topic notes" />
        </Disclosure>
      </div>
    </>
  );
}
