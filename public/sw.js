// Service Worker for Advanced Caching
const STATIC_CACHE = 'nees-static-v2';
const DYNAMIC_CACHE = 'nees-dynamic-v2';

// Assets to cache immediately
const STATIC_ASSETS = [
  '/assets/css/luxury-skincare.css',
  '/assets/css/font-awesome-pro.css',
  '/assets/css/flaticon_shofy.css',
  '/assets/fonts/fa-light-300.woff2',
  '/assets/fonts/fa-solid-900.woff2',
  '/assets/fonts/fa-regular-400.woff2',
  '/assets/fonts/fa-brands-400.woff2',
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => self.clients.claim())
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Never cache HTML navigations; this avoids stale page shells and refresh loops.
  if (request.mode === 'navigate') {
    event.respondWith(fetch(request));
    return;
  }

  // Skip external requests (except for assets)
  if (url.origin !== location.origin && !url.hostname.includes('vercel.app')) return;

  // Keep Next.js internals network-first
  if (url.pathname.startsWith('/_next/')) {
    event.respondWith(fetch(request));
    return;
  }

  // For static assets, cache-first
  if (isStaticAsset(url.pathname)) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        return cachedResponse || fetchAndCache(request, STATIC_CACHE);
      })
    );
    return;
  }

  // For API requests, network-first with cache fallback
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(networkFirst(request));
    return;
  }

  // Default: fetch from network
  event.respondWith(fetch(request));
});

// Helper functions
function isStaticAsset(pathname) {
  return pathname.startsWith('/assets/') || 
         pathname.startsWith('/_next/static/') ||
         pathname.includes('.woff2') ||
         pathname.includes('.css') ||
         pathname.includes('.js');
}

function fetchAndCache(request, cacheName) {
  return fetch(request)
    .then((response) => {
      // Don't cache non-successful responses
      if (!response.ok) return response;

      // Clone the response
      const responseClone = response.clone();

      // Cache the response
      caches.open(cacheName)
        .then((cache) => {
          cache.put(request, responseClone);
        });

      return response;
    });
}

function networkFirst(request) {
  return fetch(request)
    .then((networkResponse) => {
      if (networkResponse.ok) {
        const responseClone = networkResponse.clone();
        caches.open(DYNAMIC_CACHE).then((cache) => cache.put(request, responseClone));
      }
      return networkResponse;
    })
    .catch(() => caches.match(request));
}
