import { clientsClaim } from 'workbox-core';
import { cleanupOutdatedCaches, precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { CacheFirst } from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';

// Active immédiatement le code du dernier déploiement sur les onglets déjà ouverts.
self.skipWaiting();
clientsClaim();
cleanupOutdatedCaches();

// Précache uniquement les fichiers générés par le build courant.
precacheAndRoute(self.__WB_MANIFEST || []);

// Les réponses API authentifiées ne sont volontairement jamais mises en cache :
// elles dépendent du compte connecté et doivent toujours venir de Laravel.

// Les images publiques peuvent rester disponibles hors connexion.
registerRoute(
  ({ request }) => request.destination === 'image',
  new CacheFirst({
    cacheName: 'image-cache',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 20,
        maxAgeSeconds: 30 * 24 * 60 * 60,
      }),
    ],
  })
);
