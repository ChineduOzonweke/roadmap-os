export default function Loading() {
  return (
    <div aria-label="Loading" className="space-y-4">
      <div className="h-8 w-2/3 animate-pulse rounded bg-surface-2" />
      <div className="h-4 w-1/2 animate-pulse rounded bg-surface-2" />
      <div className="h-48 animate-pulse rounded-lg bg-surface-2" />
    </div>
  );
}
