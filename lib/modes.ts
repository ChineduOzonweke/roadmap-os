import type { ActiveModeId, UserState } from "@/types/state";

/**
 * Active Modes A-F (master 0.3, ACTIVE-PATH MODES): legitimate operating
 * states that change the recommended workload. Not to be confused with the
 * AI Learn/Build/Assess mode in lib/ai.ts.
 */

export type ActiveModePolicy = {
  /** active: normal roadmap work; light: optional, only with capacity; paused: no new roadmap modules. */
  primary: "active" | "light" | "paused";
  supporting: boolean;
  project: boolean;
  /** DSA maintenance: on, optional (short sessions only if it helps), or off (not yet unlocked / out of scope). */
  dsa: "on" | "optional" | "off";
  /** Session plan offered first on Today. */
  session: "full" | "short" | "review";
  /** One calm line explaining the state; null when nothing needs saying. */
  note: string | null;
};

export type ActiveModeDef = { id: ActiveModeId; name: string; summary: string; policy: ActiveModePolicy };

export const ACTIVE_MODES: ActiveModeDef[] = [
  {
    id: "A",
    name: "Foundation reset",
    summary: "Programming fundamentals only. Git and setup only as needed. ML, cloud and advanced DSA are not active yet.",
    policy: { primary: "active", supporting: false, project: false, dsa: "off", session: "full", note: "One real learning block: programming. Everything else is reference until the gate is passed." },
  },
  {
    id: "B",
    name: "Normal semester",
    summary: "University obligations plus one roadmap module, one small supporting block if there is real capacity, DSA maintenance, one project milestone.",
    policy: { primary: "active", supporting: true, project: true, dsa: "on", session: "full", note: null },
  },
  {
    id: "C",
    name: "Heavy semester",
    summary: "University is the priority. Keep only maintenance outside school; the roadmap can pause.",
    policy: { primary: "light", supporting: false, project: false, dsa: "optional", session: "short", note: "University comes first. A roadmap pause is not failure; it is correct scheduling." },
  },
  {
    id: "D",
    name: "Exams",
    summary: "University preparation is primary. New roadmap modules pause. Re-tests stay light; DSA only as an optional 15-30 minute session if it helps.",
    policy: { primary: "paused", supporting: false, project: false, dsa: "optional", session: "review", note: "Exam period: new roadmap work is paused and your week waits for you. Keep re-tests light." },
  },
  {
    id: "E",
    name: "Internship / SIWES",
    summary: "Treat genuine overlapping work as applied learning. Small roadmap maintenance; keep project and career evidence where practical.",
    policy: { primary: "light", supporting: false, project: true, dsa: "optional", session: "short", note: "Placement work is applied learning. Log what you built there as evidence; keep roadmap work small." },
  },
  {
    id: "F",
    name: "Break",
    summary: "Extra capacity for deeper study, projects, DSA, deployment practice and research reproduction, while keeping the active path narrow.",
    policy: { primary: "active", supporting: true, project: true, dsa: "on", session: "full", note: null },
  },
];

export const modeDef = (id: ActiveModeId): ActiveModeDef => ACTIVE_MODES.find((m) => m.id === id) ?? ACTIVE_MODES[1];

/** Suggested mode when none has been chosen: Foundation reset during the programming reset stage, otherwise Normal semester. */
export function suggestedMode(currentWeek: number): ActiveModeId {
  return currentWeek <= 2 ? "A" : "B";
}

export function effectiveMode(s: UserState): { def: ActiveModeDef; chosen: boolean; since: string | null } {
  if (s.activeMode) return { def: modeDef(s.activeMode.id), chosen: true, since: s.activeMode.since };
  return { def: modeDef(suggestedMode(s.currentWeek)), chosen: false, since: null };
}

/** Switch mode: closes the current period into history. Choosing the same mode again is a no-op. */
export function switchMode(s: UserState, id: ActiveModeId, at: Date): Pick<UserState, "activeMode" | "modeHistory"> {
  if (s.activeMode?.id === id) return { activeMode: s.activeMode, modeHistory: s.modeHistory };
  const iso = at.toISOString();
  const history = s.activeMode ? [...s.modeHistory, { id: s.activeMode.id, since: s.activeMode.since, until: iso }] : s.modeHistory;
  return { activeMode: { id, since: iso }, modeHistory: history };
}
