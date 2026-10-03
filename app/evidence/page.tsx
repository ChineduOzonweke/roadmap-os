import type { Metadata } from "next";
import { PageHeader } from "@/components/ui";
import { EvidenceView } from "@/components/EvidenceView";

export const metadata: Metadata = { title: "Evidence" };

export default function Page() {
  return (
    <>
      <PageHeader title="Evidence" lead="Proof of competency, separate from ticks: what you can show, not what you finished." />
      <EvidenceView />
    </>
  );
}
