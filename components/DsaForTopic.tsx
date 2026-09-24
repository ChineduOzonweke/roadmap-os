"use client";

import Link from "next/link";
import { useHydrated, useUserState } from "@/lib/store";

export function DsaForTopic({ conceptIds }: { conceptIds: string[] }) {
  const s = useUserState();
  const ready = useHydrated();
  if (!ready) return null;
  const set = new Set(conceptIds);
  const list = s.dsa.filter((p) => p.patterns.some((x) => set.has(x)));
  if (!list.length) return <p className="text-sm text-muted">No journal problems are tagged with this topic yet. Tag problems with its patterns in the <Link className="text-accent underline" href="/dsa">DSA journal</Link>.</p>;
  return (
    <ul className="space-y-1 text-sm">
      {list.map((p) => (
        <li key={p.id} className="flex flex-wrap gap-2">
          <span>{p.title}</span>
          <span className="text-muted">{p.difficulty}, {p.status.replace(/_/g, " ")}</span>
        </li>
      ))}
    </ul>
  );
}
