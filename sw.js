const CACHE_NAME = 'offline-cache-v2'; // ক্যাশের একটি নাম (ছোট হাতের const করা হয়েছে)
const OFFLINE_URL = 'offline.html';    // অফলাইন পেজের নাম

// ১. ইনস্টল ইভেন্ট: অফলাইন পেজটি ক্যাশ করবে
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.add(new Request(OFFLINE_URL, { cache: 'reload' }));
    })
  );
  self.skipWaiting(); 
});

// ২. অ্যাক্টিভ ইভেন্ট: পুরনো ক্যাশ ক্লিয়ার করবে
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// ৩. ফেচ ইভেন্ট: নেটওয়ার্ক ফার্স্ট পলিসি এবং অফলাইন ফলব্যাক
self.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.open(CACHE_NAME).then((cache) => {
          return cache.match(OFFLINE_URL);
        });
      })
    );
  } else {
    event.respondWith(fetch(event.request));
  }
});
