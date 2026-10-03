"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { hrefFor } from "@/lib/ids";
import { useHydrated, useUserState } from "@/lib/store";
import {
  dueReviews, gateName, gatePassed, idx, nameOf, phaseById, stageOfWeek, unitLabel, weekByCw, weekView,
} from "@/lib/progress";
import { setCheck, setCurrentWeek, setWeekDone } from "@/lib/actions";
import { activeSession, lastCompletedSession, localDay, sessionsOn, todayPlan, type ProjectInfo, type StepTemplate } from "@/lib/today";
import { AiModeLine } from "./AiModeLine";
import { effectiveMode } from "@/lib/modes";
import { ActiveModeSwitcher } from "./ActiveMode";
import { ReviewQueue } from "./Reviews";
import { Tutor } from "./Tutor";
import { SessionHistory, SessionRunner, SessionStart } from "./SessionRunner";
import { BackupNudge } from "./StorageNotices";
import { ConceptChecklist, NotesEditor } from "./progress";
import { RefId } from "./Ref";
import { Disclosure, DisclosureGroup, Tally, cx } from "./ui";

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
  const mode = effectiveMode(s);
  const policy = mode.def.policy;
  const today = todayPlan(s, w, { projects, reviewsDue: reviews.length, gatePassed: (id) => gatePassed(s, id), now, nextCount: NEXT_UP, policy });
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
        <p className="t-eyebrow">
          Week <span className="text-ink">{String(cw).padStart(3, "0")}</span> / 206{phase ? ` · ${phase.t}` : stage ? ` · ${stage.n}` : ""}
        </p>
        <h1 className="mt-2 font-display text-[2.25rem] leading-[1.04] tracking-[-0.01em] text-balance sm:text-[2.875rem] lg:text-[2.5rem] xl:text-[2.875rem]">{w.t}</h1>
        {v.total > 0 && (
          <div className="mt-5 max-w-xl">
            <Tally done={v.done} total={v.total} label="This week's checklist" />
            <p className="mt-2 text-sm text-muted">
              <span className="t-data text-ink">{v.done}/{v.total}</span> done this week
            </p>
          </div>
        )}
        <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 border-y border-rule py-1.5">
          <div className="lg:hidden"><ActiveModeSwitcher variant="compact" /></div>
          <span aria-hidden className="hidden h-4 w-px bg-rule sm:block lg:hidden" />
          <AiModeLine cw={cw} compact />
        </div>
        {policy.note && <p className="mt-2 text-sm text-muted">{policy.note}</p>}
      </header>

      {gateBlocked && (
        <p className="rounded-lg border border-warn/30 bg-warn-soft px-4 py-3 text-sm">
          This week comes after the <Link className="font-medium text-warn underline" href={`/checkpoints/${w.rg}`}>{gateName(w.rg!)}</Link>, which is not marked passed yet. Attempt it first, unless you already have the evidence.
        </p>
      )}

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
        <SessionStart template={dailyUnit} week={cw} focus={open.slice(0, 3)} leftOff={today.leftOff} doneToday={sessionsOn(s, localDay(now))} preferred={policy.session} />
      )}

      <section aria-labelledby="next">
        <h2 id="next" className="h-section mb-3">{policy.primary === "light" && focus.length ? "Optional, only with spare capacity" : focus.length ? "Up next" : "This week"}</h2>
        {policy.primary === "paused" && open.length > 0 ? (
          <p className="card px-4 py-3">
            New roadmap work is paused in this mode. Week {cw} waits for you, with {open.length} item{open.length > 1 ? "s" : ""} left; <Link href={`/weeks/${cw}`} className="text-accent hover:underline">open the week</Link> if you need to look something up.
          </p>
        ) : focus.length ? (
          <>
            <ConceptChecklist items={focus.map((u) => ({ id: u, text: unitLabel(u) }))} showIds={false} onToggle={onToggle} lead />
            <p className="mt-2.5 text-sm text-muted">
              Tick an item when you can do it without the tutorial open.
              {open.length > focus.length && <> {open.length - focus.length} more after these.</>}
              {policy.primary === "light" && <> The roadmap can pause; skipping this is fine.</>}
            </p>
          </>
        ) : (
          <p className="card px-4 py-3">
            {primaryDone ? "Every checklist item for this week is ticked." : "No checklist this week: it is a build, project or consolidation week."}
          </p>
        )}
      </section>

      <ReviewQueue />

      {(today.supporting || dsaDue.length > 0 || project || gateThisWeek) && (
        <section aria-labelledby="also">
          <h2 id="also" className="h-section mb-2">Also today</h2>
          <ul className="rule-list border-y border-rule text-sm">
            {today.supporting && (
              <li className="py-3">
                <span className="block text-xs text-faint">Supporting, only with spare capacity</span>
                <Link href={hrefOfUnit(today.supporting)} className="hover:text-accent">{unitLabel(today.supporting)}</Link>
                {supportOpen.length > 1 && <span className="text-muted"> ({supportOpen.length - 1} more in <Link href={`/weeks/${cw}`} className="text-accent hover:underline">the week</Link>)</span>}
              </li>
            )}
            {dsaDue.length > 0 && (
              <li className="py-3">
                <span className="block text-xs text-faint">Maintenance</span>
                <a href="#retests" className="hover:text-accent">{dsaDue.length} DSA revisit{dsaDue.length > 1 ? "s" : ""} due</a>
              </li>
            )}
            {project && (
              <li className="py-3">
                <span className="block text-xs text-faint">Project milestone{project.why === "in-progress" ? "" : ", scheduled this week"}</span>
                <Link href={`/projects/${project.id}`} className="hover:text-accent">{project.milestone ? project.milestone.text : `${project.title}: all milestones ticked`}</Link>
              </li>
            )}
            {gateThisWeek && (
              <li className="py-3">
                <span className="block text-xs text-faint">Checkpoint this week</span>
                <Link href={`/checkpoints/${gateThisWeek}`} className="hover:text-accent">{gateName(gateThisWeek)}</Link> <RefId id={gateThisWeek} />
              </li>
            )}
          </ul>
        </section>
      )}

{policy.primary !== "paused" && (
      <section aria-labelledby="build" className="border-l-2 border-rule-strong py-0.5 pl-4">
        <h2 id="build" className="text-sm text-muted">This week&apos;s build</h2>
        <p className="mt-0.5 leading-relaxed">{w.b}</p>
        {w.pj && <p className="mt-2 text-sm"><Link className="text-accent hover:underline" href={`/projects/${w.pj}`}>Open the project: {nameOf(w.pj)}</Link></p>}
      </section>
      )}

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

      <aside className="mt-8 space-y-4 lg:mt-0 lg:pt-1" aria-label="More for this week">
        <Tutor />
        <DisclosureGroup label="More for this week">
        {doneItems.length > 0 && (
          <Disclosure flat title={`Done this week (${doneItems.length})`} hint="Untick anything you ticked by mistake">
            <ConceptChecklist items={doneItems.map((u) => ({ id: u, text: unitLabel(u) }))} showIds={false} />
          </Disclosure>
        )}

        {plan && (
          <Disclosure flat title="The 14-day plan" hint={`This week covers days ${plan.days}`} open={cw === 1 && doneItems.length === 0}>
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

        {policy.dsa !== "off" && (lane || dsaDue.length > 0) && (
          <Disclosure flat
            id="retests"
            title="DSA practice"
            hint={policy.dsa === "optional" ? "Optional: 15-30 minutes only if it helps" : dsaDue.length ? `${dsaDue.length} revisit${dsaDue.length > 1 ? "s" : ""} due` : "DSA practice for this stage"}
            open={dsaDue.length > 0}
          >
            {lane && <p className="text-sm text-muted">{lane.note}</p>}
            {dsaDue.length > 0 && (
              <ul className="mt-2 list-disc space-y-0.5 pl-5 text-sm">
                {dsaDue.map((p) => <li key={p.id}>{p.title || "Untitled problem"}</li>)}
              </ul>
            )}
            <p className="mt-2 text-sm"><Link href="/dsa" className="text-accent hover:underline">Open the DSA journal</Link></p>
          </Disclosure>
        )}

        <Disclosure flat title="Recent sessions" hint={s.sessions.length ? "What you learned and where you got stuck" : "Your session log"}>
          <SessionHistory sessions={s.sessions} />
        </Disclosure>

        <Disclosure flat title="Notes for this week">
          <NotesEditor entityId={`week:${cw}`} title="Notes" />
        </Disclosure>

        <Disclosure flat title="More about this week" hint="Full checklist, other weeks">
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
        </DisclosureGroup>
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
