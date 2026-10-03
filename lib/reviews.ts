import type { MasteryLevel, ReviewEntry, TopicProgress, UserState } from "@/types/state";

/**
 * Spaced re-test scheduling (master spaced-retest rule), pure and deterministic.
 *
 * - The queue starts when a topic reaches Demonstrated (`demonstratedAt`).
 * - `reviews.count` is the step: the index of the next interval to wait for.
 *   Next due = (last review, or demonstratedAt) + intervals[step] days.
 * - PASS: step + 1. Mastery becomes Retained only when the pass lands on an
 *   interval of RETAIN_FROM_DAYS or more; time passing alone never promotes.
 * - FAIL: the history is kept, Retained drops back to Demonstrated, the step
 *   resets to the first interval, and the topic is flagged for re-practice.
 */

export const RETAIN_FROM_DAYS = 30;
const DAY = 86400000;

export function intervalAt(intervals: number[], step: number): number | null {
  return step < intervals.length ? intervals[step] : null;
}

export function nextReviewAt(tp: TopicProgress | undefined, intervals: number[]): Date | null {
  if (!tp || tp.mastery < 4 || !tp.demonstratedAt) return null;
  const days = intervalAt(intervals, tp.reviews?.count ?? 0);
  if (days === null) return null;
  const base = new Date(tp.reviews?.last ?? tp.demonstratedAt);
  return new Date(base.getTime() + days * DAY);
}

export type DueReview = {
  topicId: string;
  due: Date;
  step: number; // 0-based; "re-test step + 1 of intervals.length"
  intervalDays: number;
  overdueDays: number;
  needsPractice: boolean;
  lapses: number;
};

function toDue(topicId: string, tp: TopicProgress, intervals: number[], at: Date): DueReview | null {
  const due = nextReviewAt(tp, intervals);
  if (!due) return null;
  const step = tp.reviews?.count ?? 0;
  return {
    topicId,
    due,
    step,
    intervalDays: intervals[step],
    overdueDays: Math.max(0, Math.floor((at.getTime() - due.getTime()) / DAY)),
    needsPractice: !!tp.reviews?.needsPractice,
    lapses: tp.reviews?.lapses ?? 0,
  };
}

/** Due now or overdue, most overdue first. */
export function dueReviews(s: UserState, intervals: number[], at = new Date()): DueReview[] {
  return Object.entries(s.topics)
    .map(([id, tp]) => toDue(id, tp, intervals, at))
    .filter((d): d is DueReview => !!d && d.due <= at)
    .sort((a, b) => a.due.getTime() - b.due.getTime());
}

/** Scheduled within the next `days` days (not yet due), soonest first. */
export function upcomingReviews(s: UserState, intervals: number[], at = new Date(), days = 14): DueReview[] {
  const until = at.getTime() + days * DAY;
  return Object.entries(s.topics)
    .map(([id, tp]) => toDue(id, tp, intervals, at))
    .filter((d): d is DueReview => !!d && d.due > at && d.due.getTime() <= until)
    .sort((a, b) => a.due.getTime() - b.due.getTime());
}

/** Topics whose last re-test failed and that have not passed one since. */
export function needsPractice(s: UserState): string[] {
  return Object.entries(s.topics).filter(([, tp]) => tp.mastery >= 4 && tp.reviews?.needsPractice).map(([id]) => id);
}

/** Apply a re-test result. Returns the topic unchanged when it is not in the review queue (below Demonstrated). */
export function applyReview(tp: TopicProgress, result: "pass" | "fail", intervals: number[], at: Date, note = ""): TopicProgress {
  if (tp.mastery < 4) return tp;
  const step = tp.reviews?.count ?? 0;
  const days = intervalAt(intervals, step) ?? intervals[intervals.length - 1] ?? 0;
  const iso = at.toISOString();
  let mastery: MasteryLevel = tp.mastery;
  let reviews: TopicProgress["reviews"];
  if (result === "pass") {
    if (mastery === 4 && days >= RETAIN_FROM_DAYS) mastery = 5;
    reviews = { ...tp.reviews, count: step + 1, last: iso };
    delete reviews.needsPractice;
  } else {
    if (mastery === 5) mastery = 4;
    reviews = { ...tp.reviews, count: 0, last: iso, lapses: (tp.reviews?.lapses ?? 0) + 1, needsPractice: true };
  }
  const entry: ReviewEntry = {
    at: iso,
    result,
    step,
    intervalDays: days,
    ...(note.trim() ? { note: note.trim() } : {}),
    prev: { mastery: tp.mastery, reviews: tp.reviews },
  };
  return { ...tp, mastery, reviews, reviewLog: [...(tp.reviewLog ?? []), entry], updatedAt: iso };
}

/** Undo the most recent re-test, restoring exactly what it changed. */
export function undoReview(tp: TopicProgress, at: Date): TopicProgress {
  const log = tp.reviewLog ?? [];
  const last = log[log.length - 1];
  if (!last?.prev) return tp;
  return { ...tp, mastery: last.prev.mastery, reviews: last.prev.reviews, reviewLog: log.slice(0, -1), updatedAt: at.toISOString() };
}
