"use client";

import Link from "next/link";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="py-16 text-center">
      <h1 className="font-display text-[2.125rem] leading-[1.05] tracking-[-0.01em] sm:text-[2.625rem]">This page failed to render</h1>
      <p className="mx-auto mt-2 max-w-md text-muted">Your progress is safe: it is stored separately from this page. Try again; if it keeps failing, export your progress from Settings before reporting it.</p>
      {error.message && <p className="mx-auto mt-3 max-w-lg rounded-md bg-surface-2 px-3 py-2 font-mono text-xs">{error.message}</p>}
      <div className="mt-6 flex justify-center gap-3 text-sm">
        <button type="button" onClick={reset} className="rounded-md bg-accent px-3 py-2 text-accent-ink">Try again</button>
        <Link href="/settings" className="rounded-md border border-rule px-3 py-2">Settings</Link>
      </div>
    </div>
  );
}
