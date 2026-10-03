import type { EvidenceItem, EvidenceKind, UserState } from "@/types/state";

/**
 * Evidence is proof of competency, kept separate from completion (ticks and
 * statuses). Each item supports one subject: a topic (P13.2), a project (PR03),
 * a project milestone (PR03-M2 or a custom milestone id), or a checkpoint (C1).
 * Files are referenced by link; browser storage is not a place for binaries.
 */

export const EVIDENCE_KINDS: { id: EvidenceKind; label: string; hint: string }[] = [
  { id: "repo", label: "Repository", hint: "GitHub repository" },
  { id: "commit", label: "Commit / PR", hint: "A specific commit or pull request" },
  { id: "exercise", label: "Exercise", hint: "Unseen exercise or problem solved without notes" },
  { id: "explanation", label: "Written explanation", hint: "The mechanism in your own words" },
  { id: "test", label: "Test result", hint: "Test suite, coverage, CI run" },
  { id: "benchmark", label: "Benchmark / metric", hint: "Measured numbers and how they were measured" },
  { id: "diagram", label: "Architecture diagram", hint: "Link to the diagram" },
  { id: "note", label: "Technical note", hint: "Design note, debugging write-up" },
  { id: "retest", label: "Re-test result", hint: "A later re-demonstration" },
  { id: "screenshot", label: "Screenshot / artifact", hint: "Link to the image or file" },
  { id: "deploy", label: "Deployed URL", hint: "Live demo or service" },
  { id: "other", label: "Other", hint: "" },
];

export const kindLabel = (k: EvidenceKind) => EVIDENCE_KINDS.find((x) => x.id === k)?.label ?? "Evidence";

/** Evidence for any of the given subjects, newest first. */
export function evidenceFor(s: UserState, subjects: string[]): EvidenceItem[] {
  const set = new Set(subjects);
  return s.evidence.filter((e) => set.has(e.subject)).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export const isUrl = (u: string) => /^https?:\/\/\S+$/i.test(u.trim());
