console.log("Service Worker script loaded");

// Define a name for our cache
const CACHE_NAME = "my-pwa-shell-v1";

// Define the files that make up our app shell
const urlsToCache = [
  "/",
  "/index.html",
  "/styles.css",
  "/main.js",
  "/manifest.json",
  "/media/logo-512.png",
  "/media/logo-192.png",
  // Add any other core files your app depends on
];

// 'self' refers to the service worker's global scope
self.addEventListener("install", (event) => {
  console.log("Service Worker: Installing...");

  // event.waitUntil() ensures the service worker doesn't install
  // until the code inside has completed.
  event.waitUntil(
    // Open our cache by name
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        console.log("Service Worker: Caching app shell");
        // Add all the app shell files to the cache
        return cache.addAll(urlsToCache);
      })
      .catch((error) => {
        console.error("Failed to cache app shell:", error);
      })
  );
});

self.addEventListener("activate", (event) => {
  console.log("Service Worker: Activating...");
  // We'll add cache management logic here in a future lesson
});

// Listen for fetch events
self.addEventListener("fetch", (event) => {
  // We use event.respondWith() to take control of the response.
  event.respondWith(
    // caches.match() looks for a matching request in all caches.
    caches.match(event.request).then((cachedResponse) => {
      // If a cached response is found, return it.
      if (cachedResponse) {
        console.log("Serving from cache:", event.request.url);
        return cachedResponse;
      }

      // If not found in cache, fetch it from the network.
      console.log("Fetching from network:", event.request.url);
      return fetch(event.request);
    })
  );
});
