import type { EvidenceItem, ProjectProgress } from "@/types/state";
import { kindLabel } from "@/lib/evidence";
import { milestoneStatus, type RequirementGroup } from "@/lib/projectSpec";

/**
 * Project README / case-study export. It only transforms what the user has
 * recorded: empty sections are left out (and reported as gaps), and nothing is
 * invented. Pure and deterministic.
 */

export type PortfolioFormat = "readme" | "case-study";

export type PortfolioInput = {
  project: { id: string; title: string; purpose: string; milestones: { id: string; text: string }[] };
  progress: ProjectProgress | undefined;
  requirements: RequirementGroup[];
  evidence: EvidenceItem[];
  /** Milestone and subject labels for evidence lines. */
  labelOf: (subject: string) => string;
};

export type PortfolioResult = { markdown: string; gaps: string[] };

const clean = (t: string | null | undefined) => (t ?? "").trim();
/** Table cell: escape pipes, flatten lines. */
const esc = (t: string) => t.replace(/\|/g, "\\|").replace(/\n+/g, " ");
/** Prose on one line. */
const flat = (t: string) => t.replace(/\s*\n+\s*/g, " ");
const link = (text: string, url: string) => (/^https?:\/\//.test(url) ? `[${text}](${url})` : text);

function section(title: string, body: string | null): string | null {
  return body && body.trim() ? `## ${title}\n\n${body.trim()}\n` : null;
}

export function buildPortfolio(input: PortfolioInput, format: PortfolioFormat): PortfolioResult {
  const { project, progress: p, requirements, evidence, labelOf } = input;
  const r = p?.record ?? {};
  const gaps: string[] = [];
  const need = (name: string, value: string | null) => {
    if (!value || !value.trim()) gaps.push(name);
    return value;
  };

  const repo = clean(p?.repoUrl);
  const deploy = clean(r.deployUrl);
  const otherLinks = clean(r.links).split(/\r?\n/).map((l) => l.trim()).filter(Boolean);

  const decisions = (r.decisions ?? []).filter((d) => clean(d.decision));
  const decisionsMd = decisions.length
    ? ["| Decision | Why | Rejected alternatives |", "|---|---|---|", ...decisions.map((d) => `| ${esc(d.decision)} | ${esc(clean(d.why)) || "-"} | ${esc(clean(d.rejected)) || "-"} |`)].join("\n")
    : null;
  const rejectedMd = decisions.filter((d) => clean(d.rejected)).map((d) => `- Instead of ${flat(clean(d.rejected))}: chose ${flat(d.decision)}${clean(d.why) ? ` because ${flat(clean(d.why))}` : ""}.`).join("\n") || null;

  const metrics = (r.metrics ?? []).filter((m) => clean(m.name) && clean(m.value));
  const metricsMd = metrics.length
    ? ["| Metric | Value | Measured |", "|---|---|---|", ...metrics.map((m) => `| ${esc(m.name)} | ${esc(m.value)} | ${esc(clean(m.context)) || "-"} |`)].join("\n")
    : null;

  const custom = p?.customMilestones ?? [];
  const allMilestones = [...project.milestones, ...custom.map((m) => ({ id: m.id, text: m.text }))];
  const doneMilestones = allMilestones.filter((m) => milestoneStatus(p, m.id) === "done");
  const milestonesMd = allMilestones.length
    ? allMilestones.map((m) => `- [${milestoneStatus(p, m.id) === "done" ? "x" : " "}] ${m.text}`).join("\n")
    : null;

  const met = requirements.flatMap((g) => g.items.filter((i) => p?.requirements?.[i.key]).map((i) => i.text));
  const criteriaMd = [met.length ? met.map((t) => `- ${t}`).join("\n") : "", clean(r.completionCriteria)].filter(Boolean).join("\n\n") || null;

  const evidenceMd = evidence.length
    ? evidence.map((e) => `- **${kindLabel(e.kind)}**: ${link(e.title || e.url, e.url)}${e.subject !== project.id ? ` (${labelOf(e.subject)})` : ""}${clean(e.detail) ? `. ${flat(clean(e.detail))}` : ""}`).join("\n")
    : null;

  const linksMd = [repo && `- Repository: ${link(repo, repo)}`, deploy && `- Live: ${link(deploy, deploy)}`, ...otherLinks.map((l) => `- ${/^https?:\/\//.test(l) ? link(l, l) : l}`)].filter(Boolean).join("\n") || null;

  const problem = need("Problem", clean(r.problem));
  const goal = need("Goal", clean(r.goal));
  const architecture = need("Architecture", clean(r.architecture));
  const implementation = need("Implementation", clean(r.implementation));
  const experiments = clean(r.experiments);
  const failures = need("Failure points and debugging", clean(r.failures));
  const lessons = need("Lessons learned", clean(r.lessons));
  const future = need("Future improvements", clean(r.future));
  need("Technical decisions", decisionsMd);
  need("Metrics", metricsMd);
  need("Evidence", evidenceMd);
  if (!repo) gaps.push("Repository link");

  const header = format === "readme"
    ? `# ${project.title}\n\n${clean(goal) || project.purpose}\n`
    : `# ${project.title}: case study\n\n${problem ? `**Problem.** ${problem.split(/\n/)[0]}\n\n` : ""}**Status.** ${doneMilestones.length} of ${allMilestones.length} milestones done${repo ? ` · ${link("repository", repo)}` : ""}${deploy ? ` · ${link("live", deploy)}` : ""}\n`;

  const parts = format === "readme"
    ? [
        header,
        section("Problem", problem),
        section("Architecture", architecture),
        section("Technical choices", decisionsMd),
        section("Implementation", implementation),
        section("Experiments", experiments),
        section("Metrics", metricsMd),
        section("Status", milestonesMd),
        section("What it demonstrates", criteriaMd),
        section("Known issues and debugging notes", failures),
        section("Future improvements", future),
        section("Evidence", evidenceMd),
        section("Links and deployment", linksMd),
      ]
    : [
        header,
        section("Problem", problem),
        section("Goal", goal),
        section("Architecture", architecture),
        section("Technical choices", decisionsMd),
        section("Rejected alternatives", rejectedMd),
        section("Implementation", implementation),
        section("Experiments", experiments),
        section("Metrics", metricsMd),
        section("Failure points and debugging", failures),
        section("Lessons learned", lessons),
        section("Future improvements", future),
        section("Evidence", evidenceMd),
        section("Deployment and links", linksMd),
      ];

  const unused = format === "readme" ? ["Lessons learned"] : [];
  return { markdown: parts.filter(Boolean).join("\n").replace(/\n{3,}/g, "\n\n").trim() + "\n", gaps: gaps.filter((g) => !unused.includes(g)) };
}

export const portfolioFilename = (projectId: string, title: string, format: PortfolioFormat) =>
  `${projectId}-${title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}-${format === "readme" ? "README" : "case-study"}.md`;
