import type { UserState } from "@/types/state";
import { currentTier } from "@/lib/ai";
import { effectiveMode } from "@/lib/modes";
import { gateName, nameOf, phaseById, topicById, weekByCw } from "@/lib/progress";
import { evidenceFor } from "@/lib/evidence";
import type { AiModeId, TierId } from "./policy";

/**
 * What the tutor knows about the learner right now. Built deterministically
 * from user state plus the page the tutor was opened from.
 */

export type TutorScope = { topicId?: string; conceptId?: string; projectId?: string; gateId?: string };

const MASTERY = ["Not started", "Learning", "Explained", "Practised", "Demonstrated", "Retained"];

export type ModeResolution = { mode: AiModeId; locked: boolean; reason: string };

export type AiContext = {
  week: { cw: number; title: string };
  phase: { id: string; title: string } | null;
  topic: { id: string; title: string; mastery: number; masteryLabel: string } | null;
  concept: { id: string; title: string } | null;
  project: { id: string; title: string; status: string } | null;
  checkpoint: { id: string; title: string; status: string } | null;
  activeMode: { id: string; name: string };
  tier: { id: TierId; title: string };
  evidence: { count: number; recent: string[] };
};

/** Learn / Build / Assess for this scope. A checkpoint attempt in progress forces Assess and cannot be switched off here. */
export function resolveMode(s: UserState, scope: TutorScope, requested: AiModeId | null): ModeResolution {
  const w = weekByCw(s.currentWeek);
  const gate = scope.gateId ?? w?.g ?? null;
  if (gate && s.gates[gate]?.status === "attempting") {
    return { mode: "assess", locked: true, reason: `${gateName(gate)} attempt in progress: mark it passed or not attempted to leave Assess.` };
  }
  if (requested === "assess") return { mode: "assess", locked: false, reason: "You chose Assess: an unseen task, exam or graded work." };
  const topicId = scope.topicId ?? (scope.conceptId ? scope.conceptId.split("#")[0] : w?.pu[0]?.split("#")[0]);
  const mastery = topicId ? s.topics[topicId]?.mastery ?? 0 : 0;
  const buildOk = !!scope.projectId || w?.ty === "project" || mastery >= 3;
  if (requested === "build" && !buildOk) {
    return { mode: "learn", locked: false, reason: "Build needs the topic at Practised or higher, or a project. Staying in Learn." };
  }
  if (requested === "learn") return { mode: "learn", locked: false, reason: "You chose Learn." };
  if (requested === "build") return { mode: "build", locked: false, reason: "You chose Build." };
  return buildOk
    ? { mode: "build", locked: false, reason: scope.projectId || w?.ty === "project" ? "Project work defaults to Build." : "You can already do this alone (Practised or higher)." }
    : { mode: "learn", locked: false, reason: "The topic is new to you (below Practised), so Learn." };
}

export function canBuild(s: UserState, scope: TutorScope): boolean {
  return resolveMode(s, scope, "build").mode === "build";
}

export function buildContext(s: UserState, scope: TutorScope): AiContext {
  const w = weekByCw(s.currentWeek);
  const topicId = scope.topicId ?? (scope.conceptId ? scope.conceptId.split("#")[0] : w?.pu[0]?.split("#")[0]) ?? null;
  const t = topicId ? topicById.get(topicId) : undefined;
  const phase = t ? phaseById.get(t.p) : undefined;
  const gateId = scope.gateId ?? w?.g ?? null;
  const tier = currentTier(s);
  const mode = effectiveMode(s).def;
  const subjects = [topicId, scope.projectId, gateId].filter((x): x is string => !!x);
  const ev = evidenceFor(s, subjects);
  return {
    week: { cw: s.currentWeek, title: w?.t ?? "" },
    phase: phase ? { id: phase.id, title: phase.t } : null,
    topic: t ? { id: t.id, title: t.t, mastery: s.topics[t.id]?.mastery ?? 0, masteryLabel: MASTERY[s.topics[t.id]?.mastery ?? 0] } : null,
    concept: scope.conceptId ? { id: scope.conceptId, title: nameOf(scope.conceptId) } : null,
    project: scope.projectId ? { id: scope.projectId, title: nameOf(scope.projectId), status: s.projects[scope.projectId]?.status ?? "not_started" } : null,
    checkpoint: gateId ? { id: gateId, title: gateName(gateId), status: s.gates[gateId]?.status ?? "not_attempted" } : null,
    activeMode: { id: mode.id, name: mode.name },
    tier: { id: (tier.id === "T4" ? "T3" : tier.id) as TierId, title: tier.title },
    evidence: { count: ev.length, recent: ev.slice(0, 3).map((e) => e.title || e.url) },
  };
}

/** Plain-text summary sent to the provider. No notes, journal text or identifiers beyond curriculum ids. */
export function contextSummary(c: AiContext): string {
  return [
    `Week ${c.week.cw} of 206: ${c.week.title}.`,
    c.phase && `Phase: ${c.phase.title}.`,
    c.topic && `Topic: ${c.topic.title} (mastery: ${c.topic.masteryLabel}).`,
    c.concept && `Concept: ${c.concept.title}.`,
    c.project && `Project: ${c.project.title} (${c.project.status.replace("_", " ")}).`,
    c.checkpoint && `Checkpoint: ${c.checkpoint.title} (${c.checkpoint.status.replace("_", " ")}).`,
    `Operating mode: ${c.activeMode.name}.`,
    `AI tier: ${c.tier.title}.`,
    c.evidence.count ? `Evidence recorded for this context: ${c.evidence.count}.` : null,
  ].filter(Boolean).join("\n");
}
