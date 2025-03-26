// Service Worker for Melanie Wainwright's vocal coaching website
const CACHE_NAME = 'melvocal-coaching-v1';
const MEDIA_CACHE_NAME = 'melvocal-coaching-media-v1';

// Assets to cache
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/css/style.css',
  '/js/main.js',
  // Add other critical assets here
];

// Function to determine if a URL should be cached
function shouldCache(url) {
  // Don't cache Google Analytics, etc.
  if (url.includes('google-analytics.com') || 
      url.includes('googletagmanager.com') ||
      url.includes('analytics') ||
      url.includes('tracking')) {
    return false;
  }
  return true;
}

// Function to determine if a request is for media content
function isMediaRequest(url) {
  return url.match(/\.(mp4|webm|ogg|mp3|wav)$/i);
}

// Handle messages from the client
self.addEventListener('message', event => {
  // Respond immediately to prevent channel from closing
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
    event.ports[0].postMessage({ type: 'SKIP_WAITING_DONE' });
  }
});

// On install, cache the static assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service worker installing and caching initial assets');
        return cache.addAll(ASSETS_TO_CACHE);
      })
  );
  self.skipWaiting();
});

// Clean up old caches on activation
self.addEventListener('activate', event => {
  event.waitUntil(
    Promise.all([
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames
            .filter(cacheName => 
              cacheName !== CACHE_NAME && 
              cacheName !== MEDIA_CACHE_NAME
            )
            .map(cacheName => caches.delete(cacheName))
        );
      }),
      clients.claim()
    ])
  );
});

async function handleMediaRequest(request) {
  // For media files, try network first, then cache
  try {
    const response = await fetch(request);
    // Only cache successful, complete responses
    if (response.ok && response.status === 200) {
      const cache = await caches.open(MEDIA_CACHE_NAME);
      await cache.put(request, response.clone());
      console.log('Service worker caching media resource:', request.url);
    }
    return response;
  } catch (error) {
    // If network fails, try cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    throw error;
  }
}

async function handleRegularRequest(request) {
  // For non-media files, try cache first
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    console.log('Service worker serving cached resource:', request.url);
    return cachedResponse;
  }

  // If not in cache, get from network
  try {
    const networkResponse = await fetch(request);
    
    // Only cache successful responses
    if (networkResponse.ok && shouldCache(request.url)) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
      console.log('Service worker caching new resource:', request.url);
    }
    
    return networkResponse;
  } catch (error) {
    console.error('Service worker fetch failed:', error);
    throw error;
  }
}

self.addEventListener('fetch', (event) => {
  event.respondWith(
    (async () => {
      const url = new URL(event.request.url);
      
      // Handle media files differently
      if (isMediaRequest(url.pathname)) {
        return handleMediaRequest(event.request);
      }
      
      // Handle all other requests
      return handleRegularRequest(event.request);
    })()
  );
}); 