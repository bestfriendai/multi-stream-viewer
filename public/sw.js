// Advanced Service Worker for Streamyyy
// Optimized for Core Web Vitals and SEO performance

const CACHE_NAME = 'streamyyy-v2.0.0'
const STATIC_CACHE = 'streamyyy-static-v2.0.0'
const DYNAMIC_CACHE = 'streamyyy-dynamic-v2.0.0'
const IMAGE_CACHE = 'streamyyy-images-v2.0.0'

// Critical resources to cache immediately
const CRITICAL_RESOURCES = [
  '/',
  '/manifest.json',
  '/streamyyy-logo-192.png',
  '/streamyyy-logo-512.png',
  '/streamyyy-favicon.ico'
]

// Static assets to cache
const STATIC_ASSETS = [
  '/blog',
  '/16-stream-viewer',
  '/mobile-multi-stream',
  '/free-multi-stream-viewer',
  '/unified-chat-multi-stream'
]

// Network-first resources (always fresh when online)
const NETWORK_FIRST = [
  '/api/',
  '/auth/',
  '/_next/static/chunks/'
]

// Cache-first resources (static assets)
const CACHE_FIRST = [
  '/_next/static/',
  '/images/',
  '/icons/',
  '.css',
  '.js',
  '.woff2',
  '.woff',
  '.ttf'
]

self.addEventListener('install', event => {
  console.log('[SW] Installing service worker...')
  
  event.waitUntil(
    Promise.all([
      // Cache critical resources immediately
      caches.open(STATIC_CACHE).then(cache => {
        console.log('[SW] Caching critical resources')
        return cache.addAll(CRITICAL_RESOURCES)
      }),
      // Cache static pages
      caches.open(DYNAMIC_CACHE).then(cache => {
        console.log('[SW] Caching static pages')
        return cache.addAll(STATIC_ASSETS)
      })
    ]).then(() => {
      console.log('[SW] Installation complete')
      return self.skipWaiting()
    })
  )
})

self.addEventListener('activate', event => {
  console.log('[SW] Activating service worker...')
  
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          // Clean up old caches
          if (cacheName !== STATIC_CACHE && 
              cacheName !== DYNAMIC_CACHE && 
              cacheName !== IMAGE_CACHE &&
              cacheName !== CACHE_NAME) {
            console.log('[SW] Deleting old cache:', cacheName)
            return caches.delete(cacheName)
          }
        })
      )
    }).then(() => {
      console.log('[SW] Activation complete')
      return self.clients.claim()
    })
  )
})

self.addEventListener('fetch', event => {
  const { request } = event
  const url = new URL(request.url)
  
  // Skip non-GET requests
  if (request.method !== 'GET') return
  
  // Skip external requests (except for fonts and critical resources)
  if (url.origin !== location.origin && !isCriticalExternalResource(url)) {
    return
  }

  // Route requests based on resource type
  if (isNetworkFirst(request.url)) {
    event.respondWith(networkFirst(request))
  } else if (isCacheFirst(request.url)) {
    event.respondWith(cacheFirst(request))
  } else if (isImageRequest(request.url)) {
    event.respondWith(imageStrategy(request))
  } else {
    event.respondWith(staleWhileRevalidate(request))
  }
})

// Network-first strategy (for dynamic content)
async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request)
    
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE)
      cache.put(request, networkResponse.clone())
    }
    
    return networkResponse
  } catch (error) {
    console.log('[SW] Network failed, trying cache:', request.url)
    const cachedResponse = await caches.match(request)
    
    if (cachedResponse) {
      return cachedResponse
    }
    
    // Return offline page for navigation requests
    if (request.mode === 'navigate') {
      return caches.match('/')
    }
    
    throw error
  }
}

// Cache-first strategy (for static assets)
async function cacheFirst(request) {
  const cachedResponse = await caches.match(request)
  
  if (cachedResponse) {
    return cachedResponse
  }
  
  try {
    const networkResponse = await fetch(request)
    
    if (networkResponse.ok) {
      const cache = await caches.open(STATIC_CACHE)
      cache.put(request, networkResponse.clone())
    }
    
    return networkResponse
  } catch (error) {
    console.log('[SW] Failed to fetch:', request.url)
    throw error
  }
}

// Stale-while-revalidate strategy (for most resources)
async function staleWhileRevalidate(request) {
  const cache = await caches.open(DYNAMIC_CACHE)
  const cachedResponse = await cache.match(request)
  
  const fetchPromise = fetch(request).then(networkResponse => {
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone())
    }
    return networkResponse
  }).catch(error => {
    console.log('[SW] Network fetch failed:', request.url)
    return cachedResponse
  })
  
  return cachedResponse || fetchPromise
}

// Optimized image caching strategy
async function imageStrategy(request) {
  const cache = await caches.open(IMAGE_CACHE)
  const cachedResponse = await cache.match(request)
  
  if (cachedResponse) {
    // Return cached image immediately, but update in background
    fetch(request).then(networkResponse => {
      if (networkResponse.ok) {
        cache.put(request, networkResponse.clone())
      }
    }).catch(() => {
      // Ignore network errors for background updates
    })
    
    return cachedResponse
  }
  
  try {
    const networkResponse = await fetch(request)
    
    if (networkResponse.ok) {
      // Cache images with longer expiration
      cache.put(request, networkResponse.clone())
    }
    
    return networkResponse
  } catch (error) {
    console.log('[SW] Image fetch failed:', request.url)
    
    // Return placeholder or fallback image if available
    const fallback = await cache.match('/images/placeholder.jpg')
    return fallback || new Response('', { status: 404 })
  }
}

// Helper functions
function isNetworkFirst(url) {
  return NETWORK_FIRST.some(pattern => url.includes(pattern))
}

function isCacheFirst(url) {
  return CACHE_FIRST.some(pattern => url.includes(pattern))
}

function isImageRequest(url) {
  return /\.(jpg|jpeg|png|gif|webp|svg|ico)$/i.test(url)
}

function isCriticalExternalResource(url) {
  // Allow critical external resources (fonts, CDN assets)
  const criticalDomains = [
    'fonts.googleapis.com',
    'fonts.gstatic.com',
    'cdn.jsdelivr.net'
  ]
  
  return criticalDomains.some(domain => url.hostname.includes(domain))
}

// Background sync for offline actions
self.addEventListener('sync', event => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync())
  }
})

async function doBackgroundSync() {
  console.log('[SW] Performing background sync')
  
  try {
    // Sync any pending user actions
    const pendingActions = await getStoredActions()
    
    for (const action of pendingActions) {
      await syncAction(action)
    }
    
    await clearStoredActions()
    console.log('[SW] Background sync complete')
  } catch (error) {
    console.log('[SW] Background sync failed:', error)
  }
}

async function getStoredActions() {
  // Get pending actions from IndexedDB or localStorage
  return []
}

async function syncAction(action) {
  // Sync individual action when back online
  return fetch(action.url, action.options)
}

async function clearStoredActions() {
  // Clear synced actions from storage
}

// Push notification handling
self.addEventListener('push', event => {
  if (!event.data) return
  
  const data = event.data.json()
  const options = {
    body: data.body,
    icon: '/streamyyy-logo-192.png',
    badge: '/streamyyy-logo-192.png',
    data: data.data,
    actions: [
      {
        action: 'view',
        title: 'View Stream',
        icon: '/icons/view.png'
      },
      {
        action: 'dismiss',
        title: 'Dismiss',
        icon: '/icons/dismiss.png'
      }
    ]
  }
  
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  )
})

// Notification click handling
self.addEventListener('notificationclick', event => {
  event.notification.close()
  
  if (event.action === 'view') {
    event.waitUntil(
      clients.openWindow(event.notification.data.url || '/')
    )
  }
})

// Performance monitoring
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
  
  if (event.data && event.data.type === 'GET_CACHE_STATUS') {
    getCacheStatus().then(status => {
      event.ports[0].postMessage(status)
    })
  }
})

async function getCacheStatus() {
  const cacheNames = await caches.keys()
  const status = {}
  
  for (const cacheName of cacheNames) {
    const cache = await caches.open(cacheName)
    const keys = await cache.keys()
    status[cacheName] = keys.length
  }
  
  return status
}

console.log('[SW] Service worker loaded successfully')
