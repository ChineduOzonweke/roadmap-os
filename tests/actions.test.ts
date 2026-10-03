import { beforeAll, describe, expect, it } from "vitest";
import type { UserState } from "@/types/state";
import { getState, getStorageStatus, initStore } from "@/lib/store";
import {
  abandonSession, applyImport, completeSession, exportBackup, goToStage, previewImport, recordReview, resetState, restoreSnapshot,
  setActiveMode, setCheck, setMastery, setSessionLog, setStageNote, startSession, undoLastReview,
  addCustomMilestone, deleteEvidence, removeCustomMilestone, saveEvidence, setMilestoneNotes, setMilestoneStatus, setProjectRecord, setProjectRequirement,
} from "@/lib/actions";
import { sessionStages } from "@/lib/today";
import { createBrowserAdapter, STATE_KEY } from "@/lib/persistence/browser";
import { createBackupStore } from "@/lib/persistence/backups";
import { memoryKV } from "@/lib/persistence/kv";
import { buildExport, serializeExport } from "@/lib/persistence/portable";
import v1json from "./fixtures/v1-state.json";

// These tests share the app's singleton store, so they run in order against one in-memory browser.
const v1 = v1json as unknown as UserState;
const kv = memoryKV({ [STATE_KEY]: JSON.stringify(v1) });
const CUR = { md5: "m", generated: "g" };

beforeAll(async () => {
  await initStore(createBrowserAdapter(() => kv), createBackupStore(kv));
});

describe("mastery history", () => {
  it("records re-tests with the 30-day rule: a 7-day pass keeps Demonstrated", () => {
    recordReview("P01.1a", "pass");
    expect(getState().topics["P01.1a"]).toMatchObject({ mastery: 4, reviews: { count: 2 } });
    expect(getState().topics["P01.1a"].reviewLog).toHaveLength(1);
    undoLastReview("P01.1a");
    expect(getState().topics["P01.1a"]).toMatchObject({ mastery: 4, reviews: { count: 1 }, reviewLog: [] });
    recordReview("P01.1a", "pass");
  });

  it("keeps the re-test cycle as history when mastery drops below Demonstrated", () => {
    setMastery("P01.1a", 5);
    setMastery("P01.1a", 3);
    const t = getState().topics["P01.1a"];
    expect(t.mastery).toBe(3);
    expect(t.reviews).toEqual({ count: 0 });
    expect(t.demonstratedAt).toBeUndefined();
    expect(t.pastReviews).toHaveLength(1);
    expect(t.pastReviews![0]).toMatchObject({ count: 2, demonstratedAt: "2026-09-10T10:00:00.000Z" });
  });

  it("does not add history when moving between stages below Demonstrated", () => {
    setMastery("P01.1a", 2);
    expect(getState().topics["P01.1a"].pastReviews).toHaveLength(1);
  });
});

describe("export, import, restore, reset", () => {
  it("exports a backup and records the time on this device", () => {
    const { filename, json } = exportBackup(CUR);
    expect(filename).toMatch(/^roadmap-os-backup-\d{4}-\d\d-\d\d-\d{4}\.json$/);
    expect(JSON.parse(json).state.currentWeek).toBe(12);
    expect(getStorageStatus().lastExportAt).not.toBeNull();
  });

  it("import takes an automatic backup of current progress before replacing it", () => {
    setCheck("before-import-marker", true);
    const incoming = { ...v1, currentWeek: 40, checks: {} };
    const p = previewImport(serializeExport(buildExport(incoming, CUR)), CUR.md5);
    if (!p.ok) throw new Error(p.error);
    expect(applyImport(p)).toEqual({ ok: true });
    expect(getState().currentWeek).toBe(40);
    const snap = getStorageStatus().snapshots[0];
    expect(snap.reason).toBe("before-import");
    expect(snap.summary.currentWeek).toBe(12);
  });

  it("restoring a snapshot brings back the earlier progress, after backing up the current one", () => {
    const before = getStorageStatus().snapshots.find((m) => m.reason === "before-import")!;
    expect(restoreSnapshot(before.id)).toEqual({ ok: true });
    expect(getState().currentWeek).toBe(12);
    expect(getState().checks["before-import-marker"]).toBeDefined();
    expect(getStorageStatus().snapshots[0].reason).toBe("before-restore");
  });

  it("reset backs up first, then clears", async () => {
    expect(resetState()).toEqual({ ok: true });
    expect(getState().checks).toEqual({});
    expect(getStorageStatus().snapshots[0]).toMatchObject({ reason: "before-reset", summary: { currentWeek: 12 } });
    await new Promise((r) => setTimeout(r, 0));
    expect(JSON.parse(kv.get(STATE_KEY)!).checks).toEqual({});
  });
});

describe("daily work sessions", () => {
  const stages = sessionStages([
    { minutes: "10", step: "recall" }, { minutes: "30-45", step: "a" }, { minutes: "30-45", step: "b" },
    { minutes: "10-15", step: "c" }, { minutes: "5-10", step: "d" }, { minutes: "5", step: "e" },
  ]);
  const find = (id: string) => getState().sessions.find((x) => x.id === id)!;

  it("starts one session at a time, with the first stage running", () => {
    const id = startSession({ week: 3, focus: ["P01.1a#3"], stages, plan: "full" });
    expect(startSession({ week: 3, focus: [], stages, plan: "short" })).toBe(id);
    const x = find(id);
    expect(x).toMatchObject({ status: "active", stage: 0, week: 3, plan: "full", focus: ["P01.1a#3"] });
    expect(x.stages[0].startedAt).toBeDefined();
    expect(x.stages[1].startedAt).toBeUndefined();
  });

  it("moves through stages, records skips, notes and ticks made during the session", () => {
    const id = getState().sessions[0].id;
    goToStage(id, 1);
    setStageNote(id, 1, "read the docs page");
    goToStage(id, 2, true);
    setCheck("P01.1a#3", true);
    let x = find(id);
    expect(x.stage).toBe(2);
    expect(x.stages[0].endedAt).toBeDefined();
    expect(x.stages[1]).toMatchObject({ note: "read the docs page", skipped: true });
    expect(x.ticked).toEqual(["P01.1a#3"]);
    goToStage(id, 1); // going back reopens the stage
    x = find(id);
    expect(x.stages[1].endedAt).toBeUndefined();
    expect(x.stages[1].skipped).toBeUndefined();
    setCheck("P01.1a#3", false);
    expect(find(id).ticked).toEqual([]);
  });

  it("completing keeps the whole record as the day's log; ticks afterwards are not attributed to it", () => {
    const id = getState().sessions[0].id;
    setSessionLog(id, { learned: "loops", next: "write tests" });
    completeSession(id);
    const x = find(id);
    expect(x).toMatchObject({ status: "completed", log: { learned: "loops", stuck: "", next: "write tests" } });
    expect(x.endedAt).toBeDefined();
    expect(x.stages[x.stage].endedAt).toBeDefined();
    setCheck("P01.1a#4", true);
    expect(find(id).ticked).toEqual([]);
  });

  it("stopping a session keeps it, marked abandoned", () => {
    const id = startSession({ week: 3, focus: [], stages, plan: "short" });
    abandonSession(id);
    expect(find(id).status).toBe("abandoned");
    expect(getState().sessions).toHaveLength(2);
  });
});

describe("Active Mode action", () => {
  it("persists the chosen mode and its history", () => {
    setActiveMode("B");
    setActiveMode("D");
    expect(getState().activeMode?.id).toBe("D");
    expect(getState().modeHistory.map((p) => p.id)).toEqual(["B"]);
  });
});

describe("project milestones and evidence", () => {
  it("milestone status keeps the v1 done flag in sync and starts the project", () => {
    setMilestoneStatus("PR01", "PR01-M1", "doing");
    let p = getState().projects.PR01;
    expect(p.status).toBe("in_progress");
    expect(p.milestones["PR01-M1"]).toBe(false);
    expect(p.milestoneDetail?.["PR01-M1"]).toMatchObject({ status: "doing" });
    expect(p.milestoneDetail?.["PR01-M1"].startedAt).toBeDefined();
    setMilestoneNotes("PR01", "PR01-M1", "argparse done");
    setMilestoneStatus("PR01", "PR01-M1", "done");
    p = getState().projects.PR01;
    expect(p.milestones["PR01-M1"]).toBe(true);
    expect(p.milestoneDetail?.["PR01-M1"]).toMatchObject({ status: "done", notes: "argparse done" });
  });

  it("custom milestones, requirements and the engineering record", () => {
    addCustomMilestone("PR01", "  packaging  ");
    addCustomMilestone("PR01", "   ");
    const custom = getState().projects.PR01.customMilestones!;
    expect(custom.map((m) => m.text)).toEqual(["packaging"]);
    expect(custom[0].id).toMatch(/^PR01-U/);
    setProjectRequirement("PR01", "must-demonstrate:python", true);
    setProjectRecord("PR01", { problem: "messy files" });
    setProjectRecord("PR01", { decisions: [{ id: "d1", decision: "argparse", why: "stdlib", rejected: "click" }] });
    const p = getState().projects.PR01;
    expect(p.requirements).toEqual({ "must-demonstrate:python": true });
    expect(p.record).toMatchObject({ problem: "messy files", decisions: [{ decision: "argparse" }] });
    removeCustomMilestone("PR01", custom[0].id);
    expect(getState().projects.PR01.customMilestones).toEqual([]);
  });

  it("saves, edits and deletes evidence", () => {
    saveEvidence({ kind: "repo", subject: "PR01-M1", title: "cli repo", url: "https://github.com/x/cli", detail: "" });
    const e = getState().evidence[0];
    expect(e).toMatchObject({ kind: "repo", subject: "PR01-M1", title: "cli repo" });
    saveEvidence({ ...e, title: "CLI repo" });
    expect(getState().evidence).toHaveLength(1);
    expect(getState().evidence[0]).toMatchObject({ id: e.id, title: "CLI repo", createdAt: e.createdAt });
    deleteEvidence(e.id);
    expect(getState().evidence).toEqual([]);
  });
});
