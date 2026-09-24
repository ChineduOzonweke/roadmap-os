import type { Metadata } from "next";
import { checkpoints, phases } from "@/lib/data";
import { PageHeader } from "@/components/ui";
import { DependencyGraph, type GraphNode } from "@/components/DependencyGraph";

export const metadata: Metadata = { title: "Dependencies" };

export default function Page() {
  const phaseIds = new Set(phases.map((p) => p.id));
  const gateIds = new Set(phases.flatMap((p) => p.prerequisites.map((q) => q.id)).filter((id) => !phaseIds.has(id)));
  const nodes: GraphNode[] = [
    ...phases.map((p) => ({ id: p.id, title: p.title, stages: p.stages, weekRange: p.weekRange, prereqs: p.prerequisites.map((q) => q.id), kind: "phase" as const })),
    // Checkpoints that act as phase prerequisites (C5 for P40–P42) become nodes fed by the phases they test.
    ...checkpoints.filter((c) => gateIds.has(c.id)).map((c) => ({
      id: c.id,
      title: c.title,
      stages: [],
      weekRange: c.gateWeek ? ([c.gateWeek, c.gateWeek] as [number, number]) : null,
      prereqs: Array.from(new Set(c.requires.map((r) => r.split(".")[0]).filter((x) => phaseIds.has(x)))),
      kind: "gate" as const,
    })),
  ];
  return (
    <>
      <PageHeader
        title="Dependencies"
        lead="Phase-level prerequisites from the master (timeline, learning sequence, dependency spine, phase gates and decision 5). Topic-level edges and gates are shown on each topic page."
      />
      <DependencyGraph nodes={nodes} />
    </>
  );
}
