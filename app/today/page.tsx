import type { Metadata } from "next";
import { Today } from "@/components/Today";
import { meta, weeks } from "@/lib/data";

export const metadata: Metadata = { title: "Today" };

export default function Page() {
  const dayPlans = Object.fromEntries(weeks.filter((w) => w.dayPlan).map((w) => [w.cw, w.dayPlan]));
  const lanes = meta.dsaLane.map((l) => ({ from: l.from, to: l.to, label: l.slices.map((s) => s.label.replace(" · ", ", ")).join("; "), note: l.note }));
  return <Today dayPlans={dayPlans} dailyUnit={meta.dailyWorkUnit} lanes={lanes} />;
}
