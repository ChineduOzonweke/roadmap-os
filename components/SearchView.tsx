"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { useHydrated, useUserState } from "@/lib/store";
import { hrefFor } from "@/lib/ids";
import type { SearchEntry } from "@/types/curriculum";
import { InlineText } from "./ui";
import { RefId } from "./Ref";

let indexPromise: Promise<SearchEntry[]> | null = null;
function loadIndex() {
  indexPromise ??= fetch("/search-index.json").then((r) => {
    if (!r.ok) throw new Error(`Search index returned ${r.status}`);
    return r.json() as Promise<SearchEntry[]>;
  });
  return indexPromise;
}

type Hit = SearchEntry & { score: number };

/** Lowercase and fold British/American spellings so "normalization" finds "normalisation". */
export function fold(x: string) {
  return x.toLowerCase().replace(/is(ation|e|ed|es|ing|er)\b/g, "iz$1").replace(/yse\b/g, "yze").replace(/our\b/g, "or");
}

function score(e: SearchEntry, q: string, tokens: string[]): number {
  const id = e.id.toLowerCase();
  const t = fold(e.t);
  const hay = `${id} ${t} ${fold(e.p ?? "")} ${fold(e.s)} ${e.k.toLowerCase()}`;
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
    const query = fold(q.trim());
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
        placeholder="Search the roadmap, your notes and journals"
        aria-label="Search Roadmap OS"
        className="input min-h-12 text-base"
      />
      <p className="mt-2 text-xs text-muted">Try words (&quot;normalization&quot;, &quot;sliding window&quot;, &quot;docker&quot;) or a week (&quot;week 88&quot;).</p>

      {error && <p className="mt-4 rounded-md border border-danger/40 bg-danger-soft px-3 py-2 text-sm">The search index could not load ({error}). Reload the page; if it keeps failing, the deployment is missing /search-index.json.</p>}
      {!index && !error && <p className="mt-4 text-sm text-muted">Loading the search index.</p>}

      {kinds.length > 1 && (
        <div className="-mx-4 mt-4 flex gap-2 overflow-x-auto px-4 pb-1 scroll-thin sm:mx-0 sm:flex-wrap sm:px-0" role="group" aria-label="Result type">
          {[["All", hits.length] as [string, number], ...kinds].map(([k, n]) => (
            <button key={k} type="button" aria-pressed={kind === k} onClick={() => setKind(k)} className="chip">
              {k} <span className="tabular-nums opacity-70">{n}</span>
            </button>
          ))}
        </div>
      )}

      {q.trim() && index && (
        shown.length ? (
          <ul className="list-card mt-4">
            {shown.map((h, i) => (
              <li key={`${h.k}-${h.id}-${i}`}>
                <Link href={h.h} className="flex min-h-14 items-start gap-3 px-4 py-3 hover:bg-surface-2/60 active:bg-surface-2">
                  <span className="min-w-0 flex-1">
                    <span className="block font-medium leading-snug"><InlineText text={h.t} /></span>
                    {(h.p || h.s) && <span className="mt-0.5 line-clamp-2 text-sm text-muted">{h.p || h.s} <RefId id={h.id} /></span>}
                  </span>
                  <span className="mt-0.5 shrink-0 text-xs text-faint">{h.k}</span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-6 text-center text-sm text-muted">Nothing matches &quot;{q}&quot;. Try fewer words.</p>
        )
      )}
      {hits.length > 80 && kind === "All" && <p className="mt-2 text-xs text-muted">Showing the top 80 of {hits.length}. Narrow by type above.</p>}
    </div>
  );
}
