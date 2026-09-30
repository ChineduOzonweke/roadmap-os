import type { Metadata } from "next";
import { TodayPage } from "@/components/TodayPage";

export const metadata: Metadata = { title: "Today" };

export default function Page() {
  return <TodayPage />;
}
