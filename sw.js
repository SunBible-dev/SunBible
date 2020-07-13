/*
 *
 *  SunBible
 *  Copyright 2020 The SunShining All rights reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License
 *
 */

const version = "0.1.30";
const cacheName = 'SunBible-${version}';
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(cacheName).then(cache => {
      return cache.addAll([
        '/SunBible/',
        '/SunBible/index.html',

        '/SunBible/BibleStyle',
        '/SunBible/BibleStyle/ScrollBarStyleONE.css',
        '/SunBible/BibleStyle/DivStyle.css',
        '/SunBible/BibleStyle/ActsStyle.css',
        '/SunBible/BibleStyle/TorahStyle.css',
        '/SunBible/BibleStyle/his-story-of-style.css',
        '/SunBible/BibleStyle/iconBAR.css',
        '/SunBible/BibleStyle/JobStyle.css',
        '/SunBible/BibleStyle/LongestStyleSheet.css',
        '/SunBible/BibleStyle/MountainStyle.css',
        '/SunBible/BibleStyle/PaulStyle.css',
        '/SunBible/BibleStyle/Ephesians.css',
        '/SunBible/BibleStyle/Philippians.css',
        '/SunBible/BibleStyle/ProphetsStyle.css',
        '/SunBible/BibleStyle/PsalmStyle.css',
        '/SunBible/BibleStyle/RevelationStyle.css',
        '/SunBible/BibleStyle/scrollToTop.css',
        '/SunBible/BibleStyle/SomeWisdomStyle.css',
        '/SunBible/BibleStyle/SunOnJamesStyle.css',

        '/SunBible/Photos/',
        '/SunBible/Photos/SNBible.png',

        '/SunBible/BibleScript',
        '/SunBible/BibleScript/SunBibleScript-main.js',
        '/SunBible/BibleScript/jquery-3.4.1.js',
        '/SunBible/BibleScript/MoreHomeScript.js',
        '/SunBible/BibleScript/NEWtestamentBOOKchapters.js',
        '/SunBible/BibleScript/RevOvercomerScript.js',
        '/SunBible/BibleScript/SHOWorHIDEbookCHAPTERS.js',
        '/SunBible/BibleScript/scrollToTop.js',
        '/SunBible/BibleScript/SunBibleMemorization',
        '/SunBible/BibleScript/SunBibleMemorization/SunOnJamesMemoryScript.js',


        '/SunBible/Genesis.html',
        '/SunBible/Exodus.html',
        '/SunBible/Leviticus.html',
        '/SunBible/Numbers.html',
        '/SunBible/Deuteronomy.html',

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

        '/SunBible/PaulineEpistles.html',
        '/SunBible/Romans.html',
        '/SunBible/1Corinthians.html',
        '/SunBible/2Corinthians.html',
        '/SunBible/Galatians.html',
        '/SunBible/Ephesians.html',
        '/SunBible/Philippians.html',
        '/SunBible/Colossians.html',
        '/SunBible/1Thessalonians.html',
        '/SunBible/2Thessalonians.html',
        '/SunBible/1Timothy.html',
        '/SunBible/2Timothy.html',
        '/SunBible/Titus.html',
        '/SunBible/Philemon.html',

        '/SunBible/GeneralEpistles.html',
        '/SunBible/Hebrews.html',
        '/SunBible/Peter.html',
        '/SunBible/123John.html',
        '/SunBible/Jude.html',


        '/SunBible/Revelation.html'
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