"use client";

import { useState } from "react";
import { useDraft } from "@/lib/useDraft";
import { useHydrated, useUserState } from "@/lib/store";
import {
  addCustomMilestone, removeCustomMilestone, setMilestoneNotes, setMilestoneStatus, setProjectFlag, setProjectRecord,
  setProjectRepo, setProjectRequirement, setProjectStatus,
} from "@/lib/actions";
import { milestoneStatus, type RequirementGroup } from "@/lib/projectSpec";
import { newId } from "@/lib/ids";
import { evidenceFor } from "@/lib/evidence";
import type { Decision, Metric, MilestoneStatus, ProjectProgress, ProjectRecord, ProjectStatus } from "@/types/state";
import { DraftField } from "./SessionRunner";
import { EvidenceList } from "./Evidence";
import { Bar, Disclosure, DisclosureGroup, ExternalLink, cx } from "./ui";

const STATUS: { id: ProjectStatus; label: string }[] = [
  { id: "not_started", label: "Not started" },
  { id: "in_progress", label: "In progress" },
  { id: "complete", label: "Complete" },
];

const MS_STATUS: { id: MilestoneStatus; label: string }[] = [
  { id: "todo", label: "To do" },
  { id: "doing", label: "Doing" },
  { id: "blocked", label: "Blocked" },
  { id: "done", label: "Done" },
];

export function ProjectStatusBadge({ id }: { id: string }) {
  const s = useUserState();
  const ready = useHydrated();
  if (!ready) return null;
  const st = s.projects[id]?.status ?? "not_started";
  const style = st === "complete" ? "bg-ok-soft text-ok" : st === "in_progress" ? "bg-accent-soft text-accent" : "bg-surface-2 text-muted";
  return <span className={cx("rounded px-1.5 py-0.5 text-xs font-medium", style)}>{STATUS.find((x) => x.id === st)?.label}</span>;
}

type MilestoneView = { id: string; text: string; cw: number | null; custom: boolean };

function MilestoneRow({ projectId, m, p }: { projectId: string; m: MilestoneView; p: ProjectProgress | undefined }) {
  const [open, setOpen] = useState(false);
  const status = milestoneStatus(p, m.id);
  const notes = p?.milestoneDetail?.[m.id]?.notes ?? "";
  return (
    <li className="px-3 py-2.5">
      <div className="flex flex-wrap items-start gap-x-3 gap-y-2">
        <span aria-hidden className={cx("mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full", status === "done" ? "bg-ok" : status === "doing" ? "bg-accent" : status === "blocked" ? "bg-danger" : "bg-rule-strong")} />
        <button type="button" onClick={() => setOpen((v) => !v)} aria-expanded={open} className={cx("min-w-0 flex-1 text-left", status === "done" && "text-muted")}>
          {m.text}
          <span className="mt-0.5 block text-xs text-muted">
            {m.cw ? `Week ${m.cw}` : "Your milestone"}{notes ? " · has notes" : ""} · {open ? "hide details" : "details and evidence"}
          </span>
        </button>
        <select
          aria-label={`Status of ${m.text}`}
          value={status}
          onChange={(e) => setMilestoneStatus(projectId, m.id, e.target.value as MilestoneStatus)}
          className="input w-auto py-1 text-sm"
        >
          {MS_STATUS.map((o) => <option key={o.id} value={o.id}>{o.label}</option>)}
        </select>
      </div>
      {open && (
        <div className="mt-3 space-y-3 pl-5">
          <DraftField label="Notes" saved={notes} onSave={(v) => setMilestoneNotes(projectId, m.id, v)} rows={2} placeholder="What is done, what is blocking, what was decided" />
          <EvidenceList subjects={[{ id: m.id, label: m.text }]} title="Evidence for this milestone" hint="A commit, test run, screenshot link or deployed URL that shows it works." />
          {m.custom && (
            <button type="button" className="btn btn-quiet btn-sm text-muted" onClick={() => { if (window.confirm("Remove this milestone? Its evidence items are kept.")) removeCustomMilestone(projectId, m.id); }}>
              Remove milestone
            </button>
          )}
        </div>
      )}
    </li>
  );
}

/** Editable rows (decisions, metrics). Each cell saves on blur. */
function Rows<T extends { id: string }>({ rows, fields, onChange, addLabel, empty }: {
  rows: T[];
  fields: { key: keyof T & string; label: string; placeholder?: string; wide?: boolean }[];
  onChange: (rows: T[]) => void;
  addLabel: string;
  empty: () => T;
}) {
  return (
    <div className="space-y-2">
      {rows.map((r, i) => (
        <div key={r.id} className="grid gap-2 rounded-lg border border-rule p-2 sm:grid-cols-3">
          {fields.map((f) => (
            <Cell key={f.key} label={f.label} placeholder={f.placeholder} value={String(r[f.key] ?? "")}
              onSave={(v) => onChange(rows.map((x, j) => (j === i ? { ...x, [f.key]: v } : x)))} />
          ))}
          <button type="button" className="btn btn-quiet btn-sm justify-self-start text-muted sm:col-span-3" onClick={() => onChange(rows.filter((_, j) => j !== i))}>Remove</button>
        </div>
      ))}
      <button type="button" className="btn btn-secondary btn-sm" onClick={() => onChange([...rows, empty()])}>{addLabel}</button>
    </div>
  );
}

function Cell({ label, value, placeholder, onSave }: { label: string; value: string; placeholder?: string; onSave: (v: string) => void }) {
  const [v, setV] = useDraft(value);
  return (
    <label className="block text-sm">
      <span className="mb-1 block text-xs text-muted">{label}</span>
      <input className="input text-sm" value={v} placeholder={placeholder} onChange={(e) => setV(e.target.value)} onBlur={() => v !== value && onSave(v)} />
    </label>
  );
}

const TEXT_SECTIONS: { key: keyof ProjectRecord; label: string; placeholder: string }[] = [
  { key: "problem", label: "Problem", placeholder: "What real problem does this solve, and for whom?" },
  { key: "goal", label: "Goal", placeholder: "What does done look like? Measurable where possible." },
  { key: "architecture", label: "Architecture", placeholder: "Components, data flow, where state lives. Link a diagram as evidence." },
  { key: "implementation", label: "Implementation", placeholder: "Key parts of the build, in order." },
  { key: "experiments", label: "Experiments", placeholder: "What you tried, the setup, the results." },
  { key: "failures", label: "Failure points and debugging", placeholder: "What broke, how you found it, how you fixed it." },
  { key: "lessons", label: "Lessons learned", placeholder: "What you would tell yourself at the start." },
  { key: "future", label: "Future improvements", placeholder: "What you would do next, and why." },
];

export function ProjectControls({ id, title, milestones, quality, requirements, focus }: {
  id: string;
  title: string;
  milestones: { id: string; cw: number; text: string }[];
  quality: { key: string; group: string; text: string }[];
  requirements: RequirementGroup[];
  /** ML/AI projects lead with experiments and metrics. */
  focus: "general" | "ml";
}) {
  const s = useUserState();
  const ready = useHydrated();
  const p = s.projects[id];
  const [repo, setRepo] = useDraft(p?.repoUrl ?? "");
  const [deploy, setDeploy] = useDraft(p?.record?.deployUrl ?? "");
  const [newMs, setNewMs] = useState("");
  if (!ready) return <div className="h-40 animate-pulse rounded bg-surface-2" />;
  const status = p?.status ?? "not_started";
  const rec = p?.record ?? {};
  const all: MilestoneView[] = [
    ...milestones.map((m) => ({ id: m.id, text: m.text, cw: m.cw, custom: false })),
    ...(p?.customMilestones ?? []).map((m) => ({ id: m.id, text: m.text, cw: null, custom: true })),
  ];
  const msDone = all.filter((m) => milestoneStatus(p, m.id) === "done").length;
  const reqItems = requirements.flatMap((g) => g.items);
  const reqDone = reqItems.filter((r) => p?.requirements?.[r.key]).length;
  const qDone = quality.filter((q) => p?.quality?.[q.key]).length;
  const groups = Array.from(new Set(quality.map((q) => q.group)));
  const evidenceSubjects = [{ id, label: `${title} (whole project)` }, ...all.map((m) => ({ id: m.id, label: m.text }))];
  const text = (k: keyof ProjectRecord) => String(rec[k] ?? "");
  const textSections = focus === "ml" ? [...TEXT_SECTIONS].sort((a, b) => Number(b.key === "experiments") - Number(a.key === "experiments")) : TEXT_SECTIONS;

  const evidenceCount = evidenceFor(s, evidenceSubjects.map((x) => x.id)).length;
  const glance: { label: string; value: string; pct: number | null }[] = [
    { label: "Milestones", value: `${msDone}/${all.length}`, pct: all.length ? msDone / all.length : null },
    { label: "Criteria", value: reqItems.length ? `${reqDone}/${reqItems.length}` : "—", pct: reqItems.length ? reqDone / reqItems.length : null },
    { label: "Evidence", value: String(evidenceCount), pct: null },
    { label: "Quality", value: `${qDone}/${quality.length}`, pct: quality.length ? qDone / quality.length : null },
  ];

  return (
    <div className="space-y-8">
      <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-rule bg-rule sm:grid-cols-4" aria-label="Project at a glance">
        {glance.map((g) => (
          <div key={g.label} className="bg-surface px-4 py-3">
            <dt className="t-eyebrow">{g.label}</dt>
            <dd className="mt-1 t-data text-xl">{g.value}</dd>
            {g.pct !== null && <Bar value={g.pct} className="mt-2" tone={g.pct === 1 ? "ok" : "accent"} label={g.label} />}
          </div>
        ))}
      </dl>

      <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_17rem] lg:gap-10">
        <div className="min-w-0 space-y-10">
          <section aria-labelledby={`ms-${id}`}>
            <h3 id={`ms-${id}`} className="h-section mb-3">Milestones</h3>
            <ul className="list-card">
              {all.map((m) => <MilestoneRow key={m.id} projectId={id} m={m} p={p} />)}
            </ul>
            <form className="mt-2 flex gap-2" onSubmit={(e) => { e.preventDefault(); addCustomMilestone(id, newMs); setNewMs(""); }}>
              <input className="input min-w-0 flex-1 text-sm" value={newMs} onChange={(e) => setNewMs(e.target.value)} placeholder="Add your own milestone, e.g. auth and rate limiting" aria-label="New milestone" />
              <button type="submit" className="btn btn-secondary btn-sm" disabled={!newMs.trim()}>Add</button>
            </form>
          </section>

          <section aria-labelledby={`cc-${id}`}>
            <h3 id={`cc-${id}`} className="h-section">Completion criteria</h3>
            {reqItems.length > 0 && <p className="mb-3 mt-1 text-sm text-muted">From the master specification. Tick what the project actually demonstrates.</p>}
            {requirements.map((g) => (
              <div key={g.heading} className="mb-4">
                <p className="t-eyebrow mb-1.5">{g.heading}</p>
                <ul className="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
                  {g.items.map((r) => (
                    <li key={r.key}>
                      <label className="flex min-h-10 cursor-pointer items-start gap-2.5 rounded-md px-1.5 py-2 text-sm hover:bg-surface-2">
                        <input type="checkbox" className="mt-px shrink-0" checked={!!p?.requirements?.[r.key]} onChange={(e) => setProjectRequirement(id, r.key, e.target.checked)} />
                        <span>{r.text}</span>
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <DraftField label="Your definition of done" saved={text("completionCriteria")} onSave={(v) => setProjectRecord(id, { completionCriteria: v })} rows={2} placeholder="Anything beyond the master's list that must be true before you call it complete" />
          </section>

          <section aria-labelledby={`er-${id}`}>
            <h3 id={`er-${id}`} className="h-section">Engineering record</h3>
            <p className="mb-3 mt-1 text-sm text-muted">What the README and case-study export are built from. Write it as you go; it is much harder to reconstruct later.</p>
            <DisclosureGroup label="Engineering record">
              {textSections.map((sec, i) => (
                <Disclosure flat key={sec.key} title={sec.label} hint={text(sec.key) ? "Written" : sec.placeholder} open={focus === "ml" && sec.key === "experiments" ? true : i === 0 && !text(sec.key)}>
                  <DraftField label={sec.label} saved={text(sec.key)} onSave={(v) => setProjectRecord(id, { [sec.key]: v })} rows={4} placeholder={sec.placeholder} />
                </Disclosure>
              ))}
              <Disclosure flat title="Technical decisions" hint={rec.decisions?.length ? `${rec.decisions.length} recorded` : "What you chose, why, and the alternatives you rejected"}>
                <Rows<Decision>
                  rows={rec.decisions ?? []}
                  fields={[{ key: "decision", label: "Decision", placeholder: "PostgreSQL for storage" }, { key: "why", label: "Why", placeholder: "Relational data, constraints" }, { key: "rejected", label: "Rejected alternatives", placeholder: "MongoDB: weaker constraints" }]}
                  onChange={(decisions) => setProjectRecord(id, { decisions })}
                  addLabel="Add a decision"
                  empty={() => ({ id: newId("dec"), decision: "", why: "", rejected: "" })}
                />
              </Disclosure>
              <Disclosure flat title="Metrics" hint={rec.metrics?.length ? `${rec.metrics.length} recorded` : focus === "ml" ? "Evaluation results: metric, value, dataset and conditions" : "Latency, throughput, coverage, cost: measured, not guessed"} open={focus === "ml" && !rec.metrics?.length}>
                <Rows<Metric>
                  rows={rec.metrics ?? []}
                  fields={[{ key: "name", label: "Metric", placeholder: focus === "ml" ? "PR-AUC" : "p95 latency" }, { key: "value", label: "Value", placeholder: focus === "ml" ? "0.81" : "42 ms" }, { key: "context", label: "Measured how / where", placeholder: focus === "ml" ? "Temporal split, test set" : "Local, 100 rps, k6" }]}
                  onChange={(metrics) => setProjectRecord(id, { metrics })}
                  addLabel="Add a metric"
                  empty={() => ({ id: newId("met"), name: "", value: "", context: "" })}
                />
              </Disclosure>
            </DisclosureGroup>
          </section>

          <EvidenceList subjects={evidenceSubjects} title="All evidence for this project" hint="Proof that it works: commits, test results, benchmarks, diagrams, screenshots (as links), the deployed URL." />
        </div>

        <aside className="mt-10 space-y-8 lg:mt-0" aria-label="Project status, links and quality">
          <div>
            <p className="t-eyebrow mb-2">Status</p>
            <div className="flex flex-wrap gap-2" role="group" aria-label="Project status">
              {STATUS.map((o) => (
                <button key={o.id} type="button" aria-pressed={status === o.id} onClick={() => setProjectStatus(id, o.id)} className="chip">{o.label}</button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <p className="t-eyebrow">Links</p>
            <label className="block text-sm">
              <span className="mb-1 block text-xs text-muted">GitHub repository</span>
              <input type="url" value={repo} onChange={(e) => setRepo(e.target.value)} onBlur={() => setProjectRepo(id, repo.trim())} placeholder="https://github.com/..." className="input text-sm" />
              {p?.repoUrl && /^https?:\/\//.test(p.repoUrl) && <ExternalLink href={p.repoUrl} className="mt-1 inline-block text-sm">Open repository</ExternalLink>}
            </label>
            <label className="block text-sm">
              <span className="mb-1 block text-xs text-muted">Deployed URL</span>
              <input type="url" value={deploy} onChange={(e) => setDeploy(e.target.value)} onBlur={() => setProjectRecord(id, { deployUrl: deploy.trim() })} placeholder="https://..." className="input text-sm" />
              {rec.deployUrl && /^https?:\/\//.test(rec.deployUrl) && <ExternalLink href={rec.deployUrl} className="mt-1 inline-block text-sm">Open live</ExternalLink>}
            </label>
            <DraftField label="Other links (one per line)" saved={text("links")} onSave={(v) => setProjectRecord(id, { links: v })} rows={2} placeholder="Design doc, demo video, blog post" />
          </div>

          <div>
            <p className="t-eyebrow">Quality standard</p>
            <p className="mb-2 mt-1 text-xs text-muted">True of the repository, not just the code running once.</p>
            {groups.map((g) => (
              <div key={g} className="mb-3">
                {groups.length > 1 && <p className="mb-1 text-xs text-faint">{g}</p>}
                <ul>
                  {quality.filter((q) => q.group === g).map((q) => (
                    <li key={q.key}>
                      <label className="flex min-h-10 cursor-pointer items-start gap-2.5 rounded-md px-1.5 py-2 text-sm hover:bg-surface-2">
                        <input type="checkbox" className="mt-px shrink-0" checked={!!p?.quality?.[q.key]} onChange={(e) => setProjectFlag(id, "quality", q.key, e.target.checked)} />
                        <span>{q.text}</span>
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}
