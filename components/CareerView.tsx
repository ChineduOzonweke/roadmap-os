"use client";

import { useState, type ReactNode } from "react";
import { useHydrated, useUserState } from "@/lib/store";
import { deleteApplication, deleteStory, saveApplication, saveStory, setFlag } from "@/lib/actions";
import type { Application, ApplicationStage, Story } from "@/types/state";
import { Bar, ExternalLink, InlineText, cx } from "./ui";
import { RefId } from "./Ref";

type TrackItem = { id: string; text: string };
export type CareerTrack = { id: string; title: string; activation: string; items: TrackItem[] };

function Checklist({ items }: { items: TrackItem[] }) {
  const s = useUserState();
  const ready = useHydrated();
  return (
    <ul className="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
      {items.map((it) => (
        <li key={it.id}>
          <label className="flex min-h-10 cursor-pointer items-start gap-2.5 rounded-md px-1.5 py-2 text-sm hover:bg-surface-2">
            <input type="checkbox" className="mt-px shrink-0" disabled={!ready} checked={ready && !!s.flags[it.id]} onChange={(e) => setFlag(it.id, e.target.checked)} />
            <span><InlineText text={it.text} /></span>
          </label>
        </li>
      ))}
    </ul>
  );
}

function Count({ ids }: { ids: string[] }) {
  const s = useUserState();
  const ready = useHydrated();
  if (!ready || !ids.length) return null;
  const n = ids.filter((i) => s.flags[i]).length;
  return <span className="flex items-center gap-2 text-xs tabular-nums text-muted">{n}/{ids.length}<Bar value={n / ids.length} className="w-16" label="Track checklist" /></span>;
}

export function TracksSection({ tracks, bodies }: { tracks: CareerTrack[]; bodies: Record<string, ReactNode> }) {
  return (
    <ul className="space-y-2">
      {tracks.map((t) => (
        <li key={t.id} id={t.id} className="scroll-mt-20">
          <details className="card">
            <summary className="flex cursor-pointer flex-wrap items-center gap-x-3 gap-y-1 px-4 py-3">
              <span className="min-w-0 flex-1"><RefId id={t.id} /> <span className="font-medium">{t.title}</span>
                <span className="block text-xs text-muted">Active from {t.activation}</span></span>
              <Count ids={t.items.map((i) => i.id)} />
            </summary>
            <div className="space-y-4 border-t border-rule px-4 py-3">
              {t.items.length > 0 && <Checklist items={t.items} />}
              <details>
                <summary className="cursor-pointer text-sm font-medium">Master text</summary>
                <div className="mt-2 text-sm">{bodies[t.id]}</div>
              </details>
            </div>
          </details>
        </li>
      ))}
    </ul>
  );
}

export function PortfolioSection({ stages }: { stages: { id: string; title: string; items: string[] }[] }) {
  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
      {stages.map((st) => {
        const items = st.items.map((text, i) => ({ id: `${st.id}#${i + 1}`, text }));
        return (
          <div key={st.id} className="card p-4">
            <div className="mb-2 flex items-center justify-between gap-2"><p className="font-medium">{st.title}</p><Count ids={items.map((i) => i.id)} /></div>
            <Checklist items={items} />
          </div>
        );
      })}
    </div>
  );
}

const field = "input";

export function StoriesSection({ themes }: { themes: string[] }) {
  const s = useUserState();
  const ready = useHydrated();
  const empty = (): Omit<Story, "id" | "updatedAt"> & { id?: string } => ({ theme: themes[0] ?? "", title: "", situation: "", action: "", result: "" });
  const [d, setD] = useState<ReturnType<typeof empty> | null>(null);
  if (!ready) return null;
  const covered = new Set(s.stories.map((x) => x.theme));
  return (
    <div>
      <p className="mb-3 text-sm text-muted">Themes covered: {themes.map((t, i) => <span key={t} className={covered.has(t) ? "text-ok" : ""}>{i > 0 && ", "}{t}</span>)}.</p>
      {d ? (
        <form className="mb-4 space-y-3 card p-4" onSubmit={(e) => { e.preventDefault(); if (!d.title.trim()) return; saveStory(d); setD(null); }}>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <label><span className="mb-1 block text-sm font-medium">Theme</span><select value={d.theme} onChange={(e) => setD({ ...d, theme: e.target.value })} className={field}>{themes.map((t) => <option key={t}>{t}</option>)}</select></label>
            <label><span className="mb-1 block text-sm font-medium">Title</span><input required value={d.title} onChange={(e) => setD({ ...d, title: e.target.value })} className={field} placeholder="Short name for the story" /></label>
          </div>
          <label className="block"><span className="mb-1 block text-sm font-medium">Situation</span><textarea rows={2} value={d.situation} onChange={(e) => setD({ ...d, situation: e.target.value })} className={field} /></label>
          <label className="block"><span className="mb-1 block text-sm font-medium">What you did</span><textarea rows={2} value={d.action} onChange={(e) => setD({ ...d, action: e.target.value })} className={field} /></label>
          <label className="block"><span className="mb-1 block text-sm font-medium">Result and what you learned</span><textarea rows={2} value={d.result} onChange={(e) => setD({ ...d, result: e.target.value })} className={field} /></label>
          <div className="flex gap-2"><button type="submit" className="btn btn-primary btn-sm">{d.id ? "Save story" : "Add story"}</button><button type="button" onClick={() => setD(null)} className="btn btn-secondary btn-sm">Cancel</button></div>
        </form>
      ) : (
        <button type="button" onClick={() => setD(empty())} className="btn btn-primary btn-sm mb-4">Add a story</button>
      )}
      {s.stories.length === 0 ? (
        <p className="rounded-lg border border-dashed border-rule px-4 py-6 text-center text-sm text-muted">No stories yet. Write one per theme from real work (internships, projects, team situations); C7 asks for genuine behavioural evidence.</p>
      ) : (
        <ul className="space-y-2">
          {s.stories.map((x) => (
            <li key={x.id} className="card p-3 text-sm">
              <p><span className="text-xs text-muted">{x.theme}</span> <span className="font-medium">{x.title}</span></p>
              {x.situation && <p className="mt-1"><span className="text-muted">Situation:</span> {x.situation}</p>}
              {x.action && <p><span className="text-muted">Action:</span> {x.action}</p>}
              {x.result && <p><span className="text-muted">Result:</span> {x.result}</p>}
              <div className="mt-2 flex gap-3 text-xs"><button type="button" className="text-accent hover:underline" onClick={() => setD({ ...x })}>Edit</button><button type="button" className="text-danger hover:underline" onClick={() => window.confirm("Delete this story?") && deleteStory(x.id)}>Delete</button></div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

const STAGES: { id: ApplicationStage; label: string }[] = [
  { id: "planned", label: "Planned" }, { id: "applied", label: "Applied" }, { id: "interviewing", label: "Interviewing" }, { id: "offer", label: "Offer" }, { id: "closed", label: "Closed" },
];

export function ApplicationsSection() {
  const s = useUserState();
  const ready = useHydrated();
  const empty = (): Omit<Application, "id" | "updatedAt"> & { id?: string } => ({ organisation: "", role: "", kind: "internship", stage: "planned", date: new Date().toISOString().slice(0, 10), url: "", notes: "" });
  const [d, setD] = useState<ReturnType<typeof empty> | null>(null);
  if (!ready) return null;
  return (
    <div>
      {d ? (
        <form className="mb-4 space-y-3 card p-4" onSubmit={(e) => { e.preventDefault(); if (!d.organisation.trim()) return; saveApplication(d); setD(null); }}>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <label><span className="mb-1 block text-sm font-medium">Organisation</span><input required value={d.organisation} onChange={(e) => setD({ ...d, organisation: e.target.value })} className={field} /></label>
            <label><span className="mb-1 block text-sm font-medium">Role</span><input value={d.role} onChange={(e) => setD({ ...d, role: e.target.value })} className={field} /></label>
            <label><span className="mb-1 block text-sm font-medium">Type</span><select value={d.kind} onChange={(e) => setD({ ...d, kind: e.target.value as Application["kind"] })} className={field}><option value="internship">Internship</option><option value="new-grad">New grad</option><option value="research">Research</option><option value="other">Other</option></select></label>
            <label><span className="mb-1 block text-sm font-medium">Stage</span><select value={d.stage} onChange={(e) => setD({ ...d, stage: e.target.value as ApplicationStage })} className={field}>{STAGES.map((x) => <option key={x.id} value={x.id}>{x.label}</option>)}</select></label>
            <label><span className="mb-1 block text-sm font-medium">Date</span><input type="date" value={d.date} onChange={(e) => setD({ ...d, date: e.target.value })} className={field} /></label>
            <label><span className="mb-1 block text-sm font-medium">Link</span><input type="url" value={d.url} onChange={(e) => setD({ ...d, url: e.target.value })} className={field} placeholder="https://" /></label>
          </div>
          <label className="block"><span className="mb-1 block text-sm font-medium">Notes</span><textarea rows={2} value={d.notes} onChange={(e) => setD({ ...d, notes: e.target.value })} className={field} placeholder="Referral, deadline, what they asked" /></label>
          <div className="flex gap-2"><button type="submit" className="btn btn-primary btn-sm">{d.id ? "Save" : "Add application"}</button><button type="button" onClick={() => setD(null)} className="btn btn-secondary btn-sm">Cancel</button></div>
        </form>
      ) : (
        <button type="button" onClick={() => setD(empty())} className="btn btn-primary btn-sm mb-4">Log an application</button>
      )}
      {s.applications.length === 0 ? (
        <p className="rounded-lg border border-dashed border-rule px-4 py-6 text-center text-sm text-muted">No applications logged. This is a log of your own applications and internships, not a job board.</p>
      ) : (
        <ul className="list-card">
          {[...s.applications].sort((a, b) => b.date.localeCompare(a.date)).map((x) => (
            <li key={x.id} className="px-3 py-2.5 text-sm">
              <div className="flex flex-wrap items-baseline gap-x-3">
                <span className="min-w-0 flex-1 font-medium">{x.url && /^https?:\/\//.test(x.url) ? <ExternalLink href={x.url}>{x.organisation}</ExternalLink> : x.organisation}{x.role && <span className="font-normal">, {x.role}</span>}</span>
                <span className={cx("text-xs", x.stage === "offer" ? "text-ok" : x.stage === "interviewing" ? "text-warn" : "text-muted")}>{STAGES.find((y) => y.id === x.stage)?.label}</span>
                <span className="text-xs text-muted">{x.kind}, {x.date}</span>
              </div>
              {x.notes && <p className="mt-1 text-muted">{x.notes}</p>}
              <div className="mt-1 flex gap-3 text-xs"><button type="button" className="text-accent hover:underline" onClick={() => setD({ ...x })}>Edit</button><button type="button" className="text-danger hover:underline" onClick={() => window.confirm("Delete this entry?") && deleteApplication(x.id)}>Delete</button></div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
