/**
 * Enhanced Service Worker for Melvocal Coaching
 * Provides advanced caching strategies and offline support
 */
const CACHE_VERSION = 'v2';
const CACHES = {
  static: `${CACHE_NAME}-static`,  // Long-lived static assets
  images: `${CACHE_NAME}-images`,  // Image assets
  pages: `${CACHE_NAME}-pages`,    // HTML pages
  fonts: `${CACHE_NAME}-fonts`,    // Font files
  api: `${CACHE_NAME}-api`         // API responses
};

// Update the precache assets list to remove any non-existent files
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/offline.html',
  '/css-optimizer.js',
  '/fix.js',
  '/critical-perf.js', 
  '/image-optimizations.js',
  '/tbt-optimizer.js',
  '/enhanced-image-optimizer.js',
  '/js-bundle-analyzer.js',
  '/images/backgrounds/hero-bg.webp',
  '/images/logo/ml-logo.PNG',
  '/images/backgrounds/services-bg.webp',
  '/images/backgrounds/contact-bg.jpg'
];

// Add base path for GitHub Pages if needed
const isGitHubPages = self.location.hostname === 'amir3629.github.io';
const BASE_PATH = isGitHubPages ? '/melvocal-coaching' : '';

// Adjust precache assets paths for GitHub Pages
const precacheUrls = PRECACHE_ASSETS.map(url => 
  isGitHubPages ? BASE_PATH + url : url
);

// Cache expiration times
const EXPIRATION = {
  static: 30 * 24 * 60 * 60, // 30 days for static assets
  images: 7 * 24 * 60 * 60,  // 7 days for images
  pages: 24 * 60 * 60,       // 1 day for HTML pages
  fonts: 90 * 24 * 60 * 60,  // 90 days for fonts
  api: 60 * 60               // 1 hour for API responses
};

// ============= Install Event - Precache Critical Resources =============
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHES.static).then(cache => {
      console.log('Caching static assets');
      // Use individual fetch operations with error handling instead of cache.addAll
      return Promise.all(
        PRECACHE_ASSETS.map(url => {
          return fetch(url)
            .then(response => {
              if (response.ok) {
                return cache.put(url, response);
              }
              console.log(`Failed to cache: ${url} - Status: ${response.status}`);
              return Promise.resolve(); // Continue with other assets
            })
            .catch(error => {
              console.error(`Error caching ${url}:`, error);
              return Promise.resolve(); // Continue with other assets
            });
        })
      );
    })
  );
  
  // Force the waiting service worker to become the active service worker
  self.skipWaiting();
});

// ============= Activate Event - Clean Up Old Caches =============
self.addEventListener('activate', event => {
  event.waitUntil(
    Promise.all([
      // Clean up old caches
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames
            .filter(cacheName => {
              // Delete old version caches
              return cacheName.startsWith('melvocal-') && 
                     !Object.values(CACHES).includes(cacheName);
            })
            .map(cacheName => {
              console.log(`Deleting outdated cache: ${cacheName}`);
              return caches.delete(cacheName);
            })
        );
      }),
      
      // Take control of all clients
      self.clients.claim()
    ])
  );
});

// ============= Fetch Event - Strategic Caching =============
self.addEventListener('fetch', event => {
  const request = event.request;
  const url = new URL(request.url);
  
  // Don't cache cross-origin requests to avoid complications
  if (url.origin !== self.location.origin) {
    event.respondWith(fetch(request));
    return;
  }
  
  // Special handling for video requests - use network only strategy
  if (isVideoRequest(request)) {
    event.respondWith(networkOnlyStrategy(request));
    return;
  }
  
  // Handle other request types with appropriate caching strategies
  if (isImageRequest(request)) {
    event.respondWith(cacheFirstWithNetwork(request, CACHES.images));
  } else if (isHtmlRequest(request)) {
    event.respondWith(networkFirstStrategy(request, CACHES.pages));
  } else if (isStaticAsset(request)) {
    event.respondWith(cacheFirstWithNetwork(request, CACHES.static));
  } else if (isFontRequest(request)) {
    event.respondWith(cacheFirstWithNetwork(request, CACHES.fonts));
  } else if (isApiRequest(request)) {
    event.respondWith(networkFirstStrategy(request, CACHES.api));
  } else {
    event.respondWith(cacheFirstWithNetwork(request, CACHES.static));
  }
});

// ============= Message Event - Handle Messages from Client =============
self.addEventListener('message', event => {
  const data = event.data;
  
  // Handle skip waiting message
  if (data.type === 'SKIP_WAITING') {
    self.skipWaiting();
    return;
  }
  
  // Handle additional URLs to cache
  if (data.type === 'CACHE_URLS' && Array.isArray(data.urls)) {
    event.waitUntil(
      caches.open(CACHES.static).then(cache => {
        return cache.addAll(data.urls);
      })
    );
    return;
  }
  
  // Handle storing form data for offline submission
  if (data.type === 'STORE_FORM' && data.url && data.data) {
    event.waitUntil(
      storeOfflineForm(data.url, data.data)
    );
    return;
  }
  
  // Handle offline analytics data
  if (data.type === 'STORE_ANALYTICS' && data.data) {
    event.waitUntil(
      storeOfflineAnalytics(data.data)
    );
    return;
  }
});

// ============= Sync Event - Background Sync =============
self.addEventListener('sync', event => {
  if (event.tag === 'sync-forms') {
    event.waitUntil(syncOfflineForms());
  }
  
  if (event.tag === 'sync-analytics') {
    event.waitUntil(syncOfflineAnalytics());
  }
});

// ============= Helper Functions =============

// Function to detect request types
function isImageRequest(request) {
  const url = new URL(request.url);
  return /\.(jpe?g|png|webp|gif|svg|ico)$/i.test(url.pathname);
}

function isHtmlRequest(request) {
  const url = new URL(request.url);
  return url.pathname.endsWith('/') || 
         url.pathname.endsWith('.html') || 
         url.pathname === '/';
}

function isStaticAsset(request) {
  const url = new URL(request.url);
  return /\.(js|css)$/i.test(url.pathname);
}

function isFontRequest(request) {
  const url = new URL(request.url);
  return /\.(woff2?|eot|ttf|otf)$/i.test(url.pathname);
}

function isApiRequest(request) {
  const url = new URL(request.url);
  return url.pathname.startsWith('/api/');
}

// Helper function to detect if a request is for a video file
function isVideoRequest(request) {
  const url = new URL(request.url);
  return url.pathname.endsWith('.mp4') || url.pathname.endsWith('.webm') || 
         url.pathname.endsWith('.ogg') || url.pathname.endsWith('.mov');
}

// Media files (videos) strategy - Network only for video streaming
async function networkOnlyStrategy(request) {
  try {
    return await fetch(request);
  } catch (error) {
    console.error('Network error for video request:', error);
    return new Response('Video unavailable offline', { status: 503 });
  }
}

// Fixed cacheFirstWithNetwork function to check response status
async function cacheFirstWithNetwork(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse) {
    console.log('Service worker serving cached resource:', request.url);
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    
    // Only cache successful responses with status 200 (avoid 206 Partial Content)
    if (networkResponse.ok && networkResponse.status === 200) {
      console.log('Service worker caching new resource:', request.url);
      // Clone the response before caching it
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.error('Fetch failed:', error);
    // Return a fallback if available or an error response
    const fallback = await caches.match('/offline.html');
    return fallback || new Response('Network error occurred', { status: 503 });
  }
}

// Network-first strategy
async function networkFirstStrategy(request, cacheName) {
  try {
    // Try network first
    const networkResponse = await fetch(request);
    
    // Cache successful response
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log(`Network fetch failed for ${request.url}:`, error);
    
    // Fallback to cache
    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // If HTML request, try offline page
    if (request.url.match(/\.(html)$/) || request.url.endsWith('/')) {
      return caches.match('/offline.html')
        .catch(() => {
          // If offline page isn't available, return a simple message
          return new Response(
            '<html><body><h1>Offline</h1><p>Please check your connection.</p></body></html>',
            {
              headers: { 'Content-Type': 'text/html' }
            }
          );
        });
    }
    
    // Return default offline message
    return new Response('Offline content not available', {
      status: 503,
      headers: { 'Content-Type': 'text/plain' }
    });
  }
}

// ============= Utility Functions =============

// Update cache in the background
function updateCache(request, cacheName) {
  fetch(request).then(response => {
    if (response && response.status === 200) {
      caches.open(cacheName).then(cache => {
        cache.put(request, response);
      });
    }
  }).catch(error => {
    console.warn(`Background cache update failed: ${error}`);
  });
}

// Set expiration for cached items
function setExpiration(url, maxAge) {
  // Use IndexedDB or localStorage to track expiration
  // Simple implementation using localStorage
  try {
    const expirations = JSON.parse(localStorage.getItem('sw-expirations') || '{}');
    expirations[url] = Date.now() + (maxAge * 1000);
    localStorage.setItem('sw-expirations', JSON.stringify(expirations));
  } catch (e) {
    console.warn('Could not set cache expiration', e);
  }
}

// Check if cache is expired
function isExpired(url) {
  try {
    const expirations = JSON.parse(localStorage.getItem('sw-expirations') || '{}');
    const expirationTime = expirations[url];
    
    if (!expirationTime) return false;
    
    return Date.now() > expirationTime;
  } catch (e) {
    return false;
  }
}

// Clear expired caches
async function clearExpiredCaches() {
  try {
    const expirations = JSON.parse(localStorage.getItem('sw-expirations') || '{}');
    const now = Date.now();
    const expiredUrls = [];
    
    // Find expired URLs
    for (const url in expirations) {
      if (now > expirations[url]) {
        expiredUrls.push(url);
        delete expirations[url];
      }
    }
    
    // Update expirations storage
    localStorage.setItem('sw-expirations', JSON.stringify(expirations));
    
    // Clear each cache
    if (expiredUrls.length > 0) {
      const cacheNames = await caches.keys();
      
      for (const cacheName of cacheNames) {
        const cache = await caches.open(cacheName);
        
        for (const url of expiredUrls) {
          await cache.delete(url);
        }
      }
    }
  } catch (e) {
    console.warn('Error clearing expired caches', e);
  }
}

// Create an offline page response
function createOfflinePage() {
  const offlineHtml = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Offline - Mel Vocal Coaching</title>
    <style>
      body {
        font-family: system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
        background-color: #212121;
        color: white;
        margin: 0;
        padding: 0;
        height: 100vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
      }
      .container {
        max-width: 600px;
        padding: 2rem;
      }
      h1 {
        color: #b37b2c;
        font-size: 2rem;
      }
      p {
        font-size: 1.1rem;
        line-height: 1.5;
      }
      .button {
        display: inline-block;
        background-color: #b37b2c;
        color: white;
        padding: 0.8rem 1.5rem;
        border-radius: 4px;
        text-decoration: none;
        margin-top: 1rem;
        font-weight: bold;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h1>You're Offline</h1>
      <p>It looks like you're currently offline. The Mel Vocal Coaching website requires an internet connection to display the latest content.</p>
      <p>Please check your internet connection and try again.</p>
      <a href="/" class="button">Try Again</a>
    </div>
  </body>
  </html>
  `;
  
  return new Response(offlineHtml, {
    headers: { 'Content-Type': 'text/html' }
  });
}

// Create a fallback image response
function createImageFallback() {
  // Tiny transparent pixel as fallback
  const FALLBACK_IMAGE = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
  
  return fetch(FALLBACK_IMAGE)
    .catch(() => {
      // If even the data URL fetch fails, return an empty image response
      return new Response('', {
        status: 408,
        headers: { 'Content-Type': 'image/png' }
      });
    });
}

// Handle background form submission
async function handleFormSubmission() {
  const dataQueue = await getDataQueue();
  
  for (const item of dataQueue) {
    try {
      // Try to submit the form data
      const response = await fetch(item.url, {
        method: item.method,
        headers: item.headers,
        body: item.body,
        credentials: 'include'
      });
      
      if (response.ok) {
        // Success! Remove from queue
        await removeFromQueue(item.id);
      }
    } catch (error) {
      console.error('Background sync error:', error);
      // Keep in queue for next sync attempt
    }
  }
}

// Queue management
async function getDataQueue() {
  // Simple implementation using localStorage
  try {
    return JSON.parse(localStorage.getItem('form-queue') || '[]');
  } catch (e) {
    return [];
  }
}

async function removeFromQueue(id) {
  try {
    const queue = JSON.parse(localStorage.getItem('form-queue') || '[]');
    const newQueue = queue.filter(item => item.id !== id);
    localStorage.setItem('form-queue', JSON.stringify(newQueue));
  } catch (e) {
    console.error('Error removing item from queue', e);
  }
}

// Run cleanup periodically
setInterval(() => {
  clearExpiredCaches();
}, 24 * 60 * 60 * 1000); // Once per day

// Function to store offline form data
async function storeOfflineForm(url, formData) {
  try {
    // Open or create IndexedDB
    const db = await openDatabase();
    const transaction = db.transaction(['offline-forms'], 'readwrite');
    const store = transaction.objectStore('offline-forms');
    
    // Add form data to store
    await store.add({
      url: url,
      data: formData,
      timestamp: Date.now()
    });
    
    console.log('Stored offline form data');
    
    // Close the database connection
    db.close();
    
    return true;
  } catch (error) {
    console.error('Failed to store offline form data:', error);
    return false;
  }
}

// Function to store offline analytics data
async function storeOfflineAnalytics(analyticsData) {
  try {
    // Open or create IndexedDB
    const db = await openDatabase();
    const transaction = db.transaction(['offline-analytics'], 'readwrite');
    const store = transaction.objectStore('offline-analytics');
    
    // Add analytics data to store
    await store.add({
      ...analyticsData,
      stored_at: Date.now()
    });
    
    console.log('Stored offline analytics data');
    
    // Close the database connection
    db.close();
    
    // Register a sync if possible
    if (self.registration.sync) {
      await self.registration.sync.register('sync-analytics');
    }
    
    return true;
  } catch (error) {
    console.error('Failed to store offline analytics data:', error);
    return false;
  }
}

// Function to sync offline forms
async function syncOfflineForms() {
  try {
    // Open IndexedDB
    const db = await openDatabase();
    const transaction = db.transaction(['offline-forms'], 'readwrite');
    const store = transaction.objectStore('offline-forms');
    
    // Get all stored forms
    const forms = await store.getAll();
    
    // Process each form
    for (const form of forms) {
      try {
        // Attempt to submit the form
        const response = await fetch(form.url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(form.data)
        });
        
        if (response.ok) {
          // Delete from store if successful
          await store.delete(form.id);
          console.log('Successfully synced form data');
        }
      } catch (error) {
        console.error('Failed to sync form:', error);
        // Will try again next sync
      }
    }
    
    // Close the database
    db.close();
    
    return true;
  } catch (error) {
    console.error('Failed to sync offline forms:', error);
    return false;
  }
}

// Function to sync offline analytics
async function syncOfflineAnalytics() {
  try {
    // Open IndexedDB
    const db = await openDatabase();
    const transaction = db.transaction(['offline-analytics'], 'readwrite');
    const store = transaction.objectStore('offline-analytics');
    
    // Get all stored analytics data
    const analyticsItems = await store.getAll();
    
    if (analyticsItems.length > 0) {
      // Attempt to send analytics data
      try {
        // In a real app, you would send to your analytics endpoint
        console.log('Syncing offline analytics:', analyticsItems);
        
        // If successful, delete the synced items
        for (const item of analyticsItems) {
          await store.delete(item.id);
        }
      } catch (error) {
        console.error('Failed to sync analytics:', error);
        // Will try again next sync
      }
    }
    
    // Close the database
    db.close();
    
    return true;
  } catch (error) {
    console.error('Failed to sync offline analytics:', error);
    return false;
  }
}

// Helper function to open the IndexedDB database
function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('melvocal-offline-db', 1);
    
    request.onerror = event => {
      reject('IndexedDB error: ' + event.target.errorCode);
    };
    
    request.onsuccess = event => {
      resolve(event.target.result);
    };
    
    request.onupgradeneeded = event => {
      const db = event.target.result;
      
      // Create object stores if they don't exist
      if (!db.objectStoreNames.contains('offline-forms')) {
        const formsStore = db.createObjectStore('offline-forms', { keyPath: 'id', autoIncrement: true });
        formsStore.createIndex('timestamp', 'timestamp', { unique: false });
      }
      
      if (!db.objectStoreNames.contains('offline-analytics')) {
        const analyticsStore = db.createObjectStore('offline-analytics', { keyPath: 'id', autoIncrement: true });
        analyticsStore.createIndex('stored_at', 'stored_at', { unique: false });
      }
    };
  });
}
