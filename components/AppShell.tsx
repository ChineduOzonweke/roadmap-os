"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { NAV, isActive } from "@/lib/nav";
import { useHydrated, useUserState } from "@/lib/store";
import { stageOfWeek } from "@/lib/progress";
import { ActiveModeSwitcher } from "./ActiveMode";
import { CommandPalette, CommandPaletteButton } from "./CommandPalette";
import { OfflineNotice, ServiceWorkerRegistration } from "./Pwa";
import { StorageBanner } from "./StorageNotices";
import { ThemeToggle } from "./ThemeToggle";
import { IconClose, IconMore, IconProgress, IconRoadmap, IconSearch, IconToday } from "./icons";
import { cx } from "./ui";

function Brand() {
  return (
    <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
      <span aria-hidden className="grid h-7 w-7 place-items-center rounded-lg bg-accent text-accent-ink"><IconRoadmap width={16} height={16} strokeWidth={2} /></span>
      Roadmap OS
    </Link>
  );
}

function WeekChip() {
  const s = useUserState();
  const ready = useHydrated();
  const stage = stageOfWeek(s.currentWeek);
  return (
    <Link href="/" className="block rounded-lg bg-surface-2 px-3 py-2.5 hover:bg-rule">
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
          <p className="mb-1 px-3 text-xs font-medium text-faint">{g.group}</p>
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
                      "flex min-h-10 items-center rounded-lg px-3 text-[0.9375rem]",
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
  { href: "/curriculum", label: "Roadmap", Icon: IconRoadmap },
  { href: "/progress", label: "Progress", Icon: IconProgress },
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
        <CommandPaletteButton />
        <WeekChip />
        <ActiveModeSwitcher variant="sidebar" />
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

        <StorageBanner />
        <OfflineNotice />
        <main id="main" className="mx-auto w-full max-w-4xl px-4 pb-32 pt-6 sm:px-6 lg:px-10 lg:pb-16 lg:pt-10">
          {children}
        </main>
      </div>

      <CommandPalette />
      <ServiceWorkerRegistration />

      <nav aria-label="Quick" className="fixed inset-x-0 bottom-0 z-30 border-t border-rule bg-surface/95 pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_16px_rgb(0_0_0/0.04)] backdrop-blur lg:hidden">
        <ul className="mx-auto grid max-w-md grid-cols-5 px-1">
          {BOTTOM.map(({ href, label, Icon }) => {
            const active = isActive(pathname, href);
            return (
              <li key={href}>
                <Link href={href} aria-current={active ? "page" : undefined} className={cx("group flex min-h-[3.75rem] flex-col items-center justify-center gap-1 pb-1.5 pt-2 text-xs", active ? "font-medium text-accent" : "text-muted active:text-ink")}>
                  <span className={cx("flex h-8 w-14 items-center justify-center rounded-full transition-colors", active ? "bg-accent-soft" : "group-active:bg-surface-2")}><Icon width={22} height={22} /></span>
                  {label}
                </Link>
              </li>
            );
          })}
          <li>
            <button type="button" onClick={() => setMenu(true)} className="group flex min-h-[3.75rem] w-full flex-col items-center justify-center gap-1 pb-1.5 pt-2 text-xs text-muted active:text-ink" aria-expanded={menu} aria-controls="more-menu">
              <span className="flex h-8 w-14 items-center justify-center rounded-full group-active:bg-surface-2"><IconMore width={22} height={22} /></span>
              More
            </button>
          </li>
        </ul>
      </nav>

      {menu && (
        <div className="fixed inset-0 z-40 lg:hidden" role="dialog" aria-modal="true" aria-label="All sections" id="more-menu">
          <button type="button" className="absolute inset-0 bg-black/40" aria-label="Close menu" onClick={() => setMenu(false)} />
          <div className="absolute inset-x-0 bottom-0 max-h-[85dvh] overflow-y-auto rounded-t-2xl bg-surface px-3 pb-[calc(1.5rem+env(safe-area-inset-bottom))] pt-2 shadow-[0_-8px_32px_rgb(0_0_0/0.18)]">
            <div aria-hidden className="mx-auto mb-2 h-1 w-10 rounded-full bg-rule-strong" />
            <div className="mb-3 flex items-center justify-between">
              <span className="px-3 font-semibold">All sections</span>
              <button type="button" onClick={() => setMenu(false)} className="inline-flex h-11 w-11 items-center justify-center rounded-lg hover:bg-surface-2" aria-label="Close menu">
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
