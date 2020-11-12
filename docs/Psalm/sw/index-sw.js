/*
 *
 * Psalm Pages SW
 * 
 */

const version = "0.0.1";
const cacheName = 'PsalmMemory-${version}';
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(cacheName).then(cache => {
      return cache.addAll([
        '../MemorizePsalm-index.html',
        '../../Photos/Psalm/Psalm_Logo_White.png',
        '../../Photos/Psalm/Psalm_Logo_Y.png',
        '../MemorizePsalmStyle',
        '...MemorizePsalmScript/MemorizePsalmScript-main.js'
])
          .then(() => self.skipWaiting());
    })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.open(cacheName)
      .then(cache => cache.match(event.request, {ignoreSearch: true}))
      .then(response => {
      return response || fetch(event.request);
    })
  );
});