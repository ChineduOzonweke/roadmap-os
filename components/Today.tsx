"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useHydrated, useUserState } from "@/lib/store";
import {
  dueReviews, gateName, gatePassed, idx, nameOf, phaseById, stageOfWeek, topicById, unitLabel, weekByCw, weekView,
} from "@/lib/progress";
import { recordReview, setCheck, setCurrentWeek, setWeekDone } from "@/lib/actions";
import { AiModeLine } from "./AiModeLine";
import { ConceptChecklist, NotesEditor } from "./progress";
import { RefId } from "./Ref";
import { Bar, Disclosure, cx } from "./ui";

type DayPlan = { days: string; plan: { days: string; focus: string }[] } | null;

const NEXT_UP = 5;

/**
 * Today is the cockpit: where am I, what do I do next, how far along is this week.
 * Everything else is one tap away in collapsed sections.
 */
export function Today({ dayPlans, dailyUnit, lanes }: {
  dayPlans: Record<number, DayPlan>;
  dailyUnit: { minutes: string; step: string }[];
  lanes: { from: number; to: number | null; label: string; note: string }[];
}) {
  const s = useUserState();
  const ready = useHydrated();
  const [session, setSession] = useState<Record<number, boolean>>({});
  const [undo, setUndo] = useState<{ id: string; text: string } | null>(null);

  useEffect(() => {
    if (!undo) return;
    const t = setTimeout(() => setUndo(null), 6000);
    return () => clearTimeout(t);
  }, [undo]);

  if (!ready) return <div className="h-96 animate-pulse rounded-lg bg-surface-2" aria-label="Loading your progress" />;

  const cw = s.currentWeek;
  const w = weekByCw(cw);
  const v = weekView(s, w);
  const stage = stageOfWeek(cw);
  const phaseId = (w.pu[0] ?? "").split(".")[0];
  const phase = phaseById.get(phaseId);
  const open = w.pu.filter((u) => !s.checks[u]);
  const doneItems = w.pu.filter((u) => !!s.checks[u]);
  const focus = open.slice(0, NEXT_UP);
  const supportOpen = w.u.filter((u) => !w.pu.includes(u) && !s.checks[u]);
  const lane = cw >= 18 ? lanes.find((l) => cw >= l.from && (l.to == null || cw <= l.to)) : undefined;
  const reviews = dueReviews(s);
  const dsaDue = s.dsa.filter((p) => p.revisitOn && new Date(p.revisitOn) <= new Date());
  const plan = dayPlans[cw];
  const gateBlocked = w.rg && !gatePassed(s, w.rg);
  const weekDone = !!s.weeks[cw]?.done;
  const primaryDone = w.pu.length > 0 && open.length === 0;

  const onToggle = (id: string, checked: boolean) => setUndo(checked ? { id, text: unitLabel(id) } : null);

  return (
    <div className="space-y-6">
      <header>
        <p className="text-sm text-muted">
          Week {cw} of 206{phase ? ` · ${phase.t}` : stage ? ` · ${stage.n}` : ""}
        </p>
        <h1 className="mt-1 text-[1.6rem] font-semibold leading-tight tracking-tight sm:text-[1.75rem]">{w.t}</h1>
        {v.total > 0 && (
          <div className="mt-3">
            <div className="mb-1 flex items-baseline justify-between text-sm">
              <span className="text-muted">This week</span>
              <span className="tabular-nums">{v.done} of {v.total} done</span>
            </div>
            <Bar value={v.pct} tone={v.pct === 1 ? "ok" : "accent"} label="This week's progress" className="h-2" />
          </div>
        )}
      </header>

      {gateBlocked && (
        <p className="rounded-md border border-warn/40 bg-warn-soft px-3 py-2 text-sm">
          This week comes after the <Link className="font-medium text-warn underline" href={`/checkpoints/${w.rg}`}>{gateName(w.rg!)}</Link>, which is not marked passed yet. Attempt it first, unless you already have the evidence.
        </p>
      )}

      <AiModeLine cw={cw} />

      <section aria-labelledby="next">
        <h2 id="next" className="mb-2 text-base font-semibold">{focus.length ? "Next up" : "This week"}</h2>
        {focus.length ? (
          <>
            <ConceptChecklist items={focus.map((u) => ({ id: u, text: unitLabel(u) }))} showIds={false} onToggle={onToggle} />
            <p className="mt-2 text-sm text-muted">
              Tick an item when you can do it without the tutorial open.
              {open.length > focus.length && <> {open.length - focus.length} more after these.</>}
            </p>
          </>
        ) : (
          <p className="rounded-md border border-rule bg-surface px-3 py-2.5">
            {primaryDone ? "Every checklist item for this week is ticked." : "No checklist this week: it is a build, project or consolidation week."}
          </p>
        )}
      </section>

      <section aria-labelledby="build" className="rounded-lg border border-rule bg-surface px-4 py-3">
        <h2 id="build" className="text-sm font-medium text-muted">This week&apos;s build</h2>
        <p className="mt-1">{w.b}</p>
        {w.pj && <p className="mt-2 text-sm"><Link className="text-accent hover:underline" href={`/projects/${w.pj}`}>Open the project: {nameOf(w.pj)}</Link></p>}
        {w.g && (
          <p className="mt-2 text-sm">
            Checkpoint this week: <Link className="text-accent hover:underline" href={`/checkpoints/${w.g}`}>{gateName(w.g)}</Link> <RefId id={w.g} />
          </p>
        )}
      </section>

      {(primaryDone || w.pu.length === 0) && !weekDone && (
        <button
          type="button"
          onClick={() => { setWeekDone(cw, true); if (cw < 206) setCurrentWeek(cw + 1); }}
          className="w-full rounded-lg bg-ok px-4 py-3 font-medium text-white hover:opacity-90"
        >
          Build done too? Complete week {cw}{cw < 206 ? ` and start week ${cw + 1}` : ""}
        </button>
      )}

      <div className="space-y-3">
        {doneItems.length > 0 && (
          <Disclosure title={`Done this week (${doneItems.length})`} hint="Untick anything you ticked by mistake">
            <ConceptChecklist items={doneItems.map((u) => ({ id: u, text: unitLabel(u) }))} showIds={false} />
          </Disclosure>
        )}

        {plan && (
          <Disclosure title="The 14-day plan" hint={`This week covers days ${plan.days}`} open={cw === 1 && doneItems.length === 0}>
            <ol className="space-y-1.5">
              {plan.plan.map((d) => {
                const [a, b] = d.days.replace(/Days? /, "").split("-").map(Number);
                const [lo, hi] = plan.days.split("-").map(Number);
                const inWeek = (b ?? a) >= lo && a <= hi;
                return (
                  <li key={d.days} className={cx("flex gap-3", !inWeek && "text-faint")}>
                    <span className="w-20 shrink-0 text-sm">{d.days}</span>
                    <span>{d.focus}</span>
                  </li>
                );
              })}
            </ol>
            <p className="mt-2 text-sm text-muted">This is the first review horizon, not a promise that the foundation is done in 14 days. Take longer when a skill is not real yet.</p>
          </Disclosure>
        )}

        {supportOpen.length > 0 && (
          <Disclosure title="Supporting work" hint="Only with spare time">
            <ConceptChecklist items={supportOpen.map((u) => ({ id: u, text: unitLabel(u) }))} showIds={false} />
          </Disclosure>
        )}

        {(lane || reviews.length > 0 || dsaDue.length > 0) && (
          <Disclosure
            id="retests"
            title="Practice and re-tests"
            hint={[reviews.length && `${reviews.length} re-test${reviews.length > 1 ? "s" : ""} due`, dsaDue.length && `${dsaDue.length} DSA revisit${dsaDue.length > 1 ? "s" : ""}`].filter(Boolean).join(", ") || "DSA practice for this stage"}
            open={reviews.length > 0}
          >
            {lane && (
              <div className="mb-3">
                <p className="text-sm text-muted">{lane.note}</p>
                <p className="mt-1 text-sm"><Link href="/dsa" className="text-accent hover:underline">Open the DSA journal</Link></p>
              </div>
            )}
            {reviews.length > 0 && (
              <ul className="divide-y divide-rule">
                {reviews.map((r) => (
                  <li key={r.topicId} className="flex flex-wrap items-center gap-3 py-2">
                    <Link href={`/topics/${r.topicId}`} className="min-w-0 flex-1 hover:text-accent">{topicById.get(r.topicId)?.t}</Link>
                    <span className="text-xs text-muted">re-test {r.count + 1}</span>
                    <button type="button" onClick={() => recordReview(r.topicId)} className="min-h-10 rounded-md border border-accent px-3 text-sm text-accent hover:bg-accent-soft">Passed</button>
                  </li>
                ))}
              </ul>
            )}
          </Disclosure>
        )}

        <Disclosure title="Session plan" hint="A daily work unit you can shrink on busy days">
          <ol className="space-y-1.5">
            {dailyUnit.map((d, i) => (
              <li key={i}>
                <label className="flex min-h-11 cursor-pointer items-center gap-3">
                  <input type="checkbox" className="h-5 w-5 accent-[var(--accent)]" checked={!!session[i]} onChange={(e) => setSession({ ...session, [i]: e.target.checked })} />
                  <span className="w-16 shrink-0 text-sm tabular-nums text-muted">{d.minutes} min</span>
                  <span className={cx(session[i] && "text-muted line-through")}>{d.step}</span>
                </label>
              </li>
            ))}
          </ol>
        </Disclosure>

        <Disclosure title="Notes for this week">
          <NotesEditor entityId={`week:${cw}`} title="Notes" />
        </Disclosure>

        <Disclosure title="More about this week" hint="Full checklist, other weeks">
          <div className="space-y-3 text-sm">
            <p><Link href={`/weeks/${cw}`} className="text-accent hover:underline">Open week {cw} in full</Link></p>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-muted">Current week:</span>
              <button type="button" disabled={cw <= 1} onClick={() => setCurrentWeek(cw - 1)} className="min-h-10 rounded-md border border-rule px-3 disabled:opacity-40">Back to week {Math.max(1, cw - 1)}</button>
              <button type="button" disabled={cw >= 206} onClick={() => setCurrentWeek(cw + 1)} className="min-h-10 rounded-md border border-rule px-3 disabled:opacity-40">Skip to week {Math.min(206, cw + 1)}</button>
            </div>
            {stage && <p className="text-muted">Stage: {stage.n} <RefId id={stage.id} /></p>}
          </div>
        </Disclosure>
      </div>

      {undo && (
        <div role="status" className="fixed inset-x-3 bottom-[calc(4.5rem+env(safe-area-inset-bottom))] z-40 mx-auto flex max-w-md items-center gap-3 rounded-lg bg-ink px-4 py-3 text-sm text-bg shadow-lg lg:bottom-6">
          <span className="min-w-0 flex-1 truncate">Done: {undo.text}</span>
          <button type="button" className="min-h-9 shrink-0 rounded px-2 font-medium underline" onClick={() => { setCheck(undo.id, false); setUndo(null); }}>Undo</button>
        </div>
      )}

      {idx.weeks.length !== 206 && <p className="text-danger">Week data is incomplete.</p>}
    </div>
  );
}
