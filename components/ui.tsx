// Presentational primitives. No hooks, no data imports: safe in server and client components.
import Link from "next/link";
import type { ReactNode } from "react";
import type { Status } from "@/lib/progress";

export function cx(...xs: (string | false | null | undefined)[]) {
  return xs.filter(Boolean).join(" ");
}

export function IdTag({ id, href, className }: { id: string; href?: string | null; className?: string }) {
  const cls = cx("font-mono text-[0.8em] text-muted whitespace-nowrap", className);
  return href ? <Link href={href} className={cx(cls, "hover:text-accent")}>{id}</Link> : <span className={cls}>{id}</span>;
}

const STATUS_STYLE: Record<Status, string> = {
  locked: "text-faint bg-surface-2",
  available: "text-accent bg-accent-soft",
  in_progress: "text-warn bg-warn-soft",
  completed: "text-ok bg-ok-soft",
  mastered: "text-ok bg-ok-soft ring-1 ring-ok/50",
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
    <span className={cx("inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-xs font-medium whitespace-nowrap", STATUS_STYLE[status], className)}>
      <StatusGlyph status={status} />
      {STATUS_TEXT[status]}
    </span>
  );
}

export function StatusGlyph({ status }: { status: Status }) {
  const common = "inline-block h-2 w-2 shrink-0 rounded-full";
  if (status === "locked") return <span aria-hidden className={cx(common, "border border-lock")} />;
  if (status === "available") return <span aria-hidden className={cx(common, "border-2 border-accent")} />;
  if (status === "in_progress") return <span aria-hidden className={cx(common, "bg-warn")} />;
  return <span aria-hidden className={cx(common, "bg-ok")} />;
}

export function Bar({ value, tone = "accent", className, label }: { value: number; tone?: "accent" | "ok" | "warn"; className?: string; label?: string }) {
  const v = Math.max(0, Math.min(1, value));
  const color = tone === "ok" ? "bg-ok" : tone === "warn" ? "bg-warn" : "bg-accent";
  return (
    <div
      className={cx("h-1.5 w-full overflow-hidden rounded-full bg-surface-2", className)}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(v * 100)}
      aria-label={label}
    >
      <div className={cx("h-full rounded-full", color)} style={{ width: `${v * 100}%` }} />
    </div>
  );
}

export function PageHeader({ title, lead, meta, children }: { title: ReactNode; lead?: ReactNode; meta?: ReactNode; children?: ReactNode }) {
  return (
    <header className="mb-6 border-b border-rule pb-5">
      {meta && <div className="mb-2 flex flex-wrap items-center gap-2 text-sm text-muted">{meta}</div>}
      <h1 className="text-2xl font-semibold leading-tight tracking-tight sm:text-[1.75rem]">{title}</h1>
      {lead && <div className="mt-2 max-w-[72ch] text-muted">{lead}</div>}
      {children && <div className="mt-4">{children}</div>}
    </header>
  );
}

export function Section({ title, aside, children, className, id }: { title?: ReactNode; aside?: ReactNode; children: ReactNode; className?: string; id?: string }) {
  return (
    <section id={id} className={cx("mb-8", className)}>
      {(title || aside) && (
        <div className="mb-3 flex items-baseline justify-between gap-3">
          {title && <h2 className="text-base font-semibold">{title}</h2>}
          {aside && <div className="text-sm text-muted">{aside}</div>}
        </div>
      )}
      {children}
    </section>
  );
}

export function Panel({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cx("rounded-lg border border-rule bg-surface p-4", className)}>{children}</div>;
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
  return <span className={cx("inline-flex items-center rounded border border-rule px-1.5 py-0.5 text-xs text-muted", className)}>{children}</span>;
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
