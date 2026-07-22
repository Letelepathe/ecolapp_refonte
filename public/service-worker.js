const CACHE_NAME = "ecolapp-v1";
const OFFLINE_URL = "/offline.html";

// Install
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.add(OFFLINE_URL))
  );
  self.skipWaiting();
});

// Activate
self.addEventListener("activate", event => {
  event.waitUntil(self.clients.claim());
});

// Fetch
self.addEventListener("fetch", event => {
  if (event.request.mode === "navigate") {
    return event.respondWith(
      fetch(event.request).catch(() =>
        caches.open(CACHE_NAME).then(cache => cache.match(OFFLINE_URL))
      )
    );
  }
});
