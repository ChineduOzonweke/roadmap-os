import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/ui";

export const metadata: Metadata = { title: "Offline" };

/** Served by the service worker when a page has never been opened on this device and the network is down. */
export default function Page() {
  return (
    <>
      <PageHeader title="You are offline" lead="This page has not been saved on this device yet." />
      <div className="max-w-prose space-y-3 text-sm">
        <p>Your progress is stored on this device, so ticks, sessions and notes keep saving while offline.</p>
        <p>Pages you have opened before are available offline. <Link href="/" className="text-accent hover:underline">Today</Link>, the roadmap, weeks, progress and settings are saved when the app is first installed.</p>
        <p className="text-muted">When the connection returns, reload to get the latest version of this page.</p>
      </div>
    </>
  );
}
