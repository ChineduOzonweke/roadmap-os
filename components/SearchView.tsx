"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { useHydrated, useUserState } from "@/lib/store";
import { hrefFor } from "@/lib/ids";
import type { SearchEntry } from "@/types/curriculum";
import { InlineText, cx } from "./ui";

let indexPromise: Promise<SearchEntry[]> | null = null;
function loadIndex() {
  indexPromise ??= fetch("/search-index.json").then((r) => {
    if (!r.ok) throw new Error(`Search index returned ${r.status}`);
    return r.json() as Promise<SearchEntry[]>;
  });
  return indexPromise;
}

type Hit = SearchEntry & { score: number };

function score(e: SearchEntry, q: string, tokens: string[]): number {
  const id = e.id.toLowerCase();
  const t = e.t.toLowerCase();
  const hay = `${id} ${t} ${e.s.toLowerCase()} ${e.k.toLowerCase()}`;
  if (!tokens.every((x) => hay.includes(x))) return 0;
  let sc = 1;
  if (id === q) sc += 100;
  else if (id.startsWith(q)) sc += 40;
  if (t === q) sc += 60;
  else if (t.startsWith(q)) sc += 25;
  else if (t.includes(q)) sc += 15;
  tokens.forEach((x) => { if (t.includes(x)) sc += 4; });
  if (e.k === "Phase" || e.k === "Topic" || e.k === "DSA topic") sc += 6;
  if (e.k === "Project" || e.k === "Checkpoint") sc += 5;
  return sc;
}

export function SearchView() {
  const params = useSearchParams();
  const s = useUserState();
  const ready = useHydrated();
  const [q, setQ] = useState(params.get("q") ?? "");
  const [kind, setKind] = useState("All");
  const [index, setIndex] = useState<SearchEntry[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let live = true;
    loadIndex().then((x) => live && setIndex(x)).catch((e: Error) => { indexPromise = null; if (live) setError(e.message); });
    input.current?.focus();
    return () => { live = false; };
  }, []);

  useEffect(() => {
    const url = new URL(window.location.href);
    if (q) url.searchParams.set("q", q); else url.searchParams.delete("q");
    window.history.replaceState(null, "", url.toString());
  }, [q]);

  const personal = useMemo<SearchEntry[]>(() => {
    if (!ready) return [];
    return [
      ...s.dsa.map((p) => ({ k: "DSA journal", id: p.difficulty, t: p.title, s: `${p.source} ${p.patterns.join(" ")} ${p.missed} ${p.why} ${p.better} ${p.notes}`, h: "/dsa" })),
      ...Object.entries(s.notes).map(([id, n]) => ({ k: "Note", id, t: n.text.split("\n")[0].slice(0, 120), s: n.text, h: id.startsWith("week:") ? `/weeks/${id.slice(5)}` : hrefFor(id) ?? "/notes" })),
      ...s.stories.map((x) => ({ k: "Career", id: x.theme, t: x.title, s: `${x.situation} ${x.action} ${x.result}`, h: "/career#stories" })),
      ...s.applications.map((x) => ({ k: "Career", id: x.stage, t: `${x.organisation}: ${x.role}`, s: x.notes, h: "/career#applications" })),
    ];
  }, [s, ready]);

  const hits = useMemo<Hit[]>(() => {
    const query = q.trim().toLowerCase();
    if (!query || !index) return [];
    const tokens = query.split(/\s+/).filter(Boolean);
    return [...personal, ...index]
      .map((e) => ({ ...e, score: score(e, query, tokens) }))
      .filter((h) => h.score > 0)
      .sort((a, b) => b.score - a.score);
  }, [q, index, personal]);

  const kinds = useMemo(() => {
    const m = new Map<string, number>();
    hits.forEach((h) => m.set(h.k, (m.get(h.k) ?? 0) + 1));
    return [...m.entries()];
  }, [hits]);
  const shown = hits.filter((h) => kind === "All" || h.k === kind).slice(0, 80);

  return (
    <div>
      <input
        ref={input}
        type="search"
        value={q}
        onChange={(e) => { setQ(e.target.value); setKind("All"); }}
        placeholder="Search phases, topics, concepts, weeks, projects, resources, DSA, career, notes"
        aria-label="Search Roadmap OS"
        className="w-full rounded-lg border border-rule bg-surface px-4 py-3 text-base"
      />
      <p className="mt-2 text-xs text-muted">Try an ID (P13.2, C3, PR07), a week number (&quot;week 88&quot;), or words (&quot;sliding window&quot;, &quot;docker&quot;).</p>

      {error && <p className="mt-4 rounded-md border border-danger/40 bg-danger-soft px-3 py-2 text-sm">The search index could not load ({error}). Reload the page; if it keeps failing, the deployment is missing /search-index.json.</p>}
      {!index && !error && <p className="mt-4 text-sm text-muted">Loading the search index.</p>}

      {kinds.length > 1 && (
        <div className="mt-4 flex flex-wrap gap-1.5" role="group" aria-label="Result type">
          {[["All", hits.length] as [string, number], ...kinds].map(([k, n]) => (
            <button key={k} type="button" aria-pressed={kind === k} onClick={() => setKind(k)} className={cx("rounded-md border px-2 py-1 text-xs", kind === k ? "border-accent bg-accent-soft text-accent" : "border-rule bg-surface")}>
              {k} <span className="tabular-nums text-muted">{n}</span>
            </button>
          ))}
        </div>
      )}

      {q.trim() && index && (
        shown.length ? (
          <ul className="mt-4 divide-y divide-rule rounded-lg border border-rule bg-surface">
            {shown.map((h, i) => (
              <li key={`${h.k}-${h.id}-${i}`}>
                <Link href={h.h} className="block px-3 py-2.5 hover:bg-surface-2">
                  <span className="text-xs text-muted">{h.k} <span className="font-mono">{h.id}</span></span>
                  <span className="block"><InlineText text={h.t} /></span>
                  {h.s && <span className="block truncate text-sm text-muted">{h.s}</span>}
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-6 text-center text-sm text-muted">Nothing matches &quot;{q}&quot;. Use fewer words, or search by an ID.</p>
        )
      )}
      {hits.length > 80 && kind === "All" && <p className="mt-2 text-xs text-muted">Showing the top 80 of {hits.length}. Narrow by type above.</p>}
    </div>
  );
}
