"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useHydrated, useUserState } from "@/lib/store";
import { setActiveMode } from "@/lib/actions";
import { ACTIVE_MODES, effectiveMode, modeDef } from "@/lib/modes";
import { cx } from "./ui";

const since = (iso: string) => new Date(iso).toLocaleDateString(undefined, { day: "numeric", month: "short" });

/**
 * Active Mode switcher (A-F). A button that expands the six operating states in place.
 * `variant="sidebar"` for the desktop rail, `"inline"` for Today on phones and for Settings.
 */
export function ActiveModeSwitcher({ variant = "inline" }: { variant?: "inline" | "sidebar" | "compact" }) {
  const s = useUserState();
  const ready = useHydrated();
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const btn = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        btn.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  if (!ready) return <div className={cx("animate-pulse rounded-lg bg-surface-2", variant === "compact" ? "h-8 w-40" : variant === "sidebar" ? "h-12" : "h-14")} aria-hidden />;
  const { def, chosen, since: from } = effectiveMode(s);

  if (variant === "compact") {
    return (
      <div className="min-w-0">
        <button ref={btn} type="button" aria-expanded={open} aria-controls={panelId} onClick={() => setOpen((v) => !v)} className="inline-flex min-h-9 items-center gap-2 rounded-md px-1.5 text-sm hover:bg-surface-2">
          <span aria-hidden className="grid h-5 w-5 place-items-center rounded-sm bg-accent-soft font-mono text-[0.6875rem] font-medium text-accent">{def.id}</span>
          <span className="truncate"><span className="text-muted">Mode</span> {def.name}{chosen ? "" : <span className="text-faint"> (suggested)</span>}</span>
          <span aria-hidden className="text-faint">{open ? "▴" : "▾"}</span>
        </button>
        {open && <ModeOptions panelId={panelId} chosen={chosen} current={def.id} onPick={() => { setOpen(false); btn.current?.focus(); }} />}
      </div>
    );
  }

  return (
    <div className={variant === "sidebar" ? "" : "rounded-xl border border-rule bg-surface"}>
      <button
        ref={btn}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
        className={cx(
          "flex w-full items-center gap-3 text-left",
          variant === "sidebar" ? "rounded-lg px-3 py-2 hover:bg-surface-2" : "min-h-14 rounded-xl px-4 py-2.5 hover:bg-surface-2/60",
        )}
      >
        <span aria-hidden className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-accent-soft font-semibold text-accent">{def.id}</span>
        <span className="min-w-0 flex-1">
          <span className="block text-xs text-muted">Active Mode{!chosen ? ", suggested" : from && variant === "inline" ? `, since ${since(from)}` : ""}</span>
          <span className="block truncate font-medium">{def.name}</span>
        </span>
        {variant === "inline" && <span className="shrink-0 text-xs text-accent">{open ? "Close" : "Change"}</span>}
      </button>

      {open && (
        <div id={panelId} className={cx("space-y-1.5", variant === "sidebar" ? "mt-1.5" : "border-t border-rule p-2")}>
          <p className={cx("text-xs text-muted", variant === "sidebar" ? "px-1" : "px-2 pt-1")}>
            Modes are operating states, not failure states. Switching changes what Today asks of you.
          </p>
          <ModeOptions panelId={undefined} chosen={chosen} current={def.id} onPick={() => { setOpen(false); btn.current?.focus(); }} bare />
        </div>
      )}
    </div>
  );
}

function ModeOptions({ panelId, chosen, current, onPick, bare = false }: { panelId?: string; chosen: boolean; current: string; onPick: () => void; bare?: boolean }) {
  return (
    <div id={panelId} className={cx(!bare && "pop-in mt-2 rounded-lg border border-rule bg-surface p-2 shadow-float")}>
      <div role="radiogroup" aria-label="Active Mode" className="space-y-1">
        {ACTIVE_MODES.map((m) => {
          const active = chosen && m.id === current;
          return (
            <button
              key={m.id}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => { setActiveMode(m.id); onPick(); }}
              className={cx("flex w-full gap-3 rounded-md border px-3 py-2 text-left transition-colors", active ? "border-accent bg-accent-soft" : "border-transparent hover:bg-surface-2")}
            >
              <span className="w-4 shrink-0 font-mono font-medium text-faint">{m.id}</span>
              <span className="min-w-0">
                <span className="block text-sm font-medium">{m.name}{!chosen && m.id === current ? " (suggested)" : ""}</span>
                <span className="block text-xs leading-snug text-muted">{m.summary}</span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/** Settings: the switcher plus the history of mode periods. */
export function ActiveModeSettings() {
  const s = useUserState();
  const ready = useHydrated();
  const past = [...s.modeHistory].reverse().slice(0, 8);
  return (
    <div className="space-y-3">
      <ActiveModeSwitcher />
      {ready && past.length > 0 && (
        <div>
          <p className="text-sm font-medium">Earlier periods</p>
          <ul className="mt-1 space-y-0.5 text-sm text-muted">
            {past.map((p, i) => (
              <li key={p.since + i}><span className="text-ink">{p.id}, {modeDef(p.id).name}</span>: {since(p.since)} to {since(p.until)}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
