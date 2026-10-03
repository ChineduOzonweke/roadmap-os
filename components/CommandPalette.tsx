"use client";

import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useId, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { useHydrated, useUserState } from "@/lib/store";
import { setActiveMode } from "@/lib/actions";
import { ACTIVE_MODES } from "@/lib/modes";
import { NAV } from "@/lib/nav";
import { loadIndex, personalEntries, search } from "@/lib/search";
import type { SearchEntry } from "@/types/curriculum";
import { IconSearch } from "./icons";
import { cx } from "./ui";

type Entry = SearchEntry & { run?: () => void };

const LIMIT = 12;
const OPEN_EVENT = "roadmap-os:command-palette";

/** Open the palette from anywhere (e.g. a button). */
export function openCommandPalette() {
  window.dispatchEvent(new Event(OPEN_EVENT));
}

const noop = () => () => {};
function useIsMac() {
  return useSyncExternalStore(noop, () => /Mac|iPhone|iPad/.test(navigator.platform), () => false);
}

/** Sidebar trigger with the shortcut hint. */
export function CommandPaletteButton() {
  const mac = useIsMac();
  return (
    <button type="button" onClick={openCommandPalette} className="flex w-full items-center gap-2 rounded-lg border border-rule px-3 py-2 text-sm text-muted hover:bg-surface-2">
      <IconSearch width={15} height={15} />
      <span className="flex-1 text-left">Jump to…</span>
      <kbd className="rounded border border-rule px-1.5 font-mono text-[0.6875rem]">{mac ? "⌘" : "Ctrl"} K</kbd>
    </button>
  );
}

export function CommandPalette() {
  const router = useRouter();
  const pathname = usePathname();
  const s = useUserState();
  const ready = useHydrated();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);
  const [index, setIndex] = useState<SearchEntry[] | null>(null);
  const [failed, setFailed] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  const restore = useRef<HTMLElement | null>(null);
  const listId = useId();

  const show = useCallback(() => {
    restore.current = document.activeElement as HTMLElement | null;
    setQ("");
    setActive(0);
    setOpen(true);
  }, []);
  const close = useCallback(() => {
    setOpen(false);
    restore.current?.focus?.();
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && !e.altKey && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (open) close();
        else show();
      }
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener(OPEN_EVENT, show);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener(OPEN_EVENT, show);
    };
  }, [open, show, close]);

  // Close on navigation.
  const [seenPath, setSeenPath] = useState(pathname);
  if (pathname !== seenPath) {
    setSeenPath(pathname);
    if (open) setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    input.current?.focus();
    if (!index && !failed) loadIndex().then(setIndex).catch(() => setFailed(true));
  }, [open, index, failed]);

  const commands = useMemo<Entry[]>(() => [
    ...NAV.flatMap((g) => g.items.map((it) => ({ k: "Go to", id: "", t: it.label, s: `${g.group} ${it.href}`, h: it.href }))),
    { k: "Command", id: "", t: "Export a backup", s: "backup export download save settings", h: "/settings#backup" },
    ...ACTIVE_MODES.map((m) => ({
      k: "Command", id: "", t: `Active Mode ${m.id}: ${m.name}`, s: `switch mode ${m.summary}`, h: "#",
      run: () => setActiveMode(m.id),
    })),
  ], []);

  const results = useMemo<Entry[]>(() => {
    if (!q.trim()) return commands.slice(0, LIMIT);
    const pool: Entry[] = [...commands, ...(ready ? personalEntries(s) : []), ...(index ?? [])];
    return search(pool, q, LIMIT) as Entry[];
  }, [q, commands, s, ready, index]);

  if (!open) return null;

  const choose = (e: Entry | undefined) => {
    if (!e) return;
    setOpen(false);
    if (e.run) {
      e.run();
      restore.current?.focus?.();
    } else router.push(e.h);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setActive((i) => Math.min(results.length - 1, i + 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setActive((i) => Math.max(0, i - 1)); }
    else if (e.key === "Enter") { e.preventDefault(); choose(results[active]); }
    else if (e.key === "Escape") { e.preventDefault(); close(); }
    else if (e.key === "Tab") e.preventDefault(); // focus stays in the palette
  };

  const optionId = (i: number) => `${listId}-opt-${i}`;
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 px-3 pt-[10vh]" onMouseDown={(e) => { if (e.target === e.currentTarget) close(); }}>
      <div role="dialog" aria-modal="true" aria-label="Command palette" className="w-full max-w-xl overflow-hidden rounded-xl border border-rule bg-surface shadow-[0_16px_48px_rgb(0_0_0/0.3)]">
        <div className="flex items-center gap-2 border-b border-rule px-3">
          <IconSearch width={16} height={16} className="shrink-0 text-faint" />
          <input
            ref={input}
            value={q}
            onChange={(e) => { setQ(e.target.value); setActive(0); }}
            onKeyDown={onKeyDown}
            role="combobox"
            aria-expanded="true"
            aria-controls={listId}
            aria-activedescendant={results[active] ? optionId(active) : undefined}
            aria-autocomplete="list"
            placeholder="Jump to a page, topic, concept, project, note…"
            className="min-h-12 w-full bg-transparent text-base outline-none placeholder:text-faint"
          />
          <kbd className="hidden shrink-0 rounded border border-rule px-1.5 font-mono text-[0.6875rem] text-faint sm:block">Esc</kbd>
        </div>
        <ul id={listId} role="listbox" aria-label="Results" className="max-h-[60vh] overflow-y-auto py-1 scroll-thin">
          {results.map((r, i) => (
            <li
              key={`${r.k}-${r.id}-${r.t}-${i}`}
              id={optionId(i)}
              role="option"
              aria-selected={i === active}
              onMouseMove={() => setActive(i)}
              onClick={() => choose(r)}
              className={cx("flex cursor-pointer items-start gap-3 px-3 py-2", i === active && "bg-accent-soft")}
            >
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium">{r.t}</span>
                {r.p && <span className="block truncate text-xs text-muted">{r.p}</span>}
              </span>
              <span className="shrink-0 pt-0.5 text-[0.6875rem] text-faint">{r.k}</span>
            </li>
          ))}
          {q.trim() && !results.length && <li className="px-3 py-6 text-center text-sm text-muted">{index ? `Nothing matches "${q}".` : "Loading the curriculum index…"}</li>}
          {failed && <li className="px-3 py-2 text-xs text-danger">The curriculum index could not load; pages and your own records are still searchable.</li>}
        </ul>
        <p className="border-t border-rule px-3 py-1.5 text-[0.6875rem] text-faint">↑ ↓ to move · Enter to open · Esc to close</p>
      </div>
    </div>
  );
}
