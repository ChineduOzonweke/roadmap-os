"use client";

import Link from "next/link";
import { useState } from "react";
import { useHydrated, useUserState } from "@/lib/store";
import { EVIDENCE_KINDS } from "@/lib/evidence";
import { nameOf } from "@/lib/progress";
import { subjectLabel } from "@/lib/projectSpec";
import { hrefFor } from "@/lib/ids";
import type { EvidenceKind } from "@/types/state";
import { EvidenceRow } from "./Evidence";
import { Empty } from "./ui";

/** Every evidence item, filterable by kind, each linked back to what it proves. */
export function EvidenceView() {
  const s = useUserState();
  const ready = useHydrated();
  const [kind, setKind] = useState<EvidenceKind | "all">("all");
  if (!ready) return <div className="h-40 animate-pulse rounded-lg bg-surface-2" />;
  const items = [...s.evidence].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  if (!items.length) {
    return (
      <Empty title="No evidence yet">
        Attach evidence on a topic page (an exercise solved without notes, an explanation), a project milestone (a commit, a test run, a deployed URL) or a checkpoint.
      </Empty>
    );
  }
  const used = EVIDENCE_KINDS.filter((k) => items.some((e) => e.kind === k.id));
  const shown = kind === "all" ? items : items.filter((e) => e.kind === kind);
  const subjectHref = (id: string) => hrefFor(id.replace(/-(M\d+|U.*)$/, "")) ?? null;
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by kind">
        <button type="button" className="chip" aria-pressed={kind === "all"} onClick={() => setKind("all")}>All ({items.length})</button>
        {used.map((k) => (
          <button key={k.id} type="button" className="chip" aria-pressed={kind === k.id} onClick={() => setKind(k.id)}>
            {k.label} ({items.filter((e) => e.kind === k.id).length})
          </button>
        ))}
      </div>
      <ul className="divide-y divide-rule">
        {shown.map((e) => {
          const href = subjectHref(e.subject);
          const label = subjectLabel(e.subject, nameOf);
          return (
            <EvidenceRow
              key={e.id}
              e={e}
              subjectName={<>Proves: {href ? <Link href={href} className="text-accent hover:underline">{label}</Link> : label}</>}
            />
          );
        })}
      </ul>
    </div>
  );
}
