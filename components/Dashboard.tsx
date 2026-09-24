"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useHydrated, useUserState } from "@/lib/store";
import {
  COMPETENCY_GATES, approachingGate, availableTopics, dueReviews, gateById, gateCriteriaDone, gatePassed, idx,
  nextUnits, overallRollup, pct, phaseById, stageOfWeek, topicById, unitLabel, weekByCw, weekView, weeksCompleted,
} from "@/lib/progress";
import { hrefFor, conceptSlug } from "@/lib/ids";
import { WeekStrip } from "./WeekStrip";
import { Bar, InlineText, StatusPill, cx } from "./ui";

function Stat({ label, value, sub, bar }: { label: string; value: string; sub?: string; bar?: number }) {
  return (
    <div className="min-w-0">
      <p className="text-xs text-muted">{label}</p>
      <p className="text-xl font-semibold tabular-nums">{value}</p>
      {bar != null && <Bar value={bar} className="mt-1" label={label} />}
      {sub && <p className="mt-1 text-xs text-muted">{sub}</p>}
    </div>
  );
}

export function Dashboard() {
  const s = useUserState();
  const ready = useHydrated();
  const cw = s.currentWeek;
  const w = weekByCw(cw);
  const stage = stageOfWeek(cw);
  const sub = idx.stages.find((x) => x.id === w.s);
  const data = useMemo(() => {
    const overall = overallRollup(s);
    const gatesPassed = COMPETENCY_GATES.filter((g) => gatePassed(s, g)).length;
    const ap = approachingGate(s);
    const active = idx.projects.filter((p) => s.projects[p.id]?.status === "in_progress");
    const upcomingProject = idx.projects.find((p) => s.projects[p.id]?.status !== "complete" && p.w[0] >= cw);
    return {
      overall, gatesPassed, ap, active, upcomingProject,
      wv: weekView(s, w),
      next: nextUnits(s, w, 3),
      available: availableTopics(s, 6),
      reviews: dueReviews(s),
      dsaDue: s.dsa.filter((p) => p.revisitOn && new Date(p.revisitOn) <= new Date()).length,
      weeksDone: weeksCompleted(s),
      upcoming: [cw + 1, cw + 2, cw + 3].filter((x) => x <= 206).map(weekByCw),
    };
  }, [s, w, cw]);

  if (!ready) {
    return <div className="h-96 animate-pulse rounded-lg bg-surface-2" aria-label="Loading your progress" />;
  }

  const phasesNow = Array.from(new Set(w.pu.map((u) => u.split(/[.#]/)[0]).filter((p) => phaseById.has(p))));
  const gate = data.ap?.gate;

  return (
    <div className="space-y-8">
      <header className="border-b border-rule pb-5">
        <p className="text-sm text-muted">
          {stage?.id} {stage?.n}
          {sub && sub.id !== stage?.id ? `, ${sub.id} ${sub.n}` : ""}
        </p>
        <h1 className="mt-1 text-[1.9rem] font-semibold leading-tight tracking-tight">Week {cw} <span className="font-normal text-muted">of 206</span></h1>
        <p className="mt-2 max-w-[70ch]">{w.t}</p>
        {phasesNow.length > 0 && (
          <p className="mt-1 text-sm text-muted">
            Phase {phasesNow.map((p, i) => (
              <span key={p}>{i > 0 && ", "}<Link className="hover:text-accent" href={`/phases/${p}`}>{p} {phaseById.get(p)?.t}</Link></span>
            ))}
          </p>
        )}
      </header>

      <section aria-labelledby="mission" className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <div>
          <div className="mb-2 flex items-baseline justify-between gap-3">
            <h2 id="mission" className="text-base font-semibold">Current mission</h2>
            <Link href="/today" className="text-sm text-accent hover:underline">Open today</Link>
          </div>
          {!data.wv.cleared && w.rg && (
            <p className="mb-3 rounded-md border border-warn/40 bg-warn-soft px-3 py-2 text-sm">
              This week sits behind <Link className="font-medium text-warn underline" href={`/checkpoints/${w.rg}`}>{w.rg} {gateById.get(w.rg)?.t}</Link>. Pass it first, or keep going if you already have the evidence.
            </p>
          )}
          {data.next.length > 0 ? (
            <ol className="space-y-2">
              {data.next.map((u) => (
                <li key={u} className="flex gap-3 rounded-md border border-rule bg-surface px-3 py-2">
                  <Link href={hrefFor(u) ?? "#"} className="shrink-0 pt-0.5 font-mono text-xs text-muted hover:text-accent">{u}</Link>
                  <span className="min-w-0"><InlineText text={unitLabel(u)} /></span>
                </li>
              ))}
            </ol>
          ) : (
            <p className="rounded-md border border-rule bg-surface px-3 py-2">
              {w.pu.length ? "Every checklist item for this week is ticked. Finish the build, then complete the week." : "This is a build or consolidation week. Work from the build notes below."}
            </p>
          )}
          <p className="mt-3 text-sm"><span className="text-muted">Build / evidence:</span> {w.b}</p>
          <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
            <StatusPill status={data.wv.status} />
            {data.wv.total > 0 && <span className="tabular-nums text-muted">{data.wv.done}/{data.wv.total} this week</span>}
            <Link href={`/weeks/${cw}`} className="text-accent hover:underline">Open week {cw}</Link>
          </div>
        </div>

        <div className="space-y-4">
          {gate && (
            <div className="rounded-lg border border-rule bg-surface p-4">
              <p className="text-xs text-muted">{data.ap?.blocking ? "Unpassed gate behind you" : "Next gate"}</p>
              <p className="mt-0.5 font-medium">
                <Link href={`/checkpoints/${gate.id}`} className="hover:text-accent">{gate.id} {gate.t}</Link>
              </p>
              <p className="text-sm text-muted">{gate.w ? `Planned at week ${gate.w}${gate.w > cw ? `, ${gate.w - cw} week(s) ahead` : ""}` : "Calendar-driven"}</p>
              {gate.n > 0 && (
                <>
                  <Bar value={gateCriteriaDone(s, gate) / gate.n} className="mt-2" label="Gate criteria" />
                  <p className="mt-1 text-xs text-muted">{gateCriteriaDone(s, gate)} of {gate.n} pass criteria ticked</p>
                </>
              )}
            </div>
          )}
          <div className="rounded-lg border border-rule bg-surface p-4">
            <p className="text-xs text-muted">Projects</p>
            {data.active.length > 0 ? (
              <ul className="mt-1 space-y-1">
                {data.active.map((p) => (
                  <li key={p.id}><Link href={`/projects/${p.id}`} className="hover:text-accent"><span className="font-mono text-xs text-muted">{p.id}</span> {p.t}</Link> <span className="text-xs text-warn">active</span></li>
                ))}
              </ul>
            ) : data.upcomingProject ? (
              <p className="mt-1">
                Next: <Link href={`/projects/${data.upcomingProject.id}`} className="hover:text-accent"><span className="font-mono text-xs text-muted">{data.upcomingProject.id}</span> {data.upcomingProject.t}</Link>
                <span className="block text-sm text-muted">Build weeks {data.upcomingProject.w[0]}–{data.upcomingProject.w[data.upcomingProject.w.length - 1]}</span>
              </p>
            ) : (
              <p className="mt-1 text-sm text-muted">No project in progress.</p>
            )}
          </div>
        </div>
      </section>

      <section aria-labelledby="map">
        <div className="mb-3 flex items-baseline justify-between">
          <h2 id="map" className="text-base font-semibold">Execution map</h2>
          <Link href="/timeline" className="text-sm text-accent hover:underline">Timeline</Link>
        </div>
        <WeekStrip />
      </section>

      <section aria-labelledby="progress">
        <h2 id="progress" className="mb-3 text-base font-semibold">Progress</h2>
        <div className="grid grid-cols-2 gap-5 rounded-lg border border-rule bg-surface p-4 sm:grid-cols-4">
          <Stat label="Checklist coverage" value={pct(data.overall.pct)} sub={`${data.overall.done} of ${data.overall.total} items`} bar={data.overall.pct} />
          <Stat label="Topics mastered" value={`${data.overall.mastered}`} sub={`of ${data.overall.topics} scheduled topics`} bar={data.overall.mastered / data.overall.topics} />
          <Stat label="Checkpoints passed" value={`${data.gatesPassed}/8`} sub="G0 and C1–C7" bar={data.gatesPassed / 8} />
          <Stat label="Weeks complete" value={`${data.weeksDone}`} sub="of 206" bar={data.weeksDone / 206} />
        </div>
        <p className="mt-2 text-xs text-muted">Coverage counts ticked checklist items. Mastery needs the checklist plus a demonstrated stage, so the two numbers are tracked separately.</p>
      </section>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <section aria-labelledby="available">
          <div className="mb-2 flex items-baseline justify-between">
            <h2 id="available" className="text-base font-semibold">Cleared and unfinished</h2>
            <Link href="/curriculum" className="text-sm text-accent hover:underline">All phases</Link>
          </div>
          {data.available.length ? (
            <ul className="divide-y divide-rule rounded-md border border-rule bg-surface">
              {data.available.map(({ t, v }) => (
                <li key={t.id} className="flex items-center gap-3 px-3 py-2">
                  <Link href={`/topics/${t.id}`} className="min-w-0 flex-1 truncate hover:text-accent"><span className="font-mono text-xs text-muted">{t.id}</span> {t.t}</Link>
                  <span className="shrink-0 text-xs text-muted">wk {t.w}</span>
                  <StatusPill status={v.status} />
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted">Nothing cleared is waiting. Pass the next gate to unlock more.</p>
          )}
        </section>

        <section aria-labelledby="next">
          <h2 id="next" className="mb-2 text-base font-semibold">Coming next</h2>
          <ul className="divide-y divide-rule rounded-md border border-rule bg-surface">
            {data.upcoming.map((u) => (
              <li key={u.cw} className="px-3 py-2">
                <Link href={`/weeks/${u.cw}`} className="hover:text-accent">
                  <span className="text-sm font-medium">Week {u.cw}</span>
                  {u.g && <span className="ml-2 rounded bg-accent-soft px-1.5 text-xs text-accent">gate {u.g}</span>}
                  <span className="block truncate text-sm text-muted">{u.t}</span>
                </Link>
              </li>
            ))}
          </ul>
          {(data.reviews.length > 0 || data.dsaDue > 0) && (
            <div className="mt-4 space-y-1 text-sm">
              {data.reviews.length > 0 && (
                <p><Link href="/today#retests" className="text-accent hover:underline">{data.reviews.length} spaced re-test(s) due</Link>: {data.reviews.slice(0, 3).map((r) => topicById.get(r.topicId)?.t ?? r.topicId).join(", ")}</p>
              )}
              {data.dsaDue > 0 && <p><Link href="/dsa" className="text-accent hover:underline">{data.dsaDue} DSA problem(s) due for revisit</Link></p>}
            </div>
          )}
        </section>
      </div>

      <section aria-labelledby="gates">
        <h2 id="gates" className="mb-2 text-base font-semibold">Checkpoints</h2>
        <ol className="flex flex-wrap gap-2">
          {COMPETENCY_GATES.map((g) => {
            const passed = gatePassed(s, g);
            const info = gateById.get(g);
            return (
              <li key={g}>
                <Link
                  href={`/checkpoints/${g}`}
                  className={cx("inline-flex items-center gap-2 rounded-md border px-2.5 py-1.5 text-sm", passed ? "border-ok bg-ok-soft text-ok" : "border-rule bg-surface hover:border-accent")}
                  title={info?.t}
                >
                  <span className="font-mono text-xs">{g}</span>
                  <span className="hidden sm:inline">{info?.t}</span>
                  <span className="text-xs text-muted">{info?.w ? `wk ${info.w}` : "calendar"}</span>
                </Link>
              </li>
            );
          })}
        </ol>
      </section>

      {Object.keys(s.checks).length === 0 && (
        <p className="rounded-md border border-dashed border-rule px-4 py-3 text-sm">
          New here? Start with <Link className="text-accent underline" href="/today">Today</Link>: it shows week 1 of the master&apos;s 14-day Python plan. Ticking items and setting mastery stages feeds every number on this page.
          {" "}See <Link href={`/concepts/${conceptSlug("P01.1a#1")}`} className="text-accent underline">the first concept</Link> or read <Link className="text-accent underline" href="/guide">how it works</Link>.
        </p>
      )}
    </div>
  );
}
