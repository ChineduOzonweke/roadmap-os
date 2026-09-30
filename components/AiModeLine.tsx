"use client";

import Link from "next/link";
import { useHydrated, useUserState } from "@/lib/store";
import { currentTier, weekMode } from "@/lib/ai";
import { gateName } from "@/lib/progress";

/** One quiet line: which AI tier and mode apply to this week. Details live on /ai. */
export function AiModeLine({ cw }: { cw: number }) {
  const s = useUserState();
  const ready = useHydrated();
  if (!ready) return null;
  const tier = currentTier(s);
  const { mode, gate } = weekMode(s, cw);
  return (
    <Link href="/ai" className="block rounded-md border border-rule bg-surface px-3 py-2.5 text-sm hover:border-accent">
      <span className="font-medium">AI: {tier.title}, {mode.title.toLowerCase()} mode.</span>{" "}
      <span className="text-muted">{mode.summary}</span>
      {gate && <span className="mt-1 block text-muted">Checkpoint this week ({gateName(gate)}): attempt it with AI off.</span>}
    </Link>
  );
}
