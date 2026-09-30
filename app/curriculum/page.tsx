import type { Metadata } from "next";
import Link from "next/link";
import { phases, stages, topicsOfPhase } from "@/lib/data";
import { PageHeader } from "@/components/ui";
import { CurriculumExplorer, type ExplorerPhase } from "@/components/CurriculumExplorer";

export const metadata: Metadata = { title: "Roadmap" };

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
        lead={<>Every phase of the 206 weeks, in the order you reach them. Open a phase to see its topics. <Link className="text-accent underline underline-offset-2" href="/guide">How status works</Link></>}
      />
      <CurriculumExplorer phases={data} stages={stages.filter((st) => !st.parent).map((st) => ({ id: st.id, name: st.name, range: st.range }))} />
    </>
  );
}
