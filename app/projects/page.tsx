import type { Metadata } from "next";
import Link from "next/link";
import { projects } from "@/lib/data";
import { PageHeader } from "@/components/ui";
import { ProjectStatusBadge } from "@/components/ProjectControls";
import { RefId } from "@/components/Ref";

export const metadata: Metadata = { title: "Projects" };

export default function Page() {
  return (
    <>
      <PageHeader title="Projects" lead="The 11 canonical projects from the master project ladder. Each one is evidence for specific phases and checkpoints." />
      <ol className="list-card">
        {projects.map((p) => (
          <li key={p.id}>
            <Link href={`/projects/${p.id}`} className="flex flex-col gap-1 px-4 py-3 hover:bg-surface-2 sm:flex-row sm:items-center sm:gap-4">
              <span className="min-w-0 flex-1">
                <RefId id={p.id} /> <span className="font-medium">{p.title}</span>
                <span className="block text-sm text-muted">Evidence for {p.evidenceFor}</span>
              </span>
              <span className="shrink-0 text-sm tabular-nums text-muted">Weeks {p.buildWeeks[0]}–{p.buildWeeks[p.buildWeeks.length - 1]}</span>
              <span className="shrink-0"><ProjectStatusBadge id={p.id} /></span>
            </Link>
          </li>
        ))}
      </ol>
    </>
  );
}
