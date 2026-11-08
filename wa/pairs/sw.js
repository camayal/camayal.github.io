/* sw.js for camayal.info/wa/pairs/: lets the installed app open offline.
   It saves this shell page, its manifest and the app icons. The game itself (the iframe at
   /memoriter/dist/) saves itself with its own offline helper, so after one visit online the
   whole thing opens without a connection.
   Everything is served from the saved copy straight away and refreshed in the background, so opening
   never waits for the network (a weak signal can't slow it down) and changes show up on the next open.
   Change VERSION only if this file's list of files changes. */
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
  // The shell page (whatever the ?settings) shares one saved copy; manifest and icons by path.
  const key = req.mode === "navigate" && url.pathname.startsWith("/wa/pairs/") ? "/wa/pairs/"
            : FILES.includes(url.pathname) ? url.pathname : null;
  if (!key) return;
  const net = fetch(req).then(res => {
    if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(key, copy)); }
    return res;
  });
  e.respondWith(caches.match(key).then(hit => {
    if (hit) { e.waitUntil(net.catch(() => {})); return hit; }
    return net;
  }));
});
