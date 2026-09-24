"use client";

import Link from "next/link";
import { useState } from "react";
import { useHydrated, useUserState } from "@/lib/store";
import { dueReviews, gateById, gatePassed, idx, stageOfWeek, topicById, unitLabel, weekByCw, weekView } from "@/lib/progress";
import { recordReview, setCurrentWeek } from "@/lib/actions";
import { ConceptChecklist, NotesEditor } from "./progress";
import { Bar, StatusPill, cx } from "./ui";

type DayPlan = { days: string; plan: { days: string; focus: string }[] } | null;

export function Today({ dayPlans, dailyUnit, lanes }: {
  dayPlans: Record<number, DayPlan>;
  dailyUnit: { minutes: string; step: string }[];
  lanes: { from: number; to: number | null; label: string; note: string }[];
}) {
  const s = useUserState();
  const ready = useHydrated();
  const [session, setSession] = useState<Record<number, boolean>>({});
  if (!ready) return <div className="h-96 animate-pulse rounded-lg bg-surface-2" aria-label="Loading your progress" />;

  const cw = s.currentWeek;
  const w = weekByCw(cw);
  const v = weekView(s, w);
  const stage = stageOfWeek(cw);
  const open = w.pu.filter((u) => !s.checks[u]);
  const focus = open.slice(0, 5);
  const supportOpen = w.u.filter((u) => !w.pu.includes(u) && !s.checks[u]);
  const lane = cw >= 18 ? lanes.find((l) => cw >= l.from && (l.to == null || cw <= l.to)) : undefined;
  const reviews = dueReviews(s);
  const dsaDue = s.dsa.filter((p) => p.revisitOn && new Date(p.revisitOn) <= new Date());
  const plan = dayPlans[cw];
  const gateBlocked = w.rg && !gatePassed(s, w.rg);

  return (
    <div className="space-y-8">
      <header className="border-b border-rule pb-5">
        <p className="text-sm text-muted">{stage?.id} {stage?.n}</p>
        <h1 className="mt-1 text-[1.75rem] font-semibold leading-tight tracking-tight">Today, week {cw}</h1>
        <p className="mt-2">{w.t}</p>
        <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
          <StatusPill status={v.status} />
          {v.total > 0 && <span className="flex items-center gap-2 text-muted"><span className="tabular-nums">{v.done}/{v.total}</span><Bar value={v.pct} className="w-28" label="Week progress" /></span>}
          <Link href={`/weeks/${cw}`} className="text-accent hover:underline">Full week</Link>
          <span className="ml-auto flex gap-2">
            <button type="button" disabled={cw <= 1} onClick={() => setCurrentWeek(cw - 1)} className="rounded-md border border-rule px-2 py-1 disabled:opacity-40">Previous week</button>
            <button type="button" disabled={cw >= 206} onClick={() => setCurrentWeek(cw + 1)} className="rounded-md border border-rule px-2 py-1 disabled:opacity-40">Next week</button>
          </span>
        </div>
      </header>

      {gateBlocked && (
        <p className="rounded-md border border-warn/40 bg-warn-soft px-3 py-2 text-sm">
          Week {cw} comes after <Link className="font-medium text-warn underline" href={`/checkpoints/${w.rg}`}>{w.rg} {gateById.get(w.rg!)?.t}</Link>, which is not marked passed. The master unlocks later work by capability evidence, so attempt that gate first unless you already hold the evidence.
        </p>
      )}

      {plan && (
        <section aria-labelledby="dayplan">
          <h2 id="dayplan" className="mb-2 text-base font-semibold">The master&apos;s 14-day plan (this week: days {plan.days})</h2>
          <ol className="divide-y divide-rule rounded-md border border-rule bg-surface">
            {plan.plan.map((d) => {
              const [a, b] = d.days.replace(/Days? /, "").split("-").map(Number);
              const [lo, hi] = plan.days.split("-").map(Number);
              const inWeek = (b ?? a) >= lo && a <= hi;
              return (
                <li key={d.days} className={cx("flex gap-3 px-3 py-2", !inWeek && "text-faint")}>
                  <span className="w-24 shrink-0 text-sm">{d.days}</span>
                  <span>{d.focus}</span>
                </li>
              );
            })}
          </ol>
          <p className="mt-2 text-sm text-muted">Master: this is the first review horizon, not a promise the foundation is complete in 14 days. Spend longer when the skill is not real yet.</p>
        </section>
      )}

      <section aria-labelledby="focus">
        <h2 id="focus" className="mb-2 text-base font-semibold">Focus</h2>
        {focus.length ? (
          <>
            <p className="mb-2 text-sm text-muted">Next {focus.length} of {open.length} open item(s) in this week&apos;s primary block. Tick an item only when you can do it without the tutorial open.</p>
            <ConceptChecklist items={focus.map((u) => ({ id: u, text: unitLabel(u) }))} />
          </>
        ) : (
          <p className="rounded-md border border-rule bg-surface px-3 py-2">
            {w.pu.length ? "The primary checklist for this week is done." : "No checklist this week: it is a build, project or consolidation week."}
          </p>
        )}
        <p className="mt-3"><span className="text-sm text-muted">Build / evidence:</span> {w.b}</p>
        {w.pj && <p className="mt-1 text-sm"><Link className="text-accent hover:underline" href={`/projects/${w.pj}`}>Open project {w.pj}</Link></p>}
        {w.g && <p className="mt-1 text-sm">This is a gate week. <Link className="text-accent hover:underline" href={`/checkpoints/${w.g}`}>Work through {w.g} {gateById.get(w.g)?.t}</Link>.</p>}
      </section>

      {supportOpen.length > 0 && (
        <section aria-labelledby="support">
          <h2 id="support" className="mb-1 text-base font-semibold">Supporting block</h2>
          <p className="mb-2 text-sm text-muted">Only with spare capacity (master capacity rule).</p>
          <ConceptChecklist items={supportOpen.slice(0, 3).map((u) => ({ id: u, text: unitLabel(u) }))} />
        </section>
      )}

      <section aria-labelledby="practice">
        <h2 id="practice" className="mb-2 text-base font-semibold">Practice</h2>
        {lane ? (
          <div className="rounded-md border border-rule bg-surface px-3 py-2">
            <p><span className="text-sm text-muted">DSA lane:</span> {lane.label || "Maintenance"}</p>
            <p className="text-sm text-muted">{lane.note}</p>
            <p className="mt-1 text-sm"><Link href="/dsa" className="text-accent hover:underline">Log a problem in the DSA journal</Link>{dsaDue.length > 0 && <span className="text-warn">, {dsaDue.length} due for revisit</span>}</p>
          </div>
        ) : (
          <p className="text-sm text-muted">The DSA lane starts at week 18, after the DSA fundamentals block. Until then, practice is the week&apos;s own build.</p>
        )}
      </section>

      <section aria-labelledby="retests" id="retests">
        <h2 id="retests-h" className="mb-2 text-base font-semibold">Spaced re-tests due</h2>
        {reviews.length ? (
          <ul className="divide-y divide-rule rounded-md border border-rule bg-surface">
            {reviews.map((r) => (
              <li key={r.topicId} className="flex flex-wrap items-center gap-3 px-3 py-2">
                <Link href={`/topics/${r.topicId}`} className="min-w-0 flex-1 hover:text-accent"><span className="font-mono text-xs text-muted">{r.topicId}</span> {topicById.get(r.topicId)?.t}</Link>
                <span className="text-xs text-muted">re-test {r.count + 1}, due {r.due.toLocaleDateString()}</span>
                <button type="button" onClick={() => recordReview(r.topicId)} className="rounded-md border border-accent px-2 py-0.5 text-sm text-accent hover:bg-accent-soft">Passed</button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted">None due. Re-tests appear here once a topic reaches the Demonstrated stage (1–3 days, 7, 30, 90 days, 6 months).</p>
        )}
      </section>

      <section aria-labelledby="session">
        <h2 id="session" className="mb-2 text-base font-semibold">Session plan</h2>
        <p className="mb-2 text-sm text-muted">The master&apos;s daily work unit. Shrink it on busy days; the point is that active coding happens.</p>
        <ol className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
          {dailyUnit.map((d, i) => (
            <li key={i}>
              <label className="flex cursor-pointer items-center gap-3 rounded-md border border-rule bg-surface px-3 py-2">
                <input type="checkbox" className="h-4 w-4 accent-[var(--accent)]" checked={!!session[i]} onChange={(e) => setSession({ ...session, [i]: e.target.checked })} />
                <span className="w-16 shrink-0 text-sm tabular-nums text-muted">{d.minutes} min</span>
                <span className={cx(session[i] && "text-muted line-through")}>{d.step}</span>
              </label>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="note">
        <h2 id="note" className="sr-only">Week notes</h2>
        <NotesEditor entityId={`week:${cw}`} title={`Notes for week ${cw}`} />
      </section>

      {idx.weeks.length !== 206 && <p className="text-danger">Week data is incomplete.</p>}
    </div>
  );
}
