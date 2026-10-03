import type { SearchEntry } from "@/types/curriculum";
import type { UserState } from "@/types/state";
import { hrefFor } from "@/lib/ids";
import { kindLabel } from "@/lib/evidence";

/** Shared by /search and the command palette. The curriculum index is static (/search-index.json); personal entries come from user state. */

let indexPromise: Promise<SearchEntry[]> | null = null;
export function loadIndex(): Promise<SearchEntry[]> {
  indexPromise ??= fetch("/search-index.json").then((r) => {
    if (!r.ok) throw new Error(`Search index returned ${r.status}`);
    return r.json() as Promise<SearchEntry[]>;
  });
  indexPromise.catch(() => { indexPromise = null; });
  return indexPromise;
}

/** Lowercase and fold British/American spellings so "normalization" finds "normalisation". */
export function fold(x: string) {
  return x.toLowerCase().replace(/is(ation|e|ed|es|ing|er)\b/g, "iz$1").replace(/yse\b/g, "yze").replace(/our\b/g, "or");
}

export function score(e: SearchEntry, q: string, tokens: string[]): number {
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
  if (e.k === "Go to" || e.k === "Command") sc += 8;
  return sc;
}

export type Hit = SearchEntry & { score: number };

export function search(entries: SearchEntry[], q: string, limit = Infinity): Hit[] {
  const query = fold(q.trim());
  if (!query) return [];
  const tokens = query.split(/\s+/).filter(Boolean);
  return entries
    .map((e) => ({ ...e, score: score(e, query, tokens) }))
    .filter((h) => h.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

/** The user's own records as search entries: DSA problems, notes, career entries, evidence, sessions. */
export function personalEntries(s: UserState): SearchEntry[] {
  return [
    ...s.dsa.map((p) => ({ k: "DSA journal", id: p.difficulty, t: p.title, s: `${p.source} ${p.patterns.join(" ")} ${p.missed} ${p.why} ${p.better} ${p.notes}`, h: "/dsa" })),
    ...Object.entries(s.notes).map(([id, n]) => ({ k: "Note", id, t: n.text.split("\n")[0].slice(0, 120), s: n.text, h: id.startsWith("week:") ? `/weeks/${id.slice(5)}` : hrefFor(id) ?? "/notes" })),
    ...s.stories.map((x) => ({ k: "Career", id: x.theme, t: x.title, s: `${x.situation} ${x.action} ${x.result}`, h: "/career#stories" })),
    ...s.applications.map((x) => ({ k: "Career", id: x.stage, t: `${x.organisation}: ${x.role}`, s: x.notes, h: "/career#applications" })),
    ...s.evidence.map((e) => ({ k: "Evidence", id: kindLabel(e.kind), t: e.title || e.url, s: `${e.detail} ${e.url} ${e.subject}`, h: hrefFor(e.subject.replace(/-(M\d+|U.*)$/, "")) ?? "/evidence" })),
    ...s.sessions.filter((x) => x.status === "completed" && (x.log.learned || x.log.next)).map((x) => ({ k: "Session", id: x.date, t: x.log.learned.split("\n")[0].slice(0, 120) || x.log.next.slice(0, 120), s: `${x.log.learned} ${x.log.stuck} ${x.log.next}`, h: "/" })),
  ];
}
