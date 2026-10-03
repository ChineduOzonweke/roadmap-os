"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useHydrated, useUserState } from "@/lib/store";
import { deleteDsa, logDsaAttempt, saveDsa } from "@/lib/actions";
import { CLEAN_TO_RETIRE, MISTAKES, OUTCOMES, cleanStreak, dueResolves, mistakeCounts, mistakeLabel } from "@/lib/dsa";
import { localDay } from "@/lib/today";
import type { DsaAttempt, DsaDifficulty, DsaMistake, DsaProblem, DsaStatus } from "@/types/state";
import { Bar, ExternalLink, cx } from "./ui";

export type Pattern = { id: string; text: string; topicId: string; topicLabel: string };

const DIFF: DsaDifficulty[] = ["easy", "medium", "hard"];
const STATUS: { id: DsaStatus; label: string }[] = [
  { id: "todo", label: "To do" },
  { id: "attempted", label: "Attempted" },
  { id: "solved_with_help", label: "Solved with help" },
  { id: "solved", label: "Solved alone" },
];
const statusLabel = (s: DsaStatus) => STATUS.find((x) => x.id === s)?.label ?? s;

type Draft = Omit<DsaProblem, "id" | "createdAt" | "updatedAt"> & { id?: string; createdAt?: string };
const blank = (): Draft => ({
  title: "", url: "", source: "", difficulty: "medium", status: "todo", patterns: [], missed: "", why: "", better: "",
  notes: "", revisitOn: null, attempts: 0,
});

const plusDays = (d: number) => localDay(new Date(Date.now() + d * 86400000));
const today = () => localDay();
const outcomeLabel = (o: DsaAttempt["outcome"]) => (o === "clean" ? "Clean" : o === "with_help" ? "With help" : "Not solved");

/** Log one attempt: outcome first, then (if it was not clean) what went wrong. */
function AttemptForm({ p, onDone }: { p: DsaProblem; onDone: () => void }) {
  const [outcome, setOutcome] = useState<DsaAttempt["outcome"] | null>(null);
  const [mistake, setMistake] = useState<DsaMistake | "">("");
  const [minutes, setMinutes] = useState("");
  const [note, setNote] = useState("");
  return (
    <form
      className="mt-2 space-y-2 rounded-lg border border-rule bg-surface-2/40 p-3"
      onSubmit={(e) => {
        e.preventDefault();
        if (!outcome) return;
        logDsaAttempt(p.id, { outcome, mistake: mistake || undefined, minutes: Number(minutes) || undefined, note });
        onDone();
      }}
    >
      <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Outcome">
        {OUTCOMES.map((o) => (
          <button key={o.id} type="button" role="radio" aria-checked={outcome === o.id} onClick={() => setOutcome(o.id)} className="chip">{o.label}</button>
        ))}
      </div>
      {outcome && outcome !== "clean" && (
        <label className="block text-sm">
          <span className="mb-1 block text-muted">What went wrong</span>
          <select className="input text-sm" value={mistake} onChange={(e) => setMistake(e.target.value as DsaMistake | "")}>
            <option value="">Choose one (optional)</option>
            {MISTAKES.map((m) => <option key={m.id} value={m.id}>{m.label}</option>)}
          </select>
        </label>
      )}
      <div className="grid gap-2 sm:grid-cols-[8rem_1fr]">
        <label className="text-sm"><span className="mb-1 block text-muted">Minutes</span>
          <input className="input text-sm" type="number" min={0} inputMode="numeric" value={minutes} onChange={(e) => setMinutes(e.target.value)} /></label>
        <label className="text-sm"><span className="mb-1 block text-muted">Note</span>
          <input className="input text-sm" value={note} onChange={(e) => setNote(e.target.value)} placeholder="The key insight, or where it broke" /></label>
      </div>
      <p className="text-xs text-muted">Not clean: back in 3 days. Clean: 14 days, then 30; {CLEAN_TO_RETIRE} clean solves in a row retire it.</p>
      <div className="flex gap-2">
        <button type="submit" className="btn btn-primary btn-sm" disabled={!outcome}>Log attempt</button>
        <button type="button" className="btn btn-quiet btn-sm" onClick={onDone}>Cancel</button>
      </div>
    </form>
  );
}

function ProblemForm({ initial, patterns, onDone }: { initial: Draft; patterns: Pattern[]; onDone: () => void }) {
  const [d, setD] = useState<Draft>(initial);
  const [pf, setPf] = useState("");
  const set = <K extends keyof Draft>(k: K, v: Draft[K]) => setD({ ...d, [k]: v });
  const groups = useMemo(() => {
    const q = pf.trim().toLowerCase();
    const m = new Map<string, Pattern[]>();
    patterns.filter((p) => !q || `${p.id} ${p.text} ${p.topicLabel}`.toLowerCase().includes(q)).forEach((p) => m.set(p.topicLabel, [...(m.get(p.topicLabel) ?? []), p]));
    return [...m.entries()];
  }, [patterns, pf]);
  const label = (id: string) => patterns.find((p) => p.id === id)?.text ?? id;
  const field = "input";

  return (
    <form
      className="space-y-4 card p-4"
      onSubmit={(e) => {
        e.preventDefault();
        if (!d.title.trim()) return;
        saveDsa({ ...d, title: d.title.trim(), url: d.url.trim() });
        onDone();
      }}
    >
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <label className="sm:col-span-2"><span className="mb-1 block text-sm font-medium">Problem</span>
          <input required value={d.title} onChange={(e) => set("title", e.target.value)} className={field} placeholder="e.g. Longest substring without repeating characters" /></label>
        <label><span className="mb-1 block text-sm font-medium">Link</span>
          <input type="url" value={d.url} onChange={(e) => set("url", e.target.value)} className={field} placeholder="https://" /></label>
        <label><span className="mb-1 block text-sm font-medium">Source</span>
          <input value={d.source} onChange={(e) => set("source", e.target.value)} className={field} placeholder="LeetCode, NeetCode, textbook" /></label>
        <label><span className="mb-1 block text-sm font-medium">Difficulty</span>
          <select value={d.difficulty} onChange={(e) => set("difficulty", e.target.value as DsaDifficulty)} className={field}>{DIFF.map((x) => <option key={x} value={x}>{x}</option>)}</select></label>
        <label><span className="mb-1 block text-sm font-medium">Status</span>
          <select value={d.status} onChange={(e) => set("status", e.target.value as DsaStatus)} className={field}>{STATUS.map((x) => <option key={x.id} value={x.id}>{x.label}</option>)}</select></label>
        <label><span className="mb-1 block text-sm font-medium">Attempts</span>
          <input type="number" min={0} value={d.attempts} onChange={(e) => set("attempts", Math.max(0, Number(e.target.value) || 0))} className={field} /></label>
        <div><span className="mb-1 block text-sm font-medium">Revisit on</span>
          <div className="flex flex-wrap items-center gap-1.5">
            <input type="date" value={d.revisitOn ?? ""} onChange={(e) => set("revisitOn", e.target.value || null)} className="w-auto input" aria-label="Revisit date" />
            {[3, 7, 30].map((n) => <button key={n} type="button" onClick={() => set("revisitOn", plusDays(n))} className="rounded border border-rule px-1.5 py-1 text-xs hover:border-accent">+{n}d</button>)}
            {d.revisitOn && <button type="button" onClick={() => set("revisitOn", null)} className="text-xs text-muted hover:underline">clear</button>}
          </div>
        </div>
      </div>

      <fieldset>
        <legend className="mb-1 text-sm font-medium">Patterns (from P04 topics)</legend>
        {d.patterns.length > 0 && (
          <div className="mb-2 flex flex-wrap gap-1.5">
            {d.patterns.map((id) => (
              <button key={id} type="button" onClick={() => set("patterns", d.patterns.filter((x) => x !== id))} className="rounded bg-accent-soft px-1.5 py-0.5 text-xs text-accent" aria-label={`Remove ${label(id)}`}>{label(id)} ×</button>
            ))}
          </div>
        )}
        <input value={pf} onChange={(e) => setPf(e.target.value)} placeholder="Filter patterns" aria-label="Filter patterns" className="mb-2 input" />
        <div className="max-h-52 overflow-y-auto rounded-md border border-rule p-2 scroll-thin">
          {groups.map(([g, ps]) => (
            <div key={g} className="mb-2">
              <p className="text-xs text-muted">{g}</p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {ps.map((p) => {
                  const on = d.patterns.includes(p.id);
                  return (
                    <button key={p.id} type="button" aria-pressed={on} onClick={() => set("patterns", on ? d.patterns.filter((x) => x !== p.id) : [...d.patterns, p.id])}
                      className={cx("rounded border px-1.5 py-0.5 text-xs", on ? "border-accent bg-accent-soft text-accent" : "border-rule hover:border-accent/60")}>
                      {p.text}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </fieldset>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <label><span className="mb-1 block text-sm font-medium">What I missed</span><textarea rows={3} value={d.missed} onChange={(e) => set("missed", e.target.value)} className={field} /></label>
        <label><span className="mb-1 block text-sm font-medium">Why I missed it</span><textarea rows={3} value={d.why} onChange={(e) => set("why", e.target.value)} className={field} /></label>
        <label><span className="mb-1 block text-sm font-medium">Better approach</span><textarea rows={3} value={d.better} onChange={(e) => set("better", e.target.value)} className={field} /></label>
      </div>
      <label className="block"><span className="mb-1 block text-sm font-medium">Notes</span><textarea rows={3} value={d.notes} onChange={(e) => set("notes", e.target.value)} className={field} placeholder="Complexity, edge cases, the key insight" /></label>

      <div className="flex gap-2">
        <button type="submit" className="btn btn-primary btn-sm">{d.id ? "Save changes" : "Add problem"}</button>
        <button type="button" onClick={onDone} className="btn btn-secondary btn-sm">Cancel</button>
      </div>
    </form>
  );
}

export function DsaJournal({ patterns, practice, laneNote }: { patterns: Pattern[]; practice: { id: string; name: string; url: string }[]; laneNote: string }) {
  const s = useUserState();
  const ready = useHydrated();
  const [editing, setEditing] = useState<Draft | null>(null);
  const [formKey, setFormKey] = useState(0);
  const [status, setStatus] = useState("all");
  const [diff, setDiff] = useState("all");
  const [pattern, setPattern] = useState("all");
  const [view, setView] = useState<"problems" | "mistakes">("problems");
  const [logging, setLogging] = useState<string | null>(null);

  const stats = useMemo(() => {
    const byPattern = new Map<string, number>();
    s.dsa.forEach((p) => p.patterns.forEach((x) => byPattern.set(x, (byPattern.get(x) ?? 0) + 1)));
    return {
      total: s.dsa.length,
      solved: s.dsa.filter((p) => p.status === "solved").length,
      byDiff: DIFF.map((d) => [d, s.dsa.filter((p) => p.difficulty === d).length] as const),
      due: dueResolves(s.dsa, today()),
      top: [...byPattern.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8),
    };
  }, [s.dsa]);

  if (!ready) return <div className="h-64 animate-pulse rounded-lg bg-surface-2" aria-label="Loading DSA journal" />;
  const pText = (id: string) => patterns.find((p) => p.id === id)?.text ?? id;
  const list = s.dsa.filter((p) =>
    (status === "all" || (status === "due" ? !!p.revisitOn && p.revisitOn <= today() : p.status === status)) &&
    (diff === "all" || p.difficulty === diff) &&
    (pattern === "all" || p.patterns.includes(pattern)),
  );
  const mistakes = s.dsa.filter((p) => p.missed || p.why || p.better || p.attemptLog?.some((a) => a.mistake));
  const byType = mistakeCounts(s.dsa);
  const open = (d: Draft) => { setEditing(d); setFormKey((k) => k + 1); };

  return (
    <div className="space-y-8">
      <section className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-rule bg-rule sm:grid-cols-4" aria-label="DSA stats">
        <div className="bg-surface px-4 py-3"><p className="t-eyebrow">Logged</p><p className="t-data mt-1 text-xl">{stats.total}</p></div>
        <div className="bg-surface px-4 py-3"><p className="t-eyebrow">Solved alone</p><p className="t-data mt-1 text-xl">{stats.solved}</p>{stats.total > 0 && <Bar value={stats.solved / stats.total} className="mt-2" label="Solved alone" />}</div>
        <div className="bg-surface px-4 py-3"><p className="t-eyebrow">By difficulty</p><p className="t-data mt-1 text-sm">{stats.byDiff.map(([d, n]) => `${d[0].toUpperCase()}${n}`).join(" · ")}</p></div>
        <div className="bg-surface px-4 py-3"><p className="t-eyebrow">Due to re-solve</p><p className={cx("t-data mt-1 text-xl", stats.due.length > 0 && "text-warn")}>{stats.due.length}</p></div>
      </section>

      {stats.due.length > 0 && (
        <section aria-labelledby="resolve">
          <h2 id="resolve" className="h-section mb-1">Due to re-solve today</h2>
          <p className="mb-2 text-sm text-muted">Solve from a blank editor, no notes. Failed problems keep coming back until they are solved cleanly.</p>
          <ul className="list-card">
            {stats.due.map((p) => {
              const last = p.attemptLog?.[p.attemptLog.length - 1];
              return (
                <li key={p.id} className="px-3 py-3">
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <span className="min-w-0 flex-1 font-medium">{p.url && /^https?:\/\//.test(p.url) ? <ExternalLink href={p.url}>{p.title}</ExternalLink> : p.title}</span>
                    <span className="text-xs text-muted">due {p.revisitOn}{last ? `, last: ${outcomeLabel(last.outcome).toLowerCase()}${last.mistake ? ` (${mistakeLabel(last.mistake).toLowerCase()})` : ""}` : ""}</span>
                  </div>
                  {logging === p.id ? <AttemptForm p={p} onDone={() => setLogging(null)} /> : (
                    <button type="button" className="btn btn-secondary btn-sm mt-2" onClick={() => setLogging(p.id)}>Log attempt</button>
                  )}
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {editing ? (
        <ProblemForm key={formKey} initial={editing} patterns={patterns} onDone={() => setEditing(null)} />
      ) : (
        <button type="button" onClick={() => open(blank())} className="btn btn-primary btn-sm">Log a problem</button>
      )}

      <section>
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <div className="flex gap-1.5" role="tablist" aria-label="Journal view">
            <button role="tab" type="button" aria-selected={view === "problems"} onClick={() => setView("problems")} className="chip">Problems</button>
            <button role="tab" type="button" aria-selected={view === "mistakes"} onClick={() => setView("mistakes")} className="chip">Mistake log ({mistakes.length})</button>
          </div>
          {view === "problems" && (
            <div className="flex flex-wrap gap-2">
              <select aria-label="Status filter" value={status} onChange={(e) => setStatus(e.target.value)} className="w-auto input">
                <option value="all">Any status</option>
                <option value="due">Due for revisit</option>
                {STATUS.map((x) => <option key={x.id} value={x.id}>{x.label}</option>)}
              </select>
              <select aria-label="Difficulty filter" value={diff} onChange={(e) => setDiff(e.target.value)} className="w-auto input">
                <option value="all">Any difficulty</option>
                {DIFF.map((x) => <option key={x}>{x}</option>)}
              </select>
              <select aria-label="Pattern filter" value={pattern} onChange={(e) => setPattern(e.target.value)} className="max-w-56 input">
                <option value="all">Any pattern</option>
                {patterns.filter((p) => s.dsa.some((x) => x.patterns.includes(p.id))).map((p) => <option key={p.id} value={p.id}>{p.text}</option>)}
              </select>
            </div>
          )}
        </div>

        {view === "problems" ? (
          list.length === 0 ? (
            <div className="rounded-lg border border-dashed border-rule px-4 py-8 text-center text-sm">
              <p className="font-medium">{s.dsa.length ? "No problems match these filters" : "No problems logged yet"}</p>
              <p className="mt-1 text-muted">{s.dsa.length ? "Clear a filter to see more." : "Log the first one after your next DSA session. Tag it with a pattern so it shows up on that topic's page."}</p>
            </div>
          ) : (
            <ul className="list-card">
              {list.map((p) => (
                <li key={p.id} className="px-3 py-3">
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <span className="min-w-0 flex-1 font-medium">{p.url && /^https?:\/\//.test(p.url) ? <ExternalLink href={p.url}>{p.title}</ExternalLink> : p.title}</span>
                    <span className={cx("text-xs", p.difficulty === "hard" ? "text-danger" : p.difficulty === "medium" ? "text-warn" : "text-ok")}>{p.difficulty}</span>
                    <span className="text-xs text-muted">{statusLabel(p.status)}{p.attempts ? `, ${p.attempts} attempt(s)` : ""}</span>
                  </div>
                  {p.patterns.length > 0 && <p className="mt-1 flex flex-wrap gap-1.5">{p.patterns.map((x) => <Link key={x} href={`/topics/${x.split("#")[0]}`} className="rounded bg-surface-2 px-1.5 py-0.5 text-xs hover:text-accent">{pText(x)}</Link>)}</p>}
                  <p className="mt-1 text-xs text-muted">
                    {p.revisitOn ? <span className={cx(p.revisitOn <= today() && "text-warn")}>Re-solve {p.revisitOn}</span> : (p.attemptLog?.length ?? 0) > 0 && cleanStreak(p.attemptLog) >= CLEAN_TO_RETIRE ? "Retired: solved cleanly " + CLEAN_TO_RETIRE + " times in a row" : null}
                    {p.cleanSolvedAt && <span>{p.revisitOn ? " · " : ""}last clean solve {p.cleanSolvedAt.slice(0, 10)}</span>}
                    {(p.attemptLog?.length ?? 0) > 0 && cleanStreak(p.attemptLog) < CLEAN_TO_RETIRE && <span> · {cleanStreak(p.attemptLog)} of {CLEAN_TO_RETIRE} clean in a row</span>}
                  </p>
                  {(p.attemptLog?.length ?? 0) > 0 && (
                    <details className="mt-1 text-xs">
                      <summary className="cursor-pointer text-muted">Attempts ({p.attemptLog!.length})</summary>
                      <ul className="mt-1 space-y-0.5">
                        {[...p.attemptLog!].reverse().map((a, i) => (
                          <li key={a.at + i}>
                            <span className="tabular-nums text-muted">{a.at.slice(0, 10)}</span>{" "}
                            <span className={a.outcome === "clean" ? "text-ok" : a.outcome === "failed" ? "text-danger" : "text-warn"}>{outcomeLabel(a.outcome)}</span>
                            {a.mistake && <span className="text-muted">, {mistakeLabel(a.mistake).toLowerCase()}</span>}
                            {a.minutes ? <span className="text-muted">, {a.minutes} min</span> : null}
                            {a.note && <span className="text-muted">: {a.note}</span>}
                          </li>
                        ))}
                      </ul>
                    </details>
                  )}
                  {logging === p.id && <AttemptForm p={p} onDone={() => setLogging(null)} />}
                  {p.notes && <p className="mt-1 whitespace-pre-wrap text-sm text-muted">{p.notes}</p>}
                  <div className="-ml-1.5 mt-1 flex gap-1 text-sm">
                    <button type="button" className="btn btn-quiet btn-sm" onClick={() => open({ ...p })}>Edit</button>
                    {logging !== p.id && <button type="button" className="btn btn-quiet btn-sm" onClick={() => setLogging(p.id)}>Log attempt</button>}
                    <button type="button" className="btn btn-quiet btn-sm text-danger hover:bg-danger-soft" onClick={() => { if (window.confirm(`Delete "${p.title}"?`)) deleteDsa(p.id); }}>Delete</button>
                  </div>
                </li>
              ))}
            </ul>
          )
        ) : mistakes.length === 0 ? (
          <p className="rounded-lg border border-dashed border-rule px-4 py-8 text-center text-sm text-muted">No mistakes recorded. Fill in &quot;what I missed&quot; when a problem goes wrong; the master DSA track treats this log as the main learning signal.</p>
        ) : (
          <ul className="space-y-3">
            {byType.length > 0 && (
              <li className="card p-3 text-sm">
                <p className="font-medium">Mistakes by type</p>
                <ul className="mt-1 space-y-0.5">{byType.map(([m, n]) => <li key={m} className="flex justify-between gap-3"><span>{mistakeLabel(m)}</span><span className="tabular-nums text-muted">{n}</span></li>)}</ul>
              </li>
            )}
            {mistakes.map((p) => (
              <li key={p.id} className="card p-3 text-sm">
                <p className="font-medium">{p.title} <span className="text-xs font-normal text-muted">{p.patterns.map(pText).join(", ")}</span></p>
                <dl className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-3">
                  <div><dt className="text-xs text-muted">Missed</dt><dd className="whitespace-pre-wrap">{p.missed || "—"}</dd></div>
                  <div><dt className="text-xs text-muted">Why</dt><dd className="whitespace-pre-wrap">{p.why || "—"}</dd></div>
                  <div><dt className="text-xs text-muted">Better approach</dt><dd className="whitespace-pre-wrap">{p.better || "—"}</dd></div>
                </dl>
              </li>
            ))}
          </ul>
        )}
      </section>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <section>
          <h2 className="h-section mb-3">Most practised patterns</h2>
          {stats.top.length ? (
            <ul className="space-y-1 text-sm">{stats.top.map(([id, n]) => <li key={id} className="flex justify-between gap-3"><Link className="hover:text-accent" href={`/topics/${id.split("#")[0]}`}>{pText(id)}</Link><span className="tabular-nums text-muted">{n}</span></li>)}</ul>
          ) : <p className="text-sm text-muted">Tag problems with patterns to see coverage.</p>}
        </section>
        <section>
          <h2 className="h-section mb-3">DSA lane and practice sources</h2>
          <p className="mb-2 text-sm text-muted">{laneNote}</p>
          <ul className="space-y-1 text-sm">{practice.map((r) => <li key={r.id}><ExternalLink href={r.url}>{r.name || r.url}</ExternalLink></li>)}</ul>
        </section>
      </div>
    </div>
  );
}
