// Service Worker for Melanie Wainwright's vocal coaching website
const CACHE_NAME = 'melanie-vocal-coach-cache-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/css/style.css',
  '/js/main.js',
];

// On install, cache the static assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service worker caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
  );
});

// Clean up old caches on activation
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Service worker deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Fetch event handler with fix for 206 Partial Content responses
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        // Return cached response if found
        if (cachedResponse) {
          return cachedResponse;
        }
        
        // Clone the request to use multiple times
        const fetchRequest = event.request.clone();
        
        return fetch(fetchRequest)
          .then(response => {
            // Check if valid response
            if (!response || response.status !== 200) {
              // Don't cache non-200 responses or 206 (Partial Content) responses
              return response;
            }
            
            // Clone the response to use it multiple times
            const responseToCache = response.clone();
            
            // Open cache and store the response
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
                console.log('Service worker caching new resource:', event.request.url);
              });
              
            return response;
          })
          .catch(error => {
            console.error('Service worker fetch failed:', error);
            // You can return a custom offline page here if needed
          });
      })
  );
});

// Handle media files with Range requests separately
self.addEventListener('fetch', event => {
  // Only handle Range requests separately
  if (event.request.headers.has('range')) {
    event.respondWith(handleRangeRequest(event.request));
  }
});

async function handleRangeRequest(request) {
  // For range requests, always go to network
  try {
    return await fetch(request);
  } catch (error) {
    console.error('Range request fetch failed:', error);
    // Fall back to a non-range request from cache if available
    const nonRangeRequest = new Request(request.url, {
      method: request.method,
      headers: request.headers,
      mode: request.mode,
      credentials: request.credentials,
      redirect: request.redirect,
      referrer: request.referrer
    });
    
    // Remove the range header
    nonRangeRequest.headers.delete('range');
    
    const cachedResponse = await caches.match(nonRangeRequest);
    if (cachedResponse) return cachedResponse;
    
    // If there's no cached response, return a network error
    return new Response('Network error', { status: 503 });
  }
} 