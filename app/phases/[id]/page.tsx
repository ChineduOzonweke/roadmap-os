import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  checkpointsForPhase, dependentsOfPhase, getCheckpoint, getPhase, phases, projectsForPhase, refLabel, resources, topicsOfPhase,
} from "@/lib/data";
import { Markdown } from "@/components/Markdown";
import { Chip, ExternalLink, PageHeader, Section } from "@/components/ui";
import { GateBadge, NotesEditor, PhaseStatus, TopicStatus } from "@/components/progress";

export const dynamicParams = false;
export function generateStaticParams() {
  return phases.map((p) => ({ id: p.id }));
}
type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const p = getPhase(id);
  return { title: p ? `${p.id} ${p.title}` : "Phase" };
}

const SOURCE: Record<string, string> = {
  S79: "master timeline", S101: "master learning sequence", S103: "dependency spine", GATE: "phase gate", TEXT: "master text", D5: "decision 5",
};

export default async function Page({ params }: Props) {
  const { id } = await params;
  const p = getPhase(id);
  if (!p) notFound();
  const topics = topicsOfPhase(id);
  const dependents = dependentsOfPhase(id);
  const ckpts = checkpointsForPhase(id);
  const projects = projectsForPhase(id);
  const res = resources.filter((r) => r.phaseId === id);
  const rules = topics.filter((t) => t.kind === "gate-text" || t.kind === "rule");
  const idx = phases.findIndex((x) => x.id === id);
  return (
    <>
      <PageHeader
        meta={<><Link href="/curriculum" className="hover:text-accent">Curriculum</Link><span aria-hidden>/</span><span className="font-mono">{p.id}</span></>}
        title={p.title}
        lead={p.description}
      >
        <PhaseStatus phaseId={p.id} />
      </PageHeader>

      <div className="mb-8 grid grid-cols-1 gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
        <div><p className="text-xs text-muted">Priority</p><p>{p.priority}</p></div>
        <div><p className="text-xs text-muted">Depth target</p><p>{p.target}</p></div>
        <div><p className="text-xs text-muted">Position in the 206 weeks</p><p>{p.weekRange ? `Weeks ${p.weekRange[0]}–${p.weekRange[1]}` : p.placement}</p></div>
        <div><p className="text-xs text-muted">Stages</p><p>{p.stages.join(", ") || p.placement}</p></div>
      </div>

      {(p.gate || p.unlockNote) && (
        <Section title="Unlock rule">
          {p.gate && <p className="text-sm"><span className="font-medium">Master gate:</span> {p.gate}</p>}
          {p.unlockNote && <p className="mt-1 text-sm">{p.unlockNote}</p>}
        </Section>
      )}

      <Section title="Topics" aside={`${topics.filter((t) => t.kind === "concepts").length} topics`}>
        <ul className="divide-y divide-rule rounded-md border border-rule bg-surface">
          {topics.filter((t) => t.kind === "concepts" || t.kind === "parent").map((t) => (
            <li key={t.id} className={t.parentId ? "pl-4" : ""}>
              {t.kind === "parent" ? (
                <div className="px-3 py-2 text-sm font-medium">{t.id} {t.title} <span className="font-normal text-muted">{t.meta}</span></div>
              ) : (
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 px-3 py-2">
                  <Link href={`/topics/${t.id}`} className="min-w-0 flex-1 hover:text-accent"><span className="font-mono text-xs text-muted">{t.id}</span> {t.label}</Link>
                  <span className="text-xs text-muted">
                    {t.depth ? `D${t.depth.min}${t.depth.max !== t.depth.min ? `–D${t.depth.max}` : ""}` : ""}
                    {t.firstWeek ? `, from week ${t.firstWeek}` : t.onDemand ? ", on demand" : ""}
                  </span>
                  <TopicStatus topicId={t.id} />
                </div>
              )}
            </li>
          ))}
        </ul>
      </Section>

      {rules.length > 0 && (
        <Section title="Mastery statements and rules">
          {rules.map((t) => (
            <div key={t.id} className="mb-3">
              <p className="text-sm font-medium">{t.label} <span className="font-mono text-xs text-muted">{t.id}</span></p>
              {t.blocks.map((b, i) => (b.t === "md" ? <Markdown key={i} md={b.md} className="text-sm" /> : null))}
            </div>
          ))}
        </Section>
      )}

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <Section title="Needs first">
          {p.prerequisites.length ? (
            <ul className="space-y-1 text-sm">
              {p.prerequisites.map((q) => {
                const r = refLabel(q.id);
                return (
                  <li key={q.id} className="flex flex-wrap items-center gap-2">
                    {r.href ? <Link href={r.href} className="hover:text-accent">{r.label}</Link> : r.label}
                    <Chip>{SOURCE[q.source] ?? q.source}</Chip>
                    {getCheckpoint(q.id) && <GateBadge gateId={q.id} />}
                  </li>
                );
              })}
            </ul>
          ) : <p className="text-sm text-muted">No prerequisite phases.</p>}
        </Section>
        <Section title="Required by">
          {dependents.length ? (
            <ul className="space-y-1 text-sm">
              {dependents.map((d) => <li key={d.id}><Link href={`/phases/${d.id}`} className="hover:text-accent"><span className="font-mono text-xs text-muted">{d.id}</span> {d.title}</Link></li>)}
            </ul>
          ) : <p className="text-sm text-muted">No phase lists this one as a prerequisite.</p>}
        </Section>
      </div>

      {(ckpts.length > 0 || projects.length > 0) && (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <Section title="Checkpoints that test it">
            {ckpts.length ? (
              <ul className="space-y-1 text-sm">
                {ckpts.map((c) => <li key={c.id} className="flex items-center gap-2"><Link href={`/checkpoints/${c.id}`} className="hover:text-accent"><span className="font-mono text-xs text-muted">{c.id}</span> {c.title}</Link><GateBadge gateId={c.id} /></li>)}
              </ul>
            ) : <p className="text-sm text-muted">None.</p>}
          </Section>
          <Section title="Projects that use it">
            {projects.length ? (
              <ul className="space-y-1 text-sm">
                {projects.map((pr) => <li key={pr.id}><Link href={`/projects/${pr.id}`} className="hover:text-accent"><span className="font-mono text-xs text-muted">{pr.id}</span> {pr.title}</Link></li>)}
              </ul>
            ) : <p className="text-sm text-muted">None.</p>}
          </Section>
        </div>
      )}

      <Section title="Resources" aside={<Link href={`/resources?phase=${p.id}`} className="text-accent hover:underline">In registry</Link>}>
        {res.length ? (
          <ul className="space-y-1.5 text-sm">
            {res.map((r) => (
              <li key={r.id}>
                <span className="mr-2 text-xs text-muted">{r.group ? `${r.group}, ` : ""}{r.label}</span>
                {r.url ? <ExternalLink href={r.url}>{r.name || r.url}</ExternalLink> : <span>{r.name}</span>}
              </li>
            ))}
          </ul>
        ) : <p className="text-sm text-muted">No resources listed for this phase in the master.</p>}
      </Section>

      <Section><NotesEditor entityId={p.id} title="Phase notes" /></Section>

      <nav className="flex justify-between border-t border-rule pt-4 text-sm" aria-label="Phase navigation">
        {idx > 0 ? <Link className="text-accent hover:underline" href={`/phases/${phases[idx - 1].id}`}>{phases[idx - 1].id} {phases[idx - 1].title}</Link> : <span />}
        {idx < phases.length - 1 ? <Link className="text-right text-accent hover:underline" href={`/phases/${phases[idx + 1].id}`}>{phases[idx + 1].id} {phases[idx + 1].title}</Link> : <span />}
      </nav>
    </>
  );
}
