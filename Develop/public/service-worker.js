// install event handler
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open('budget').then( cache => {
      return cache.addAll([
        './',
        './index.html',
        './icons/icon-192x192',
        './icons/icon-512x512',
      ]);
    })
  );
  console.log('Install');
  self.skipWaiting();
});

// retrieve assets from cache
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then( response => {
      return response || fetch(event.request);
    })
  );
});
