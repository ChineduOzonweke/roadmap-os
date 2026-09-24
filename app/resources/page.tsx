import type { Metadata } from "next";
import { Suspense } from "react";
import { phases, resources, tools } from "@/lib/data";
import { PageHeader } from "@/components/ui";
import { ResourceBrowser } from "@/components/ResourceBrowser";

export const metadata: Metadata = { title: "Resources" };

export default function Page() {
  return (
    <>
      <PageHeader
        title="Resources"
        lead="Every resource and tool from the master resource map, with the original URLs. Mark what you are using; the status is yours, the registry is canonical."
      />
      <Suspense fallback={<div className="h-64 animate-pulse rounded-lg bg-surface-2" aria-label="Loading resources" />}>
        <ResourceBrowser resources={resources} tools={tools} phases={phases.map((p) => ({ id: p.id, title: p.title }))} />
      </Suspense>
    </>
  );
}
