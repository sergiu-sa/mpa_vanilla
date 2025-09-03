console.log("Service Worker script loaded");

// Define a name for our cache
const CACHE_NAME = "my-pwa-shell-v2";

// Define the files that make up our app shell
const APP_SHELL_URLS = [
  "/",
  "/index.html",
  "/styles.css",
  "/main.js",
  "/manifest.json",
  "/media/logo-512.png",
  "/media/logo-192.png",
  "https://dummyjson.com/products",
  // Add any other core files your app depends on
];

// 'self' refers to the service worker's global scope
self.addEventListener("install", (event) => {
  console.log("Service Worker: Installing...");
  event.waitUntil(
    (async () => {
      try {
        const cache = await caches.open(CACHE_NAME);
        console.log("Service Worker: Caching app shell");
        await cache.addAll(APP_SHELL_URLS);

        // Cache all product images
        try {
          const res = await fetch("https://dummyjson.com/products");
          const data = await res.json();
          const imageUrls = [];
          data.products.forEach((product) => {
            if (product.thumbnail) imageUrls.push(product.thumbnail);
            if (Array.isArray(product.images)) {
              product.images.forEach((img) => imageUrls.push(img));
            }
          });
          await cache.addAll(imageUrls);
        } catch (imgErr) {
          console.error("Failed to cache product images:", imgErr);
        }
      } catch (error) {
        console.error("Failed to cache app shell:", error);
      }
    })()
  );
});

// Listen for fetch events
self.addEventListener("fetch", (event) => {
  // We use event.respondWith() to take control of the response.
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return cachedResponse || fetch(event.request);
    })
  );
});

// Request notification permission and send a push notification after 4 seconds
self.addEventListener("activate", (event) => {
  console.log("Service Worker: Activating...");
  event.waitUntil(
    (async () => {
      // Delete old caches
      try {
        const cacheNames = await caches.keys();
        await Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log("Service Worker: Deleting old cache:", cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      } catch (err) {
        console.error("Error deleting old caches:", err);
      }

      // Push notifications
      try {
        if (self.registration && self.registration.showNotification) {
          // Wait 4 seconds, then show first notification
          await new Promise((res) => setTimeout(res, 4000));
          self.registration.showNotification("Hello user", {
            body: "This is a push notification from your PWA!",
            icon: "/media/logo-192.png",
          });
          // Wait another 6 seconds (total 10 seconds), then show second notification
          await new Promise((res) => setTimeout(res, 6000));
          self.registration.showNotification("Hello again!", {
            body: "This is your second push notification.",
            icon: "/media/logo-192.png",
          });
        }
      } catch (notifErr) {
        console.error("Error showing notifications:", notifErr);
      }
    })()
  );
});
