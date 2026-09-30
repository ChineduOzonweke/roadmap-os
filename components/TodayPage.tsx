import { Today } from "@/components/Today";
import { meta, weeks } from "@/lib/data";

/** Server wrapper: passes the static parts of Today (day plans, daily unit, DSA lanes). */
export function TodayPage() {
  const dayPlans = Object.fromEntries(weeks.filter((w) => w.dayPlan).map((w) => [w.cw, w.dayPlan]));
  const lanes = meta.dsaLane.map((l) => ({ from: l.from, to: l.to, label: l.slices.map((s) => s.title).join("; "), note: l.note }));
  return <Today dayPlans={dayPlans} dailyUnit={meta.dailyWorkUnit} lanes={lanes} />;
}
