// Service Worker for PWA functionality
const CACHE_NAME = 'serene-start-page-v1.0.0';
const urlsToCache = [
  '/',
  '/index.html',
  '/css/main.css',
  '/css/theme.css',
  '/js/app.js',
  '/js/clock.js',
  '/js/search.js',
  '/js/bookmarks.js',
  '/js/todo.js',
  '/js/notes.js',
  '/js/news.js',
  '/js/weather.js',
  '/js/system-info.js',
  '/js/toast.js',
  '/js/theme.js',
  '/js/widgets.js',
  '/js/error-handler.js',
  '/js/favicon-service.js',
  '/js/background.js',
  '/js/shortcuts.js'
];

// Install event
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cached version or fetch from network
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});

// Activate event
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
}); 