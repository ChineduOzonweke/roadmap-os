"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { hrefFor } from "@/lib/ids";
import { useHydrated, useUserState } from "@/lib/store";
import {
  dueReviews, gateName, gatePassed, idx, nameOf, phaseById, stageOfWeek, topicById, unitLabel, weekByCw, weekView,
} from "@/lib/progress";
import { recordReview, setCheck, setCurrentWeek, setWeekDone } from "@/lib/actions";
import { activeSession, lastCompletedSession, localDay, sessionsOn, todayPlan, type ProjectInfo, type StepTemplate } from "@/lib/today";
import { AiModeLine } from "./AiModeLine";
import { SessionHistory, SessionRunner, SessionStart } from "./SessionRunner";
import { BackupNudge } from "./StorageNotices";
import { ConceptChecklist, NotesEditor } from "./progress";
import { RefId } from "./Ref";
import { Disclosure, Tally, cx } from "./ui";

const hrefOfUnit = (u: string) => hrefFor(u) ?? "#";

type DayPlan = { days: string; plan: { days: string; focus: string }[] } | null;

const NEXT_UP = 5;

/**
 * Today is the cockpit: where am I, what do I do next, how far along is this week.
 * Everything else is one tap away in collapsed sections.
 */
export function Today({ dayPlans, dailyUnit, lanes, projects }: {
  dayPlans: Record<number, DayPlan>;
  dailyUnit: StepTemplate[];
  lanes: { from: number; to: number | null; label: string; note: string }[];
  projects: ProjectInfo[];
}) {
  const s = useUserState();
  const ready = useHydrated();
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
  const now = new Date();
  const reviews = dueReviews(s, now);
  const today = todayPlan(s, w, { projects, reviewsDue: reviews.length, gatePassed: (id) => gatePassed(s, id), now, nextCount: NEXT_UP });
  const open = w.pu.filter((u) => !s.checks[u]);
  const doneItems = w.pu.filter((u) => !!s.checks[u]);
  const focus = today.primary.next;
  const supportOpen = w.u.filter((u) => !w.pu.includes(u) && !s.checks[u]);
  const lane = cw >= 18 ? lanes.find((l) => cw >= l.from && (l.to == null || cw <= l.to)) : undefined;
  const dsaDue = today.maintenance.dsaDue;
  const plan = dayPlans[cw];
  const running = activeSession(s);
  // Skip the project row when its milestone is word-for-word this week's build, which is shown just below.
  const project = today.project && today.project.milestone?.text !== w.b ? today.project : null;
  const gateThisWeek = today.checkpoints.thisWeek;
  const gateBlocked = today.checkpoints.blocking;
  const weekDone = !!s.weeks[cw]?.done;
  const primaryDone = w.pu.length > 0 && open.length === 0;

  const onToggle = (id: string, checked: boolean) => setUndo(checked ? { id, text: unitLabel(id) } : null);

  return (
    <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_17.5rem] lg:gap-10 xl:grid-cols-[minmax(0,1fr)_19rem]">
     <div className="min-w-0 space-y-7">
      <header>
        <p className="text-sm text-muted">
          <span className="font-medium text-ink">Week {cw}</span> of 206{phase ? `, ${phase.t}` : stage ? `, ${stage.n}` : ""}
        </p>
        <h1 className="mt-1.5 text-[1.75rem] font-semibold leading-[1.15] tracking-[-0.015em] text-balance sm:text-[2rem]">{w.t}</h1>
        {v.total > 0 && (
          <div className="mt-5">
            <Tally done={v.done} total={v.total} label="This week's checklist" />
            <p className="mt-2 text-sm tabular-nums text-muted">
              <span className="font-medium text-ink">{v.done} of {v.total}</span> done this week
            </p>
          </div>
        )}
      </header>

      {gateBlocked && (
        <p className="rounded-xl border border-warn/30 bg-warn-soft px-4 py-3 text-sm">
          This week comes after the <Link className="font-medium text-warn underline" href={`/checkpoints/${w.rg}`}>{gateName(w.rg!)}</Link>, which is not marked passed yet. Attempt it first, unless you already have the evidence.
        </p>
      )}

      <div className="lg:hidden"><AiModeLine cw={cw} /></div>

      {running ? (
        <SessionRunner
          session={running}
          state={s}
          ctx={{
            build: w.b,
            projectHref: today.project ? `/projects/${today.project.id}` : null,
            projectTitle: today.project?.title ?? null,
            reviewsDue: reviews.length,
            previous: lastCompletedSession(s),
          }}
        />
      ) : (
        <SessionStart template={dailyUnit} week={cw} focus={open.slice(0, 3)} leftOff={today.leftOff} doneToday={sessionsOn(s, localDay(now))} />
      )}

      <section aria-labelledby="next">
        <h2 id="next" className="h-section mb-3">{focus.length ? "Up next" : "This week"}</h2>
        {focus.length ? (
          <>
            <ConceptChecklist items={focus.map((u) => ({ id: u, text: unitLabel(u) }))} showIds={false} onToggle={onToggle} lead />
            <p className="mt-2.5 text-sm text-muted">
              Tick an item when you can do it without the tutorial open.
              {open.length > focus.length && <> {open.length - focus.length} more after these.</>}
            </p>
          </>
        ) : (
          <p className="card px-4 py-3">
            {primaryDone ? "Every checklist item for this week is ticked." : "No checklist this week: it is a build, project or consolidation week."}
          </p>
        )}
      </section>

      {(today.supporting || reviews.length > 0 || dsaDue.length > 0 || project || gateThisWeek) && (
        <section aria-labelledby="also">
          <h2 id="also" className="h-section mb-2">Also today</h2>
          <ul className="list-card text-sm">
            {today.supporting && (
              <li className="px-4 py-3">
                <span className="block text-xs text-muted">Supporting, only with spare capacity</span>
                <Link href={hrefOfUnit(today.supporting)} className="hover:text-accent">{unitLabel(today.supporting)}</Link>
                {supportOpen.length > 1 && <span className="text-muted"> ({supportOpen.length - 1} more in <Link href={`/weeks/${cw}`} className="text-accent hover:underline">the week</Link>)</span>}
              </li>
            )}
            {(reviews.length > 0 || dsaDue.length > 0) && (
              <li className="px-4 py-3">
                <span className="block text-xs text-muted">Maintenance</span>
                <a href="#retests" className="hover:text-accent">
                  {[reviews.length && `${reviews.length} re-test${reviews.length > 1 ? "s" : ""} due`, dsaDue.length && `${dsaDue.length} DSA revisit${dsaDue.length > 1 ? "s" : ""}`].filter(Boolean).join(", ")}
                </a>
              </li>
            )}
            {project && (
              <li className="px-4 py-3">
                <span className="block text-xs text-muted">Project milestone{project.why === "in-progress" ? "" : ", scheduled this week"}</span>
                <Link href={`/projects/${project.id}`} className="hover:text-accent">{project.milestone ? project.milestone.text : `${project.title}: all milestones ticked`}</Link>
              </li>
            )}
            {gateThisWeek && (
              <li className="px-4 py-3">
                <span className="block text-xs text-muted">Checkpoint this week</span>
                <Link href={`/checkpoints/${gateThisWeek}`} className="hover:text-accent">{gateName(gateThisWeek)}</Link> <RefId id={gateThisWeek} />
              </li>
            )}
          </ul>
        </section>
      )}

      <section aria-labelledby="build" className="border-l-2 border-rule-strong py-0.5 pl-4">
        <h2 id="build" className="text-sm text-muted">This week&apos;s build</h2>
        <p className="mt-0.5 leading-relaxed">{w.b}</p>
        {w.pj && <p className="mt-2 text-sm"><Link className="text-accent hover:underline" href={`/projects/${w.pj}`}>Open the project: {nameOf(w.pj)}</Link></p>}
      </section>

      {(primaryDone || w.pu.length === 0) && !weekDone && (
        <button
          type="button"
          onClick={() => { setWeekDone(cw, true); if (cw < 206) setCurrentWeek(cw + 1); }}
          className="btn btn-ok btn-block min-h-12"
        >
          Build done too? Complete week {cw}{cw < 206 ? ` and start week ${cw + 1}` : ""}
        </button>
      )}

      <BackupNudge />

     </div>

      <aside className="mt-7 space-y-3 lg:mt-0 lg:pt-1" aria-label="More for this week">
        <div className="hidden lg:block"><AiModeLine cw={cw} /></div>
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
                    <button type="button" onClick={() => recordReview(r.topicId)} className="btn btn-secondary btn-sm">Passed</button>
                  </li>
                ))}
              </ul>
            )}
          </Disclosure>
        )}

        <Disclosure title="Recent sessions" hint={s.sessions.length ? "What you learned and where you got stuck" : "Your session log"}>
          <SessionHistory sessions={s.sessions} />
        </Disclosure>

        <Disclosure title="Notes for this week">
          <NotesEditor entityId={`week:${cw}`} title="Notes" />
        </Disclosure>

        <Disclosure title="More about this week" hint="Full checklist, other weeks">
          <div className="space-y-3 text-sm">
            <p><Link href={`/weeks/${cw}`} className="text-accent hover:underline">Open week {cw} in full</Link></p>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-muted">Current week:</span>
              <button type="button" disabled={cw <= 1} onClick={() => setCurrentWeek(cw - 1)} className="btn btn-secondary btn-sm">Back to week {Math.max(1, cw - 1)}</button>
              <button type="button" disabled={cw >= 206} onClick={() => setCurrentWeek(cw + 1)} className="btn btn-secondary btn-sm">Skip to week {Math.min(206, cw + 1)}</button>
            </div>
            {stage && <p className="text-muted">Stage: {stage.n} <RefId id={stage.id} /></p>}
          </div>
        </Disclosure>
      </aside>

      {undo && (
        <div role="status" className="fixed inset-x-3 bottom-[calc(4.75rem+env(safe-area-inset-bottom))] z-40 mx-auto flex max-w-md items-center gap-3 rounded-xl bg-ink py-2 pl-4 pr-2 text-sm text-bg shadow-[0_8px_24px_rgb(0_0_0/0.22)] lg:bottom-6">
          <span className="min-w-0 flex-1 truncate">Done: {undo.text}</span>
          <button type="button" className="min-h-10 shrink-0 rounded-lg px-3 font-semibold text-accent-soft hover:bg-white/10" onClick={() => { setCheck(undo.id, false); setUndo(null); }}>Undo</button>
        </div>
      )}

      {idx.weeks.length !== 206 && <p className="text-danger">Week data is incomplete.</p>}
    </div>
  );
}
