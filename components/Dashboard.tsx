"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useHydrated, useUserState } from "@/lib/store";
import {
  COMPETENCY_GATES, approachingGate, availableTopics, gateById, gateCriteriaDone, gateName, gatePassed, idx,
  overallRollup, pct, phaseById, phaseRollup, stageOfWeek, unitLabel, weekByCw, weekView, weeksCompleted,
} from "@/lib/progress";
import { currentTier } from "@/lib/ai";
import { WeekStrip } from "./WeekStrip";
import { RefId } from "./Ref";
import { Bar, Disclosure, InlineText, StatusGlyph, StatusPill, cx } from "./ui";

function Stat({ label, value, sub, bar }: { label: string; value: string; sub?: string; bar?: number }) {
  return (
    <div className="min-w-0">
      <p className="text-2xl font-semibold leading-none tabular-nums tracking-tight">{value}{sub && <span className="ml-1 text-sm font-normal text-muted">{sub}</span>}</p>
      <p className="mt-1.5 text-sm text-muted">{label}</p>
      {bar != null && <Bar value={bar} className="mt-2.5" label={label} />}
    </div>
  );
}

function ago(iso: string) {
  const d = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);
  return d <= 0 ? "Today" : d === 1 ? "Yesterday" : d < 7 ? `${d} days ago` : new Date(iso).toLocaleDateString();
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
      recent: Object.entries(s.checks).sort((a, b) => b[1].localeCompare(a[1])).slice(0, 5),
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
        <h1 className="text-[1.75rem] font-semibold leading-[1.15] tracking-[-0.015em]">Progress</h1>
        <p className="mt-2 text-muted">What you have done, where you are, and what comes next.</p>
      </header>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:items-start lg:gap-6">
      <section aria-labelledby="where" className="card p-5">
        <h2 id="where" className="text-sm text-muted">Where you are</h2>
        <p className="mt-1 text-lg font-semibold leading-snug">Week {cw} of 206: {w.t}</p>
        <p className="mt-0.5 text-sm text-muted">
          {phase && <><Link href={`/phases/${data.phaseId}`} className="hover:text-accent">{phase.t}</Link> <RefId id={data.phaseId} />, </>}
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
        <Link href="/" className="btn btn-primary btn-block mt-5">Continue today&apos;s work</Link>
      </section>

      <section aria-labelledby="next">
        <h2 id="next" className="h-section mb-3">What comes next</h2>
        <div className="space-y-3">
          {gate && (
            <Link href={`/checkpoints/${gate.id}`} className="card block p-4 hover:bg-surface-2/60">
              <p className="text-xs text-muted">{data.ap?.blocking ? "Checkpoint behind you, not yet passed" : "Next checkpoint"}</p>
              <p className="font-medium">{gateName(gate.id)} <RefId id={gate.id} /></p>
              <p className="text-sm text-muted">{gate.w ? (gate.w > cw ? `Planned for week ${gate.w}, ${gate.w - cw} week(s) ahead` : `Planned for week ${gate.w}`) : "Timed to recruiting periods"}</p>
              {gate.n > 0 && <Bar value={gateCriteriaDone(s, gate) / gate.n} className="mt-2" label="Checkpoint criteria" />}
            </Link>
          )}
          <ul className="list-card">
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
      </div>

      <section aria-labelledby="done">
        <h2 id="done" className="h-section mb-3">Completed so far</h2>
        <div className="card grid grid-cols-2 gap-x-6 gap-y-6 p-5 sm:grid-cols-4">
          <Stat label="Weeks complete" value={`${data.weeksDone}`} sub="/ 206" bar={data.weeksDone / 206} />
          <Stat label={`Checklist items (${pct(data.overall.pct)})`} value={`${data.overall.done}`} sub={`/ ${data.overall.total}`} bar={data.overall.pct} />
          <Stat label="Topics mastered" value={`${data.overall.mastered}`} sub={`/ ${data.overall.topics}`} bar={data.overall.mastered / data.overall.topics} />
          <Stat label="Checkpoints passed" value={`${data.gatesPassed}`} sub="/ 8" bar={data.gatesPassed / 8} />
        </div>
        {data.recent.length > 0 && (
          <div className="mt-4">
            <h3 className="mb-2 text-sm font-medium text-muted">Recently ticked</h3>
            <ul className="list-card">
              {data.recent.map(([id, at]) => (
                <li key={id} className="flex items-center gap-3 px-4 py-2.5">
                  <StatusGlyph status="completed" />
                  <span className="min-w-0 flex-1 truncate"><InlineText text={unitLabel(id)} /></span>
                  <span className="shrink-0 text-xs text-muted">{ago(at)}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      <section aria-labelledby="map">
        <div className="mb-3 flex items-baseline justify-between">
          <h2 id="map" className="h-section">All 206 weeks</h2>
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
                  <Link href={`/checkpoints/${g}`} className={cx("flex min-h-12 items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-surface-2", passed && "text-ok")}>
                    <StatusGlyph status={passed ? "completed" : "available"} />
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
