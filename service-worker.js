// Service Worker for Picture Gallery
const CACHE_NAME = 'picture-gallery-cache-v1';
const ASSETS_TO_CACHE = [
    '/',
    '/index.html',
    '/admin.html',
    '/styles.css',
    '/admin-styles.css',
    '/script.js',
    '/admin.js',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css'
];

// Install event - cache assets
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Caching app assets');
                return cache.addAll(ASSETS_TO_CACHE);
            })
            .then(() => self.skipWaiting())
    );
});

// Activate event - clean up old caches
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
        }).then(() => self.clients.claim())
    );
});

// Fetch event - serve from cache, fall back to network
self.addEventListener('fetch', event => {
    // Skip cross-origin requests
    if (!event.request.url.startsWith(self.location.origin) &&
        !event.request.url.startsWith('https://cdnjs.cloudflare.com')) {
        return;
    }

    // For HTML requests - network first, then cache
    if (event.request.headers.get('Accept').includes('text/html')) {
        event.respondWith(
            fetch(event.request)
                .then(response => {
                    // Clone the response
                    const responseToCache = response.clone();

                    // Update the cache
                    caches.open(CACHE_NAME)
                        .then(cache => {
                            cache.put(event.request, responseToCache);
                        });

                    return response;
                })
                .catch(() => {
                    // If network fails, try the cache
                    return caches.match(event.request);
                })
        );
        return;
    }

    // For other assets - cache first, then network
    event.respondWith(
        caches.match(event.request)
            .then(cachedResponse => {
                if (cachedResponse) {
                    // Return cached response and update cache in background
                    fetch(event.request)
                        .then(response => {
                            caches.open(CACHE_NAME)
                                .then(cache => {
                                    cache.put(event.request, response.clone());
                                });
                        })
                        .catch(err => console.log('Failed to update cache:', err));

                    return cachedResponse;
                }

                // If not in cache, fetch from network
                return fetch(event.request)
                    .then(response => {
                        // Don't cache if not a valid response
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }

                        // Clone the response
                        const responseToCache = response.clone();

                        // Add to cache
                        caches.open(CACHE_NAME)
                            .then(cache => {
                                cache.put(event.request, responseToCache);
                            });

                        return response;
                    });
            })
    );
});

// Handle image caching separately for better performance
self.addEventListener('fetch', event => {
    if (event.request.url.match(/\.(jpg|jpeg|png|gif|webp)$/)) {
        event.respondWith(
            caches.match(event.request)
                .then(cachedResponse => {
                    // Return cached image immediately
                    if (cachedResponse) {
                        return cachedResponse;
                    }

                    // Fetch from network and cache
                    return fetch(event.request)
                        .then(response => {
                            // Clone the response
                            const responseToCache = response.clone();

                            // Add to cache
                            caches.open(CACHE_NAME)
                                .then(cache => {
                                    cache.put(event.request, responseToCache);
                                });

                            return response;
                        });
                })
        );
    }
}); 