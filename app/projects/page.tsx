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
            <Link href={`/projects/${p.id}`} className="flex items-start gap-4 px-4 py-4 transition-colors hover:bg-surface-2 sm:items-center">
              <span className="t-data w-7 shrink-0 pt-0.5 text-sm text-faint sm:pt-0">{String(p.number).padStart(2, "0")}</span>
              <span className="min-w-0 flex-1">
                <span className="block text-[1.0625rem] font-medium leading-snug">{p.title} <RefId id={p.id} /></span>
                <span className="mt-0.5 block text-sm text-muted">Evidence for {p.evidenceFor}</span>
                <span className="t-data mt-1 block text-xs text-faint sm:hidden">Weeks {p.buildWeeks[0]}–{p.buildWeeks[p.buildWeeks.length - 1]}</span>
              </span>
              <span className="t-data hidden shrink-0 text-xs text-faint sm:block">Weeks {p.buildWeeks[0]}–{p.buildWeeks[p.buildWeeks.length - 1]}</span>
              <span className="shrink-0"><ProjectStatusBadge id={p.id} /></span>
            </Link>
          </li>
        ))}
      </ol>
    </>
  );
}
