// Service Worker for Melanie Wainwright's vocal coaching website
const CACHE_NAME = 'melanie-vocal-coach-cache-v2';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/css/style.css',
  '/js/main.js',
];

// Media file types that may return 206 Partial Content responses
const RANGE_REQUEST_MEDIA_TYPES = [
  '.mp3',
  '.mp4',
  '.webm',
  '.avi',
  '.mov',
  '.ogg',
  '.wav'
];

// Check if URL is for a media file that might use range requests
function isMediaFile(url) {
  return RANGE_REQUEST_MEDIA_TYPES.some(type => url.endsWith(type));
}

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

// Main fetch event handler
self.addEventListener('fetch', event => {
  // Skip range requests for media files as they will be handled by a dedicated handler
  if (event.request.headers.has('range') || isMediaFile(event.request.url)) {
    return;
  }

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
            // Check if valid response and NOT a 206 Partial Content response
            if (!response || response.status !== 200 || response.status === 206) {
              // Don't cache non-200 responses or 206 (Partial Content) responses
              return response;
            }
            
            // Clone the response to use it multiple times
            const responseToCache = response.clone();
            
            // Open cache and store the response
            caches.open(CACHE_NAME)
              .then(cache => {
                try {
                  cache.put(event.request, responseToCache);
                  console.log('Service worker caching new resource:', event.request.url);
                } catch (error) {
                  console.error('Failed to cache resource:', error);
                }
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

// Separate handler for range requests
self.addEventListener('fetch', event => {
  // Only handle Range requests
  if (event.request.headers.has('range') || isMediaFile(event.request.url)) {
    event.respondWith(handleRangeRequest(event.request));
  }
});

async function handleRangeRequest(request) {
  // For range requests, always go to network
  try {
    // Just return the network response without caching
    return await fetch(request);
  } catch (error) {
    console.error('Range request fetch failed:', error);
    
    // Try to return a full cached version if available
    try {
      // Create a non-range version of the request
      const nonRangeRequest = new Request(request.url, {
        method: request.method,
        headers: new Headers(request.headers),
        mode: request.mode,
        credentials: request.credentials,
        redirect: request.redirect,
        referrer: request.referrer
      });
      
      // Remove the range header
      nonRangeRequest.headers.delete('range');
      
      const cachedResponse = await caches.match(nonRangeRequest);
      if (cachedResponse) return cachedResponse;
    } catch (cacheError) {
      console.error('Cache fallback failed:', cacheError);
    }
    
    // If there's no cached response, return a network error
    return new Response('Network error', { status: 503 });
  }
} 