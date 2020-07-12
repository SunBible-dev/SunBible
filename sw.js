var APP_PREFIX = 'SunBible'     // Identifier for this app (this needs to be consistent across every cache update)
var VERSION = 'version_01'              // Version of the off-line cache (change this value everytime you want to update cache)
var CACHE_NAME = 'SunBible_01'
var URLS = [ 
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
    ]

    // Respond with cached resources
    self.addEventListener('fetch', function (e) {
      console.log('fetch request : ' + e.request.url)
      e.respondWith(
        caches.match(e.request).then(function (request) {
          if (request) { // if cache is available, respond with cache
            console.log('responding with cache : ' + e.request.url)
            return request
          } else {       // if there are no cache, try fetching request
            console.log('file is not cached, fetching : ' + e.request.url)
            return fetch(e.request)
          }
    
          // You can omit if/else for console.log & put one line below like this too.
          // return request || fetch(e.request)
        })
      )
    })
    
    // Cache resources
    self.addEventListener('install', function (e) {
      e.waitUntil(
        caches.open(CACHE_NAME).then(function (cache) {
          console.log('installing cache : ' + CACHE_NAME)
          return cache.addAll(URLS)
        })
      )
    })
    
    // Delete outdated caches
    self.addEventListener('activate', function (e) {
      e.waitUntil(
        caches.keys().then(function (keyList) {
          // `keyList` contains all cache names under your username.github.io
          // filter out ones that has this app prefix to create white list
          var cacheWhitelist = keyList.filter(function (key) {
            return key.indexOf(APP_PREFIX)
          })
          // add current cache name to white list
          cacheWhitelist.push(CACHE_NAME)
    
          return Promise.all(keyList.map(function (key, i) {
            if (cacheWhitelist.indexOf(key) === -1) {
              console.log('deleting cache : ' + keyList[i] )
              return caches.delete(keyList[i])
            }
          }))
        })
      )
    })