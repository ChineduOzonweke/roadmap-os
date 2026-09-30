"use client";

import Link from "next/link";
import { useHydrated, useUserState } from "@/lib/store";
import { currentTier, weekMode } from "@/lib/ai";
import { gateName } from "@/lib/progress";
import { IconChevron } from "./icons";

/** One quiet line: which AI tier and mode apply to this week. Details live on /ai. */
export function AiModeLine({ cw }: { cw: number }) {
  const s = useUserState();
  const ready = useHydrated();
  if (!ready) return null;
  const tier = currentTier(s);
  const { mode, gate } = weekMode(s, cw);
  return (
    <Link href="/ai" className="flex items-center gap-3 rounded-xl bg-surface-2 px-4 py-3 text-sm hover:bg-rule active:bg-rule">
      <span className="min-w-0 flex-1">
        <span className="font-medium">AI as {tier.title.toLowerCase()}, {mode.title.toLowerCase()} mode.</span>{" "}
        <span className="text-muted">{mode.summary}</span>
        {gate && <span className="mt-1 block text-muted">Checkpoint this week ({gateName(gate)}): attempt it with AI off.</span>}
      </span>
      <IconChevron className="shrink-0 text-faint" width={16} height={16} />
    </Link>
  );
}
