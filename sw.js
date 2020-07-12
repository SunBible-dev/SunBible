


self.addEventListener('install', function(e) {
 e.waitUntil(
   caches.open('SunBible').then(function(cache) {
     return cache.addAll([
       '/',
       'index.html',
       'BibleStyle/StudyBibleInStyle.css',
       'BibleScript/SunBibleScript-main.js',
     ]);
   })
 );
});







self.addEventListener('fetch', function(event) {
    console.log(event.request.url);
   
    event.respondWith(
      caches.match(event.request).then(function(response) {
        return response || fetch(event.request);
      })
    );
   });