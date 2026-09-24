import type { Metadata } from "next";
import { PageHeader } from "@/components/ui";
import { NotesView } from "@/components/NotesView";

export const metadata: Metadata = { title: "Notes" };

export default function Page() {
  return (
    <>
      <PageHeader title="Notes" lead="Everything you have written against phases, topics, concepts, weeks, checkpoints and projects, newest first." />
      <NotesView />
    </>
  );
}
