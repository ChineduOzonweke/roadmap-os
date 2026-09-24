#!/usr/bin/env node
// Validates data/*.json before the app is built. Exits with code 1 on any error.
// Runs automatically via `npm run build` (prebuild) so a broken dataset never deploys.
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const load = (f) => JSON.parse(readFileSync(join(root, "data", f), "utf8"));

const meta = load("meta.json");
const stages = load("stages.json");
const phases = load("phases.json");
const topics = load("topics.json");
const concepts = load("concepts.json");
const checkpoints = load("checkpoints.json");
const projects = load("projects.json");
const tracks = load("tracks.json");
const { resources, tools } = load("resources.json");
const weeks = load("weeks.json");

const errors = [];
const warnings = [];
const err = (m) => errors.push(m);

// ---- unique IDs (per collection and globally)
const all = new Map();
function register(kind, id) {
  if (typeof id !== "string" || !id) return err(`${kind}: empty or non-string id`);
  if (all.has(id)) err(`duplicate id ${id} (${kind} and ${all.get(id)})`);
  all.set(id, kind);
}
phases.forEach((p) => register("phase", p.id));
topics.forEach((t) => register("topic", t.id));
concepts.forEach((c) => register("concept", c.id));
checkpoints.forEach((c) => register("checkpoint", c.id));
projects.forEach((p) => register("project", p.id));
tracks.forEach((t) => register("track", t.id));
resources.forEach((r) => register("resource", r.id));
tools.forEach((t) => register("tool", t.id));
stages.forEach((s) => register("stage", s.id));

const phaseIds = new Set(phases.map((p) => p.id));
const topicMap = new Map(topics.map((t) => [t.id, t]));
const conceptMap = new Map(concepts.map((c) => [c.id, c]));
const gateIds = new Set(checkpoints.map((c) => c.id));
const projectIds = new Set(projects.map((p) => p.id));

const isRef = (id) => phaseIds.has(id) || topicMap.has(id) || conceptMap.has(id) || gateIds.has(id) || projectIds.has(id);

// ---- phases
if (phases.length !== 46) err(`expected 46 phases, found ${phases.length}`);
phases.forEach((p, i) => {
  const expect = `P${String(i + 1).padStart(2, "0")}`;
  if (p.id !== expect) err(`phase order: expected ${expect}, found ${p.id}`);
  p.prerequisites.forEach((q) => { if (!phaseIds.has(q.id) && !gateIds.has(q.id)) err(`${p.id} prerequisite ${q.id} does not exist`); });
  p.topicIds.forEach((t) => { if (!topicMap.has(t)) err(`${p.id} lists missing topic ${t}`); });
});

// prerequisite graph must be acyclic
{
  const adj = new Map(phases.map((p) => [p.id, p.prerequisites.map((q) => q.id).filter((x) => phaseIds.has(x))]));
  const state = new Map();
  const visit = (id, path) => {
    if (state.get(id) === 2) return;
    if (state.get(id) === 1) return err(`prerequisite cycle: ${[...path, id].join(" -> ")}`);
    state.set(id, 1);
    for (const n of adj.get(id) || []) visit(n, [...path, id]);
    state.set(id, 2);
  };
  phases.forEach((p) => visit(p.id, []));
}

// ---- topics and concepts
topics.forEach((t) => {
  if (!phaseIds.has(t.phaseId)) err(`topic ${t.id} has invalid phase ${t.phaseId}`);
  if (!t.id.startsWith(t.phaseId + ".")) err(`topic ${t.id} id does not match phase ${t.phaseId}`);
  if (t.parentId && !topicMap.has(t.parentId)) err(`topic ${t.id} has missing parent ${t.parentId}`);
  t.conceptIds.forEach((c, i) => {
    const cc = conceptMap.get(c);
    if (!cc) err(`topic ${t.id} lists missing concept ${c}`);
    else if (cc.topicId !== t.id || cc.index !== i + 1) err(`concept ${c} index/topic mismatch`);
  });
  t.blocks.forEach((b) => { if (b.t === "concepts") b.ids.forEach((c) => { if (!conceptMap.has(c)) err(`topic ${t.id} block references missing concept ${c}`); }); });
  t.predecessors.forEach((p) => { if (!isRef(p.from.split("#")[0]) && !isRef(p.from)) err(`topic ${t.id} predecessor ${p.from} missing`); });
  if (t.requiredGate && !gateIds.has(t.requiredGate)) err(`topic ${t.id} requires missing gate ${t.requiredGate}`);
  t.masteryStatements.forEach((m) => { if (!topicMap.has(m)) err(`topic ${t.id} mastery statement ${m} missing`); });
});
concepts.forEach((c) => {
  if (!topicMap.has(c.topicId)) err(`concept ${c.id} has missing topic ${c.topicId}`);
  if (!phaseIds.has(c.phaseId)) err(`concept ${c.id} has invalid phase ${c.phaseId}`);
  if (!c.text || !c.text.trim()) err(`concept ${c.id} has empty text`);
  if (c.id !== `${c.topicId}#${c.index}`) err(`concept id ${c.id} does not match topic/index`);
});

// ---- weeks: exactly 206 contiguous, valid references, full concept coverage
if (weeks.length !== 206) err(`expected 206 weeks, found ${weeks.length}`);
weeks.forEach((w, i) => { if (w.cw !== i + 1) err(`week sequence broken at index ${i}: cw ${w.cw}`); });
const covered = new Set();
const checkSlice = (w, s, lane) => {
  if (s.kind === "topic") {
    const t = topicMap.get(s.topicId);
    if (!t) return err(`CW${w.cw} ${lane} references missing topic ${s.topicId}`);
    const ids = s.conceptIds ?? t.conceptIds;
    ids.forEach((c) => { if (!conceptMap.has(c)) err(`CW${w.cw} references missing concept ${c}`); else covered.add(c); });
  } else if (s.kind === "project") {
    if (!projectIds.has(s.projectId)) err(`CW${w.cw} references missing project ${s.projectId}`);
  }
};
weeks.forEach((w) => {
  w.primary.forEach((s) => checkSlice(w, s, "primary"));
  w.supporting.forEach((s) => checkSlice(w, s, "supporting"));
  if (w.dsaLane) w.dsaLane.slices.forEach((s) => checkSlice(w, s, "dsa"));
  if (w.gate && !gateIds.has(w.gate)) err(`CW${w.cw} gate ${w.gate} missing`);
  if (w.requiredGate && !gateIds.has(w.requiredGate)) err(`CW${w.cw} required gate ${w.requiredGate} missing`);
  if (w.project && !projectIds.has(w.project)) err(`CW${w.cw} project ${w.project} missing`);
  if (!stages.some((s) => s.id === w.stage)) err(`CW${w.cw} stage ${w.stage} missing`);
});
const onDemand = new Set(concepts.filter((c) => c.onDemand).map((c) => c.id));
const onDemandTopics = new Set(topics.filter((t) => t.onDemand).map((t) => t.id));
const uncovered = concepts.filter((c) => !covered.has(c.id) && !onDemand.has(c.id) && !onDemandTopics.has(c.topicId));
if (uncovered.length) err(`${uncovered.length} concepts are not mapped to any week: ${uncovered.slice(0, 10).map((c) => c.id).join(", ")}`);

// ---- gates
const gateWeeks = new Map(weeks.filter((w) => w.gate).map((w) => [w.gate, w.cw]));
checkpoints.forEach((c) => {
  c.requires.forEach((r) => { if (!isRef(r)) err(`checkpoint ${c.id} requires missing ${r}`); });
  if (c.gateWeek != null && gateWeeks.get(c.id) !== c.gateWeek) err(`checkpoint ${c.id} gateWeek ${c.gateWeek} does not match week data`);
  if (!c.criteria.length) warnings.push(`checkpoint ${c.id} has no criteria list`);
});
["G0", "C1", "C2", "C3", "C4", "C5", "C6", "C7"].forEach((g) => { if (!gateIds.has(g)) err(`missing canonical checkpoint ${g}`); });

// ---- projects
if (projects.length !== 11) err(`expected 11 canonical projects, found ${projects.length}`);
projects.forEach((p) => {
  p.requires.forEach((r) => { if (!isRef(r)) err(`project ${p.id} requires missing ${r}`); });
  p.relatedTopics.forEach((t) => { if (!topicMap.has(t)) err(`project ${p.id} related topic ${t} missing`); });
  p.milestones.forEach((m) => { if (m.cw < 1 || m.cw > 206) err(`project ${p.id} milestone week ${m.cw} out of range`); });
  if (!p.buildWeeks.length) err(`project ${p.id} has no build weeks`);
});

// ---- resources
let guidance = 0;
resources.forEach((r) => {
  if (r.phaseId && !phaseIds.has(r.phaseId)) err(`resource ${r.id} phase ${r.phaseId} missing`);
  r.topicIds.forEach((t) => { if (!topicMap.has(t)) err(`resource ${r.id} topic ${t} missing`); });
  if (r.url) { try { const u = new URL(r.url); if (!/^https?:$/.test(u.protocol)) err(`resource ${r.id} bad protocol`); } catch { err(`resource ${r.id} malformed url ${r.url}`); } }
  else guidance += 1;
});
tools.forEach((t) => { if (t.url) { try { new URL(t.url); } catch { err(`tool ${t.id} malformed url`); } } });
meta.componentEdges.forEach((e) => { [e.from, e.to].forEach((x) => { if (!isRef(x)) err(`component edge references missing ${x}`); }); });

// ---- report
const withUrl = resources.filter((r) => r.url).length;
console.log("Roadmap OS data validation");
console.log(`  source md5        ${meta.source.md5}`);
console.log(`  phases            ${phases.length}`);
console.log(`  topics            ${topics.length} (${topics.filter((t) => t.kind === "concepts").length} with checklists)`);
console.log(`  concepts          ${concepts.length} (${covered.size} mapped to weeks, ${onDemand.size + concepts.filter((c) => onDemandTopics.has(c.topicId)).length} on demand)`);
console.log(`  weeks             ${weeks.length}`);
console.log(`  gates             ${checkpoints.length}`);
console.log(`  projects          ${projects.length}`);
console.log(`  resources         ${resources.length} (${withUrl} with URLs, ${guidance} written guidance) + ${tools.length} tools`);
meta.resourceNotes.forEach((n) => warnings.push(`source note: ${n}`));
warnings.forEach((w) => console.log(`  note: ${w}`));
if (errors.length) {
  console.error(`\n${errors.length} error(s):`);
  errors.forEach((e) => console.error(`  - ${e}`));
  process.exit(1);
}
console.log("  result            OK");
