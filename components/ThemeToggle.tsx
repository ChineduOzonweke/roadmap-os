"use client";

import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";
import { IconMoon, IconSun } from "./icons";

const noop = () => () => {};

export function ThemeToggle({ withLabel = false }: { withLabel?: boolean }) {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(noop, () => true, () => false);
  const dark = mounted && resolvedTheme === "dark";
  const label = dark ? "Switch to light mode" : "Switch to dark mode";
  return (
    <button
      type="button"
      onClick={() => setTheme(dark ? "light" : "dark")}
      className="inline-flex h-9 items-center gap-2 rounded-md px-2 text-muted hover:bg-surface-2 hover:text-ink"
      aria-label={label}
      title={label}
    >
      {mounted ? dark ? <IconSun /> : <IconMoon /> : <span className="shrink-0" />}
      {withLabel && <span className="text-sm">{dark ? "Light mode" : "Dark mode"}</span>}
    </button>
  );
}
