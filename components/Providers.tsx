"use client";

import { ThemeProvider } from "next-themes";
import { useEffect, type ReactNode } from "react";
import { initStore } from "@/lib/store";
import { getAdapter, getBackupStore } from "@/lib/persistence";

function StoreBoot() {
  useEffect(() => {
    let cleanup: (() => void) | undefined;
    let cancelled = false;
    initStore(getAdapter(), getBackupStore()).then((c) => {
      if (cancelled) c();
      else cleanup = c;
    });
    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, []);
  return null;
}

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <StoreBoot />
      {children}
    </ThemeProvider>
  );
}
