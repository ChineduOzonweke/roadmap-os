// Presentational primitives. No hooks, no data imports: safe in server and client components.
import Link from "next/link";
import type { ReactNode } from "react";
import type { Status } from "@/lib/progress";
import { IconChevron } from "./icons";

export function cx(...xs: (string | false | null | undefined)[]) {
  return xs.filter(Boolean).join(" ");
}

export function IdTag({ id, href, className }: { id: string; href?: string | null; className?: string }) {
  const cls = cx("font-mono text-[0.8em] text-muted whitespace-nowrap", className);
  return href ? <Link href={href} className={cx(cls, "hover:text-accent")}>{id}</Link> : <span className={cls}>{id}</span>;
}

// Status reads through a glyph plus a word; colour is secondary. Only "done" states are coloured.
const STATUS_STYLE: Record<Status, string> = {
  locked: "text-faint",
  available: "text-muted",
  in_progress: "text-ink",
  completed: "text-ok",
  mastered: "text-ok",
};
const STATUS_TEXT: Record<Status, string> = {
  locked: "Locked",
  available: "Available",
  in_progress: "In progress",
  completed: "Checklist done",
  mastered: "Mastered",
};

export function StatusPill({ status, className }: { status: Status; className?: string }) {
  return (
    <span className={cx("inline-flex items-center gap-1.5 text-xs font-medium whitespace-nowrap", STATUS_STYLE[status], className)}>
      <StatusGlyph status={status} />
      {STATUS_TEXT[status]}
    </span>
  );
}

/** Ring = not started, half ring = in progress, filled = done, double ring = mastered. */
export function StatusGlyph({ status }: { status: Status }) {
  const common = "inline-block h-2.5 w-2.5 shrink-0 rounded-full";
  if (status === "locked") return <span aria-hidden className={cx(common, "border-[1.5px] border-dashed border-rule-strong")} />;
  if (status === "available") return <span aria-hidden className={cx(common, "border-[1.5px] border-muted")} />;
  if (status === "in_progress") return <span aria-hidden className={cx(common, "border-[1.5px] border-accent bg-[conic-gradient(var(--accent)_0_50%,transparent_50%_100%)]")} />;
  if (status === "mastered") return <span aria-hidden className={cx(common, "bg-ok ring-2 ring-ok/35 ring-offset-1 ring-offset-surface")} />;
  return <span aria-hidden className={cx(common, "bg-ok")} />;
}

export function Bar({ value, tone = "accent", className, label }: { value: number; tone?: "accent" | "ok" | "warn"; className?: string; label?: string }) {
  const v = Math.max(0, Math.min(1, value));
  const color = tone === "ok" ? "bg-ok" : tone === "warn" ? "bg-warn" : "bg-accent";
  return (
    <div
      className={cx("h-1.5 w-full overflow-hidden rounded-full bg-rule", className)}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(v * 100)}
      aria-label={label}
    >
      <div className={cx("h-full rounded-full transition-[width] duration-300", color)} style={{ width: `${v * 100}%` }} />
    </div>
  );
}

/**
 * Tally bar: one segment per checklist item, filled in order of completion.
 * Used where the count is small enough to read (a week's checklist).
 */
export function Tally({ done, total, label, className }: { done: number; total: number; label: string; className?: string }) {
  if (total <= 0) return null;
  if (total > 40) return <Bar value={done / total} label={label} className={cx("h-2", className)} tone={done === total ? "ok" : "accent"} />;
  const full = done === total;
  return (
    <div className={cx("flex gap-[3px]", className)} role="progressbar" aria-valuemin={0} aria-valuemax={total} aria-valuenow={done} aria-label={label}>
      {Array.from({ length: total }, (_, i) => (
        <span key={i} className={cx("h-2 flex-1 rounded-[2px] transition-colors duration-200", i < done ? (full ? "bg-ok" : "bg-accent") : "bg-rule")} />
      ))}
    </div>
  );
}

export function PageHeader({ title, lead, meta, children }: { title: ReactNode; lead?: ReactNode; meta?: ReactNode; children?: ReactNode }) {
  return (
    <header className="mb-8">
      {meta && <div className="mb-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted">{meta}</div>}
      <h1 className="font-display text-[2.125rem] leading-[1.05] tracking-[-0.01em] text-balance sm:text-[2.625rem]">{title}</h1>
      {lead && <div className="mt-3 max-w-[65ch] text-[0.9375rem] leading-relaxed text-muted">{lead}</div>}
      {children && <div className="mt-4">{children}</div>}
    </header>
  );
}

export function Section({ title, aside, children, className, id }: { title?: ReactNode; aside?: ReactNode; children: ReactNode; className?: string; id?: string }) {
  return (
    <section id={id} className={cx("mb-8", className)}>
      {(title || aside) && (
        <div className="mb-3 flex items-baseline justify-between gap-3">
          {title && <h2 className="h-section">{title}</h2>}
          {aside && <div className="text-sm text-muted">{aside}</div>}
        </div>
      )}
      {children}
    </section>
  );
}

/** Several flat disclosures on one surface, separated by hairlines instead of separate cards. */
export function DisclosureGroup({ children, className, label }: { children: ReactNode; className?: string; label?: string }) {
  return <div role={label ? "group" : undefined} aria-label={label} className={cx("card overflow-hidden rule-list", className)}>{children}</div>;
}

/** Mastery 0-5 as six ticks on one accent ramp; retained turns the run green. */
export function MasteryMark({ level, className }: { level: number; className?: string }) {
  const names = ["Not started", "Learning", "Explained", "Practised", "Demonstrated", "Retained"];
  return (
    <span className={cx("inline-flex items-center gap-[3px]", className)} role="img" aria-label={`Mastery: ${names[level] ?? "Not started"}`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className={cx("h-2.5 w-1 rounded-full", i <= level ? (level >= 5 ? "bg-ok" : "bg-accent") : "bg-rule-strong")} style={i <= level && level < 5 ? { opacity: 0.45 + i * 0.11 } : undefined} />
      ))}
    </span>
  );
}

export function Panel({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cx("card p-4", className)}>{children}</div>;
}

export function Empty({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="rounded-lg border border-dashed border-rule px-4 py-6 text-center">
      <p className="font-medium">{title}</p>
      {children && <div className="mt-1 text-sm text-muted">{children}</div>}
    </div>
  );
}

export function Chip({ children, className }: { children: ReactNode; className?: string }) {
  return <span className={cx("inline-flex items-center rounded-md bg-surface-2 px-2 py-0.5 text-xs text-muted", className)}>{children}</span>;
}

export function DepthScale({ current, target }: { current: number | null; target: [number, number] | null }) {
  return (
    <div className="flex items-center gap-1" aria-label={`Current depth ${current == null ? "not set" : "D" + current}${target ? `, target D${target[0]}${target[1] !== target[0] ? "–D" + target[1] : ""}` : ""}`}>
      {[0, 1, 2, 3, 4, 5].map((d) => {
        const reached = current != null && d <= current;
        const inTarget = target && d >= target[0] && d <= target[1];
        return (
          <span
            key={d}
            className={cx(
              "flex h-5 w-7 items-center justify-center rounded-sm font-mono text-[10px]",
              reached ? "bg-accent text-accent-ink" : "bg-surface-2 text-faint",
              inTarget && "ring-1 ring-accent",
            )}
          >
            D{d}
          </span>
        );
      })}
    </div>
  );
}

/** Renders concept text, turning `code` spans into code elements. */
export function InlineText({ text }: { text: string }) {
  const parts = text.split(/(`[^`]+`)/g);
  return (
    <>
      {parts.map((p, i) =>
        p.startsWith("`") && p.endsWith("`") && p.length > 1 ? (
          <code key={i} className="rounded bg-surface-2 px-1 font-mono text-[0.88em]">{p.slice(1, -1)}</code>
        ) : (
          <span key={i}>{p}</span>
        ),
      )}
    </>
  );
}

export function ExternalLink({ href, children, className }: { href: string; children: ReactNode; className?: string }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={cx("text-accent underline underline-offset-2 [overflow-wrap:anywhere] hover:no-underline", className)}>
      {children}
    </a>
  );
}

/**
 * Progressive disclosure: collapsed section with a large tap target. Native <details>, no JS.
 * `flat` drops the card so several disclosures can share one surface (see DisclosureGroup).
 */
export function Disclosure({ title, hint, open, children, id, className, flat = false }: { title: ReactNode; hint?: ReactNode; open?: boolean; children: ReactNode; id?: string; className?: string; flat?: boolean }) {
  return (
    <details id={id} open={open} className={cx("group", !flat && "card overflow-hidden", className)}>
      <summary className="flex min-h-14 cursor-pointer list-none items-center gap-3 px-4 py-3 hover:bg-surface-2/60 active:bg-surface-2 [&::-webkit-details-marker]:hidden">
        <span className="min-w-0 flex-1">
          <span className="block font-medium">{title}</span>
          {hint && <span className="block text-sm text-muted">{hint}</span>}
        </span>
        <IconChevron className="shrink-0 text-faint transition-transform duration-150 group-open:rotate-90" width={18} height={18} />
      </summary>
      <div className="border-t border-rule px-4 py-4">{children}</div>
    </details>
  );
}
