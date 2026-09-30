"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useDraft } from "@/lib/useDraft";
import { useHydrated, useUserState } from "@/lib/store";
import {
  conceptBlocker, gatePassed, gateById, gateName, nameOf, nextReviewDate, phaseRollup, topicById, topicView, weekByCw, weekView, pct,
} from "@/lib/progress";
import {
  recordReview, setCheck, setChecks, setCurrentWeek, setDepth, setEvidence, setGateCriterion, setGateEvidence,
  setGateStatus, setMastery, setNote, setWeekDone,
} from "@/lib/actions";
import { conceptSlug, hrefFor } from "@/lib/ids";
import type { DepthLevel, GateStatus, MasteryLevel } from "@/types/state";
import { Bar, InlineText, StatusPill, cx } from "./ui";
import { IconChevron, IconLock } from "./icons";
import { RefId } from "./Ref";

function Placeholder({ className }: { className?: string }) {
  return <span className={cx("inline-block h-5 w-24 animate-pulse rounded bg-surface-2", className)} aria-hidden />;
}

// ------------------------------------------------------------------ status badges
export function TopicStatus({ topicId, showBar = false }: { topicId: string; showBar?: boolean }) {
  const s = useUserState();
  const ready = useHydrated();
  const t = topicById.get(topicId);
  if (!t) return null;
  if (!ready) return <Placeholder />;
  const v = topicView(s, t);
  return (
    <span className="inline-flex flex-wrap items-center gap-2">
      <StatusPill status={v.status} />
      {v.total > 1 && <span className="text-xs text-muted tabular-nums">{v.done}/{v.total}</span>}
      {showBar && v.total > 0 && <Bar value={v.pct} className="w-20" tone={v.status === "completed" || v.status === "mastered" ? "ok" : "accent"} label="Checklist progress" />}
    </span>
  );
}

export function PhaseStatus({ phaseId, compact = false }: { phaseId: string; compact?: boolean }) {
  const s = useUserState();
  const ready = useHydrated();
  if (!ready) return <Placeholder />;
  const r = phaseRollup(s, phaseId);
  if (compact) return <StatusPill status={r.status} />;
  return (
    <div className="flex flex-wrap items-center gap-3 text-sm">
      <StatusPill status={r.status} />
      <span className="tabular-nums text-muted">{r.done}/{r.total} checklist items</span>
      <span className="tabular-nums text-muted">{r.mastered}/{r.topics} topics mastered</span>
      <Bar value={r.pct} className="w-32" label="Phase checklist progress" />
    </div>
  );
}

export function WeekStatusPill({ cw }: { cw: number }) {
  const s = useUserState();
  const ready = useHydrated();
  if (!ready) return <Placeholder className="w-16" />;
  const w = weekByCw(cw);
  const v = weekView(s, w);
  return (
    <span className="inline-flex items-center gap-2">
      <StatusPill status={v.status} />
      {v.total > 0 && <span className="text-xs tabular-nums text-muted">{v.done}/{v.total}</span>}
    </span>
  );
}

// ------------------------------------------------------------------ checklists
export type ChecklistItem = { id: string; text: string };

export function ConceptChecklist({ items, showIds = true, linkConcepts = true, onToggle }: { items: ChecklistItem[]; showIds?: boolean; linkConcepts?: boolean; onToggle?: (id: string, checked: boolean) => void }) {
  const s = useUserState();
  const ready = useHydrated();
  return (
    <ul className="divide-y divide-rule rounded-md border border-rule bg-surface">
      {items.map((it) => {
        const checked = ready && !!s.checks[it.id];
        const blocker = ready ? conceptBlocker(s, it.id) : null;
        return (
          <li key={it.id} className="flex items-stretch">
            <label className="flex min-h-11 flex-1 cursor-pointer items-start gap-3 px-3 py-2.5 active:bg-surface-2">
              <input
                type="checkbox"
                className="mt-0.5 h-5 w-5 shrink-0 accent-[var(--accent)]"
                checked={checked}
                disabled={!ready}
                onChange={(e) => { setCheck(it.id, e.target.checked); onToggle?.(it.id, e.target.checked); }}
              />
              <span className="min-w-0 flex-1">
                <span className={cx(checked && "text-muted line-through decoration-rule")}>
                  <InlineText text={it.text} />
                </span>
                {blocker && (
                  <span className="ml-2 inline-flex items-center gap-1 text-xs text-warn">
                    <IconLock width={12} height={12} /> after {nameOf(blocker)}
                  </span>
                )}
                {showIds && <> <RefId id={it.id} /></>}
              </span>
            </label>
            {linkConcepts && it.id.includes("#") && (
              <Link
                href={`/concepts/${conceptSlug(it.id)}`}
                className="flex w-10 shrink-0 items-center justify-center text-faint hover:text-accent"
                aria-label="Details and notes"
                title="Details and notes"
              >
                <IconChevron width={16} height={16} />
              </Link>
            )}
          </li>
        );
      })}
    </ul>
  );
}

export function ChecklistSummary({ ids }: { ids: string[] }) {
  const s = useUserState();
  const ready = useHydrated();
  if (!ready || ids.length === 0) return null;
  const done = ids.filter((i) => !!s.checks[i]).length;
  const all = done === ids.length;
  return (
    <div className="flex flex-wrap items-center gap-3 text-sm">
      <span className="tabular-nums text-muted">{done} of {ids.length} checked ({pct(done / ids.length)})</span>
      <Bar value={done / ids.length} className="w-32" tone={all ? "ok" : "accent"} label="Checklist progress" />
      <button type="button" className="text-accent hover:underline" onClick={() => setChecks(ids, !all)}>
        {all ? "Uncheck all" : "Check all"}
      </button>
    </div>
  );
}

export function SingleCheck({ id, label }: { id: string; label: string }) {
  const s = useUserState();
  const ready = useHydrated();
  const checked = ready && !!s.checks[id];
  return (
    <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-rule bg-surface px-3 py-2">
      <input type="checkbox" className="h-4 w-4 accent-[var(--accent)]" checked={checked} disabled={!ready} onChange={(e) => setCheck(id, e.target.checked)} />
      <span>{label}</span>
    </label>
  );
}

// ------------------------------------------------------------------ gate notice for topics
export function ClearanceNotice({ topicId }: { topicId: string }) {
  const s = useUserState();
  const ready = useHydrated();
  const t = topicById.get(topicId);
  if (!ready || !t) return null;
  const v = topicView(s, t);
  if (v.cleared) {
    return (
      <p className="rounded-md border border-rule bg-surface px-3 py-2 text-sm">
        <span className="font-medium text-ok">Cleared to work on.</span>{" "}
        <span className="text-muted">{t.g ? `${t.g} is passed.` : "No gate is required before this topic."}</span>
      </p>
    );
  }
  return (
    <div className="rounded-md border border-warn/40 bg-warn-soft px-3 py-2 text-sm">
      <p className="flex items-center gap-2 font-medium text-warn"><IconLock width={16} height={16} /> Not cleared yet. You can read it, but it is not your current work.</p>
      <ul className="mt-1 list-disc pl-5 text-ink">
        {v.blockers.map((b) => (
          <li key={b}>
            {gateById.has(b) ? "Pass " : "Complete "}
            <Link className="text-accent underline" href={hrefFor(b) ?? "#"}>{gateById.has(b) ? gateName(b) : nameOf(b)}</Link> <RefId id={b} />
          </li>
        ))}
      </ul>
    </div>
  );
}

// ------------------------------------------------------------------ mastery + depth
type MasteryState = { level: number; id: string; name: string; master: string };
type DepthDef = { level: number; name: string; definition: string };

export function MasteryPanel({ topicId, states, depths, target }: { topicId: string; states: MasteryState[]; depths: DepthDef[]; target: [number, number] | null }) {
  const s = useUserState();
  const ready = useHydrated();
  const tp = s.topics[topicId];
  const mastery = tp?.mastery ?? 0;
  const depth = tp?.depth ?? null;
  const [evidence, setEv] = useDraft(tp?.evidence ?? "");
  const next = ready ? nextReviewDate(s, topicId) : null;
  const t = topicById.get(topicId);
  const v = t && ready ? topicView(s, t) : null;

  if (!ready) return <Placeholder className="h-40 w-full" />;
  return (
    <div className="space-y-5">
      <div>
        <p className="mb-2 text-sm font-medium">Mastery stage</p>
        <ol className="grid grid-cols-1 gap-1.5 sm:grid-cols-3">
          {states.map((st) => {
            const active = st.level === mastery;
            const reached = st.level <= mastery;
            return (
              <li key={st.id}>
                <button
                  type="button"
                  onClick={() => setMastery(topicId, st.level as MasteryLevel)}
                  aria-pressed={active}
                  className={cx(
                    "w-full rounded-md border px-2.5 py-2 text-left text-sm",
                    active ? "border-accent bg-accent-soft" : reached ? "border-rule bg-surface-2" : "border-rule bg-surface hover:border-accent/60",
                  )}
                >
                  <span className="flex items-center gap-2 font-medium"><span className="font-mono text-xs text-muted">{st.level}</span>{st.name}</span>
                  <span className="mt-0.5 block text-xs leading-snug text-muted">{st.master}</span>
                </button>
              </li>
            );
          })}
        </ol>
        {v && mastery >= 4 && v.done < v.total && (
          <p className="mt-2 text-sm text-warn">The checklist still has {v.total - v.done} open item(s). Mastered status needs the checklist complete as well.</p>
        )}
      </div>

      <div>
        <p className="mb-1 text-sm font-medium">Current depth</p>
        <p className="mb-2 text-xs text-muted">
          Target {target ? `D${target[0]}${target[1] !== target[0] ? `–D${target[1]}` : ""}` : "not stated in the master"}. Set the level you can honestly demonstrate today.
        </p>
        <div className="flex flex-wrap gap-1.5">
          {depths.map((d) => {
            const inTarget = target && d.level >= target[0] && d.level <= target[1];
            return (
              <button
                key={d.level}
                type="button"
                title={d.definition}
                aria-pressed={depth === d.level}
                onClick={() => setDepth(topicId, depth === d.level ? null : (d.level as DepthLevel))}
                className={cx(
                  "rounded-md border px-2.5 py-1.5 text-sm",
                  depth === d.level ? "border-accent bg-accent text-accent-ink" : "border-rule bg-surface hover:border-accent/60",
                  inTarget && depth !== d.level && "ring-1 ring-accent/50",
                )}
              >
                <span className="font-mono">D{d.level}</span> {d.name}
              </button>
            );
          })}
        </div>
        {depth != null && <p className="mt-2 text-sm text-muted">D{depth}: {depths[depth]?.definition}</p>}
      </div>

      <div>
        <label htmlFor={`ev-${topicId}`} className="mb-1 block text-sm font-medium">Evidence</label>
        <p className="mb-2 text-xs text-muted">Link or describe the artifact, unseen task or practical check that proves this (repo URL, notebook, writeup).</p>
        <textarea
          id={`ev-${topicId}`}
          value={evidence}
          onChange={(e) => setEv(e.target.value)}
          onBlur={() => evidence !== (tp?.evidence ?? "") && setEvidence(topicId, evidence)}
          rows={2}
          className="w-full rounded-md border border-rule bg-surface px-3 py-2 text-sm"
          placeholder="e.g. github.com/you/repo, unseen task solved on paper"
        />
      </div>

      {mastery >= 4 && (
        <div className="rounded-md border border-rule bg-surface px-3 py-2 text-sm">
          <p className="font-medium">Spaced re-test</p>
          <p className="text-muted">
            {tp?.reviews?.count ?? 0} re-test(s) recorded.{" "}
            {next ? <>Next re-test due {next.toLocaleDateString()}.</> : "All scheduled re-tests are done."}
          </p>
          <button type="button" onClick={() => recordReview(topicId)} className="mt-2 rounded-md border border-accent px-2.5 py-1 text-accent hover:bg-accent-soft">
            Record a passed re-test
          </button>
        </div>
      )}
    </div>
  );
}

// ------------------------------------------------------------------ notes
export function NotesEditor({ entityId, title = "Notes" }: { entityId: string; title?: string }) {
  const s = useUserState();
  const ready = useHydrated();
  const saved = s.notes[entityId]?.text ?? "";
  const [dirty, setDirty] = useState(false);
  const [text, setText] = useDraft(saved, dirty);
  useEffect(() => {
    if (!dirty) return;
    const h = setTimeout(() => { setNote(entityId, text); setDirty(false); }, 600);
    return () => clearTimeout(h);
  }, [text, dirty, entityId]);
  return (
    <div>
      <div className="mb-1 flex items-baseline justify-between">
        <label htmlFor={`note-${entityId}`} className="text-sm font-medium">{title}</label>
        <span className="text-xs text-faint">{!ready ? "Loading" : dirty ? "Saving" : saved ? `Saved ${new Date(s.notes[entityId]!.updatedAt).toLocaleString()}` : "Saved as you type"}</span>
      </div>
      <textarea
        id={`note-${entityId}`}
        value={text}
        disabled={!ready}
        onChange={(e) => { setText(e.target.value); setDirty(true); }}
        rows={5}
        className="w-full rounded-md border border-rule bg-surface px-3 py-2 text-sm leading-relaxed"
        placeholder="What clicked, what still breaks, questions to revisit"
      />
    </div>
  );
}

// ------------------------------------------------------------------ weeks
export function WeekControls({ cw }: { cw: number }) {
  const s = useUserState();
  const ready = useHydrated();
  if (!ready) return <Placeholder className="h-9 w-64" />;
  const w = weekByCw(cw);
  const v = weekView(s, w);
  const current = s.currentWeek === cw;
  return (
    <div className="flex flex-wrap items-center gap-3">
      <StatusPill status={v.status} />
      {v.total > 0 && (
        <span className="flex items-center gap-2 text-sm text-muted">
          <span className="tabular-nums">{v.done}/{v.total} items</span>
          <Bar value={v.pct} className="w-28" label="Week progress" />
        </span>
      )}
      {current ? (
        <span className="rounded-md bg-accent px-2.5 py-1 text-sm text-accent-ink">Current week</span>
      ) : (
        <button type="button" onClick={() => setCurrentWeek(cw)} className="rounded-md border border-rule px-2.5 py-1 text-sm hover:border-accent">
          Make this my current week
        </button>
      )}
      <button
        type="button"
        onClick={() => {
          const done = !s.weeks[cw]?.done;
          setWeekDone(cw, done);
          if (done && current && cw < 206) setCurrentWeek(cw + 1);
        }}
        className={cx("rounded-md px-2.5 py-1 text-sm", s.weeks[cw]?.done ? "border border-rule hover:border-accent" : "bg-ok text-white hover:opacity-90")}
      >
        {s.weeks[cw]?.done ? "Mark week not complete" : current ? "Complete week and move on" : "Mark week complete"}
      </button>
      {!v.cleared && w.rg && (
        <span className="text-sm text-warn">{gateName(w.rg)} is not passed yet.</span>
      )}
    </div>
  );
}

// ------------------------------------------------------------------ gates
const GATE_STATUS: { id: GateStatus; label: string }[] = [
  { id: "not_attempted", label: "Not attempted" },
  { id: "attempting", label: "Attempting" },
  { id: "passed", label: "Passed" },
];

export function GateControls({ gateId, criteria, requires }: { gateId: string; criteria: string[]; requires: string[] }) {
  const s = useUserState();
  const ready = useHydrated();
  const g = s.gates[gateId];
  const [ev, setEv] = useDraft(g?.evidence ?? "");
  const reqStatus = useMemo(() => requires.map((r) => {
    const t = topicById.get(r);
    if (t) {
      const v = topicView(s, t);
      return { id: r, ok: v.status === "completed" || v.status === "mastered", label: t.t };
    }
    if (gateById.has(r)) return { id: r, ok: gatePassed(s, r), label: gateById.get(r)!.t };
    if (/^PR\d\d$/.test(r)) return { id: r, ok: s.projects[r]?.status === "complete", label: "project complete" };
    return { id: r, ok: false, label: r };
  }), [requires, s]);
  if (!ready) return <Placeholder className="h-40 w-full" />;
  const done = criteria.filter((_, i) => g?.criteria?.[i]).length;
  const open = reqStatus.filter((r) => !r.ok);
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-2" role="group" aria-label="Gate status">
        {GATE_STATUS.map((o) => (
          <button
            key={o.id}
            type="button"
            aria-pressed={(g?.status ?? "not_attempted") === o.id}
            onClick={() => setGateStatus(gateId, o.id)}
            className={cx(
              "rounded-md border px-3 py-1.5 text-sm",
              (g?.status ?? "not_attempted") === o.id ? (o.id === "passed" ? "border-ok bg-ok text-white" : "border-accent bg-accent-soft") : "border-rule bg-surface hover:border-accent/60",
            )}
          >
            {o.label}
          </button>
        ))}
        {g?.passedAt && <span className="self-center text-sm text-muted">Passed {new Date(g.passedAt).toLocaleDateString()}</span>}
      </div>
      {g?.status === "passed" && open.length > 0 && (
        <p className="text-sm text-warn">Marked passed while {open.length} required item(s) are still open. That is allowed; make sure the practical gate really passed.</p>
      )}
      {criteria.length > 0 && (
        <div>
          <p className="mb-2 text-sm font-medium">Pass criteria <span className="font-normal text-muted">({done}/{criteria.length})</span></p>
          <ul className="divide-y divide-rule rounded-md border border-rule bg-surface">
            {criteria.map((c, i) => (
              <li key={i} className="flex items-start gap-3 px-3 py-2">
                <input type="checkbox" className="mt-1 h-4 w-4 accent-[var(--accent)]" checked={!!g?.criteria?.[i]} onChange={(e) => setGateCriterion(gateId, i, e.target.checked)} aria-label={`Criterion ${i + 1}`} />
                <span><InlineText text={c} /></span>
              </li>
            ))}
          </ul>
        </div>
      )}
      <div>
        <p className="mb-2 text-sm font-medium">Required before this gate</p>
        <ul className="grid grid-cols-1 gap-1 sm:grid-cols-2">
          {reqStatus.map((r) => (
            <li key={r.id} className="flex items-center gap-2 text-sm">
              <span aria-hidden className={cx("h-2 w-2 rounded-full", r.ok ? "bg-ok" : "border border-lock")} />
              <Link href={hrefFor(r.id) ?? "#"} className="truncate hover:text-accent">{gateById.has(r.id) ? gateName(r.id) : nameOf(r.id)}</Link>
              <RefId id={r.id} />
            </li>
          ))}
        </ul>
      </div>
      <div>
        <label htmlFor={`gev-${gateId}`} className="mb-1 block text-sm font-medium">Evidence for this gate</label>
        <textarea id={`gev-${gateId}`} rows={2} value={ev} onChange={(e) => setEv(e.target.value)} onBlur={() => setGateEvidence(gateId, ev)} className="w-full rounded-md border border-rule bg-surface px-3 py-2 text-sm" placeholder="Unseen tasks attempted, links to the artifact, what was checked" />
      </div>
    </div>
  );
}

export function GateBadge({ gateId }: { gateId: string }) {
  const s = useUserState();
  const ready = useHydrated();
  if (!ready) return <Placeholder className="w-16" />;
  const st = s.gates[gateId]?.status ?? "not_attempted";
  const style = st === "passed" ? "bg-ok-soft text-ok" : st === "attempting" ? "bg-warn-soft text-warn" : "bg-surface-2 text-muted";
  const text = st === "passed" ? "Passed" : st === "attempting" ? "Attempting" : "Not passed";
  return <span className={cx("inline-flex rounded px-1.5 py-0.5 text-xs font-medium", style)}>{text}</span>;
}
