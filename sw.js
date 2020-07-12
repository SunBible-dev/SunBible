var CACHE_NAME = 'SunBible-v1';
var urlsToCache = [
        '/SunBible/',
        '/SunBible/index.html',
        '/SunBible/Photos/',
        '/SunBible/Photos/SNBible.png',
        '/SunBible/BibleStyle/StudyBibleInStyle.css',
        '/SunBible/BibleScript/SunBibleScript-main.js',
        '/SunBible/Genesis.html',
        '/SunBible/Exodus.html',
        '/SunBible/Leviticus.html',
        '/SunBible/Numbers.html',
        '/SunBible/Deuteronomy.html',
        '/SunBible/BibleStyle/TorahStyle.css',
        '/SunBible/Joshua.html',
        '/SunBible/Judges.html',
        '/SunBible/Ruth.html',
        '/SunBible/1Samuel.html',
        '/SunBible/2Samuel.html',
        '/SunBible/1Kings.html',
        '/SunBible/2Kings.html',
        '/SunBible/1Chronicles.html',
        '/SunBible/2Chronicles.html',
        '/SunBible/Ezra.html',
        '/SunBible/Nehemiah.html',
        '/SunBible/Esther.html',
        '/SunBible/Job.html',
        '/SunBible/Psalm.html',
        '/SunBible/Proverbs.html',
        '/SunBible/Ecclesiastes.html',
        '/SunBible/SongofSolomon.html',
        '/SunBible/Isaiah.html',
        '/SunBible/Jeremiah.html',
        '/SunBible/Lamentations.html',
        '/SunBible/Ezekiel.html',
        '/SunBible/Daniel.html',
        '/SunBible/Hosea.html',
        '/SunBible/Joel.html',
        '/SunBible/Amos.html',
        '/SunBible/Obadiah.html',
        '/SunBible/Jonah.html',
        '/SunBible/Micah.html',
        '/SunBible/Nahum.html',
        '/SunBible/Habakkuk.html',
        '/SunBible/Zephaniah.html',
        '/SunBible/Haggai.html',
        '/SunBible/Zechariah.html',
        '/SunBible/Malachi.html',
        '/SunBible/TheLifeofJesusMinistry/index.html',
        '/SunBible/TheLifeofJesusMinistry/Matthew.html',
        '/SunBible/TheLifeofJesusMinistry/Mark.html',
        '/SunBible/TheLifeofJesusMinistry/Luke.html',
        '/SunBible/TheLifeofJesusMinistry/John.html',
        '/SunBible/TheLifeofJesusMinistry/jesuschristlifestyle.css',
        '/SunBible/Acts.html',
        '/SunBible/BibleStyle/ActsStyle.css',
        '/SunBible/BibleStyle/PaulStyle.css',
        '/SunBible/Romans.html',
        '/SunBible/Revelation.html'
    ];

    self.addEventListener('install', function(event) {
      // Perform install steps
      event.waitUntil(
        caches.open(CACHE_NAME)
          .then(function(cache) {
            console.log('Opened cache');
            return cache.addAll(urlsToCache);
          })
      );
    });





    self.addEventListener('fetch', function(event) {
        event.respondWith(
          caches.match(event.request)
            .then(function(response) {
              // Cache hit - return response
              if (response) {
                return response;
              }
      
              return fetch(event.request).then(
                function(response) {
                  // Check if we received a valid response
                  if(!response || response.status !== 200 || response.type !== 'basic') {
                    return response;
                  }
      
                  // IMPORTANT: Clone the response. A response is a stream
                  // and because we want the browser to consume the response
                  // as well as the cache consuming the response, we need
                  // to clone it so we have two streams.
                  var responseToCache = response.clone();
      
                  caches.open(CACHE_NAME)
                    .then(function(cache) {
                      cache.put(event.request, responseToCache);
                    });
      
                  return response;
                }
              );
            })
          );
      });



      
      self.addEventListener('activate', function(event) {

        var cacheWhitelist = ['SunBible-v1'];
      
        event.waitUntil(
          caches.keys().then(function(cacheNames) {
            return Promise.all(
              cacheNames.map(function(cacheName) {
                if (cacheWhitelist.indexOf(cacheName) === -1) {
                  return caches.delete(cacheName);
                }
              })
            );
          })
        );
      });