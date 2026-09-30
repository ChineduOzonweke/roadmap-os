// AI-native engineering overlay (master section 109, generated into data/ai-overlay.json).
// Everything here is derived from existing progress: gates decide the tier,
// topic mastery decides the mode. No separate AI progress system.
import overlayJson from "@/data/ai-overlay.json";
import type { UserState } from "@/types/state";
import { gatePassed, topicById, topicView, weekByCw } from "@/lib/progress";

export type AiModeId = "learn" | "build" | "assess";
export type AiMode = { id: AiModeId; title: string; when: string; summary: string; aiCan: string[]; yours: string[] };
export type AiTier = {
  id: "T1" | "T2" | "T3" | "T4";
  title: string;
  unlock: string | null;
  summary: string;
  aiCan: string[];
  youOwn: string[];
  security: string[];
  links: string[];
  pointerOnly: boolean;
};
export type AiMission = {
  id: string;
  title: string;
  tier: number;
  requires: string[];
  goal: string;
  you: string;
  ai: string;
  verify: string;
  evidence: string;
};
export type AiOverlay = {
  intro: string[];
  loop: string[];
  modes: AiMode[];
  tiers: AiTier[];
  context: { text: string; points: string[] };
  verification: { text: string; points: string[] };
  missions: AiMission[];
  checkpoints: string;
};

export const overlay = overlayJson as unknown as AiOverlay;
export const workingTiers = overlay.tiers.filter((t) => !t.pointerOnly);
export const modeById = new Map(overlay.modes.map((m) => [m.id, m]));

/** Highest working tier whose unlock gate is passed. Tier 1 is always open. */
export function currentTier(s: UserState): AiTier {
  let cur = workingTiers[0];
  for (const t of workingTiers) if (!t.unlock || gatePassed(s, t.unlock)) cur = t;
  return cur;
}

export function tierNumber(t: AiTier) {
  return Number(t.id.slice(1));
}

/**
 * Default mode for a week: Learn while the week's main topic is new to you
 * (mastery below Practised), Build once you can do it alone or on project weeks.
 * Assess applies to gate attempts and is shown as a separate note.
 */
export function weekMode(s: UserState, cw: number): { mode: AiMode; gate: string | null } {
  const w = weekByCw(cw);
  const gate = w.g && !gatePassed(s, w.g) ? w.g : null;
  const firstTopic = w.pu[0]?.split("#")[0];
  const mastery = firstTopic ? s.topics[firstTopic]?.mastery ?? 0 : 0;
  const build = w.ty === "project" || (firstTopic ? mastery >= 3 : false);
  return { mode: modeById.get(build ? "build" : "learn")!, gate };
}

function requirementMet(s: UserState, id: string): boolean {
  if (/^AIM-\d\d$/.test(id)) return !!s.flags[id];
  if (/^(G0|C\d|SG\d[A-Z]?)$/.test(id)) return gatePassed(s, id);
  const t = topicById.get(id);
  if (t) {
    const v = topicView(s, t);
    return v.done > 0 || v.mastery >= 1;
  }
  return false;
}

export type MissionState = "done" | "open" | "locked";

export function missionState(s: UserState, m: AiMission): { state: MissionState; missing: string[] } {
  if (s.flags[m.id]) return { state: "done", missing: [] };
  const tier = tierNumber(currentTier(s));
  const missing = m.requires.filter((r) => !requirementMet(s, r));
  if (m.tier > tier) {
    const t = workingTiers[m.tier - 1];
    if (t?.unlock && !missing.includes(t.unlock)) missing.unshift(t.unlock);
  }
  return { state: missing.length ? "locked" : "open", missing };
}
