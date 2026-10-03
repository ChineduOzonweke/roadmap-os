/**
 * Completion criteria from a project's master specification (data/projects.json
 * bodyMd). Every bullet list introduced by a "Heading:" line becomes a group,
 * except "Examples:" (those are options to choose from, not requirements).
 * Keys are derived from the text, so ticks survive curriculum reordering.
 */

export type RequirementGroup = { heading: string; items: { key: string; text: string }[] };

const slug = (t: string) => t.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60);

export function parseRequirements(bodyMd: string): RequirementGroup[] {
  const lines = bodyMd.split(/\r?\n/);
  const groups: RequirementGroup[] = [];
  let heading: string | null = null;
  let current: RequirementGroup | null = null;
  let inCode = false;
  for (const raw of lines) {
    const line = raw.trim();
    if (line.startsWith("```")) {
      inCode = !inCode;
      current = null; // a code block ends any list
      heading = null;
      continue;
    }
    if (inCode || !line) continue;
    const bullet = /^[-*]\s+(.+)$/.exec(line);
    if (bullet && heading !== null) {
      if (!current) {
        current = { heading, items: [] };
        groups.push(current);
      }
      const text = bullet[1].trim();
      current.items.push({ key: `${slug(heading)}:${slug(text)}`, text });
      continue;
    }
    if (bullet) continue; // a list with no heading: not a requirement list
    current = null;
    heading = line.endsWith(":") && !/^examples?:$/i.test(line) ? line.slice(0, -1).trim() : null;
  }
  return groups.filter((g) => g.items.length > 0);
}

/** A milestone's status. The v1 done flag wins, so ticks made before phase F (or elsewhere) are respected. */
export function milestoneStatus(
  p: { milestones: Record<string, boolean>; milestoneDetail?: Record<string, { status: "todo" | "doing" | "blocked" | "done" }> } | undefined,
  id: string,
): "todo" | "doing" | "blocked" | "done" {
  if (!p) return "todo";
  if (p.milestones[id]) return "done";
  const st = p.milestoneDetail?.[id]?.status;
  return st && st !== "done" ? st : "todo";
}

/** Human label for an evidence subject id (topic, project, milestone, checkpoint). */
export function subjectLabel(id: string, nameOf: (id: string) => string): string {
  const generated = /^(PR\d\d)-M(\d+)$/.exec(id);
  if (generated) return `${nameOf(generated[1])}, milestone ${generated[2]}`;
  const custom = /^(PR\d\d)-U/.exec(id);
  if (custom) return `${nameOf(custom[1])}, your milestone`;
  return nameOf(id);
}
