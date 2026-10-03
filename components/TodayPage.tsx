import { Today } from "@/components/Today";
import { meta, projects, weeks } from "@/lib/data";

/** Server wrapper: passes the static parts of Today (day plans, daily unit, DSA lanes). */
export function TodayPage() {
  const dayPlans = Object.fromEntries(weeks.filter((w) => w.dayPlan).map((w) => [w.cw, w.dayPlan]));
  const lanes = meta.dsaLane.map((l) => ({ from: l.from, to: l.to, label: l.slices.map((s) => s.title).join("; "), note: l.note }));
  const projectInfo = projects.map((p) => ({ id: p.id, title: p.title, weeks: p.buildWeeks, milestones: p.milestones }));
  return <Today dayPlans={dayPlans} dailyUnit={meta.dailyWorkUnit} lanes={lanes} projects={projectInfo} />;
}
