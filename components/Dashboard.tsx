"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useHydrated, useUserState } from "@/lib/store";
import {
  COMPETENCY_GATES, approachingGate, availableTopics, gateById, gateCriteriaDone, gateName, gatePassed, idx,
  overallRollup, pct, phaseById, phaseRollup, stageOfWeek, weekByCw, weekView, weeksCompleted,
} from "@/lib/progress";
import { currentTier } from "@/lib/ai";
import { WeekStrip } from "./WeekStrip";
import { RefId } from "./Ref";
import { Bar, Disclosure, StatusPill, cx } from "./ui";

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

/** Progress: what I have done, where I am, what comes next. The daily work lives on Today. */
export function Dashboard() {
  const s = useUserState();
  const ready = useHydrated();
  const cw = s.currentWeek;
  const w = weekByCw(cw);
  const stage = stageOfWeek(cw);
  const data = useMemo(() => {
    const phaseId = (w.pu[0] ?? "").split(".")[0];
    return {
      overall: overallRollup(s),
      gatesPassed: COMPETENCY_GATES.filter((g) => gatePassed(s, g)).length,
      ap: approachingGate(s),
      wv: weekView(s, w),
      phaseId,
      phaseR: phaseById.has(phaseId) ? phaseRollup(s, phaseId) : null,
      active: idx.projects.filter((p) => s.projects[p.id]?.status === "in_progress"),
      available: availableTopics(s, 6),
      weeksDone: weeksCompleted(s),
      upcoming: [cw + 1, cw + 2, cw + 3].filter((x) => x <= 206).map(weekByCw),
      tier: currentTier(s),
    };
  }, [s, w, cw]);

  if (!ready) return <div className="h-96 animate-pulse rounded-lg bg-surface-2" aria-label="Loading your progress" />;

  const gate = data.ap?.gate;
  const phase = phaseById.get(data.phaseId);

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-[1.6rem] font-semibold leading-tight tracking-tight">Progress</h1>
        <p className="mt-1 text-muted">What you have done, where you are, and what comes next.</p>
      </header>

      <section aria-labelledby="where" className="rounded-lg border border-rule bg-surface p-4">
        <h2 id="where" className="text-sm font-medium text-muted">Where you are</h2>
        <p className="mt-1 text-lg font-semibold">Week {cw} of 206: {w.t}</p>
        <p className="mt-0.5 text-sm text-muted">
          {phase && <><Link href={`/phases/${data.phaseId}`} className="hover:text-accent">{phase.t}</Link> <RefId id={data.phaseId} /> · </>}
          {stage?.n} <RefId id={stage?.id ?? ""} />
        </p>
        {data.wv.total > 0 && (
          <div className="mt-3 flex items-center gap-3 text-sm">
            <Bar value={data.wv.pct} className="flex-1" label="This week" />
            <span className="tabular-nums text-muted">{data.wv.done}/{data.wv.total} this week</span>
          </div>
        )}
        {data.phaseR && data.phaseR.total > 0 && (
          <div className="mt-2 flex items-center gap-3 text-sm">
            <Bar value={data.phaseR.pct} className="flex-1" tone="ok" label="This phase" />
            <span className="tabular-nums text-muted">{pct(data.phaseR.pct)} of this phase</span>
          </div>
        )}
        <Link href="/" className="mt-4 flex min-h-11 w-full items-center justify-center rounded-md bg-accent px-4 font-medium text-accent-ink hover:opacity-90">Continue today&apos;s work</Link>
      </section>

      <section aria-labelledby="done">
        <h2 id="done" className="mb-3 text-base font-semibold">Completed so far</h2>
        <div className="grid grid-cols-2 gap-5 rounded-lg border border-rule bg-surface p-4 sm:grid-cols-4">
          <Stat label="Weeks complete" value={`${data.weeksDone}`} sub="of 206" bar={data.weeksDone / 206} />
          <Stat label="Checklist items" value={pct(data.overall.pct)} sub={`${data.overall.done} of ${data.overall.total}`} bar={data.overall.pct} />
          <Stat label="Topics mastered" value={`${data.overall.mastered}`} sub={`of ${data.overall.topics}`} bar={data.overall.mastered / data.overall.topics} />
          <Stat label="Checkpoints passed" value={`${data.gatesPassed} of 8`} bar={data.gatesPassed / 8} />
        </div>
      </section>

      <section aria-labelledby="next">
        <h2 id="next" className="mb-3 text-base font-semibold">What comes next</h2>
        <div className="space-y-3">
          {gate && (
            <Link href={`/checkpoints/${gate.id}`} className="block rounded-lg border border-rule bg-surface p-4 hover:border-accent">
              <p className="text-xs text-muted">{data.ap?.blocking ? "Checkpoint behind you, not yet passed" : "Next checkpoint"}</p>
              <p className="font-medium">{gateName(gate.id)} <RefId id={gate.id} /></p>
              <p className="text-sm text-muted">{gate.w ? (gate.w > cw ? `Planned for week ${gate.w}, ${gate.w - cw} week(s) ahead` : `Planned for week ${gate.w}`) : "Timed to recruiting periods"}</p>
              {gate.n > 0 && <Bar value={gateCriteriaDone(s, gate) / gate.n} className="mt-2" label="Checkpoint criteria" />}
            </Link>
          )}
          <ul className="divide-y divide-rule rounded-lg border border-rule bg-surface">
            {data.upcoming.map((u) => (
              <li key={u.cw}>
                <Link href={`/weeks/${u.cw}`} className="flex min-h-12 flex-col justify-center px-4 py-2 hover:bg-surface-2">
                  <span className="text-sm text-muted">Week {u.cw}{u.g ? ` · ${gateName(u.g)}` : ""}</span>
                  <span className="truncate">{u.t}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="map">
        <div className="mb-3 flex items-baseline justify-between">
          <h2 id="map" className="text-base font-semibold">All 206 weeks</h2>
          <Link href="/weeks" className="text-sm text-accent hover:underline">Week list</Link>
        </div>
        <WeekStrip />
      </section>

      <div className="space-y-3">
        <Disclosure title="Checkpoints" hint={`${data.gatesPassed} of 8 passed`}>
          <ol className="space-y-1.5">
            {COMPETENCY_GATES.map((g) => {
              const passed = gatePassed(s, g);
              const info = gateById.get(g);
              return (
                <li key={g}>
                  <Link href={`/checkpoints/${g}`} className={cx("flex min-h-11 items-center gap-3 rounded-md border px-3 py-2 text-sm", passed ? "border-ok bg-ok-soft" : "border-rule hover:border-accent")}>
                    <span className="flex-1">{gateName(g)} <RefId id={g} /></span>
                    <span className="text-xs text-muted">{passed ? "Passed" : info?.w ? `Week ${info.w}` : "Recruiting periods"}</span>
                  </Link>
                </li>
              );
            })}
          </ol>
        </Disclosure>

        {data.available.length > 0 && (
          <Disclosure title="Open topics you can work on" hint="Cleared by your checkpoints but not finished">
            <ul className="divide-y divide-rule">
              {data.available.map(({ t, v }) => (
                <li key={t.id} className="flex items-center gap-3 py-2">
                  <Link href={`/topics/${t.id}`} className="min-w-0 flex-1 hover:text-accent">{t.t} <RefId id={t.id} /></Link>
                  <StatusPill status={v.status} />
                </li>
              ))}
            </ul>
          </Disclosure>
        )}

        <Disclosure title="Working with AI" hint={`Your AI tier: ${data.tier.title}`}>
          <p className="text-sm">How much AI can take part in your work grows with your checkpoints. <Link href="/ai" className="text-accent hover:underline">See tiers, modes and missions</Link>.</p>
        </Disclosure>

        {data.active.length > 0 && (
          <Disclosure title="Projects in progress" hint={`${data.active.length} active`} open>
            <ul className="space-y-1">
              {data.active.map((p) => (
                <li key={p.id}><Link href={`/projects/${p.id}`} className="hover:text-accent">{p.t}</Link> <RefId id={p.id} /></li>
              ))}
            </ul>
          </Disclosure>
        )}
      </div>
    </div>
  );
}
