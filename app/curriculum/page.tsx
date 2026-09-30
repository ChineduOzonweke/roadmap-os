import type { Metadata } from "next";
import Link from "next/link";
import { meta, phases, topicsOfPhase } from "@/lib/data";
import { PageHeader } from "@/components/ui";
import { CurriculumExplorer, type ExplorerPhase } from "@/components/CurriculumExplorer";

export const metadata: Metadata = { title: "Phases" };

export default function Page() {
  const data: ExplorerPhase[] = phases.map((p) => ({
    id: p.id,
    title: p.title,
    priority: p.priority,
    target: p.target,
    description: p.description,
    weekRange: p.weekRange,
    stages: p.stages,
    placement: p.placement,
    topics: topicsOfPhase(p.id)
      .filter((t) => t.kind === "concepts")
      .map((t) => ({
        id: t.id,
        label: t.label,
        depth: t.depth ? `D${t.depth.min}${t.depth.max !== t.depth.min ? `–D${t.depth.max}` : ""}` : "",
        firstWeek: t.firstWeek,
        items: t.conceptIds.length,
        indent: !!t.parentId,
      })),
  }));
  return (
    <>
      <PageHeader
        title="Roadmap"
        lead={<>46 phases from the master roadmap. Open a phase to see its topics, then a topic to see its checklist, mastery criteria and dependencies. Locked content stays readable: locked only means you are not cleared to work on it yet. <Link className="text-accent underline" href="/guide">How status works</Link>.</>}
      />
      <CurriculumExplorer phases={data} />
      <p className="mt-6 text-xs text-muted [overflow-wrap:anywhere]">Source: {meta.source.file}, MD5 {meta.source.md5}.</p>
    </>
  );
}
