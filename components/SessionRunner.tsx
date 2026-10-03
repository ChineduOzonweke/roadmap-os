"use client";

import Link from "next/link";
import { useEffect, useId, useState } from "react";
import { useDraft } from "@/lib/useDraft";
import { abandonSession, completeSession, goToStage, setMastery, setSessionLog, setStageNote, startSession } from "@/lib/actions";
import { elapsedMinutes, localDay, planMinutes, sessionMinutes, sessionStages, type StepTemplate } from "@/lib/today";
import { topicById, unitLabel } from "@/lib/progress";
import type { DailySession, UserState } from "@/types/state";
import { ConceptChecklist } from "./progress";
import { cx } from "./ui";

/** A text field that keeps a local draft and saves 600 ms after typing stops (same rhythm as NotesEditor). */
export function DraftField({ label, saved, onSave, rows = 3, placeholder, hint }: {
  label: string; saved: string; onSave: (v: string) => void; rows?: number; placeholder?: string; hint?: string;
}) {
  const id = useId();
  const [dirty, setDirty] = useState(false);
  const [text, setText] = useDraft(saved, dirty);
  useEffect(() => {
    if (!dirty) return;
    const h = setTimeout(() => { onSave(text); setDirty(false); }, 600);
    return () => clearTimeout(h);
  }, [text, dirty, onSave]);
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-sm font-medium">{label}</label>
      {hint && <p className="-mt-0.5 mb-1.5 text-xs text-muted">{hint}</p>}
      <textarea
        id={id}
        value={text}
        rows={rows}
        onChange={(e) => { setText(e.target.value); setDirty(true); }}
        onBlur={() => { if (dirty) { onSave(text); setDirty(false); } }}
        className="input text-sm leading-relaxed"
        placeholder={placeholder}
      />
    </div>
  );
}

/** Re-render every 30 s so running timers stay current without reading the clock during render. */
function useNow(intervalMs = 30000): Date {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), intervalMs);
    return () => clearInterval(t);
  }, [intervalMs]);
  return now;
}

export type SessionContext = {
  build: string;
  projectHref: string | null;
  projectTitle: string | null;
  reviewsDue: number;
  previous: DailySession | null;
};

function StageGuide({ x, s, ctx }: { x: DailySession; s: UserState; ctx: SessionContext }) {
  const key = x.stages[x.stage].key;
  const focus = x.focus.slice(0, 3);
  const topicId = focus[0]?.split("#")[0];
  const topic = topicId ? topicById.get(topicId) : undefined;
  const mastery = topicId ? s.topics[topicId]?.mastery ?? 0 : 0;

  if (key === "recall") {
    const prev = ctx.previous;
    return (
      <div className="space-y-2 text-sm">
        <p>Close your notes. Write or say what you remember from last time, then check.</p>
        {prev && prev.ticked.length > 0 && (
          <div>
            <p className="text-muted">Last session you ticked:</p>
            <ul className="mt-1 list-disc space-y-0.5 pl-5">{prev.ticked.slice(0, 5).map((u) => <li key={u}>{unitLabel(u)}</li>)}</ul>
          </div>
        )}
        {prev?.log.next && <p><span className="text-muted">You planned next:</span> {prev.log.next}</p>}
        {ctx.reviewsDue > 0 && <p><Link href="#reviews" className="text-accent hover:underline">{ctx.reviewsDue} re-test{ctx.reviewsDue > 1 ? "s" : ""} due</Link>: a good recall target.</p>}
        {!prev && ctx.reviewsDue === 0 && <p className="text-muted">First session: recall anything you already know about today&apos;s topic.</p>}
      </div>
    );
  }
  if (key === "study") {
    return (
      <div className="space-y-2 text-sm">
        <p>Learn one small concept. Stop as soon as you can try it yourself.</p>
        {focus.length > 0 && <ul className="list-disc space-y-0.5 pl-5">{focus.map((u) => <li key={u}>{unitLabel(u)}</li>)}</ul>}
        {topic && <p><Link href={`/topics/${topic.id}`} className="text-accent hover:underline">Open {topic.t}</Link> for resources and criteria.</p>}
      </div>
    );
  }
  if (key === "code") {
    return (
      <div className="space-y-2 text-sm">
        <p>Write the code yourself, without the tutorial open. Get stuck, then consult, then fix.</p>
        {ctx.build && <p><span className="text-muted">This week&apos;s build:</span> {ctx.build}</p>}
        {ctx.projectHref && <p><Link href={ctx.projectHref} className="text-accent hover:underline">Open the project: {ctx.projectTitle}</Link></p>}
      </div>
    );
  }
  if (key === "debug") {
    return <p className="text-sm">Run it, test edge cases, break something on purpose and fix it. Note the bug you hit and how you found it.</p>;
  }
  if (key === "explain") {
    return (
      <div className="space-y-2 text-sm">
        <p>Explain what you learned out loud or in writing, without notes, as if teaching it.</p>
        {topic && mastery < 2 && (
          <button type="button" className="btn btn-secondary btn-sm" onClick={() => setMastery(topic.id, 2)}>
            I explained it without notes: mark {topic.t} as Explained
          </button>
        )}
        {topic && mastery >= 2 && <p className="text-muted">{topic.t} is already at Explained or beyond.</p>}
      </div>
    );
  }
  return null;
}

export function SessionRunner({ session: x, state: s, ctx }: { session: DailySession; state: UserState; ctx: SessionContext }) {
  const now = useNow();
  const st = x.stages[x.stage];
  const isLast = x.stage === x.stages.length - 1;
  const [lo, hi] = planMinutes(x.stages);
  const stageMin = elapsedMinutes(st.startedAt, st.endedAt, now);
  const total = sessionMinutes(x, now);
  const stale = x.date < localDay(now);

  return (
    <section aria-labelledby="session" className="card overflow-hidden">
      <div className="border-b border-rule px-4 py-3">
        <div className="flex items-baseline justify-between gap-3">
          <h2 id="session" className="h-section">Today&apos;s session</h2>
          <span className="text-xs tabular-nums text-muted">{total} min of {lo}-{hi}</span>
        </div>
        <ol className="mt-3 flex gap-1" aria-label="Stages">
          {x.stages.map((g, i) => (
            <li key={g.key + i} className="min-w-0 flex-1">
              <button
                type="button"
                onClick={() => goToStage(x.id, i)}
                aria-current={i === x.stage ? "step" : undefined}
                aria-label={`${g.label}${g.skipped ? " (skipped)" : g.endedAt ? " (done)" : ""}`}
                className={cx(
                  "block h-2 w-full rounded-full",
                  i === x.stage ? "bg-accent" : g.skipped ? "bg-rule" : g.endedAt ? "bg-ok" : "bg-surface-2 ring-1 ring-inset ring-rule",
                )}
              />
            </li>
          ))}
        </ol>
        {stale && <p className="mt-2 text-xs text-warn">Started on {x.date}. Finish and log it, or stop it, before starting a new one.</p>}
      </div>

      <div className="space-y-4 px-4 py-4">
        <div>
          <p className="text-xs text-muted">Stage {x.stage + 1} of {x.stages.length}</p>
          <div className="flex items-baseline justify-between gap-3">
            <h3 className="text-lg font-semibold">{st.label}</h3>
            <span className="shrink-0 text-sm tabular-nums text-muted">{stageMin} / {st.minutes} min</span>
          </div>
        </div>

        <StageGuide x={x} s={s} ctx={ctx} />

        {!isLast && (
          <DraftField
            key={x.id + x.stage}
            label="Note (optional)"
            saved={st.note}
            onSave={(v) => setStageNote(x.id, x.stage, v)}
            rows={2}
            placeholder={st.key === "debug" ? "The bug, and how you found it" : st.key === "explain" ? "Your explanation, in your own words" : "Anything worth keeping"}
          />
        )}

        {isLast && (
          <div className="space-y-3">
            {x.focus.length > 0 && (
              <div>
                <p className="mb-1.5 text-sm font-medium">Tick what you can now do without the tutorial</p>
                <ConceptChecklist items={x.focus.map((u) => ({ id: u, text: unitLabel(u) }))} showIds={false} />
              </div>
            )}
            <DraftField label="What I learned" saved={x.log.learned} onSave={(v) => setSessionLog(x.id, { learned: v })} rows={2} />
            <DraftField label="Where I got stuck" saved={x.log.stuck} onSave={(v) => setSessionLog(x.id, { stuck: v })} rows={2} placeholder="Leave blank if nothing" />
            <DraftField label="Next step" hint="Shown on Today next time, so you can start without deciding." saved={x.log.next} onSave={(v) => setSessionLog(x.id, { next: v })} rows={2} />
          </div>
        )}

        <div className="flex flex-wrap items-center gap-2">
          {isLast ? (
            <button type="button" className="btn btn-ok min-h-11 flex-1 sm:flex-none" onClick={() => completeSession(x.id)}>Finish session</button>
          ) : (
            <button type="button" className="btn btn-primary min-h-11 flex-1 sm:flex-none" onClick={() => goToStage(x.id, x.stage + 1)}>
              Done, next: {x.stages[x.stage + 1].label}
            </button>
          )}
          {!isLast && <button type="button" className="btn btn-secondary btn-sm" onClick={() => goToStage(x.id, x.stage + 1, true)}>Skip</button>}
          {x.stage > 0 && <button type="button" className="btn btn-quiet btn-sm" onClick={() => goToStage(x.id, x.stage - 1)}>Back</button>}
          <button
            type="button"
            className="btn btn-quiet btn-sm ml-auto text-muted"
            onClick={() => { if (window.confirm("Stop this session without finishing? It stays in your history as stopped.")) abandonSession(x.id); }}
          >
            Stop
          </button>
        </div>
      </div>
    </section>
  );
}

/** Start card: the plan's length up front, a busy-day option, and where you left off. */
export function SessionStart({ template, week, focus, leftOff, doneToday }: {
  template: StepTemplate[];
  week: number;
  focus: string[];
  leftOff: { next: string; date: string } | null;
  doneToday: DailySession[];
}) {
  const full = sessionStages(template, "full");
  const short = sessionStages(template, "short");
  const [flo, fhi] = planMinutes(full);
  const [slo, shi] = planMinutes(short);
  const start = (plan: "full" | "short") => startSession({ week, focus, stages: plan === "full" ? full : short, plan });
  const done = doneToday.length > 0;
  return (
    <section aria-labelledby="session" className={cx("card px-4 py-4", !done && "border-accent/40")}>
      <h2 id="session" className="h-section">{done ? "Today's session is logged" : "Today's session"}</h2>
      {leftOff && !done && (
        <p className="mt-2 text-sm"><span className="text-muted">Where you left off ({leftOff.date}):</span> {leftOff.next}</p>
      )}
      {done ? (
        <p className="mt-1 text-sm text-muted">
          {doneToday.length === 1 ? "One session" : `${doneToday.length} sessions`} finished today. Rest counts too; start another only if you have real capacity.
        </p>
      ) : (
        <p className="mt-1 text-sm text-muted">
          {full.map((st) => st.label.toLowerCase()).join(", ")}. About {flo}-{fhi} min; the short version is {slo}-{shi} min.
        </p>
      )}
      <div className="mt-3 flex flex-wrap gap-2">
        <button type="button" className={cx("btn min-h-11", done ? "btn-secondary btn-sm" : "btn-primary flex-1 sm:flex-none")} onClick={() => start("full")}>
          {done ? "Start another session" : "Start session"}
        </button>
        <button type="button" className="btn btn-secondary min-h-11" onClick={() => start("short")}>Short day</button>
      </div>
    </section>
  );
}

const STATUS_LABEL: Record<DailySession["status"], string> = { active: "In progress", completed: "Finished", abandoned: "Stopped" };

/** Recent sessions as a readable log: what was learned, where it stuck, what was ticked. */
export function SessionHistory({ sessions, limit = 5 }: { sessions: DailySession[]; limit?: number }) {
  const now = useNow(60000);
  const past = sessions.filter((x) => x.status !== "active").slice(0, limit);
  if (!past.length) return <p className="text-sm text-muted">Finished sessions appear here with what you learned and where you got stuck.</p>;
  return (
    <ul className="space-y-3">
      {past.map((x) => (
        <li key={x.id} className="text-sm">
          <p>
            <span className="font-medium">{x.date}</span>
            <span className="text-muted"> · week {x.week} · {sessionMinutes(x, now)} min · {STATUS_LABEL[x.status]}{x.plan === "short" ? " · short" : ""}</span>
          </p>
          {x.log.learned && <p className="mt-0.5"><span className="text-muted">Learned:</span> {x.log.learned}</p>}
          {x.log.stuck && <p className="mt-0.5"><span className="text-muted">Stuck:</span> {x.log.stuck}</p>}
          {x.log.next && <p className="mt-0.5"><span className="text-muted">Next:</span> {x.log.next}</p>}
          {x.ticked.length > 0 && <p className="mt-0.5 text-muted">Ticked {x.ticked.length}: {x.ticked.slice(0, 3).map(unitLabel).join("; ")}{x.ticked.length > 3 ? "…" : ""}</p>}
        </li>
      ))}
    </ul>
  );
}
