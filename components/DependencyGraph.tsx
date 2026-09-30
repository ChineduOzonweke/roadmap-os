"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useHydrated, useUserState } from "@/lib/store";
import { gatePassed, phaseRollup, type Status } from "@/lib/progress";
import { StatusPill, cx } from "./ui";

export type GraphNode = { id: string; title: string; stages: string[]; weekRange: [number, number] | null; prereqs: string[]; kind: "phase" | "gate" };

const W = 164, H = 42, GX = 180, GY = 78, PAD = 16;
const STAGES = ["S0", "S1", "S2", "S3", "S4", "S5", "S6", "S7", "S8"];

const FILL: Record<Status, string> = {
  locked: "var(--surface)",
  available: "var(--accent-soft)",
  in_progress: "var(--warn-soft)",
  completed: "var(--ok-soft)",
  mastered: "var(--ok-soft)",
};

function layout(nodes: GraphNode[]) {
  const byId = new Map(nodes.map((n) => [n.id, n]));
  const depth = new Map<string, number>();
  const d = (id: string, seen = new Set<string>()): number => {
    if (depth.has(id)) return depth.get(id)!;
    if (seen.has(id)) return 0;
    seen.add(id);
    const n = byId.get(id);
    const v = n && n.prereqs.length ? 1 + Math.max(...n.prereqs.filter((p) => byId.has(p)).map((p) => d(p, seen))) : 0;
    depth.set(id, v);
    return v;
  };
  nodes.forEach((n) => d(n.id));
  const layers: string[][] = [];
  nodes.forEach((n) => {
    const l = depth.get(n.id)!;
    (layers[l] ??= []).push(n.id);
  });
  // Two barycentre sweeps to reduce edge crossings.
  const pos = new Map<string, number>();
  layers.forEach((ids) => ids.forEach((id, i) => pos.set(id, i)));
  for (let sweep = 0; sweep < 2; sweep++) {
    for (let l = 1; l < layers.length; l++) {
      layers[l].sort((a, b) => {
        const ba = byId.get(a)!.prereqs.map((p) => pos.get(p) ?? 0);
        const bb = byId.get(b)!.prereqs.map((p) => pos.get(p) ?? 0);
        const ma = ba.length ? ba.reduce((x, y) => x + y, 0) / ba.length : 0;
        const mb = bb.length ? bb.reduce((x, y) => x + y, 0) / bb.length : 0;
        return ma - mb;
      });
      layers[l].forEach((id, i) => pos.set(id, i));
    }
  }
  // Top to bottom: one row per dependency level, rows centred horizontally.
  const widest = Math.max(...layers.map((x) => x.length));
  const xy = new Map<string, { x: number; y: number }>();
  layers.forEach((ids, l) => {
    const offset = ((widest - ids.length) * GX) / 2;
    ids.forEach((id, i) => xy.set(id, { x: PAD + offset + i * GX, y: PAD + l * GY }));
  });
  const width = PAD * 2 + (widest - 1) * GX + W;
  const height = PAD * 2 + (layers.length - 1) * GY + H;
  return { xy, width, height, layers: layers.length };
}

function closure(start: string, next: (id: string) => string[]) {
  const out = new Set<string>();
  const stack = [...next(start)];
  while (stack.length) {
    const id = stack.pop()!;
    if (out.has(id)) continue;
    out.add(id);
    stack.push(...next(id));
  }
  return out;
}

export function DependencyGraph({ nodes }: { nodes: GraphNode[] }) {
  const s = useUserState();
  const ready = useHydrated();
  const [sel, setSel] = useState<string | null>(null);
  const [stage, setStage] = useState<string>("all");
  const [view, setView] = useState<"auto" | "graph" | "list">("auto");

  const byId = useMemo(() => new Map(nodes.map((n) => [n.id, n])), [nodes]);
  const dependents = useMemo(() => {
    const m = new Map<string, string[]>();
    nodes.forEach((n) => n.prereqs.forEach((p) => m.set(p, [...(m.get(p) ?? []), n.id])));
    return m;
  }, [nodes]);
  const { xy, width, height } = useMemo(() => layout(nodes), [nodes]);
  const ancestors = useMemo(() => (sel ? closure(sel, (id) => byId.get(id)?.prereqs ?? []) : new Set<string>()), [sel, byId]);
  const descendants = useMemo(() => (sel ? closure(sel, (id) => dependents.get(id) ?? []) : new Set<string>()), [sel, dependents]);

  const status = (id: string): Status => {
    if (!ready) return "locked";
    const n = byId.get(id)!;
    if (n.kind === "gate") return gatePassed(s, id) ? "completed" : "available";
    return phaseRollup(s, id).status;
  };
  const inStage = (id: string) => stage === "all" || (byId.get(id)?.stages ?? []).some((x) => x.startsWith(stage));
  const dim = (id: string) => (sel ? !(id === sel || ancestors.has(id) || descendants.has(id)) : !inStage(id));

  const selected = sel ? byId.get(sel) : null;
  const directDeps = sel ? dependents.get(sel) ?? [] : [];

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center gap-1.5" role="group" aria-label="Stage filter">
        <span className="mr-1 text-xs text-muted">Stage</span>
        {["all", ...STAGES].map((x) => (
          <button key={x} type="button" aria-pressed={stage === x} onClick={() => { setStage(x); setSel(null); }} className="chip">
            {x === "all" ? "All" : x}
          </button>
        ))}
        <span className="ml-auto flex gap-1.5" role="group" aria-label="View">
          <button type="button" aria-pressed={view === "graph"} onClick={() => setView(view === "graph" ? "auto" : "graph")} className="chip">Graph</button>
          <button type="button" aria-pressed={view === "list"} onClick={() => setView(view === "list" ? "auto" : "list")} className="chip">Focus list</button>
        </span>
      </div>

      <div className="mb-4">
        <label htmlFor="focus-node" className="mb-1 block text-sm font-medium">Focus on a phase</label>
        <select id="focus-node" value={sel ?? ""} onChange={(e) => setSel(e.target.value || null)} className="max-w-md input">
          <option value="">Nothing selected: show everything</option>
          {nodes.map((n) => <option key={n.id} value={n.id}>{n.id} {n.title}</option>)}
        </select>
        <p className="mt-1 text-xs text-muted">Selecting highlights everything it needs (upstream) and everything that builds on it (downstream).</p>
      </div>

      {selected && (
        <div className="mb-4 card p-4 text-sm">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="font-medium">
              {selected.kind === "phase" ? <Link href={`/phases/${selected.id}`} className="hover:text-accent">{selected.id} {selected.title}</Link> : <Link href={`/checkpoints/${selected.id}`} className="hover:text-accent">{selected.id} {selected.title}</Link>}
            </p>
            {ready && <StatusPill status={status(selected.id)} />}
          </div>
          <p className="mt-1 text-muted">{selected.weekRange ? `Weeks ${selected.weekRange[0]}–${selected.weekRange[1]}` : selected.kind === "gate" ? "Checkpoint" : "Not scheduled"}</p>
          <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <p className="text-xs text-muted">Needs directly ({selected.prereqs.length}), {ancestors.size} upstream in total</p>
              <ul className="mt-1 space-y-0.5">{selected.prereqs.map((p) => <li key={p}><button type="button" onClick={() => setSel(p)} className="text-left hover:text-accent"><span className="font-mono text-xs text-muted">{p}</span> {byId.get(p)?.title}</button></li>)}</ul>
            </div>
            <div>
              <p className="text-xs text-muted">Unlocks directly ({directDeps.length}), {descendants.size} downstream in total</p>
              <ul className="mt-1 space-y-0.5">{directDeps.map((p) => <li key={p}><button type="button" onClick={() => setSel(p)} className="text-left hover:text-accent"><span className="font-mono text-xs text-muted">{p}</span> {byId.get(p)?.title}</button></li>)}</ul>
            </div>
          </div>
        </div>
      )}

      <div className={cx(view === "list" ? "hidden" : view === "graph" ? "block" : "hidden md:block")}>
        <div className="overflow-auto rounded-lg border border-rule bg-bg scroll-thin" style={{ maxHeight: "80vh" }}>
          <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Phase dependency graph, prerequisites above">
            <g fill="none" strokeWidth={1.2}>
              {nodes.flatMap((n) =>
                n.prereqs.filter((p) => xy.has(p)).map((p) => {
                  const a = xy.get(p)!, b = xy.get(n.id)!;
                  const x1 = a.x + W / 2, y1 = a.y + H, x2 = b.x + W / 2, y2 = b.y, my = (y1 + y2) / 2;
                  const on = !sel ? null
                    : (n.id === sel || ancestors.has(n.id)) && ancestors.has(p) ? "up"
                    : (p === sel || descendants.has(p)) && descendants.has(n.id) ? "down" : null;
                  const faded = sel ? !on : dim(n.id) && dim(p);
                  return (
                    <path key={`${p}-${n.id}`} d={`M${x1},${y1} C${x1},${my} ${x2},${my} ${x2},${y2}`}
                      stroke={on === "down" ? "var(--ok)" : on === "up" ? "var(--accent)" : "var(--rule)"}
                      opacity={faded ? 0.25 : 1} strokeWidth={on ? 1.8 : 1.1} />
                  );
                }),
              )}
            </g>
            {nodes.map((n) => {
              const p = xy.get(n.id)!;
              const st = status(n.id);
              const isSel = n.id === sel;
              const role = sel ? (isSel ? "sel" : ancestors.has(n.id) ? "up" : descendants.has(n.id) ? "down" : null) : null;
              return (
                <g key={n.id} transform={`translate(${p.x},${p.y})`} opacity={dim(n.id) ? 0.3 : 1} className="cursor-pointer"
                  onClick={() => setSel(isSel ? null : n.id)} role="button" tabIndex={0} aria-label={`${n.id} ${n.title}`}
                  onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setSel(isSel ? null : n.id); } }}>
                  <rect width={W} height={H} rx={n.kind === "gate" ? 20 : 6} fill={FILL[st]}
                    stroke={role === "sel" ? "var(--ink)" : role === "up" ? "var(--accent)" : role === "down" ? "var(--ok)" : "var(--rule)"}
                    strokeWidth={role ? 2 : 1} />
                  <text x={10} y={16} fontSize={10.5} fontFamily="var(--font-mono)" fill="var(--muted)">{n.id}{n.weekRange ? `  wk ${n.weekRange[0]}` : ""}</text>
                  <text x={10} y={32} fontSize={12} fill="var(--ink)">{n.title.length > 22 ? n.title.slice(0, 21) + "…" : n.title}</text>
                </g>
              );
            })}
          </svg>
        </div>
        <p className="mt-2 text-xs text-muted">Rows run top to bottom by dependency depth: everything a phase needs sits above it. Blue edges lead to the selection; green edges lead away from it. Node colour shows your progress.</p>
      </div>

      <div className={cx(view === "graph" ? "hidden" : view === "list" ? "block" : "md:hidden")}>
        <ol className="list-card">
          {nodes.filter((n) => !dim(n.id)).map((n) => (
            <li key={n.id} className="px-3 py-2.5">
              <div className="flex items-center gap-2">
                <button type="button" onClick={() => setSel(n.id === sel ? null : n.id)} className={cx("min-w-0 flex-1 text-left", n.id === sel && "font-medium text-accent")}>
                  <span className="font-mono text-xs text-muted">{n.id}</span> {n.title}
                </button>
                {ready && <StatusPill status={status(n.id)} />}
              </div>
              {n.prereqs.length > 0 && <p className="mt-0.5 text-xs text-muted">Needs {n.prereqs.join(", ")}</p>}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
