"use client";

import { useDraft } from "@/lib/useDraft";
import { useHydrated, useUserState } from "@/lib/store";
import { setProjectFlag, setProjectRepo, setProjectStatus } from "@/lib/actions";
import type { ProjectStatus } from "@/types/state";
import { Bar, ExternalLink, cx } from "./ui";

const STATUS: { id: ProjectStatus; label: string }[] = [
  { id: "not_started", label: "Not started" },
  { id: "in_progress", label: "In progress" },
  { id: "complete", label: "Complete" },
];

export function ProjectStatusBadge({ id }: { id: string }) {
  const s = useUserState();
  const ready = useHydrated();
  if (!ready) return null;
  const st = s.projects[id]?.status ?? "not_started";
  const style = st === "complete" ? "bg-ok-soft text-ok" : st === "in_progress" ? "bg-warn-soft text-warn" : "bg-surface-2 text-muted";
  return <span className={cx("rounded px-1.5 py-0.5 text-xs font-medium", style)}>{STATUS.find((x) => x.id === st)?.label}</span>;
}

export function ProjectControls({ id, milestones, quality }: {
  id: string;
  milestones: { id: string; cw: number; text: string }[];
  quality: { key: string; group: string; text: string }[];
}) {
  const s = useUserState();
  const ready = useHydrated();
  const p = s.projects[id];
  const [repo, setRepo] = useDraft(p?.repoUrl ?? "");
  if (!ready) return <div className="h-40 animate-pulse rounded bg-surface-2" />;
  const status = p?.status ?? "not_started";
  const msDone = milestones.filter((m) => p?.milestones?.[m.id]).length;
  const qDone = quality.filter((q) => p?.quality?.[q.key]).length;
  const groups = Array.from(new Set(quality.map((q) => q.group)));
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2" role="group" aria-label="Project status">
        {STATUS.map((o) => (
          <button key={o.id} type="button" aria-pressed={status === o.id} onClick={() => setProjectStatus(id, o.id)}
            className={cx("rounded-md border px-3 py-1.5 text-sm", status === o.id ? (o.id === "complete" ? "border-ok bg-ok text-white" : "border-accent bg-accent-soft") : "border-rule bg-surface hover:border-accent/60")}>
            {o.label}
          </button>
        ))}
      </div>

      <div>
        <div className="mb-2 flex items-center gap-3">
          <p className="text-sm font-medium">Milestones (build weeks)</p>
          <span className="text-xs tabular-nums text-muted">{msDone}/{milestones.length}</span>
          <Bar value={milestones.length ? msDone / milestones.length : 0} className="w-24" label="Milestones" />
        </div>
        <ul className="divide-y divide-rule rounded-md border border-rule bg-surface">
          {milestones.map((m) => (
            <li key={m.id} className="flex items-start gap-3 px-3 py-2">
              <input type="checkbox" className="mt-1 h-4 w-4 accent-[var(--accent)]" checked={!!p?.milestones?.[m.id]} onChange={(e) => setProjectFlag(id, "milestones", m.id, e.target.checked)} aria-label={`Milestone ${m.id}`} />
              <span className="min-w-0 flex-1">{m.text}</span>
              <a href={`/weeks/${m.cw}`} className="shrink-0 text-xs text-muted hover:text-accent">week {m.cw}</a>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <div className="mb-1 flex items-center gap-3">
          <p className="text-sm font-medium">Master project quality standard</p>
          <span className="text-xs tabular-nums text-muted">{qDone}/{quality.length}</span>
          <Bar value={quality.length ? qDone / quality.length : 0} className="w-24" label="Quality standard" />
        </div>
        <p className="mb-2 text-xs text-muted">Portfolio-ready means these are true of the repository, not just the code running once.</p>
        {groups.map((g) => (
          <div key={g} className="mb-3">
            {groups.length > 1 && <p className="mb-1 text-xs text-muted">{g}</p>}
            <ul className="grid grid-cols-1 gap-1 sm:grid-cols-2">
              {quality.filter((q) => q.group === g).map((q) => (
                <li key={q.key}>
                  <label className="flex cursor-pointer items-start gap-2 rounded px-1 py-1 text-sm hover:bg-surface-2">
                    <input type="checkbox" className="mt-0.5 h-4 w-4 accent-[var(--accent)]" checked={!!p?.quality?.[q.key]} onChange={(e) => setProjectFlag(id, "quality", q.key, e.target.checked)} />
                    <span>{q.text}</span>
                  </label>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div>
        <label htmlFor={`repo-${id}`} className="mb-1 block text-sm font-medium">Repository or demo link</label>
        <div className="flex flex-wrap items-center gap-3">
          <input id={`repo-${id}`} type="url" value={repo} onChange={(e) => setRepo(e.target.value)} onBlur={() => setProjectRepo(id, repo.trim())} placeholder="https://github.com/..." className="min-w-0 flex-1 rounded-md border border-rule bg-surface px-3 py-2 text-sm" />
          {p?.repoUrl && /^https?:\/\//.test(p.repoUrl) && <ExternalLink href={p.repoUrl}>Open</ExternalLink>}
        </div>
      </div>
    </div>
  );
}
