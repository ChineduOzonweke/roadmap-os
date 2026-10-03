"use client";

import { useEffect, useSyncExternalStore } from "react";

/** Registers /sw.js in production builds only, so development never serves stale code. */
export function ServiceWorkerRegistration() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production" || !("serviceWorker" in navigator)) return;
    const register = () => navigator.serviceWorker.register("/sw.js").catch(() => {
      /* offline support is an enhancement; the app works without it */
    });
    if (document.readyState === "complete") register();
    else window.addEventListener("load", register, { once: true });
  }, []);
  return null;
}

function subscribe(cb: () => void) {
  window.addEventListener("online", cb);
  window.addEventListener("offline", cb);
  return () => {
    window.removeEventListener("online", cb);
    window.removeEventListener("offline", cb);
  };
}

/** One quiet line while the device is offline. Progress keeps saving locally either way. */
export function OfflineNotice() {
  const offline = useSyncExternalStore(subscribe, () => !navigator.onLine, () => false);
  if (!offline) return null;
  return (
    <div role="status" className="border-b border-rule bg-surface-2">
      <p className="mx-auto max-w-4xl px-4 py-2 text-sm text-muted sm:px-6 lg:px-10">
        Offline. Progress still saves on this device; pages you have opened before are available.
      </p>
    </div>
  );
}
