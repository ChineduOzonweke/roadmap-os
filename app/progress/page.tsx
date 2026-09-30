import type { Metadata } from "next";
import { Dashboard } from "@/components/Dashboard";

export const metadata: Metadata = { title: "Progress" };

export default function Page() {
  return <Dashboard />;
}
