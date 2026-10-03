"use client";

import Link from "next/link";
import { useState } from "react";
import { useUserState } from "@/lib/store";
import { recordReview, undoLastReview } from "@/lib/actions";
import { idx, topicById } from "@/lib/progress";
import { dueReviews, nextReviewAt, RETAIN_FROM_DAYS, type DueReview } from "@/lib/reviews";
import type { ReviewEntry, TopicProgress } from "@/types/state";
import { cx } from "./ui";

const fmt = (d: Date | string) => new Date(d).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });
const label = (days: number) => (days >= 180 ? "6-month" : days >= 90 ? "90-day" : `${days}-day`);

function promotes(tp: TopicProgress | undefined, step: number): boolean {
  return !!tp && tp.mastery === 4 && (idx.retest[step] ?? 0) >= RETAIN_FROM_DAYS;
}

/** Pass/fail controls with an optional note on failure. Shared by the queue and the topic panel. */
function ReviewButtons({ topicId, onDone }: { topicId: string; onDone?: (r: "pass" | "fail") => void }) {
  const [failing, setFailing] = useState(false);
  const [note, setNote] = useState("");
  if (failing) {
    return (
      <div className="w-full space-y-2">
        <label className="block text-sm">
          <span className="mb-1 block text-muted">What broke? (optional, kept with the result)</span>
          <input className="input text-sm" value={note} onChange={(e) => setNote(e.target.value)} placeholder="e.g. could not write the recursion without notes" autoFocus />
        </label>
        <div className="flex flex-wrap gap-2">
          <button type="button" className="btn btn-danger btn-sm" onClick={() => { recordReview(topicId, "fail", note); setFailing(false); setNote(""); onDone?.("fail"); }}>Record failed re-test</button>
          <button type="button" className="btn btn-quiet btn-sm" onClick={() => setFailing(false)}>Cancel</button>
        </div>
      </div>
    );
  }
  return (
    <div className="flex shrink-0 gap-2">
      <button type="button" className="btn btn-secondary btn-sm" onClick={() => { recordReview(topicId, "pass"); onDone?.("pass"); }}>Passed</button>
      <button type="button" className="btn btn-quiet btn-sm" onClick={() => setFailing(true)}>Failed</button>
    </div>
  );
}

function QueueItem({ d, tp, onDone }: { d: DueReview; tp: TopicProgress; onDone: (r: "pass" | "fail") => void }) {
  const t = topicById.get(d.topicId);
  return (
    <li className="space-y-2 px-4 py-3">
      <div className="flex flex-wrap items-start gap-x-3 gap-y-2">
        <div className="min-w-0 flex-1">
          <Link href={`/topics/${d.topicId}`} className="font-medium hover:text-accent">{t?.t ?? d.topicId}</Link>
          <p className="text-xs text-muted">
            {label(d.intervalDays)} re-test ({d.step + 1} of {idx.retest.length})
            {d.overdueDays > 0 && `, ${d.overdueDays} day${d.overdueDays > 1 ? "s" : ""} overdue`}
            {d.needsPractice && ", re-practise first: last re-test failed"}
          </p>
        </div>
        <ReviewButtons topicId={d.topicId} onDone={onDone} />
      </div>
      {promotes(tp, d.step) && <p className="text-xs text-muted">Passing this one moves the topic to Retained.</p>}
    </li>
  );
}

/** "Due for review today": every re-test that is due, with an evidence-oriented pass/fail. Renders nothing when none are due. */
export function ReviewQueue() {
  const s = useUserState();
  const [last, setLast] = useState<{ topicId: string; result: "pass" | "fail" } | null>(null);
  const due = dueReviews(s, idx.retest);
  if (!due.length && !last) return null;
  const lastTp = last ? s.topics[last.topicId] : undefined;
  const lastNext = lastTp ? nextReviewAt(lastTp, idx.retest) : null;
  return (
    <section aria-labelledby="reviews-h" id="reviews" className="scroll-mt-20">
      <h2 id="reviews-h" className="h-section mb-1">Due for review today</h2>
      <p className="mb-2 text-sm text-muted">Re-demonstrate without notes: an unseen exercise, a re-implementation, or explaining the mechanism. Pass only if it held up.</p>
      {due.length > 0 && (
        <ul className="list-card">
          {due.map((d) => <QueueItem key={d.topicId} d={d} tp={s.topics[d.topicId]} onDone={(r) => setLast({ topicId: d.topicId, result: r })} />)}
        </ul>
      )}
      {last && (
        <p role="status" className="mt-2 flex flex-wrap items-center gap-x-2 text-sm">
          <span>
            {last.result === "pass" ? "Passed" : "Failed, scheduled for re-practice"}: {topicById.get(last.topicId)?.t}.
            {lastNext ? ` Next re-test ${fmt(lastNext)}.` : " No more scheduled re-tests."}
          </span>
          <button type="button" className="btn btn-quiet btn-sm" onClick={() => { undoLastReview(last.topicId); setLast(null); }}>Undo</button>
        </p>
      )}
      {!due.length && last && <p className="mt-1 text-sm text-muted">Nothing else is due today.</p>}
    </section>
  );
}

function HistoryRow({ e }: { e: ReviewEntry }) {
  return (
    <li className="flex flex-wrap gap-x-2 text-sm">
      <span className="tabular-nums text-muted">{fmt(e.at)}</span>
      <span className={e.result === "pass" ? "text-ok" : "text-danger"}>{e.result === "pass" ? "Passed" : "Failed"}</span>
      <span className="text-muted">{label(e.intervalDays)} re-test</span>
      {e.note && <span className="w-full text-muted">{e.note}</span>}
    </li>
  );
}

/** Topic page: where the topic is in its re-test schedule, the history, and pass/fail. */
export function ReviewPanel({ topicId }: { topicId: string }) {
  const s = useUserState();
  const tp = s.topics[topicId];
  const log = tp?.reviewLog ?? [];
  if (!tp || tp.mastery < 4) {
    if (!log.length) return null;
    return (
      <div className="rounded-xl border border-rule bg-surface px-4 py-3">
        <p className="text-sm font-medium">Re-test history</p>
        <p className="text-sm text-muted">Re-tests resume when this topic is back at Demonstrated.</p>
        <ul className="mt-2 space-y-1">{[...log].reverse().map((e, i) => <HistoryRow key={e.at + i} e={e} />)}</ul>
      </div>
    );
  }
  const step = tp.reviews?.count ?? 0;
  const next = nextReviewAt(tp, idx.retest);
  const isDue = !!next && next <= new Date();
  return (
    <div className="rounded-xl border border-rule bg-surface px-4 py-3 text-sm">
      <p className="font-medium">Spaced re-test</p>
      <ol className="mt-2 flex gap-1" aria-label="Re-test schedule">
        {idx.retest.map((d, i) => (
          <li key={d} className="min-w-0 flex-1 text-center">
            <span className={cx("block h-1.5 rounded-full", i < step ? "bg-ok" : i === step ? "bg-accent" : "bg-surface-2 ring-1 ring-inset ring-rule")} />
            <span className="mt-1 block text-[0.6875rem] text-muted">{label(d).replace("-day", "d").replace("-month", "mo")}</span>
          </li>
        ))}
      </ol>
      <p className="mt-2 text-muted">
        {next ? (isDue ? <>The {label(idx.retest[step])} re-test is <span className="font-medium text-ink">due now</span>.</> : <>Next: the {label(idx.retest[step])} re-test, due {fmt(next)}.</>) : "All scheduled re-tests are done."}
        {" "}Retained needs a passed re-test at {RETAIN_FROM_DAYS} days or later{tp.mastery === 5 ? " (reached)" : ""}.
      </p>
      {tp.reviews?.needsPractice && <p className="mt-1 text-warn">The last re-test failed. Re-practise this topic before the next one.</p>}
      <div className="mt-3">
        <ReviewButtons topicId={topicId} />
        {next && !isDue && <p className="mt-1.5 text-xs text-faint">Recording a re-test early is allowed; the next interval counts from today.</p>}
      </div>
      {log.length > 0 && (
        <details className="mt-3">
          <summary className="cursor-pointer text-muted">History ({log.length})</summary>
          <ul className="mt-2 space-y-1">{[...log].reverse().map((e, i) => <HistoryRow key={e.at + i} e={e} />)}</ul>
          <button type="button" className="btn btn-quiet btn-sm mt-1" onClick={() => undoLastReview(topicId)}>Undo the latest result</button>
        </details>
      )}
    </div>
  );
}
