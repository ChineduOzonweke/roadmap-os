"use client";

import Link from "next/link";
import { useHydrated, useUserState } from "@/lib/store";

export function CurrentWeekLink() {
  const s = useUserState();
  const ready = useHydrated();
  if (!ready) return null;
  return (
    <Link href={`/weeks/${s.currentWeek}`} className="inline-flex rounded-md bg-accent px-3 py-1.5 text-sm text-accent-ink hover:opacity-90">
      Go to current week ({s.currentWeek})
    </Link>
  );
}
