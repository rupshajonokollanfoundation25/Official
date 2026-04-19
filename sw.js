// ১. ইনস্টল হওয়ার সাথে সাথে নতুন ভার্সন পুশ করবে
self.addEventListener('install', (event) => {
  self.skipWaiting(); 
});

// ২. অ্যাক্টিভেট হওয়ার সময় পুরনো সব জঞ্জাল (Cache) পরিষ্কার করবে
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(keys.map((key) => caches.delete(key)));
    })
  );
  self.clients.claim(); // সাথে সাথে কন্ট্রোল নিবে
});

// ৩. নেটওয়ার্ক ছাড়া কিচ্ছু লোড হবে না
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request).catch(() => {
      // ইন্টারনেট না থাকলে ব্রাউজার তার ডিফল্ট অফলাইন পেজ দেখাবে
      return Promise.reject();
    })
  );
});
