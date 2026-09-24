// Persisted user state. One JSON document per user.
// Today it lives in browser storage; the same document will be stored in the
// cloud (Supabase) in the next stage, so keep it serialisable and versioned.

export const STATE_VERSION = 1;

export type MasteryLevel = 0 | 1 | 2 | 3 | 4 | 5; // not started .. retained
export type DepthLevel = 0 | 1 | 2 | 3 | 4 | 5; // D0 .. D5

export type TopicProgress = {
  mastery: MasteryLevel;
  depth: DepthLevel | null;
  evidence: string;
  demonstratedAt?: string;
  reviews: { count: number; last?: string };
  updatedAt: string;
};

export type GateStatus = "not_attempted" | "attempting" | "passed";
export type GateProgress = {
  status: GateStatus;
  criteria: Record<number, boolean>;
  evidence: string;
  passedAt?: string;
};

export type ProjectStatus = "not_started" | "in_progress" | "complete";
export type ProjectProgress = {
  status: ProjectStatus;
  milestones: Record<string, boolean>;
  quality: Record<string, boolean>;
  repoUrl: string;
};

export type ResourceStatus = "todo" | "using" | "done";

export type Note = { text: string; updatedAt: string };

export type DsaDifficulty = "easy" | "medium" | "hard";
export type DsaStatus = "todo" | "attempted" | "solved_with_help" | "solved";
export type DsaProblem = {
  id: string;
  title: string;
  url: string;
  source: string;
  difficulty: DsaDifficulty;
  status: DsaStatus;
  patterns: string[]; // concept IDs from P04 (for example P04.6#2 sliding window)
  missed: string; // mistake log (master DSA track): what I missed
  why: string; // why I missed it
  better: string; // better approach
  notes: string;
  revisitOn: string | null; // ISO date
  attempts: number;
  createdAt: string;
  updatedAt: string;
};

export type Story = {
  id: string;
  theme: string;
  title: string;
  situation: string;
  action: string;
  result: string;
  updatedAt: string;
};

export type ApplicationStage = "planned" | "applied" | "interviewing" | "offer" | "closed";
export type Application = {
  id: string;
  organisation: string;
  role: string;
  kind: "internship" | "new-grad" | "research" | "other";
  stage: ApplicationStage;
  date: string;
  url: string;
  notes: string;
  updatedAt: string;
};

export type UserState = {
  version: number;
  updatedAt: string;
  currentWeek: number;
  checks: Record<string, string>; // concept id (or zero-item topic id) -> ISO time checked
  topics: Record<string, TopicProgress>;
  gates: Record<string, GateProgress>;
  weeks: Record<string, { done: boolean; doneAt?: string }>;
  projects: Record<string, ProjectProgress>;
  resources: Record<string, ResourceStatus>;
  flags: Record<string, boolean>; // track items (T04#2), portfolio items (PS-A#1)
  notes: Record<string, Note>; // entity id -> note
  dsa: DsaProblem[];
  stories: Story[];
  applications: Application[];
};

export function emptyState(): UserState {
  return {
    version: STATE_VERSION,
    updatedAt: new Date(0).toISOString(),
    currentWeek: 1,
    checks: {},
    topics: {},
    gates: {},
    weeks: {},
    projects: {},
    resources: {},
    flags: {},
    notes: {},
    dsa: [],
    stories: [],
    applications: [],
  };
}
