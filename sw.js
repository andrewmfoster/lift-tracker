// program.json is network-first (fresh program on every online open, cache only
// as offline fallback); other same-origin assets stay stale-while-revalidate.
const CACHE = "lift-v8";  // bumped: pull sets/notes back from Supabase on open
const ASSETS = ["./", "index.html", "program.json", "manifest.json", "icon-192.png", "icon-512.png", "apple-touch-icon.png",
  "fonts/ChakraPetch-500.woff2", "fonts/ChakraPetch-600.woff2", "fonts/ChakraPetch-700.woff2", "fonts/Orbitron-800.woff2"];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});
self.addEventListener("fetch", (e) => {
  const url = new URL(e.request.url);
  if (url.origin !== location.origin || e.request.method !== "GET") return; // Supabase → network
  if (url.pathname.endsWith("/program.json")) {
    e.respondWith(
      fetch(e.request)
        .then((res) => {
          if (res.ok) caches.open(CACHE).then((c) => c.put(e.request, res.clone()));
          return res;
        })
        .catch(() => caches.match(e.request))
    );
    return;
  }
  e.respondWith(
    caches.match(e.request).then((cached) => {
      const fresh = fetch(e.request)
        .then((res) => {
          if (res.ok) caches.open(CACHE).then((c) => c.put(e.request, res.clone()));
          return res;
        })
        .catch(() => cached);
      return cached || fresh;
    })
  );
});
