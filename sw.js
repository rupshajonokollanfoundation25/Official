const CACHE_NAME = 'pwa-cache-v1';
const urlsToCache = ['./', 'index.html']; 

// সার্ভিস ওয়ার্কার ইনস্টল করা
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Opened cache');
      return cache.addAll(urlsToCache);
    })
  );
});

// রিকোয়েস্ট ইন্টারসেপ্ট করা
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // যদি ক্যাশে থাকে তবে ওটাই দিবে, না থাকলে নেটওয়ার্ক থেকে নিবে
      return response || fetch(event.request);
    })
  );
});
