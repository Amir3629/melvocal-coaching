/**
 * Enhanced Service Worker for Melvocal Coaching
 * Provides advanced caching strategies and offline support
 */
const CACHE_VERSION = 'v2';
const CACHE_NAME = `melvocal-${CACHE_VERSION}`;

// Define cache categories for different resources
const CACHES = {
  static: `${CACHE_NAME}-static`,  // Long-lived static assets
  images: `${CACHE_NAME}-images`,  // Image assets
  pages: `${CACHE_NAME}-pages`,    // HTML pages
  fonts: `${CACHE_NAME}-fonts`,    // Font files
  api: `${CACHE_NAME}-api`         // API responses
};

// Assets that should be cached immediately during installation
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/index-perf.html',
  '/offline.html',
  '/critical-perf.js',
  '/css-optimizer.js',
  '/tbt-optimizer.js',
  '/lcp-optimizer.js',
  '/js-execution-optimizer.js',
  '/js-bundle-analyzer.js',
  '/image-optimizations.js',
  '/enhanced-image-optimizer.js',
  '/fix.min.js',
  '/css-purger.js',
  '/images/backgrounds/hero-bg.webp',
  '/images/logo/ml-logo.webp',
  '/images/placeholders/avatar.svg',
  '/_next/static/css/e3294716e1c0f397.css'
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
    Promise.all([
      // Cache static assets
      caches.open(CACHES.static).then(cache => {
        console.log('Caching static assets');
        return cache.addAll(precacheUrls);
      }),
      
      // Activate immediately without waiting for tabs to close
      self.skipWaiting()
    ])
  );
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
  const url = new URL(event.request.url);
  const requestPath = url.pathname;
  
  // Skip cross-origin requests
  if (url.origin !== self.location.origin && 
      !url.hostname.endsWith('github.io')) {
    return;
  }
  
  // Apply different strategies based on request type
  if (/\.(jpe?g|png|webp|gif|svg)$/i.test(requestPath)) {
    // Image caching strategy - Cache first, network fallback
    event.respondWith(cacheFirstStrategy(event.request, CACHES.images));
  } 
  else if (requestPath.endsWith('/') || requestPath.endsWith('.html')) {
    // HTML caching strategy - Network first, cache fallback
    event.respondWith(networkFirstStrategy(event.request, CACHES.pages));
  }
  else if (/\.(js|css)$/i.test(requestPath)) {
    // Static asset strategy - Cache first, network fallback with update
    event.respondWith(cacheFirstStrategy(event.request, CACHES.static));
  }
  else if (/\.(woff2?|eot|ttf|otf)$/i.test(requestPath)) {
    // Font caching strategy - Cache first, network fallback
    event.respondWith(cacheFirstStrategy(event.request, CACHES.fonts));
  }
  else {
    // Default strategy - Network first, cache fallback
    event.respondWith(networkFirstStrategy(event.request, CACHES.static));
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
function isImageRequest(path) {
  return /\.(jpe?g|png|webp|gif|bmp|svg|ico)$/i.test(path);
}

function isHtmlRequest(path) {
  return path.endsWith('/') || path.endsWith('.html') || path === BASE_PATH;
}

function isStaticAsset(path) {
  return /\.(js|css)$/i.test(path) || 
         path.includes('static') || 
         path.includes('_next');
}

function isFontRequest(path) {
  return /\.(woff2?|eot|ttf|otf)$/i.test(path) ||
         path.includes('fonts');
}

function isApiRequest(url) {
  return url.pathname.includes('/api/') || 
         url.pathname.includes('/data/');
}

// Cache-first strategy
async function cacheFirstStrategy(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse) {
    // Return cached response
    return cachedResponse;
  }
  
  try {
    // Get from network
    const networkResponse = await fetch(request);
    
    // Cache the response
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log(`Fetch failed for ${request.url}:`, error);
    
    // Return fallback response for images
    if (request.url.match(/\.(jpe?g|png|webp|gif|svg)$/i)) {
      return new Response('', {
        headers: { 'Content-Type': 'image/svg+xml' }
      });
    }
    
    // Return generic offline response
    return new Response('Network error', {
      status: 408,
      headers: { 'Content-Type': 'text/plain' }
    });
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
