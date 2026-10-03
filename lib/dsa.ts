import type { DsaAttempt, DsaMistake, DsaProblem, DsaStatus } from "@/types/state";
import { localDay } from "@/lib/today";

/**
 * DSA re-solve scheduling, pure. A problem keeps coming back until it is solved
 * cleanly (alone, no hints) several times in a row:
 * - any attempt that is not clean -> re-solve in 3 days, streak reset;
 * - clean attempts -> 14 days, then 30 days; the third consecutive clean solve retires it.
 * `revisitOn` (the v1 field) holds the next date, so Today and older views keep working.
 */

export const RESOLVE_INTERVALS = [3, 14, 30];
export const CLEAN_TO_RETIRE = 3;

export const OUTCOMES: { id: DsaAttempt["outcome"]; label: string }[] = [
  { id: "clean", label: "Clean: alone, no hints" },
  { id: "with_help", label: "With help or hints" },
  { id: "failed", label: "Not solved" },
];

export const MISTAKES: { id: DsaMistake; label: string }[] = [
  { id: "pattern", label: "Did not recognise the pattern" },
  { id: "edge-case", label: "Missed an edge case" },
  { id: "off-by-one", label: "Off-by-one / boundaries" },
  { id: "complexity", label: "Too slow (complexity)" },
  { id: "implementation", label: "Implementation bug" },
  { id: "misread", label: "Misread the problem" },
  { id: "syntax", label: "Syntax / API recall" },
  { id: "other", label: "Other" },
];

export const mistakeLabel = (m: DsaMistake) => MISTAKES.find((x) => x.id === m)?.label ?? m;

/** Clean attempts at the end of the log, uninterrupted by a non-clean one. */
export function cleanStreak(log: DsaAttempt[] | undefined): number {
  let n = 0;
  for (let i = (log ?? []).length - 1; i >= 0; i--) {
    if (log![i].outcome !== "clean") break;
    n++;
  }
  return n;
}

const STATUS_FOR: Record<DsaAttempt["outcome"], DsaStatus> = { clean: "solved", with_help: "solved_with_help", failed: "attempted" };

export function logAttempt(p: DsaProblem, attempt: Omit<DsaAttempt, "at">, at: Date): DsaProblem {
  const entry: DsaAttempt = { at: at.toISOString(), outcome: attempt.outcome };
  if (attempt.mistake && attempt.outcome !== "clean") entry.mistake = attempt.mistake;
  if (attempt.minutes && attempt.minutes > 0) entry.minutes = Math.round(attempt.minutes);
  if (attempt.note?.trim()) entry.note = attempt.note.trim();
  const attemptLog = [...(p.attemptLog ?? []), entry];
  const streak = cleanStreak(attemptLog);
  const days = attempt.outcome !== "clean" ? RESOLVE_INTERVALS[0] : streak >= CLEAN_TO_RETIRE ? null : RESOLVE_INTERVALS[Math.min(streak, RESOLVE_INTERVALS.length - 1)];
  const next: DsaProblem = {
    ...p,
    attemptLog,
    attempts: p.attempts + 1,
    status: STATUS_FOR[attempt.outcome],
    revisitOn: days === null ? null : localDay(new Date(at.getTime() + days * 86400000)),
    updatedAt: at.toISOString(),
  };
  if (attempt.outcome === "clean") next.cleanSolvedAt = at.toISOString();
  return next;
}

/** Problems due to re-solve on `day` (YYYY-MM-DD), not-yet-clean ones first, then oldest due. */
export function dueResolves(problems: DsaProblem[], day: string): DsaProblem[] {
  return problems
    .filter((p) => p.revisitOn && p.revisitOn.slice(0, 10) <= day)
    .sort((a, b) => Number(a.status === "solved") - Number(b.status === "solved") || (a.revisitOn ?? "").localeCompare(b.revisitOn ?? ""));
}

/** How often each mistake type appears across all attempts, most frequent first. */
export function mistakeCounts(problems: DsaProblem[]): [DsaMistake, number][] {
  const m = new Map<DsaMistake, number>();
  problems.forEach((p) => (p.attemptLog ?? []).forEach((a) => a.mistake && m.set(a.mistake, (m.get(a.mistake) ?? 0) + 1)));
  return [...m.entries()].sort((a, b) => b[1] - a[1]);
}
