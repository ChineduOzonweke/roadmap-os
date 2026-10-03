"use client";

import { useState } from "react";
import { useHydrated, useUserState } from "@/lib/store";
import { buildPortfolio, portfolioFilename, type PortfolioFormat } from "@/lib/portfolio";
import { evidenceFor } from "@/lib/evidence";
import type { RequirementGroup } from "@/lib/projectSpec";
import { downloadText } from "./BackupPanel";
import { Markdown } from "./Markdown";

/** README / case-study draft generated from the project record. Copy or download as Markdown. */
export function PortfolioExport({ project, requirements }: {
  project: { id: string; title: string; purpose: string; milestones: { id: string; text: string }[] };
  requirements: RequirementGroup[];
}) {
  const s = useUserState();
  const ready = useHydrated();
  const [format, setFormat] = useState<PortfolioFormat>("readme");
  const [view, setView] = useState<"rendered" | "markdown">("rendered");
  const [copied, setCopied] = useState(false);
  if (!ready) return null;
  const p = s.projects[project.id];
  const custom = p?.customMilestones ?? [];
  const labels = new Map([...project.milestones, ...custom].map((m) => [m.id, m.text]));
  const subjects = [project.id, ...labels.keys()];
  const { markdown, gaps } = buildPortfolio(
    { project, progress: p, requirements, evidence: evidenceFor(s, subjects), labelOf: (id) => labels.get(id) ?? id },
    format,
  );
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(markdown);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setView("markdown");
    }
  };
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex gap-2" role="group" aria-label="Export format">
          <button type="button" className="chip" aria-pressed={format === "readme"} onClick={() => setFormat("readme")}>README</button>
          <button type="button" className="chip" aria-pressed={format === "case-study"} onClick={() => setFormat("case-study")}>Case study</button>
        </div>
        <div className="ml-auto flex gap-2">
          <button type="button" className="btn btn-secondary btn-sm" onClick={copy}>{copied ? "Copied" : "Copy Markdown"}</button>
          <button type="button" className="btn btn-secondary btn-sm" onClick={() => downloadText(portfolioFilename(project.id, project.title, format), markdown)}>Download .md</button>
        </div>
      </div>
      <p className="text-xs text-muted">Built only from what you recorded above. Empty sections are left out rather than filled with generic text.</p>
      {gaps.length > 0 && (
        <p className="rounded-lg bg-surface-2 px-3 py-2 text-sm">
          <span className="text-muted">Not recorded yet:</span> {gaps.join(", ")}.
        </p>
      )}
      <div className="flex gap-2" role="group" aria-label="Preview">
        <button type="button" className="chip" aria-pressed={view === "rendered"} onClick={() => setView("rendered")}>Preview</button>
        <button type="button" className="chip" aria-pressed={view === "markdown"} onClick={() => setView("markdown")}>Markdown</button>
      </div>
      {view === "rendered" ? (
        // Headings are demoted two levels in the preview only, so the draft's "# Title" does not become a second h1 on the page.
        <div className="card max-h-[32rem] overflow-auto p-4 scroll-thin" role="region" aria-label="Rendered preview">
          <Markdown md={markdown.replace(/^(#{1,4}) /gm, "$1## ")} />
        </div>
      ) : (
        <textarea readOnly value={markdown} rows={16} className="input font-mono text-xs leading-relaxed" aria-label="Generated Markdown" onFocus={(e) => e.currentTarget.select()} />
      )}
    </div>
  );
}
