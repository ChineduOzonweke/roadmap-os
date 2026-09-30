// Server-side access to the curriculum. Import only from Server Components,
// route handlers and build-time code: it pulls in the full dataset.
import metaJson from "@/data/meta.json";
import stagesJson from "@/data/stages.json";
import phasesJson from "@/data/phases.json";
import topicsJson from "@/data/topics.json";
import conceptsJson from "@/data/concepts.json";
import checkpointsJson from "@/data/checkpoints.json";
import projectsJson from "@/data/projects.json";
import tracksJson from "@/data/tracks.json";
import resourcesJson from "@/data/resources.json";
import weeksJson from "@/data/weeks.json";
import type {
  Checkpoint, Concept, Meta, Phase, Project, Resource, Stage, Tool, Topic, Track, Week,
} from "@/types/curriculum";
import { conceptSlug } from "@/lib/ids";

export const meta = metaJson as unknown as Meta;
export const stages = stagesJson as unknown as Stage[];
export const phases = phasesJson as unknown as Phase[];
export const topics = topicsJson as unknown as Topic[];
export const concepts = conceptsJson as unknown as Concept[];
export const checkpoints = checkpointsJson as unknown as Checkpoint[];
export const projects = projectsJson as unknown as Project[];
export const tracks = tracksJson as unknown as Track[];
export const resources = (resourcesJson as unknown as { resources: Resource[] }).resources;
export const tools = (resourcesJson as unknown as { tools: Tool[] }).tools;
export const weeks = weeksJson as unknown as Week[];

const byId = <T extends { id: string }>(xs: T[]) => new Map(xs.map((x) => [x.id, x]));
const phaseMap = byId(phases);
const topicMap = byId(topics);
const conceptMap = byId(concepts);
const checkpointMap = byId(checkpoints);
const projectMap = byId(projects);
const stageMap = byId(stages);

export const getPhase = (id: string) => phaseMap.get(id);
export const getTopic = (id: string) => topicMap.get(id);
export const getConcept = (id: string) => conceptMap.get(id);
export const getCheckpoint = (id: string) => checkpointMap.get(id);
export const getProject = (id: string) => projectMap.get(id);
export const getStage = (id: string) => stageMap.get(id);
export const getWeek = (cw: number) => weeks[cw - 1];

export const topicsOfPhase = (phaseId: string) =>
  (phaseMap.get(phaseId)?.topicIds ?? []).map((id) => topicMap.get(id)!).filter(Boolean);

export const conceptsOfTopic = (topicId: string) =>
  (topicMap.get(topicId)?.conceptIds ?? []).map((id) => conceptMap.get(id)!).filter(Boolean);

/** Phases that list `phaseId` as a prerequisite. */
export const dependentsOfPhase = (phaseId: string) =>
  phases.filter((p) => p.prerequisites.some((q) => q.id === phaseId));

export const resourcesForPhase = (phaseId: string) => resources.filter((r) => r.phaseId === phaseId && r.topicIds.length === 0);

export function resourcesForTopic(topic: Topic): Resource[] {
  const ids = new Set([topic.id, topic.parentId].filter(Boolean) as string[]);
  const own = resources.filter((r) => r.topicIds.some((t) => ids.has(t)));
  return own;
}

export const projectsForTopic = (topicId: string) =>
  projects.filter((p) => p.relatedTopics.includes(topicId) || p.requires.includes(topicId));

export const projectsForPhase = (phaseId: string) =>
  projects.filter((p) => p.relatedTopics.some((t) => t.startsWith(phaseId + ".")) || p.requires.some((t) => t.startsWith(phaseId + ".")));

export const checkpointsForTopic = (topicId: string) => checkpoints.filter((c) => c.requires.includes(topicId));

export const checkpointsForPhase = (phaseId: string) =>
  checkpoints.filter((c) => c.requires.some((r) => r.startsWith(phaseId + ".")));

/** Topics whose weeks begin right after this gate (what passing it unlocks). */
export const topicsUnlockedBy = (gateId: string) =>
  topics.filter((t) => t.kind === "concepts" && t.requiredGate === gateId);

export const weeksOfStage = (stageId: string) => weeks.filter((w) => w.stage === stageId || w.mainStage === stageId);

/** Learner-facing name and link for any curriculum ID. The ID itself is shown only via <RefId>. */
export function refLabel(id: string): { label: string; href: string | null } {
  if (phaseMap.has(id)) return { label: phaseMap.get(id)!.title, href: `/phases/${id}` };
  if (topicMap.has(id)) return { label: topicMap.get(id)!.label, href: `/topics/${id}` };
  if (conceptMap.has(id)) {
    const c = conceptMap.get(id)!;
    return { label: `${c.text} (${topicMap.get(c.topicId)?.label ?? ""})`, href: `/concepts/${conceptSlug(id)}` };
  }
  if (checkpointMap.has(id)) return { label: checkpointName(id), href: `/checkpoints/${id}` };
  if (projectMap.has(id)) return { label: projectMap.get(id)!.title, href: `/projects/${id}` };
  return { label: id, href: null };
}

/** "Programmer checkpoint" for competency checkpoints; stage gates keep their descriptive title. */
export function checkpointName(id: string): string {
  const c = checkpointMap.get(id);
  if (!c) return id;
  return c.kind === "competency" ? `${c.title} checkpoint` : c.title;
}
