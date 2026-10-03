import { describe, expect, it } from "vitest";
import { emptyState, type TopicProgress, type UserState } from "@/types/state";
import {
  applyReview, dueReviews, needsPractice, nextReviewAt, RETAIN_FROM_DAYS, undoReview, upcomingReviews,
} from "@/lib/reviews";
import { sanitizeState } from "@/lib/persistence/sanitize";

const I = [2, 7, 30, 90, 180];
const D0 = new Date("2026-10-01T09:00:00Z");
const day = (n: number) => new Date(D0.getTime() + n * 86400000);

const demonstrated = (over: Partial<TopicProgress> = {}): TopicProgress => ({
  mastery: 4, depth: null, evidence: "", demonstratedAt: D0.toISOString(), reviews: { count: 0 }, updatedAt: D0.toISOString(), ...over,
});

describe("schedule", () => {
  it("starts at Demonstrated and follows the intervals from the last re-test", () => {
    expect(nextReviewAt(demonstrated(), I)).toEqual(day(2));
    expect(nextReviewAt(demonstrated({ reviews: { count: 2, last: day(9).toISOString() } }), I)).toEqual(day(39));
    expect(nextReviewAt(demonstrated({ mastery: 3 }), I)).toBeNull();
    expect(nextReviewAt(demonstrated({ reviews: { count: 5 } }), I)).toBeNull();
    expect(nextReviewAt(undefined, I)).toBeNull();
  });

  it("lists due (most overdue first) and upcoming re-tests", () => {
    const s: UserState = { ...emptyState(), topics: { A: demonstrated(), B: demonstrated({ demonstratedAt: day(-5).toISOString() }), C: demonstrated({ demonstratedAt: day(3).toISOString() }), D: demonstrated({ mastery: 2 }) } };
    const due = dueReviews(s, I, day(2));
    expect(due.map((d) => [d.topicId, d.overdueDays])).toEqual([["B", 5], ["A", 0]]);
    expect(upcomingReviews(s, I, day(2), 14).map((d) => d.topicId)).toEqual(["C"]);
  });
});

describe("pass and fail", () => {
  it("a pass advances the step but does not reach Retained before the 30-day interval", () => {
    let tp = demonstrated();
    tp = applyReview(tp, "pass", I, day(2));
    expect(tp).toMatchObject({ mastery: 4, reviews: { count: 1, last: day(2).toISOString() } });
    tp = applyReview(tp, "pass", I, day(9));
    expect(tp.mastery).toBe(4);
    tp = applyReview(tp, "pass", I, day(39));
    expect(RETAIN_FROM_DAYS).toBe(30);
    expect(tp.mastery).toBe(5);
    expect(tp.reviewLog!.map((e) => [e.result, e.intervalDays])).toEqual([["pass", 2], ["pass", 7], ["pass", 30]]);
  });

  it("time passing alone never changes mastery", () => {
    const s: UserState = { ...emptyState(), topics: { A: demonstrated() } };
    dueReviews(s, I, day(400));
    expect(s.topics.A.mastery).toBe(4);
  });

  it("a fail keeps history, drops Retained to Demonstrated, resets to the first interval and flags re-practice", () => {
    const retained = demonstrated({ mastery: 5, reviews: { count: 3, last: day(39).toISOString() } });
    const tp = applyReview(retained, "fail", I, day(130), "forgot the invariant");
    expect(tp.mastery).toBe(4);
    expect(tp.reviews).toEqual({ count: 0, last: day(130).toISOString(), lapses: 1, needsPractice: true });
    expect(tp.reviewLog![0]).toMatchObject({ result: "fail", step: 3, intervalDays: 90, note: "forgot the invariant" });
    expect(nextReviewAt(tp, I)).toEqual(day(132));
    expect(needsPractice({ ...emptyState(), topics: { X: tp } })).toEqual(["X"]);
    const again = applyReview(tp, "pass", I, day(132));
    expect(again.reviews.needsPractice).toBeUndefined();
    expect(again.reviews.lapses).toBe(1);
    expect(again.mastery).toBe(4); // a 2-day pass does not restore Retained
  });

  it("does nothing below Demonstrated", () => {
    const tp = demonstrated({ mastery: 3 });
    expect(applyReview(tp, "pass", I, day(2))).toBe(tp);
  });

  it("undo restores exactly what the last result changed", () => {
    const start = demonstrated({ mastery: 5, reviews: { count: 3, last: day(39).toISOString() } });
    const failed = applyReview(start, "fail", I, day(130));
    const undone = undoReview(failed, day(131));
    expect(undone.mastery).toBe(5);
    expect(undone.reviews).toEqual(start.reviews);
    expect(undone.reviewLog).toEqual([]);
    expect(undoReview(start, day(1))).toBe(start);
  });

  it("the review log survives storage validation, and bad entries are reported", () => {
    const tp = applyReview(demonstrated(), "pass", I, day(2));
    const { state, issues } = sanitizeState({ topics: { A: { ...tp, reviewLog: [...tp.reviewLog!, { nope: 1 }] } } });
    expect(state.topics.A.reviewLog).toHaveLength(1);
    expect(state.topics.A.reviewLog![0].prev?.reviews).toEqual({ count: 0 });
    expect(issues.filter((i) => i.dropped)).toHaveLength(1);
  });
});
