/* sw.js for camayal.info/wa/pairs/: lets the installed app open offline.
   It saves this shell page, its manifest and the app icons. The game itself (the iframe at
   /memoriter/dist/) saves itself with its own offline helper, so after one visit online the
   whole thing opens without a connection.
   The page is fetched from the network first (changes show up right away) and falls back to the
   saved copy when offline. Change VERSION only if this file's list of files changes. */
const VERSION = "1";
const CACHE = "pairs-shell-" + VERSION;
const FILES = [
  "/wa/pairs/",
  "/wa/pairs/manifest.webmanifest",
  "/memoriter/dist/icon-192.png",
  "/memoriter/dist/icon-512.png",
  "/memoriter/dist/icon-maskable-512.png",
  "/memoriter/dist/apple-touch-icon.png",
];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k.startsWith("pairs-shell-") && k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return;
  if (req.mode === "navigate" && url.pathname.startsWith("/wa/pairs/")) {
    // Network first; offline → the saved shell (works with any ?settings).
    e.respondWith(fetch(req).then(res => {
      const copy = res.clone(); caches.open(CACHE).then(c => c.put("/wa/pairs/", copy)); return res;
    }).catch(() => caches.match("/wa/pairs/")));
  } else if (FILES.includes(url.pathname)) {
    // Manifest and icons: from the cache, refreshed in the background.
    e.respondWith(caches.match(url.pathname).then(hit => {
      const net = fetch(req).then(res => { if (res.ok) caches.open(CACHE).then(c => c.put(url.pathname, res.clone())); return res; }).catch(() => hit);
      return hit || net;
    }));
  }
});
