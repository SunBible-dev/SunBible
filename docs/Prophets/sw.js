/*
 *
 *  SunBible
 *  Copyright 2020 The SunShining All rights reserved.
 *
 */
const version = "0.0.1";
const cacheName = 'Prophet-${version}';
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(cacheName).then(cache => {
      return cache.addAll([
        '/SunBible/Prophets/Prophets.html',
        'https://the-sunshining.github.io/sunshining-photography/docs/img/2020/img/sun_25.jpg',
        'https://the-sunshining.github.io/sunshining-photography/docs/img/2020/img/fall_leaves_trees_10.jpg',
        'https://the-sunshining.github.io/SunBible_IMG_Library/Head_IMG/Prophets/Isaiah.png',
        'https://the-sunshining.github.io/SunBible_IMG_Library/Head_IMG/Prophets/Jeremiah.png',
        'https://the-sunshining.github.io/SunBible_IMG_Library/Head_IMG/Prophets/Lamentations.png',
        'https://the-sunshining.github.io/SunBible_IMG_Library/Head_IMG/Prophets/Ezekiel.png',
        'https://the-sunshining.github.io/SunBible_IMG_Library/Head_IMG/Prophets/Daniel.png',
        'https://the-sunshining.github.io/SunBible_IMG_Library/Head_IMG/Prophets/Hosea.png',
        'https://the-sunshining.github.io/SunBible_IMG_Library/Head_IMG/Prophets/Joel.png',
        'https://the-sunshining.github.io/SunBible_IMG_Library/Head_IMG/Prophets/Amos.png',
        'https://the-sunshining.github.io/SunBible_IMG_Library/Head_IMG/Prophets/Obadiah.png',
        'https://the-sunshining.github.io/SunBible_IMG_Library/Head_IMG/Prophets/Jonah.png',
        'https://the-sunshining.github.io/SunBible_IMG_Library/Head_IMG/Prophets/Micah.png',
        'https://the-sunshining.github.io/SunBible_IMG_Library/Head_IMG/Prophets/Nahum.png',
        'https://the-sunshining.github.io/SunBible_IMG_Library/Head_IMG/Prophets/Habakkuk.png',
        'https://the-sunshining.github.io/SunBible_IMG_Library/Head_IMG/Prophets/Zephaniah.png',
        'https://the-sunshining.github.io/SunBible_IMG_Library/Head_IMG/Prophets/Haggai.png',
        'https://the-sunshining.github.io/SunBible_IMG_Library/Head_IMG/Prophets/Zechariah.png',
        'https://the-sunshining.github.io/SunBible_IMG_Library/Head_IMG/Prophets/Malachi.png'
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