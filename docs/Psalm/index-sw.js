/*
 *
 * Psalm Pages SW
 * 
 */

const version = "0.0.2";
const cacheName = 'PsalmMemory-${version}';
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(cacheName).then(cache => {
      return cache.addAll([
        'https://the-sunshining.github.io/SunBible_IMG_Library/Main_IMG/Psalm/Psalm_Logo_White.png',
        'https://the-sunshining.github.io/SunBible_IMG_Library/Main_IMG/Psalm/Psalm_Logo_Y.png'
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