"use client";

import Link from "next/link";
import { useState } from "react";
import { useHydrated, useUserState } from "@/lib/store";
import { currentTier, missionState, overlay, tierNumber, weekMode, workingTiers, type AiMission, type AiTier } from "@/lib/ai";
import { gateById, gateName, nameOf } from "@/lib/progress";
import { deleteAiLog, saveAiLog, setFlag } from "@/lib/actions";
import { hrefFor } from "@/lib/ids";
import type { AiCanDoAlone } from "@/types/state";
import { RefId } from "./Ref";
import { Disclosure, cx } from "./ui";

const refName = (id: string) => (gateById.has(id) ? gateName(id) : /^AIM-/.test(id) ? overlay.missions.find((m) => m.id === id)?.title ?? id : nameOf(id));

function RefLinks({ ids }: { ids: string[] }) {
  return (
    <span className="inline-flex flex-wrap gap-x-3 gap-y-1">
      {ids.map((id) => {
        const href = hrefFor(id);
        return href ? <Link key={id} href={href} className="text-accent hover:underline">{refName(id)}</Link> : <span key={id}>{refName(id)}</span>;
      })}
    </span>
  );
}

function List({ items }: { items: string[] }) {
  return <ul className="list-disc space-y-1 pl-5">{items.map((x, i) => <li key={i}>{x}</li>)}</ul>;
}

function TierBody({ t }: { t: AiTier }) {
  return (
    <div className="space-y-3 text-sm">
      {t.aiCan.length > 0 && <div><p className="mb-1 font-medium">AI can</p><List items={t.aiCan} /></div>}
      {t.youOwn.length > 0 && <div><p className="mb-1 font-medium">You stay responsible for</p><List items={t.youOwn} /></div>}
      {t.security.length > 0 && <div><p className="mb-1 font-medium">Operator security</p><List items={t.security} /></div>}
      {t.links.length > 0 && <p><span className="text-muted">In the roadmap: </span><RefLinks ids={t.links} /></p>}
    </div>
  );
}

function LogForm({ missions, onDone, presetMission }: { missions: AiMission[]; onDone: () => void; presetMission: string | null }) {
  const [task, setTask] = useState("");
  const [attemptedFirst, setAttempted] = useState(true);
  const [aiDid, setAiDid] = useState("");
  const [verified, setVerified] = useState("");
  const [aiErrorCaught, setCaught] = useState(false);
  const [canDoAlone, setAlone] = useState<AiCanDoAlone>("partly");
  const [missionId, setMission] = useState<string | null>(presetMission);
  const field = "input";
  const seg = "chip flex-1 justify-center";
  return (
    <form
      className="space-y-3"
      onSubmit={(e) => {
        e.preventDefault();
        if (!task.trim()) return;
        saveAiLog({ task: task.trim(), attemptedFirst, aiDid: aiDid.trim(), verified: verified.trim(), aiErrorCaught, canDoAlone, missionId });
        onDone();
      }}
    >
      <label className="block"><span className="mb-1 block text-sm font-medium">Task</span>
        <input className={field} value={task} onChange={(e) => setTask(e.target.value)} placeholder="e.g. CS50P problem: fix my while loop" required />
      </label>
      <div>
        <span className="mb-1 block text-sm font-medium">Tried it myself first?</span>
        <div className="flex gap-2"><button type="button" aria-pressed={attemptedFirst} className={seg} onClick={() => setAttempted(true)}>Yes</button><button type="button" aria-pressed={!attemptedFirst} className={seg} onClick={() => setAttempted(false)}>No</button></div>
      </div>
      <label className="block"><span className="mb-1 block text-sm font-medium">What the AI did</span>
        <input className={field} value={aiDid} onChange={(e) => setAiDid(e.target.value)} placeholder="e.g. explained why the loop never ends" />
      </label>
      <label className="block"><span className="mb-1 block text-sm font-medium">What I checked</span>
        <input className={field} value={verified} onChange={(e) => setVerified(e.target.value)} placeholder="e.g. ran it with 3 inputs, read the docs for range()" />
      </label>
      <label className="flex min-h-11 items-center gap-3">
        <input type="checkbox" checked={aiErrorCaught} onChange={(e) => setCaught(e.target.checked)} />
        <span className="text-sm">I caught an AI mistake</span>
      </label>
      <div>
        <span className="mb-1 block text-sm font-medium">Can I do it alone now?</span>
        <div className="flex gap-2">
          {(["yes", "partly", "no"] as AiCanDoAlone[]).map((x) => <button key={x} type="button" aria-pressed={canDoAlone === x} className={seg} onClick={() => setAlone(x)}>{x[0].toUpperCase() + x.slice(1)}</button>)}
        </div>
      </div>
      <label className="block"><span className="mb-1 block text-sm font-medium">Mission (optional)</span>
        <select className={field} value={missionId ?? ""} onChange={(e) => setMission(e.target.value || null)}>
          <option value="">None, everyday use</option>
          {missions.map((m) => <option key={m.id} value={m.id}>{m.title}</option>)}
        </select>
      </label>
      <div className="flex gap-2">
        <button type="submit" className="btn btn-primary flex-1">Save</button>
        <button type="button" onClick={onDone} className="btn btn-secondary">Cancel</button>
      </div>
    </form>
  );
}

export function AiPractice() {
  const s = useUserState();
  const ready = useHydrated();
  const [logging, setLogging] = useState<{ mission: string | null } | null>(null);
  if (!ready) return <div className="h-96 animate-pulse rounded-lg bg-surface-2" aria-label="Loading" />;

  const tier = currentTier(s);
  const n = tierNumber(tier);
  const next = workingTiers[n];
  const { mode } = weekMode(s, s.currentWeek);
  const pointer = overlay.tiers.find((t) => t.pointerOnly);
  const missions = overlay.missions.map((m) => ({ m, ...missionState(s, m) }));
  const open = missions.filter((x) => x.state === "open");
  const done = missions.filter((x) => x.state === "done");
  const locked = missions.filter((x) => x.state === "locked");

  const MissionItem = ({ m, state, missing }: { m: AiMission; state: string; missing: string[] }) => (
    <Disclosure
      title={<>{m.title} <RefId id={m.id} /></>}
      hint={state === "done" ? "Done" : state === "locked" ? `After: ${missing.map(refName).join(", ")}` : m.goal}
      className={state === "done" ? "border-ok/50" : undefined}
    >
      <dl className="space-y-2 text-sm">
        <div><dt className="font-medium">You do</dt><dd>{m.you}</dd></div>
        <div><dt className="font-medium">AI does</dt><dd>{m.ai}</dd></div>
        <div><dt className="font-medium">Verify</dt><dd>{m.verify}</dd></div>
        <div><dt className="font-medium">Evidence</dt><dd>{m.evidence}</dd></div>
        <div><dt className="text-muted">Roadmap link</dt><dd><RefLinks ids={m.requires} /></dd></div>
      </dl>
      <div className="mt-3 flex flex-wrap gap-2">
        {state !== "locked" && <button type="button" onClick={() => setLogging({ mission: m.id })} className="btn btn-secondary btn-sm">Log evidence</button>}
        {state !== "locked" && (
          <button type="button" onClick={() => setFlag(m.id, state !== "done")} className={cx("btn btn-sm", state === "done" ? "btn-secondary" : "btn-ok")}>
            {state === "done" ? "Mark not done" : "Mark done"}
          </button>
        )}
      </div>
    </Disclosure>
  );

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-[1.6rem] font-semibold leading-tight tracking-tight">Working with AI</h1>
        <p className="mt-1 text-muted">AI output is an input to engineering, not proof of correctness. Use AI to get more capable, not to skip the learning.</p>
      </header>

      <section className="card p-4">
        <p className="text-sm text-muted">Your tier now</p>
        <p className="text-lg font-semibold">Tier {n}: {tier.title}</p>
        <p className="mt-1">{tier.summary}</p>
        <p className="mt-3 text-sm"><span className="font-medium">This week: {mode.title.toLowerCase()} mode.</span> {mode.summary}</p>
        {next && <p className="mt-2 text-sm text-muted">Next: Tier {n + 1}, {next.title}, after the {next.unlock ? gateName(next.unlock) : ""}.</p>}
      </section>

      <section aria-labelledby="loop">
        <h2 id="loop" className="mb-2 text-base font-semibold">The working loop</h2>
        <ol className="flex flex-wrap gap-1.5 text-sm">
          {overlay.loop.map((x, i) => <li key={x} className="rounded-md bg-surface-2 px-2 py-1">{i + 1}. {x}</li>)}
        </ol>
      </section>

      <section aria-labelledby="modes">
        <h2 id="modes" className="mb-2 text-base font-semibold">Modes: what you are doing right now</h2>
        <div className="space-y-2">
          {overlay.modes.map((md) => (
            <Disclosure key={md.id} title={md.title} hint={md.when} open={md.id === mode.id}>
              <p className="mb-3 text-sm">{md.summary}</p>
              <div className="space-y-3 text-sm">
                <div><p className="mb-1 font-medium">AI can</p><List items={md.id === "build" ? [`everything your tier allows (now: ${tier.title})`] : md.aiCan} /></div>
                <div><p className="mb-1 font-medium">Keep for yourself</p><List items={md.yours} /></div>
              </div>
            </Disclosure>
          ))}
        </div>
      </section>

      <section aria-labelledby="missions">
        <div className="mb-2 flex items-baseline justify-between gap-3">
          <h2 id="missions" className="text-base font-semibold">Missions</h2>
          <span className="text-sm text-muted">{done.length} of {missions.length} done</span>
        </div>
        <div className="space-y-2">
          {open.map((x) => <MissionItem key={x.m.id} {...x} />)}
          {open.length === 0 && <p className="text-sm text-muted">No mission is open right now. The next ones open as you progress.</p>}
        </div>
        {done.length > 0 && <div className="mt-3 space-y-2">{done.map((x) => <MissionItem key={x.m.id} {...x} />)}</div>}
        {locked.length > 0 && (
          <Disclosure className="mt-3" title={`Later missions (${locked.length})`} hint="They open when you reach the linked part of the roadmap">
            <div className="space-y-2">{locked.map((x) => <MissionItem key={x.m.id} {...x} />)}</div>
          </Disclosure>
        )}
      </section>

      <section aria-labelledby="log">
        <div className="mb-2 flex items-baseline justify-between gap-3">
          <h2 id="log" className="text-base font-semibold">AI log</h2>
          {!logging && <button type="button" onClick={() => setLogging({ mission: null })} className="btn btn-primary btn-sm">Log a task</button>}
        </div>
        {logging && (
          <div className="mb-3 card p-4">
            <LogForm missions={overlay.missions} presetMission={logging.mission} onDone={() => setLogging(null)} />
          </div>
        )}
        {s.aiLog.length ? (
          <ul className="list-card">
            {s.aiLog.slice(0, 20).map((e) => (
              <li key={e.id} className="px-4 py-3 text-sm">
                <p className="font-medium">{e.task}</p>
                <p className="text-muted">
                  {new Date(e.createdAt).toLocaleDateString()}
                  {e.missionId ? ` · ${refName(e.missionId)}` : ""}
                  {` · alone: ${e.canDoAlone}`}
                  {e.aiErrorCaught ? " · caught an AI mistake" : ""}
                  {!e.attemptedFirst ? " · asked before trying" : ""}
                </p>
                {e.aiDid && <p className="mt-1"><span className="text-muted">AI:</span> {e.aiDid}</p>}
                {e.verified && <p><span className="text-muted">Checked:</span> {e.verified}</p>}
                <button type="button" onClick={() => deleteAiLog(e.id)} className="mt-1 min-h-9 text-xs text-muted underline">Delete</button>
              </li>
            ))}
          </ul>
        ) : (
          !logging && <p className="text-sm text-muted">Nothing logged yet. Log a task when AI helped with something worth remembering, especially when you caught it being wrong.</p>
        )}
      </section>

      <section className="space-y-2" aria-label="Reference">
        <h2 className="text-base font-semibold">Reference</h2>
        {workingTiers.map((t, i) => (
          <Disclosure key={t.id} title={`Tier ${i + 1}: ${t.title}`} hint={t.unlock ? `After the ${gateName(t.unlock)}` : "From the start"}>
            <p className="mb-3 text-sm">{t.summary}</p>
            <TierBody t={t} />
          </Disclosure>
        ))}
        <Disclosure title="Context engineering" hint="Giving AI the right information, tools and boundaries">
          <p className="mb-2 text-sm">{overlay.context.text}</p>
          <div className="text-sm"><List items={overlay.context.points} /></div>
        </Disclosure>
        <Disclosure title="Verification" hint="Checks before you keep AI-produced work">
          <p className="mb-2 text-sm">{overlay.verification.text}</p>
          <div className="text-sm"><List items={overlay.verification.points} /></div>
        </Disclosure>
        {pointer && (
          <Disclosure title={pointer.title} hint={pointer.unlock ? `After the ${gateName(pointer.unlock)}` : undefined}>
            <p className="mb-2 text-sm">{pointer.summary}</p>
            <p className="text-sm"><RefLinks ids={pointer.links} /></p>
          </Disclosure>
        )}
        <Disclosure title="How this connects to checkpoints">
          <p className="text-sm">{overlay.checkpoints}</p>
        </Disclosure>
      </section>
    </div>
  );
}
