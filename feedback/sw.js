const CACHE_NAME = 'my-site-cache-v1';
const OFFLINE_URL = 'offline.html'; // অফলাইন হলে যে ফাইলটি দেখাবে

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(RJF).then((cache) => {
      return cache.addAll([Https://rupshajonokollanfoundation.vercel.app/feedback/]);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(Https://rupshajonokollanfoundation.vercel.app/feedback/);
    })
  );
});

