import { beforeAll, describe, expect, it } from "vitest";
import type { UserState } from "@/types/state";
import { getState, getStorageStatus, initStore } from "@/lib/store";
import {
  applyImport, exportBackup, previewImport, resetState, restoreSnapshot, setCheck, setMastery, recordReview,
} from "@/lib/actions";
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
  it("keeps the re-test cycle as history when mastery drops below Demonstrated", () => {
    recordReview("P01.1a");
    expect(getState().topics["P01.1a"]).toMatchObject({ mastery: 5, reviews: { count: 2 } });
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
