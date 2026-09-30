// Static search index, generated at build time from data/*.json and served as a cached file.
import { checkpoints, concepts, meta, phases, projects, resources, tools, topics, tracks, weeks } from "@/lib/data";
import { conceptSlug } from "@/lib/ids";
import type { SearchEntry } from "@/types/curriculum";
import overlay from "@/data/ai-overlay.json";

export const dynamic = "force-static";

export function GET() {
  const e: SearchEntry[] = [];
  const phaseTitle = new Map(phases.map((p) => [p.id, p.title]));
  const topicLabel = new Map(topics.map((t) => [t.id, t.label]));
  const topicPath = (id: string) => {
    const t = topics.find((x) => x.id === id);
    if (!t) return "";
    const ph = phaseTitle.get(t.phaseId) ?? "";
    return t.label.startsWith(ph) ? t.label : `${ph} › ${t.label}`;
  };
  phases.forEach((p) => e.push({ k: "Phase", id: p.id, t: p.title, p: "Roadmap", s: p.description, h: `/phases/${p.id}` }));
  topics.forEach((t) => e.push({ k: t.phaseId === "P04" ? "DSA topic" : "Topic", id: t.id, t: t.label, p: phaseTitle.get(t.phaseId) ?? "", s: `${t.meta} ${t.title}`, h: `/topics/${t.id}` }));
  concepts.forEach((c) => e.push({ k: c.phaseId === "P04" ? "DSA concept" : "Concept", id: c.id, t: c.text, p: topicPath(c.topicId), s: topicLabel.get(c.topicId) ?? "", h: `/concepts/${conceptSlug(c.id)}` }));
  weeks.forEach((w) => e.push({ k: "Week", id: String(w.cw), t: `Week ${w.cw}: ${w.title}`, p: w.primary.map((x) => x.detail).filter(Boolean).join("; "), s: w.build, h: `/weeks/${w.cw}` }));
  checkpoints.forEach((c) => e.push({ k: "Checkpoint", id: c.id, t: c.kind === "competency" ? `${c.title} checkpoint` : c.title, s: [c.practicalGate, ...c.criteria].join(" "), h: `/checkpoints/${c.id}` }));
  projects.forEach((p) => e.push({ k: "Project", id: p.id, t: p.title, s: `${p.purpose} ${p.evidenceFor} ${p.skills.join(" ")}`, h: `/projects/${p.id}` }));
  resources.forEach((r) => e.push({ k: "Resource", id: r.id, t: r.name || r.url || r.id, s: `${r.label} ${r.phaseId ?? "general"} ${r.group} ${r.note} ${r.url ?? ""}`, h: r.phaseId ? `/resources?phase=${r.phaseId}` : "/resources" }));
  tools.forEach((t) => e.push({ k: "Tool", id: t.id, t: t.name, s: `${t.activation} ${t.route}`, h: "/resources" }));
  tracks.forEach((t) => {
    e.push({ k: "Career", id: t.id, t: t.title, s: t.activation, h: `/career#${t.id}` });
    t.items.forEach((it) => e.push({ k: "Career", id: it.id, t: it.text, s: t.title, h: `/career#${t.id}` }));
  });
  meta.portfolioStages.forEach((p) => e.push({ k: "Career", id: p.id, t: p.title, s: p.items.join(", "), h: "/career#portfolio" }));
  meta.depthModel.forEach((d) => e.push({ k: "Guide", id: `D${d.level}`, t: d.name, s: d.definition, h: "/guide#depth" }));
  meta.masteryStates.forEach((m) => e.push({ k: "Guide", id: `M${m.level}`, t: `Mastery: ${m.name}`, s: m.master, h: "/guide#mastery" }));
  overlay.missions.forEach((m) => e.push({ k: "AI mission", id: m.id, t: m.title, p: "Working with AI", s: `${m.goal} ${m.you} ${m.verify}`, h: "/ai" }));
  e.push({ k: "Guide", id: "AI", t: "Working with AI: tiers and modes", p: "Working with AI", s: "tutor pair supervised agent learn build assess context engineering verification prompt injection", h: "/ai" });
  return Response.json(e);
}
