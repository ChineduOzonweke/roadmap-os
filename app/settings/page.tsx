import type { Metadata } from "next";
import { checkpoints, concepts, meta, phases, projects, resources, topics, weeks } from "@/lib/data";
import { PageHeader } from "@/components/ui";
import { SettingsView } from "@/components/SettingsView";

export const metadata: Metadata = { title: "Settings" };

export default function Page() {
  const counts = `${phases.length} phases, ${topics.filter((t) => t.kind === "concepts").length} topics, ${concepts.length} checklist items, ${weeks.length} weeks, ${checkpoints.length} gates, ${projects.length} projects, ${resources.length} resources.`;
  return (
    <>
      <PageHeader title="Settings" />
      <SettingsView dataInfo={{ md5: meta.source.md5, generated: meta.source.generated, counts }} />
    </>
  );
}
