// সার্ভিস ওয়ার্কার ইনস্টল হওয়ার সময় কোনো ফাইল ক্যাশ করবে না
self.addEventListener('install', (event) => {
  self.skipWaiting(); 
});

// পুরনো যত ক্যাশ সেভ করা আছে, সব ক্লিয়ার করে দিবে
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          return caches.delete(cacheName);
        })
      );
    })
  );
  self.clients.claim();
});

// রিকোয়েস্ট ইন্টারসেপ্ট করা - শুধুমাত্র নেটওয়ার্ক থেকে ডেটা নিবে
self.addEventListener('fetch', (event) => {
  // এখানে ক্যাশ চেক করার কোনো কোড নেই, তাই সরাসরি ইন্টারনেট থেকে লোড হবে
  event.respondWith(fetch(event.request));
});
