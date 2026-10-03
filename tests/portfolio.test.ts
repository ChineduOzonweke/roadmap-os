import { describe, expect, it } from "vitest";
import type { EvidenceItem, ProjectProgress } from "@/types/state";
import { buildPortfolio, portfolioFilename } from "@/lib/portfolio";

const project = {
  id: "PR03",
  title: "Database-Backed API",
  purpose: "Build a CRUD backend.",
  milestones: [{ id: "PR03-M1", text: "routing, validation" }, { id: "PR03-M2", text: "migrations and tests" }],
};
const requirements = [{ heading: "Required", items: [{ key: "required:postgresql", text: "PostgreSQL" }, { key: "required:tests", text: "tests" }] }];
const ev = (over: Partial<EvidenceItem>): EvidenceItem => ({
  id: "e", kind: "repo", subject: "PR03", title: "", url: "", detail: "", createdAt: "2026-10-01", updatedAt: "2026-10-01", ...over,
});
const base = { project, requirements, labelOf: (id: string) => ({ "PR03-M1": "routing, validation" } as Record<string, string>)[id] ?? id };

describe("portfolio export", () => {
  it("an empty record produces no invented content, and reports what is missing", () => {
    const { markdown, gaps } = buildPortfolio({ ...base, progress: undefined, evidence: [] }, "readme");
    expect(markdown).toBe("# Database-Backed API\n\nBuild a CRUD backend.\n\n## Status\n\n- [ ] routing, validation\n- [ ] migrations and tests\n");
    expect(gaps).toEqual(["Problem", "Goal", "Architecture", "Implementation", "Failure points and debugging", "Future improvements", "Technical decisions", "Metrics", "Evidence", "Repository link"]);
  });

  it("transforms the recorded engineering record", () => {
    const progress: ProjectProgress = {
      status: "in_progress",
      milestones: { "PR03-M1": true },
      quality: {},
      repoUrl: "https://github.com/me/pr03",
      requirements: { "required:postgresql": true },
      customMilestones: [{ id: "PR03-Ux", text: "auth", createdAt: "" }],
      record: {
        problem: "Students lose track of shared expenses.",
        goal: "A tested CRUD API with migrations.",
        architecture: "FastAPI -> PostgreSQL.",
        failures: "N+1 queries on list endpoint; fixed with a join.",
        lessons: "Write the migration first.",
        deployUrl: "https://pr03.example.com",
        links: "https://example.com/design\nnot a url",
        decisions: [{ id: "d", decision: "PostgreSQL", why: "constraints | joins", rejected: "SQLite" }, { id: "x", decision: "", why: "", rejected: "" }],
        metrics: [{ id: "m", name: "p95 latency", value: "42 ms", context: "local, k6" }, { id: "n", name: "empty", value: "", context: "" }],
      },
    };
    const evidence = [ev({ kind: "test", title: "CI run", url: "https://ci/1", subject: "PR03-M1", detail: "48 tests\npassing" }), ev({ kind: "deploy", title: "Live", url: "https://pr03.example.com" })];
    const readme = buildPortfolio({ ...base, progress, evidence }, "readme");
    expect(readme.markdown).toContain("# Database-Backed API\n\nA tested CRUD API with migrations.");
    expect(readme.markdown).toContain("| PostgreSQL | constraints \\| joins | SQLite |");
    expect(readme.markdown).not.toContain("| empty |");
    expect(readme.markdown).toContain("| p95 latency | 42 ms | local, k6 |");
    expect(readme.markdown).toContain("- [x] routing, validation\n- [ ] migrations and tests\n- [ ] auth");
    expect(readme.markdown).toContain("## What it demonstrates\n\n- PostgreSQL");
    expect(readme.markdown).toContain("- **Test result**: [CI run](https://ci/1) (routing, validation). 48 tests passing");
    expect(readme.markdown).toContain("- Repository: [https://github.com/me/pr03](https://github.com/me/pr03)");
    expect(readme.markdown).toContain("- not a url");
    expect(readme.markdown).not.toContain("Lessons learned");
    expect(readme.gaps).toEqual(["Implementation", "Future improvements"]);

    const cs = buildPortfolio({ ...base, progress, evidence }, "case-study");
    expect(cs.markdown).toMatch(/^# Database-Backed API: case study\n\n\*\*Problem\.\*\* Students lose track of shared expenses\./);
    expect(cs.markdown).toContain("**Status.** 1 of 3 milestones done");
    expect(cs.markdown).toContain("## Rejected alternatives\n\n- Instead of SQLite: chose PostgreSQL because constraints | joins.");
    expect(cs.markdown).toContain("## Lessons learned\n\nWrite the migration first.");
  });

  it("names files predictably", () => {
    expect(portfolioFilename("PR03", "Database-Backed API", "readme")).toBe("PR03-database-backed-api-README.md");
    expect(portfolioFilename("PR11", "Intelligent Financial Research Platform", "case-study")).toBe("PR11-intelligent-financial-research-platform-case-study.md");
  });
});
