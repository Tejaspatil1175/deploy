const CACHE_NAME = 'disasterguard-v1';
const API_CACHE_NAME = 'disasterguard-api-v1';

const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/vite.svg'
];

const API_ENDPOINTS = [
  '/api/disasters',
  '/api/user/location',
  '/api/alerts',
  '/api/contacts'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    Promise.all([
      caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_ASSETS)),
      caches.open(API_CACHE_NAME)
    ]).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME && cacheName !== API_CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Handle API requests
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(handleApiRequest(request));
    return;
  }

  // Handle static assets
  if (request.destination === 'document' || 
      request.destination === 'script' || 
      request.destination === 'style' ||
      request.destination === 'image') {
    event.respondWith(handleStaticRequest(request));
    return;
  }
});

async function handleApiRequest(request) {
  const cache = await caches.open(API_CACHE_NAME);
  
  try {
    // Try network first for API requests
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      // Cache successful responses
      cache.put(request, networkResponse.clone());
      return networkResponse;
    }
    
    throw new Error('Network response not ok');
  } catch (error) {
    // Fallback to cache for critical endpoints
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline data for critical endpoints
    if (request.url.includes('/api/disasters')) {
      return new Response(JSON.stringify({
        disasters: [],
        message: 'Offline mode - limited data available'
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    if (request.url.includes('/api/contacts')) {
      return new Response(JSON.stringify({
        contacts: [
          { name: 'Emergency Services', number: '911', type: 'emergency' },
          { name: 'Local Police', number: '911', type: 'police' },
          { name: 'Fire Department', number: '911', type: 'fire' },
          { name: 'Medical Emergency', number: '911', type: 'medical' }
        ]
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    throw error;
  }
}

async function handleStaticRequest(request) {
  const cache = await caches.open(CACHE_NAME);
  
  // Try cache first for static assets
  const cachedResponse = await cache.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
      return networkResponse;
    }
    
    throw new Error('Network response not ok');
  } catch (error) {
    // For navigation requests, return index.html
    if (request.destination === 'document') {
      const indexResponse = await cache.match('/index.html');
      if (indexResponse) {
        return indexResponse;
      }
    }
    
    throw error;
  }
}

// Handle background sync
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(syncData());
  }
});

async function syncData() {
  // Sync any pending data when connection is restored
  const pendingData = await getStoredData('pending-sync');
  
  if (pendingData && pendingData.length > 0) {
    for (const item of pendingData) {
      try {
        await fetch(item.url, {
          method: item.method,
          headers: item.headers,
          body: item.body
        });
      } catch (error) {
        console.error('Sync failed for:', item.url, error);
      }
    }
    
    // Clear synced data
    await clearStoredData('pending-sync');
  }
}

// Push notifications
self.addEventListener('push', (event) => {
  const options = {
    body: event.data?.text() || 'Emergency alert received',
    icon: '/vite.svg',
    badge: '/vite.svg',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'view',
        title: 'View Alert',
        icon: '/vite.svg'
      },
      {
        action: 'dismiss',
        title: 'Dismiss'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('DisasterGuard Alert', options)
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'view') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Helper functions
async function getStoredData(key) {
  try {
    const cache = await caches.open('app-data');
    const response = await cache.match(`/data/${key}`);
    return response ? await response.json() : null;
  } catch (error) {
    return null;
  }
}

async function clearStoredData(key) {
  try {
    const cache = await caches.open('app-data');
    await cache.delete(`/data/${key}`);
  } catch (error) {
    console.error('Failed to clear data:', error);
  }
}