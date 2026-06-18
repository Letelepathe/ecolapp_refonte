const isLocalhost = Boolean(
  window.location.hostname === 'localhost' ||
  window.location.hostname === '[::1]' ||
  window.location.hostname.match(
    /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
  )
);

export function register(config) {
  if ('serviceWorker' in navigator) {
    const swUrl = `/service-worker.js`;

    if (!isLocalhost) {
      registerValidSW(swUrl, config);
    } else {
      console.log('SW désactivé localhost.');
    }
  }
}

function registerValidSW(swUrl, config) {
  navigator.serviceWorker
    .register(swUrl, { type: 'module' })
    .then((registration) => {
      // console.log('[SW] Registered:', registration);

      if (registration.waiting && config?.onUpdate) {
        config.onUpdate(registration);
      }

      if (registration.installing && config?.onSuccess) {
        config.onSuccess(registration);
      }

      enableBackgroundSync(registration);
    })
    .catch((error) => {
      console.error('[SW] Error:', error);
    });
}

function enableBackgroundSync(registration) {
  if ('sync' in registration) {
    registration.sync.register('sync-requests')
      .then(() => console.log('[SW] Background sync enabled'))
      .catch((err) => console.error('[SW] Background sync error:', err));
  }
}

export function unregister() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then((registration) => registration.unregister())
      .catch((error) => console.error(error.message));
  }
}
