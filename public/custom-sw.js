self.addEventListener('install', (event) => {
    console.log('[Service Worker] Installing...');
    event.waitUntil(
      caches.open('app-cache').then((cache) => {
        console.log('[Service Worker] Caching assets');
        return cache.addAll(['/', '/index.html']);
      })
    );
  });
  
  self.addEventListener('fetch', (event) => {
    console.log('[Service Worker] Fetching...', event.request.url);
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request);
      })
    );
  });
  