import type { Metadata } from "next";
import Link from "next/link";
import { concepts, getTopic, meta, resources } from "@/lib/data";
import { PageHeader } from "@/components/ui";
import { DsaJournal, type Pattern } from "@/components/DsaJournal";

export const metadata: Metadata = { title: "DSA journal" };

const PATTERN_TOPICS = ["P04.6", "P04.5", "P04.2", "P04.3", "P04.4"];

export default function Page() {
  const patterns: Pattern[] = PATTERN_TOPICS.flatMap((tid) => {
    const t = getTopic(tid)!;
    return concepts.filter((c) => c.topicId === tid).map((c) => ({ id: c.id, text: c.text.replace(/`/g, ""), topicId: tid, topicLabel: `${tid} ${t.label}` }));
  });
  const practice = resources.filter((r) => r.phaseId === "P04" && r.url).map((r) => ({ id: r.id, name: r.name, url: r.url! }));
  const laneNote = meta.dsaLane.map((l) => `Weeks ${l.from}${l.to ? `–${l.to}` : " onward"}: ${l.note}`).join(" ");
  return (
    <>
      <PageHeader
        title="DSA journal"
        lead={<>Problems, the patterns they practise, and the mistakes behind them. Tag each problem with patterns from <Link className="text-accent underline underline-offset-2" href="/topics/P04.6">Problem-solving patterns</Link> and the data-structure topics, and it shows up on those topic pages.</>}
      />
      <DsaJournal patterns={patterns} practice={practice} laneNote={laneNote} />
    </>
  );
}
