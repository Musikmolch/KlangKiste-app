const CACHE_NAME = 'klangkiste-v1';
const urlsToCache = [
  './',
  './index_phase_6_v6.html',
  './manifest.json',
  './sounds/bariton_g3.mp3',
  './sounds/bariton_a3.mp3',
  './sounds/bariton_h3.mp3',
  './sounds/bariton_c4.mp3',
  './sounds/bariton_d4.mp3',
  './sounds/bariton_e4.mp3',
  './sounds/bariton_f4.mp3',
  './sounds/bariton_g4.mp3',
  './sounds/sopran_g4.mp3',
  './sounds/sopran_a4.mp3',
  './sounds/sopran_h4.mp3',
  './sounds/sopran_c5.mp3',
  './sounds/sopran_d5.mp3',
  './sounds/sopran_e5.mp3',
  './sounds/sopran_f5.mp3',
  './sounds/sopran_g5.mp3',
  './sounds/akkord_c_dur.mp3',
  './sounds/akkord_g_dur.mp3',
  './sounds/akkord_f_dur.mp3',
  './sounds/akkord_d_dur.mp3',
  './sounds/akkord_a_moll.mp3',
  './sounds/metronome_accent.mp3',
  './sounds/metronome_normal.mp3'
];

self.addEventListener('install', event => {
  console.log('✅ Service Worker: Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('📦 Service Worker: Caching files...');
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  console.log('🔄 Service Worker: Activating...');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('🗑️ Service Worker: Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request).then(response => {
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }
          const responseToCache = response.clone();
          caches.open(CACHE_NAME)
            .then(cache => {
              cache.put(event.request, responseToCache);
            });
          return response;
        });
      })
  );
});
