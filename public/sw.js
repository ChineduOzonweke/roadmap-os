/*
 * Roadmap OS service worker: offline access to the app shell and the pages you
 * have opened. Hand-written (no build plugin) and deliberately small.
 *
 * - Hashed build assets (/_next/static/*) never change: cache-first.
 * - Pages and RSC payloads: network-first, so a connected device always gets the
 *   latest deployment; the cached copy is only used when the network fails.
 * - Search index, manifest and icons: stale-while-revalidate.
 * - User progress never passes through here: it lives in localStorage.
 *
 * Bump VERSION to drop every old cache on the next visit.
 */
const VERSION = "v2";
const STATIC = `ros-static-${VERSION}`;
const PAGES = `ros-pages-${VERSION}`;
const ASSETS = `ros-assets-${VERSION}`;
const KEEP = [STATIC, PAGES, ASSETS];
const MAX_PAGES = 200;

const PRECACHE_PAGES = ["/", "/curriculum", "/weeks", "/progress", "/settings", "/offline"];
const PRECACHE_ASSETS = ["/search-index.json", "/manifest.webmanifest", "/icon-192.png"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const pages = await caches.open(PAGES);
      const assets = await caches.open(ASSETS);
      // One failing URL must not abort the install.
      await Promise.all([
        ...PRECACHE_PAGES.map((u) => pages.add(u).catch(() => undefined)),
        ...PRECACHE_ASSETS.map((u) => assets.add(u).catch(() => undefined)),
      ]);
      await self.skipWaiting();
    })(),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const names = await caches.keys();
      await Promise.all(names.filter((n) => n.startsWith("ros-") && !KEEP.includes(n)).map((n) => caches.delete(n)));
      await self.clients.claim();
    })(),
  );
});

async function trim(cacheName, max) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  for (let i = 0; i < keys.length - max; i++) await cache.delete(keys[i]);
}

async function cacheFirst(request) {
  const cache = await caches.open(STATIC);
  const hit = await cache.match(request);
  if (hit) return hit;
  const res = await fetch(request);
  if (res.ok) cache.put(request, res.clone());
  return res;
}

async function networkFirst(request, { fallbackToOffline }) {
  const cache = await caches.open(PAGES);
  try {
    const res = await fetch(request);
    if (res.ok && res.type === "basic") {
      cache.put(request, res.clone()).then(() => trim(PAGES, MAX_PAGES));
    }
    return res;
  } catch (err) {
    const hit = await cache.match(request);
    if (hit) return hit;
    if (fallbackToOffline) {
      const offline = await cache.match("/offline");
      if (offline) return offline;
    }
    throw err;
  }
}

async function staleWhileRevalidate(request) {
  const cache = await caches.open(ASSETS);
  const hit = await cache.match(request);
  const fresh = fetch(request)
    .then((res) => {
      if (res.ok) cache.put(request, res.clone());
      return res;
    })
    .catch(() => undefined);
  return hit || (await fresh) || Response.error();
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (url.pathname.startsWith("/_next/static/")) {
    event.respondWith(cacheFirst(request));
    return;
  }
  if (request.mode === "navigate") {
    event.respondWith(networkFirst(request, { fallbackToOffline: true }));
    return;
  }
  // RSC payloads for client-side navigation. If none is cached offline, Next falls back to a full navigation.
  if (request.headers.get("RSC") === "1" || url.searchParams.has("_rsc")) {
    event.respondWith(networkFirst(request, { fallbackToOffline: false }));
    return;
  }
  if (url.pathname === "/search-index.json" || url.pathname === "/manifest.webmanifest" || /^\/(icon|apple-icon)/.test(url.pathname)) {
    event.respondWith(staleWhileRevalidate(request));
  }
});
