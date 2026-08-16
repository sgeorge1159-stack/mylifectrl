// Service worker decommissioned.
// A prior version cached the HTML shell (cache-first), which served stale pages
// pointing to deleted JS bundles and produced a blank white screen.
// This version clears all caches and unregisters itself so the site always loads fresh.
self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.map((key) => caches.delete(key))))
      .then(() => self.registration.unregister())
      .then(() => self.clients.claim())
  );
});
