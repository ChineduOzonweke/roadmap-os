import type { Metadata } from "next";
import Link from "next/link";
import { getCheckpoint, meta, tracks } from "@/lib/data";
import { Markdown } from "@/components/Markdown";
import { PageHeader, Section } from "@/components/ui";
import { GateBadge } from "@/components/progress";
import { ApplicationsSection, PortfolioSection, StoriesSection, TracksSection } from "@/components/CareerView";

export const metadata: Metadata = { title: "Career" };

export default function Page() {
  const c7 = getCheckpoint("C7")!;
  const bodies = Object.fromEntries(tracks.map((t) => [t.id, <Markdown key={t.id} md={t.bodyMd} />]));
  return (
    <>
      <PageHeader
        title="Career preparation"
        lead="The master's eleven continuous tracks, run alongside the curriculum rather than after it. DSA practice lives in its own journal; projects carry their own portfolio checklist."
      >
        <nav className="flex flex-wrap gap-2 text-sm" aria-label="Career sections">
          {[["#tracks", "Tracks"], ["#portfolio", "Portfolio"], ["#stories", "Story bank"], ["#applications", "Applications"]].map(([h, l]) => (
            <a key={h} href={h} className="chip">{l}</a>
          ))}
          <Link href="/dsa" className="chip">DSA journal</Link>
          <Link href="/projects" className="chip">Projects</Link>
        </nav>
      </PageHeader>

      <Section title="Interview readiness">
        <div className="flex flex-wrap items-center gap-3 card p-4 text-sm">
          <Link href="/checkpoints/C7" className="font-medium hover:text-accent">C7 {c7.title}</Link>
          <GateBadge gateId="C7" />
          <span className="w-full text-muted">{c7.note}</span>
        </div>
      </Section>

      <Section title="Tracks" id="tracks"><TracksSection tracks={tracks.map(({ id, title, activation, items }) => ({ id, title, activation, items }))} bodies={bodies} /></Section>
      <Section title="Portfolio stages" id="portfolio"><PortfolioSection stages={meta.portfolioStages} /></Section>
      <Section title="Behavioural story bank" id="stories"><StoriesSection themes={meta.storyThemes} /></Section>
      <Section title="Applications and internships" id="applications"><ApplicationsSection /></Section>
    </>
  );
}
