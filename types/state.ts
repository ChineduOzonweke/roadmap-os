// Persisted user state. One JSON document per user.
// Today it lives in browser storage; the same document will be stored in the
// cloud (Supabase) in the next stage, so keep it serialisable and versioned.

// v1: original. v2 (phase C): adds `sessions`. v3 (phase E): adds `activeMode`, `modeHistory`.
// v4 (phase F): adds `evidence`. See lib/persistence/migrate.ts.
export const STATE_VERSION = 4;

export type MasteryLevel = 0 | 1 | 2 | 3 | 4 | 5; // not started .. retained
export type DepthLevel = 0 | 1 | 2 | 3 | 4 | 5; // D0 .. D5

/** One spaced re-test outcome. `prev` is what the result changed, so it can be undone exactly. */
export type ReviewEntry = {
  at: string;
  result: "pass" | "fail";
  step: number; // index of the interval this re-test closed
  intervalDays: number;
  note?: string;
  prev?: { mastery: MasteryLevel; reviews: TopicProgress["reviews"] };
};

export type TopicProgress = {
  mastery: MasteryLevel;
  depth: DepthLevel | null;
  evidence: string;
  demonstratedAt?: string;
  /** count = step into the re-test intervals; lapses = failed re-tests; needsPractice = last re-test failed. */
  reviews: { count: number; last?: string; lapses?: number; needsPractice?: boolean };
  /** Every re-test result, never trimmed (phase D). */
  reviewLog?: ReviewEntry[];
  /** Re-test cycles ended when mastery dropped below Demonstrated. Kept as history, never deleted. */
  pastReviews?: { count: number; last?: string; demonstratedAt?: string; endedAt: string }[];
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
export type MilestoneStatus = "todo" | "doing" | "blocked" | "done";
export type MilestoneDetail = { status: MilestoneStatus; notes: string; startedAt?: string; doneAt?: string };
export type CustomMilestone = { id: string; text: string; createdAt: string };
export type Decision = { id: string; decision: string; why: string; rejected: string };
export type Metric = { id: string; name: string; value: string; context: string };
/** The engineering record behind a project: what the README / case study is generated from (phase G). */
export type ProjectRecord = {
  problem: string;
  goal: string;
  architecture: string;
  implementation: string;
  experiments: string;
  failures: string; // failure points and debugging
  lessons: string;
  future: string;
  completionCriteria: string; // the user's own definition of done, beyond the master's
  deployUrl: string;
  links: string; // one per line
  decisions: Decision[];
  metrics: Metric[];
};
export type ProjectProgress = {
  status: ProjectStatus;
  milestones: Record<string, boolean>; // milestone id -> done (v1 field, still the source of "done")
  quality: Record<string, boolean>;
  repoUrl: string;
  // phase F, all optional:
  milestoneDetail?: Record<string, MilestoneDetail>;
  customMilestones?: CustomMilestone[];
  requirements?: Record<string, boolean>; // lib/projectSpec.ts keys -> met
  record?: Partial<ProjectRecord>;
};

export type EvidenceKind =
  | "repo" | "commit" | "exercise" | "explanation" | "test" | "benchmark" | "diagram" | "note" | "retest" | "screenshot" | "deploy" | "other";
export type EvidenceItem = {
  id: string;
  kind: EvidenceKind;
  subject: string; // topic, project, milestone or checkpoint id
  title: string;
  url: string;
  detail: string;
  createdAt: string;
  updatedAt: string;
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

// AI-native engineering overlay: one lightweight evidence entry per AI-assisted task.
export type AiCanDoAlone = "yes" | "partly" | "no";
export type AiLogEntry = {
  id: string;
  missionId: string | null; // AIM-01 .. AIM-12, or null for everyday use
  task: string;
  attemptedFirst: boolean; // did I try it myself before asking?
  aiDid: string;
  verified: string; // what I checked, and what the AI got wrong
  aiErrorCaught: boolean;
  canDoAlone: AiCanDoAlone;
  createdAt: string;
  updatedAt: string;
};

// Daily Work Unit sessions (master 0.x daily unit). Each session copies its stage
// plan when it starts, so changing the template later never rewrites history.
export type SessionStage = {
  key: string; // recall | study | code | debug | explain | log (or step-N for custom plans)
  label: string;
  minutes: string; // target, e.g. "30-45"
  startedAt?: string;
  endedAt?: string;
  skipped?: boolean;
  note: string;
};
export type SessionStatus = "active" | "completed" | "abandoned";
export type SessionPlan = "full" | "short" | "review";

/** Active Modes A-F (master 0.3). Distinct from the AI Learn/Build/Assess mode. */
export type ActiveModeId = "A" | "B" | "C" | "D" | "E" | "F";
export type ModePeriod = { id: ActiveModeId; since: string; until: string };
export type DailySession = {
  id: string;
  date: string; // local calendar day the session started, YYYY-MM-DD
  week: number;
  plan: SessionPlan;
  status: SessionStatus;
  startedAt: string;
  endedAt?: string;
  stage: number; // index of the current stage
  stages: SessionStage[];
  focus: string[]; // checklist items the session targeted
  ticked: string[]; // checklist items ticked while the session was active
  log: { learned: string; stuck: string; next: string };
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
  aiLog: AiLogEntry[]; // added after v1 shipped; normalize() defaults it to [] for older documents
  sessions: DailySession[]; // v2; newest first
  activeMode: { id: ActiveModeId; since: string } | null; // v3; null until chosen (a suggestion is shown)
  modeHistory: ModePeriod[]; // v3; closed periods, oldest first
  evidence: EvidenceItem[]; // v4; proof of competency, see lib/evidence.ts
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
    aiLog: [],
    sessions: [],
    activeMode: null,
    modeHistory: [],
    evidence: [],
  };
}
