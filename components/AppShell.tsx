"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { NAV, isActive } from "@/lib/nav";
import { useHydrated, useUserState } from "@/lib/store";
import { stageOfWeek } from "@/lib/progress";
import { ThemeToggle } from "./ThemeToggle";
import { IconClose, IconDashboard, IconMore, IconSearch, IconToday, IconTree } from "./icons";
import { cx } from "./ui";

function Brand() {
  return (
    <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
      <span aria-hidden className="grid h-6 w-6 place-items-center rounded bg-accent font-mono text-[11px] font-medium text-accent-ink">R</span>
      Roadmap OS
    </Link>
  );
}

function WeekChip() {
  const s = useUserState();
  const ready = useHydrated();
  const stage = stageOfWeek(s.currentWeek);
  return (
    <Link href="/" className="block rounded-md border border-rule px-3 py-2 hover:border-accent">
      <span className="block text-xs text-muted">Current week</span>
      <span className="block font-medium">{ready ? `Week ${s.currentWeek} of 206` : "Loading progress"}</span>
      {ready && stage && <span className="block truncate text-xs text-muted">{stage.n}</span>}
    </Link>
  );
}

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <nav aria-label="Main">
      {NAV.map((g) => (
        <div key={g.group} className="mb-4">
          <p className="mb-1 px-2 text-xs text-faint">{g.group}</p>
          <ul>
            {g.items.map((it) => {
              const active = isActive(pathname, it.href);
              return (
                <li key={it.href}>
                  <Link
                    href={it.href}
                    onClick={onNavigate}
                    aria-current={active ? "page" : undefined}
                    className={cx(
                      "block rounded-md px-2 py-1.5 text-[0.93rem]",
                      active ? "bg-accent-soft font-medium text-accent" : "text-ink hover:bg-surface-2",
                    )}
                  >
                    {it.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}

const BOTTOM = [
  { href: "/", label: "Today", Icon: IconToday },
  { href: "/curriculum", label: "Roadmap", Icon: IconTree },
  { href: "/progress", label: "Progress", Icon: IconDashboard },
  { href: "/search", label: "Search", Icon: IconSearch },
];

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [menu, setMenu] = useState(false);

  useEffect(() => {
    if (!menu) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenu(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menu]);

  return (
    <div className="min-h-dvh lg:grid lg:grid-cols-[236px_minmax(0,1fr)]">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-3 focus:top-3 focus:z-50 focus:rounded focus:bg-surface focus:px-3 focus:py-2">
        Skip to content
      </a>

      <aside className="sticky top-0 hidden h-dvh flex-col gap-4 overflow-y-auto border-r border-rule bg-surface px-3 py-4 scroll-thin lg:flex">
        <div className="px-2"><Brand /></div>
        <WeekChip />
        <NavLinks />
        <div className="mt-auto flex items-center justify-between px-1 text-xs text-faint">
          <span>Undated plan</span>
          <ThemeToggle />
        </div>
      </aside>

      <div className="min-w-0">
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-rule bg-surface/95 px-4 backdrop-blur lg:hidden">
          <Brand />
          <div className="flex items-center">
            <ThemeToggle />
          </div>
        </header>

        <main id="main" className="mx-auto w-full max-w-5xl px-4 pb-28 pt-5 sm:px-6 lg:px-10 lg:pb-16 lg:pt-8">
          {children}
        </main>
      </div>

      <nav aria-label="Quick" className="fixed inset-x-0 bottom-0 z-30 border-t border-rule bg-surface/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden">
        <ul className="grid grid-cols-5">
          {BOTTOM.map(({ href, label, Icon }) => {
            const active = isActive(pathname, href);
            return (
              <li key={href}>
                <Link href={href} aria-current={active ? "page" : undefined} className={cx("flex min-h-14 flex-col items-center justify-center gap-0.5 py-2 text-[11px]", active ? "text-accent" : "text-muted")}>
                  <Icon />
                  {label}
                </Link>
              </li>
            );
          })}
          <li>
            <button type="button" onClick={() => setMenu(true)} className="flex min-h-14 w-full flex-col items-center justify-center gap-0.5 py-2 text-[11px] text-muted" aria-expanded={menu} aria-controls="more-menu">
              <IconMore />
              More
            </button>
          </li>
        </ul>
      </nav>

      {menu && (
        <div className="fixed inset-0 z-40 lg:hidden" role="dialog" aria-modal="true" aria-label="All sections" id="more-menu">
          <button type="button" className="absolute inset-0 bg-black/40" aria-label="Close menu" onClick={() => setMenu(false)} />
          <div className="absolute inset-x-0 bottom-0 max-h-[85dvh] overflow-y-auto rounded-t-xl border-t border-rule bg-surface px-4 pb-[calc(1.5rem+env(safe-area-inset-bottom))] pt-3">
            <div className="mb-3 flex items-center justify-between">
              <span className="font-semibold">All sections</span>
              <button type="button" onClick={() => setMenu(false)} className="inline-flex h-9 w-9 items-center justify-center rounded-md hover:bg-surface-2" aria-label="Close menu">
                <IconClose />
              </button>
            </div>
            <div className="mb-4"><WeekChip /></div>
            <NavLinks onNavigate={() => setMenu(false)} />
          </div>
        </div>
      )}
    </div>
  );
}
