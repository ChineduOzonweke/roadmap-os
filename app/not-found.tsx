import Link from "next/link";

export default function NotFound() {
  return (
    <div className="py-16 text-center">
      <p className="font-mono text-sm text-muted">404</p>
      <h1 className="mt-2 font-display text-[2.125rem] leading-[1.05] tracking-[-0.01em] sm:text-[2.625rem]">That page is not in the roadmap</h1>
      <p className="mx-auto mt-2 max-w-md text-muted">The ID may be mistyped. IDs look like P13, P13.2, P13.2-4 (concept), C3, PR07 or a week number from 1 to 206.</p>
      <div className="mt-6 flex justify-center gap-3 text-sm">
        <Link href="/search" className="rounded-md bg-accent px-3 py-2 text-accent-ink">Search the roadmap</Link>
        <Link href="/" className="rounded-md border border-rule px-3 py-2">Dashboard</Link>
      </div>
    </div>
  );
}
