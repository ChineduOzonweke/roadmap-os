import type { Metadata } from "next";
import { AiPractice } from "@/components/AiPractice";

export const metadata: Metadata = { title: "Working with AI" };

export default function Page() {
  return <AiPractice />;
}
