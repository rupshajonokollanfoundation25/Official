const CACHE_NAME = 'offline-cache-v2'; // ক্যাশের একটি নাম
const OFFLINE_URL = 'offline.html';    // তোমার অফলাইন পেজের নাম

// ১. ইনস্টল ইভেন্ট: শুধু অফলাইন পেজটি সেভ করবে, অন্য কোনো ফাইল ক্যাশ করবে না
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // অফলাইন পেজটি ক্যাশে যুক্ত করা হচ্ছে
      return cache.add(new Request(OFFLINE_URL, { cache: 'reload' }));
    })
  );
  self.skipWaiting(); // দ্রুত অ্যাক্টিভ করার জন্য
});

// ২. অ্যাক্টিভ ইভেন্ট: তোমার শর্ত অনুযায়ী পুরনো সব ক্যাশ ক্লিয়ার করবে (যাতে অ্যাপ ফাস্ট থাকে)
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // বর্তমান ক্যাশ ছাড়া বাকি সব পুরনো ক্যাশ ডিলিট করে দিবে
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// ৩. ফেচ ইভেন্ট (রিকোয়েস্ট ইন্টারসেপ্ট করা): তোমার শর্ত অনুযায়ী নেটওয়ার্ক থেকে ডেটা নিবে
self.addEventListener('fetch', (event) => {
  
  // যদি ইউজার কোনো পেজ (HTML) লোড করতে চায়
  if (event.request.mode === 'navigate') {
    event.respondWith(
      // প্রথমে সরাসরি ইন্টারনেট থেকে ডাটা নেওয়ার চেষ্টা করবে (তোমার আগের কোডের মতো)
      fetch(event.request).catch(() => {
        // যদি ইন্টারনেট না থাকে (error খায়), তখনই শুধু ক্যাশ থেকে offline.html দেখাবে
        return caches.open(CACHE_NAME).then((cache) => {
          return cache.match(OFFLINE_URL);
        });
      })
    );
  } else {
    // ছবি, CSS, JS বা API রিকোয়েস্টের ক্ষেত্রে সরাসরি ইন্টারনেট থেকেই লোড হবে, কোনো ক্যাশ করবে না
    event.respondWith(fetch(event.request));
  }
  
});
