import { describe, expect, it } from "vitest";
import projects from "@/data/projects.json";
import { emptyState, type UserState } from "@/types/state";
import { milestoneStatus, parseRequirements, subjectLabel } from "@/lib/projectSpec";
import { evidenceFor } from "@/lib/evidence";
import { migrate } from "@/lib/persistence/migrate";
import { sanitizeState } from "@/lib/persistence/sanitize";

const body = (id: string) => (projects as { id: string; bodyMd: string }[]).find((p) => p.id === id)!.bodyMd;

describe("completion criteria from the master specification", () => {
  it("parses every headed bullet list, skipping Examples and code blocks", () => {
    const pr01 = parseRequirements(body("PR01"));
    expect(pr01.map((g) => g.heading)).toEqual(["Must demonstrate"]);
    expect(pr01[0].items.map((i) => i.text)).toEqual(["Python", "functions", "data structures", "error handling", "Git", "testing"]);
    const pr04 = parseRequirements(body("PR04"));
    expect(pr04.map((g) => g.heading)).toEqual(["Requirements", "Then analyse"]);
    const pr07 = parseRequirements(body("PR07"));
    expect(pr07.some((g) => g.heading === "Required questions")).toBe(true);
    expect(pr07.flatMap((g) => g.items).some((i) => i.text.includes("→"))).toBe(false); // code block ignored
  });

  it("gives every project its own criteria, with stable unique keys", () => {
    for (const p of projects as { id: string; bodyMd: string }[]) {
      const items = parseRequirements(p.bodyMd).flatMap((g) => g.items);
      expect(items.length, p.id).toBeGreaterThan(0);
      expect(new Set(items.map((i) => i.key)).size, p.id).toBe(items.length);
    }
    expect(parseRequirements(body("PR01"))[0].items[0].key).toBe("must-demonstrate:python");
  });

  it("handles inline cases", () => {
    const md = ["Examples:", "", "- a", "- b", "", "Required:", "", "- x", "- y", "", "```text", "Required:", "- not this", "```", "- orphan"].join("\n");
    expect(parseRequirements(md)).toEqual([
      { heading: "Required", items: [{ key: "required:x", text: "x" }, { key: "required:y", text: "y" }] },
    ]);
  });
});

describe("milestones and evidence", () => {
  it("derives milestone status, respecting the v1 done flag", () => {
    expect(milestoneStatus(undefined, "PR01-M1")).toBe("todo");
    expect(milestoneStatus({ milestones: { "PR01-M1": true } }, "PR01-M1")).toBe("done");
    expect(milestoneStatus({ milestones: {}, milestoneDetail: { "PR01-M1": { status: "blocked" } } }, "PR01-M1")).toBe("blocked");
    expect(milestoneStatus({ milestones: { "PR01-M1": false }, milestoneDetail: { "PR01-M1": { status: "done" } } }, "PR01-M1")).toBe("todo");
  });

  it("labels evidence subjects", () => {
    const names: Record<string, string> = { PR03: "Database-Backed API", "P13.2": "Joins" };
    const nameOf = (id: string) => names[id] ?? id;
    expect(subjectLabel("PR03-M2", nameOf)).toBe("Database-Backed API, milestone 2");
    expect(subjectLabel("PR03-Uabc-1", nameOf)).toBe("Database-Backed API, your milestone");
    expect(subjectLabel("P13.2", nameOf)).toBe("Joins");
  });

  it("finds evidence for a set of subjects, newest first", () => {
    const mk = (id: string, subject: string, createdAt: string) => ({ id, subject, createdAt, kind: "repo" as const, title: "", url: "", detail: "", updatedAt: createdAt });
    const s: UserState = { ...emptyState(), evidence: [mk("a", "PR03", "2026-01-01"), mk("b", "PR03-M1", "2026-02-01"), mk("c", "P01.1a", "2026-03-01")] };
    expect(evidenceFor(s, ["PR03", "PR03-M1"]).map((e) => e.id)).toEqual(["b", "a"]);
  });

  it("v3 -> v4 adds an empty evidence list and leaves free-text evidence alone", () => {
    const r = migrate({ version: 3, topics: { T: { mastery: 4, evidence: "old notes" } } });
    expect(r.ok && r.doc).toMatchObject({ version: 4, evidence: [], topics: { T: { evidence: "old notes" } } });
  });

  it("validates the project record and evidence, preserving unknown fields", () => {
    const { state, issues } = sanitizeState({
      projects: {
        PR03: {
          status: "in_progress", milestones: { "PR03-M1": true }, quality: {}, repoUrl: "",
          milestoneDetail: { "PR03-M2": { status: "weird", notes: 5 }, bad: "x" },
          customMilestones: [{ text: "auth" }, "junk"],
          requirements: { "required:x": 1 },
          record: { problem: "slow", decisions: [{ decision: "pg" }, 3], metrics: "nope", extra: true },
        },
      },
      evidence: [{ kind: "nope", subject: "PR03", title: "t", future: 1 }, 7],
    });
    const p = state.projects.PR03;
    expect(p.milestoneDetail).toEqual({ "PR03-M2": { status: "todo", notes: "5" } });
    expect(p.customMilestones).toMatchObject([{ id: "custom-recovered-0", text: "auth" }]);
    expect(p.requirements).toEqual({ "required:x": true });
    expect(p.record).toMatchObject({ problem: "slow", decisions: [{ id: "dec-0", decision: "pg", why: "", rejected: "" }], metrics: [], extra: true });
    expect(state.evidence).toMatchObject([{ id: "ev-recovered-0", kind: "other", subject: "PR03", future: 1 }]);
    expect(issues.filter((i) => i.dropped).map((i) => i.path)).toEqual(["evidence[1]"]);
  });
});
