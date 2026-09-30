"use client";

import Link from "next/link";
import { useHydrated, useUserState } from "@/lib/store";

export function CurrentWeekLink() {
  const s = useUserState();
  const ready = useHydrated();
  if (!ready) return null;
  return (
    <Link href={`/weeks/${s.currentWeek}`} className="btn btn-primary btn-sm">
      Go to current week ({s.currentWeek})
    </Link>
  );
}
