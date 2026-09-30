"use client";

// Internal reference codes (P13.2, C3, SG4, PR07...) stay in the data and URLs.
// Learners see names by default; codes appear only when "Show reference codes"
// is switched on in Settings.
import Link from "next/link";
import { useHydrated, useUserState } from "@/lib/store";
import { cx } from "./ui";

export const SHOW_REFS_FLAG = "pref:showRefs";

export function useShowRefs() {
  const s = useUserState();
  const ready = useHydrated();
  return ready && !!s.flags[SHOW_REFS_FLAG];
}

export function RefId({ id, href, className }: { id: string; href?: string | null; className?: string }) {
  const show = useShowRefs();
  if (!show) return null;
  const cls = cx("font-mono text-[0.78em] text-faint whitespace-nowrap", className);
  return href ? <Link href={href} className={cx(cls, "hover:text-accent")}>{id}</Link> : <span className={cls}>{id}</span>;
}
