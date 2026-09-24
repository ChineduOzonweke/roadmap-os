import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHeader } from "@/components/ui";
import { SearchView } from "@/components/SearchView";

export const metadata: Metadata = { title: "Search" };

export default function Page() {
  return (
    <>
      <PageHeader title="Search" />
      <Suspense fallback={<div className="h-12 animate-pulse rounded-lg bg-surface-2" aria-label="Loading search" />}>
        <SearchView />
      </Suspense>
    </>
  );
}
