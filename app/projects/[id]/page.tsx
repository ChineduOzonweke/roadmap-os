import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProject, getTopic, meta, projects, refLabel, resources } from "@/lib/data";
import { Markdown } from "@/components/Markdown";
import { ExternalLink, PageHeader, Section } from "@/components/ui";
import { NotesEditor, TopicStatus } from "@/components/progress";
import { ProjectControls } from "@/components/ProjectControls";
import { parseRequirements } from "@/lib/projectSpec";
import { PortfolioExport } from "@/components/PortfolioExport";
import { Tutor } from "@/components/Tutor";
import { RefId } from "@/components/Ref";

export const dynamicParams = false;
export function generateStaticParams() {
  return projects.map((p) => ({ id: p.id }));
}
type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const p = getProject(id);
  return { title: p ? `${p.id} ${p.title}` : "Project" };
}

const GROUP_LABEL = { general: "Every project", ml: "ML projects", ai: "AI projects" } as const;

export default async function Page({ params }: Props) {
  const { id } = await params;
  const p = getProject(id);
  if (!p) notFound();
  const quality = p.qualityProfile.flatMap((g) => meta.quality[g].map((text, i) => ({ key: `${g}-${i + 1}`, group: GROUP_LABEL[g], text })));
  const requirements = parseRequirements(p.bodyMd);
  const phasesUsed = Array.from(new Set(p.relatedTopics.map((t) => t.split(".")[0])));
  const res = resources.filter((r) => r.url && r.phaseId && phasesUsed.includes(r.phaseId) && (r.label === "BUILD" || r.label === "PROJECT")).slice(0, 12);
  return (
    <>
      <PageHeader
        meta={<><Link href="/projects" className="hover:text-accent">Projects</Link><RefId id={p.id} /></>}
        title={p.title}
        lead={p.purpose}
      />
      <div className="mb-8 grid grid-cols-1 gap-3 text-sm sm:grid-cols-3">
        <div><p className="t-eyebrow mb-1">Evidence for</p><p>{p.evidenceFor.split(/,\s*/).map((e) => refLabel(e.trim()).label).join(", ")}</p></div>
        <div><p className="t-eyebrow mb-1">Build weeks</p><p className="t-data -mx-1">{p.buildWeeks.map((w) => <Link key={w} className="inline-block min-h-6 px-1 hover:text-accent" href={`/weeks/${w}`}>{w}</Link>)}</p></div>
        <div><p className="t-eyebrow mb-1">Requires</p><p>{p.requires.map((r, i) => { const x = refLabel(r); return <span key={r}>{i > 0 && ", "}{x.href ? <Link className="hover:text-accent" href={x.href}>{x.label}</Link> : x.label}</span>; })}</p></div>
      </div>

      <Section title="Your project record">
        <ProjectControls
          id={p.id}
          title={p.title}
          milestones={p.milestones}
          quality={quality}
          requirements={requirements}
          focus={p.qualityProfile.some((g) => g === "ml" || g === "ai") ? "ml" : "general"}
        />
      </Section>

      <Section><Tutor scope={{ projectId: p.id }} /></Section>

      <Section title="README and case study">
        <PortfolioExport project={{ id: p.id, title: p.title, purpose: p.purpose, milestones: p.milestones }} requirements={requirements} />
      </Section>

      <Section title="Master specification">
        <div className="card p-4"><Markdown md={p.bodyMd} /></div>
      </Section>

      <Section title="Curriculum it draws on">
        <ul className="space-y-1.5 text-sm">
          {p.relatedTopics.map((tid) => {
            const t = getTopic(tid);
            return t ? (
              <li key={tid} className="flex flex-wrap items-center gap-2">
                <Link href={`/topics/${tid}`} className="min-w-0 flex-1 hover:text-accent"><RefId id={tid} /> {t.label}</Link>
                <TopicStatus topicId={tid} />
              </li>
            ) : null;
          })}
        </ul>
      </Section>

      <Section title="Deep-dive questions (master interview track)">
        <p className="mb-2 text-sm text-muted">You should be able to answer these about this project without notes.</p>
        <ol className="mb-4 list-decimal space-y-0.5 pl-5 text-sm">{meta.deepDiveQuestions.map((q) => <li key={q}>{q}</li>)}</ol>
        <NotesEditor entityId={p.id} title="Project notes and deep-dive answers" />
      </Section>

      {res.length > 0 && (
        <Section title="Build resources from its phases">
          <ul className="space-y-1 text-sm">{res.map((r) => <li key={r.id}><span className="mr-2 text-xs text-muted">{r.phaseId}</span><ExternalLink href={r.url!}>{r.name || r.url}</ExternalLink></li>)}</ul>
        </Section>
      )}
    </>
  );
}
