// Types for the generated curriculum data in data/*.json.
// IDs are stable: phases P01..P46, topics P13.2 / P10.1d, concepts P13.2#4,
// gates G0, C1..C7, SG2..SG7, projects PR01..PR11, tracks T01..T11.

export type Depth = { min: number; max: number; raw: string };

export type Phase = {
  id: string;
  number: number;
  title: string;
  masterTitle: string;
  description: string;
  priority: string;
  target: string;
  depth: Depth | null;
  gate: string;
  unlockNote: string;
  prerequisites: { id: string; source: string }[];
  stages: string[];
  placement: string;
  topicIds: string[];
  weekRange: [number, number] | null;
  masterSection: number;
};

export type TopicKind = "concepts" | "gate-text" | "rule" | "resources" | "parent";

export type TopicBlock = { t: "md"; md: string } | { t: "concepts"; ids: string[] };

export type TopicWeek = {
  cw: number;
  cwEnd?: number | null;
  lane: "primary" | "supporting" | "dsa";
  conceptIds: string[] | null;
};

export type Topic = {
  id: string;
  phaseId: string;
  parentId: string | null;
  title: string;
  label: string;
  meta: string;
  kind: TopicKind;
  depth: Depth | null;
  conceptIds: string[];
  blocks: TopicBlock[];
  weeks: TopicWeek[];
  firstWeek: number | null;
  requiredGate: string | null;
  onDemand: string | null;
  predecessors: { from: string; to: string; reason: string }[];
  masteryStatements: string[];
};

export type Concept = {
  id: string;
  topicId: string;
  phaseId: string;
  index: number;
  text: string;
  weeks: number[];
  onDemand?: string;
};

export type Checkpoint = {
  id: string;
  title: string;
  kind: "initial" | "competency" | "stage";
  source: string;
  gateWeek: number | null;
  requires: string[];
  criteria: string[];
  practicalGate: string;
  note: string;
};

export type Project = {
  id: string;
  number: number;
  title: string;
  purpose: string;
  requires: string[];
  evidenceFor: string;
  buildWeeks: number[];
  milestones: { id: string; cw: number; text: string }[];
  relatedTopics: string[];
  skills: string[];
  bodyMd: string;
  qualityProfile: ("general" | "ml" | "ai")[];
};

export type Track = {
  id: string;
  title: string;
  activation: string;
  bodyMd: string;
  items: { id: string; text: string }[];
};

export type Resource = {
  id: string;
  phaseId: string | null;
  group: string;
  label: string;
  name: string;
  url: string | null;
  note: string;
  topicIds: string[];
};

export type Tool = {
  id: string;
  name: string;
  activation: string;
  route: string;
  url: string | null;
  reference: string;
};

export type WeekSlice =
  | { ref: string; kind: "topic"; topicId: string; conceptIds: string[] | null; label: string }
  | { ref: string; kind: "project"; projectId: string; label: string }
  | { ref: string; kind: "activity"; activity: string; label: string };

export type Week = {
  cw: number;
  stage: string;
  mainStage: string;
  type: "study" | "project" | "consolidation" | "open";
  primary: WeekSlice[];
  supporting: WeekSlice[];
  dsaLane: { slices: WeekSlice[]; note: string } | null;
  project: string | null;
  build: string;
  note: string;
  gate: string | null;
  requiredGate: string | null;
  conceptCount: number;
  dayPlan: { days: string; plan: { days: string; focus: string }[] } | null;
};

export type Stage = {
  id: string;
  name: string;
  basis: string;
  entry: string;
  exit: string;
  range: [number, number];
  parent: string | null;
};

export type Meta = {
  source: { file: string; md5: string; version: string; generated: string };
  depthModel: { level: number; name: string; definition: string }[];
  depthNotes: string[];
  priorityModel: { symbol: string; name: string; definition: string }[];
  masteryStates: { level: number; id: string; name: string; master: string }[];
  evidenceLoop: string[];
  phaseGatingRule: string[];
  spacedRetestDays: number[];
  dailyWorkUnit: { minutes: string; step: string }[];
  operatingRulesMd: string;
  weeklyModelMd: string;
  monthlyReviewMd: string;
  recoveryMd: string;
  dependencySpine: string[];
  decision5: string[];
  dsaLane: { from: number; to: number | null; slices: WeekSlice[]; note: string }[];
  onDemand: Record<string, string>;
  onDemandGates: Record<string, string | null>;
  gateOrder: string[];
  quality: { general: string[]; ml: string[]; ai: string[] };
  deepDiveQuestions: string[];
  portfolioStages: { id: string; title: string; items: string[] }[];
  storyThemes: string[];
  resourceNotes: string[];
  componentEdges: { from: string; to: string; reason: string }[];
  validation: Record<string, number | number[]>;
};

// Compact index shipped to the browser (data/client-index.json).
export type ClientIndex = {
  phases: { id: string; t: string; topics: string[] }[];
  topics: {
    id: string;
    p: string;
    t: string;
    n: number;
    w: number | null;
    g: string | null;
    od: boolean;
    d: [number, number] | null;
    pre: string[];
    cpre: [string, string][];
  }[];
  ct: Record<string, string>;
  weeks: {
    cw: number;
    s: string;
    ty: Week["type"];
    g: string | null;
    rg: string | null;
    u: string[];
    pu: string[];
    t: string;
    b: string;
    pj: string | null;
  }[];
  gates: { id: string; t: string; k: Checkpoint["kind"]; w: number | null; n: number; r: string[] }[];
  projects: { id: string; t: string; m: string[]; w: number[] }[];
  stages: { id: string; n: string; r: [number, number]; p: string | null }[];
  retest: number[];
};

// One row of the static search index served at /search-index.json.
export type SearchEntry = { k: string; id: string; t: string; s: string; h: string };
