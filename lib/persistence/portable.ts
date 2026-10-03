import { STATE_VERSION, type UserState } from "@/types/state";
import { readDocument } from "./migrate";
import type { Issue } from "./sanitize";

/** Versioned, human-readable backup file. Bare v1 exports (just the state) are still accepted on import. */
export const EXPORT_APP = "roadmap-os";
export const EXPORT_KIND = "progress-backup";

export type StateSummary = {
  ticks: number;
  topicsTracked: number;
  demonstrated: number;
  gatesPassed: number;
  weeksDone: number;
  projectsStarted: number;
  notes: number;
  dsa: number;
  stories: number;
  applications: number;
  aiLog: number;
  currentWeek: number;
  lastChange: string | null;
};

export type ExportEnvelope = {
  app: typeof EXPORT_APP;
  kind: typeof EXPORT_KIND;
  schemaVersion: number;
  exportedAt: string;
  curriculum: { md5: string; generated: string } | null;
  summary: StateSummary;
  readme: string[];
  state: UserState;
};

const README = [
  "Roadmap OS progress backup. Import it from Settings > Backup to restore.",
  "`state` holds all progress; the curriculum itself is not included (it ships with the app).",
  "state.checks: checklist item id (e.g. P13.2#4) -> time ticked.",
  "state.topics: topic id (e.g. P13.2) -> mastery 0-5 (Not started, Learning, Explained, Practised, Demonstrated, Retained), depth D0-D5, evidence, re-tests.",
  "state.gates / weeks / projects: checkpoint, week and project progress. state.notes: entity id -> note text.",
  "state.dsa, stories, applications, aiLog: journal entries. All times are ISO 8601 UTC.",
];

export function summarize(s: UserState): StateSummary {
  return {
    ticks: Object.keys(s.checks).length,
    topicsTracked: Object.values(s.topics).filter((t) => t.mastery > 0).length,
    demonstrated: Object.values(s.topics).filter((t) => t.mastery >= 4).length,
    gatesPassed: Object.values(s.gates).filter((g) => g.status === "passed").length,
    weeksDone: Object.values(s.weeks).filter((w) => w.done).length,
    projectsStarted: Object.values(s.projects).filter((p) => p.status !== "not_started").length,
    notes: Object.keys(s.notes).length,
    dsa: s.dsa.length,
    stories: s.stories.length,
    applications: s.applications.length,
    aiLog: s.aiLog.length,
    currentWeek: s.currentWeek,
    lastChange: s.updatedAt.startsWith("1970") ? null : s.updatedAt,
  };
}

/** True when there is anything worth protecting. */
export function hasProgress(s: UserState): boolean {
  const m = summarize(s);
  return !!m.lastChange || m.ticks + m.topicsTracked + m.gatesPassed + m.weeksDone + m.projectsStarted + m.notes + m.dsa + m.stories + m.applications + m.aiLog > 0;
}

/** True when this device has never exported, or not within `days`. */
export function exportIsStale(lastExportAt: string | null | undefined, days: number, now = new Date()): boolean {
  if (!lastExportAt) return true;
  const t = new Date(lastExportAt).getTime();
  return !Number.isFinite(t) || now.getTime() - t >= days * 86400000;
}

const plural = (n: number, one: string, many = `${one}s`) => `${n} ${n === 1 ? one : many}`;

/** One-line plain-English description of a summary, for previews and backup lists. */
export function describeSummary(m: StateSummary): string {
  const parts = [
    `week ${m.currentWeek}`,
    `${plural(m.ticks, "item")} ticked`,
    m.topicsTracked ? plural(m.topicsTracked, "topic") + " in progress" : "",
    m.gatesPassed ? plural(m.gatesPassed, "gate") + " passed" : "",
    m.notes ? plural(m.notes, "note") : "",
    m.dsa ? plural(m.dsa, "DSA problem") : "",
    m.aiLog ? plural(m.aiLog, "AI log entry", "AI log entries") : "",
    m.stories + m.applications ? plural(m.stories + m.applications, "career entry", "career entries") : "",
  ];
  return parts.filter(Boolean).join(", ");
}

export function buildExport(state: UserState, curriculum: { md5: string; generated: string } | null, at = new Date()): ExportEnvelope {
  return {
    app: EXPORT_APP,
    kind: EXPORT_KIND,
    schemaVersion: STATE_VERSION,
    exportedAt: at.toISOString(),
    curriculum,
    summary: summarize(state),
    readme: README,
    state,
  };
}

export function exportFilename(at = new Date()): string {
  const p = (n: number) => String(n).padStart(2, "0");
  return `roadmap-os-backup-${at.getFullYear()}-${p(at.getMonth() + 1)}-${p(at.getDate())}-${p(at.getHours())}${p(at.getMinutes())}.json`;
}

export function serializeExport(e: ExportEnvelope): string {
  return JSON.stringify(e, null, 2);
}

export type ImportPreview =
  | {
      ok: true;
      state: UserState;
      format: "backup" | "legacy";
      exportedAt: string | null;
      schemaVersion: number;
      curriculumMd5: string | null;
      curriculumMismatch: boolean;
      summary: StateSummary;
      issues: Issue[];
    }
  | { ok: false; error: string };

const STATE_KEYS = ["checks", "topics", "gates", "weeks", "projects", "notes", "dsa"];

/** Parse and validate a backup file. Nothing is changed; the caller shows the preview and asks before applying. */
export function parseImport(text: string, currentMd5?: string): ImportPreview {
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    return { ok: false, error: "This file is not valid JSON. It may be damaged or not a Roadmap OS backup." };
  }
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    return { ok: false, error: "This file is not a Roadmap OS backup." };
  }
  const obj = parsed as Record<string, unknown>;
  let doc: unknown;
  let format: "backup" | "legacy";
  let exportedAt: string | null = null;
  let curriculumMd5: string | null = null;
  if (obj.app === EXPORT_APP) {
    if (obj.kind !== EXPORT_KIND || !obj.state || typeof obj.state !== "object") {
      return { ok: false, error: "This Roadmap OS file is not a progress backup." };
    }
    format = "backup";
    doc = obj.state;
    exportedAt = typeof obj.exportedAt === "string" ? obj.exportedAt : null;
    const cur = obj.curriculum as { md5?: unknown } | null | undefined;
    curriculumMd5 = cur && typeof cur.md5 === "string" ? cur.md5 : null;
  } else if (STATE_KEYS.some((k) => k in obj)) {
    format = "legacy";
    doc = obj;
  } else {
    return { ok: false, error: "This file is not a Roadmap OS backup: it has no progress data." };
  }
  const r = readDocument(doc);
  if (!r.ok) {
    return r.reason === "newer"
      ? { ok: false, error: `This backup was made by a newer version of Roadmap OS (schema v${r.version}). Update the app before importing it.` }
      : { ok: false, error: "This file is not a Roadmap OS backup." };
  }
  return {
    ok: true,
    state: r.state,
    format,
    exportedAt,
    schemaVersion: r.from,
    curriculumMd5,
    curriculumMismatch: !!(curriculumMd5 && currentMd5 && curriculumMd5 !== currentMd5),
    summary: summarize(r.state),
    issues: r.issues,
  };
}
