// ল্যাঙ্গুয়েজ চেঞ্জ
function toggleLanguage() {
    const btn = document.getElementById('langBtn');
    const title = document.getElementById('title');
    
    if (btn.innerText === "English") {
        btn.innerText = "বাংলা";
        title.innerText = "Rupsha Jonokollan Foundation";
    } else {
        btn.innerText = "English";
        title.innerText = "রূপসা জনকল্যাণ ফাউন্ডেশন";
    }
}

// থিম চেঞ্জ
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const icon = document.querySelector('#themeIcon i');
    
    if (document.body.classList.contains('dark-mode')) {
        icon.className = 'fas fa-sun';
    } else {
        icon.className = 'fas fa-moon';
    }
}

function toggleSidebar() {
    const sidebar = document.getElementById('mySidebar');
    const overlay = document.getElementById('overlay');
    
    sidebar.classList.toggle('active');
    overlay.classList.toggle('active');
}

// মেনু খোলার পর লিংকে ক্লিক করলে যেন মেনু বন্ধ হয়ে যায়
document.querySelectorAll('.sidebar-links a').forEach(link => {
    link.addEventListener('click', () => {
        toggleSidebar();
    });
});

// নোটিশ পরিবর্তন করার ফাংশন (দরকার হলে ব্যবহার করিস)
function updateNotice(newText) {
    const noticeElement = document.getElementById('noticeContent');
    if (noticeElement) {
        noticeElement.innerText = newText;
    }
}

// স্ক্রলিং স্পিড কন্ট্রোল (ঐচ্ছিক)
const notice = document.querySelector('.moving-text');
if (notice) {
    // এখানে টেক্সটের দৈর্ঘ্য অনুযায়ী স্পিড এডজাস্ট করা যায়
    notice.style.animationDuration = '25s'; 
}

// বাণীর তালিকা (এরে)
const quotes = [
    {
        text: "মানুষের সেবা করাই পরম ধর্ম।",
        author: "স্বামী বিবেকানন্দ"
    },
    {
        text: "অসহায় মানুষের পাশে দাঁড়ানোই হলো প্রকৃত মনুষ্যত্ব।",
        author: "মাদার তেরেসা"
    },
    {
        text: "এমনভাবে জীবন যাপন করো যেন তুমি কালই মারা যাবে। এমনভাবে শেখো যেন তুমি চিরকাল বাঁচবে।",
        author: "মহাত্মা গান্ধী"
    },
    {
        text: "ক্ষুদ্র ক্ষুদ্র বালুকণা, বিন্দু বিন্দু জল, গড়ে তোলে মহাদেশ, সাগর অতল।",
        author: "সংগৃহীত"
    },
    {
        text: "ভালো কাজ করতে থাকো, কেউ দেখুক বা না দেখুক, কারণ প্রতিদান মানুষ নয়, সৃষ্টিকর্তা দেবেন।",
        author: "প্রবাদ"
    }
];

// র্যান্ডম বাণী দেখানোর ফাংশন
function showRandomQuote() {
    const quoteElement = document.getElementById('quoteText');
    const authorElement = document.getElementById('quoteAuthor');
    
    // র্যান্ডম ইন্ডেক্স জেনারেট করা
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const selectedQuote = quotes[randomIndex];

    // এইচটিএমএল এ বাণী সেট করা
    quoteElement.innerText = selectedQuote.text;
    authorElement.innerText = "- " + selectedQuote.author;
}

// পেজ লোড বা রিফ্রেশ হলে ফাংশনটি কল হবে
window.onload = function() {
    showRandomQuote();
    // যদি আগে কোনো onload ফাংশন থাকে তবে তার সাথে মিলিয়ে নিও
};

// স্ক্রল করলে পরিচিতি সেকশন ভেসে উঠবে (স্মুথ এনিমেশন)
window.addEventListener('scroll', function() {
    const aboutSection = document.querySelector('.about-section');
    const position = aboutSection.getBoundingClientRect().top;
    const screenPosition = window.innerHeight / 1.3;

    if (position < screenPosition) {
        aboutSection.style.opacity = '1';
        aboutSection.style.transform = 'translateY(0)';
    }
});

// শুরুর স্টাইল সেট করা (CSS ফাইলে না দিয়ে এখান থেকেও করা যায়)
const aboutSection = document.querySelector('.about-section');
aboutSection.style.opacity = '0';
aboutSection.style.transform = 'translateY(30px)';
aboutSection.style.transition = 'all 0.8s ease-out';



// কাউন্টার এনিমেশন ফাংশন
function startCounters() {
    const counters = document.querySelectorAll('.counter-number');
    const speed = 100; // এনিমেশনের গতি

    counters.forEach(counter => {
        const updateCount = () => {
            const target = +counter.getAttribute('data-target');
            const count = +counter.innerText;
            const inc = target / speed;

            if (count < target) {
                counter.innerText = Math.ceil(count + inc);
                setTimeout(updateCount, 20);
            } else {
                counter.innerText = target + "+"; // শেষে প্লাস চিহ্ন যোগ হবে
            }
        };
        updateCount();
    });
}

// যখন সেকশনটি স্ক্রিনে আসবে তখনই শুধু এনিমেশন শুরু হবে
let started = false;
window.addEventListener('scroll', () => {
    const section = document.querySelector('.impact-section');
    if (section) {
        const sectionPos = section.getBoundingClientRect().top;
        const screenPos = window.innerHeight;

        if (sectionPos < screenPos && !started) {
            startCounters();
            started = true;
        }
    }
});






// অটোমেটিক বর্তমান সাল আপডেট করা
document.addEventListener('DOMContentLoaded', function() {
    const yearSpan = document.getElementById('year');
    if(yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
});










// Premium Dynamic Tab Title ইউজার ট্যাপ ম্যাসেজ
(() => {
    try {
        // আপনার সাইটের অরিজিনাল টাইটেলটি সেভ করে রাখা হচ্ছে
        const originalTitle = document.title;
        
        // ইউজার অন্য ট্যাবে গেলে যে প্রিমিয়াম মেসেজটি দেখাবে
        const awayMessage = "🙂 ফিরে আসুন আমাদের এখানে | রূপসা জনকল্যাণ ফাউন্ডেশন"; 

        // মডার্ন Page Visibility API ব্যবহার
        document.addEventListener("visibilitychange", () => {
            if (document.hidden) {
                // ইউজার সাইট ছেড়ে অন্য ট্যাবে গেলে
                document.title = awayMessage;
            } else {
                // ইউজার সাইটে ফিরে এলে সাথে সাথে অরিজিনাল টাইটেল
                document.title = originalTitle;
            }
        });
    } catch (error) {
        // কোনো কারণে সমস্যা হলে সাইটের অন্য কোড যেন ব্রেক না করে
        console.warn("Tab title feature skipped.");
    }
})();








// Premium Smart Copy Attribution কপি সিকিওরিটি
(() => {
    'use strict'; // কোডকে আরও ফাস্ট এবং সিকিউর রাখার জন্য ওয়ান-টাইম স্ট্রিক্ট মোড
    try {
        document.addEventListener('copy', (e) => {
            // ওল্ড এবং মডার্ন সব ব্রাউজার সাপোর্টের জন্য সিকিউর ক্লিপবোর্ড চেক
            const clipboard = e.clipboardData || window.clipboardData;
            if (!clipboard) return;

            const selection = window.getSelection();
            if (!selection) return;

            const selectedText = selection.toString();
            
            // .trim() ব্যবহারের ফলে কেউ শুধু ফাঁকা স্পেস কপি করলে কোডটি ফালতু ট্রিগার হবে en
            if (selectedText.trim().length > 30) {
                
                // 🚀 স্মার্ট ট্রিক: লিংক শেয়ারিংয়ের ট্র্যাকিং আইডি (?fbclid= বা #আলাদা_ট্যাগ) 
                // স্বয়ংক্রিয়ভাবে রিমুভ করে একদম ফ্রেশ এবং ক্লিন মেইন ইউআরএল (URL) তৈরি করবে।
                const cleanUrl = window.location.origin + window.location.pathname;
                
                // 💎 প্রিমিয়াম ও অত্যন্ত প্রফেশনাল ক্রেডিট ফরম্যাট
                const attribution = `\n\n----------------------------------------\n© রূপসা জনকল্যাণ ফাউন্ডেশন | সর্বস্বত্ব সংরক্ষিত\nউৎস: ${cleanUrl}\n----------------------------------------`;
                
                // ক্লিপবোর্ডে ডেটা পুশ এবং ডিফল্ট কপি সিস্টেম বাইপাস
                clipboard.setData('text/plain', selectedText + attribution);
                e.preventDefault(); 
            }
        });
    } catch (failSafe) {
        // কোনো ব্যাকগ্রাউন্ড ইরর হলেও মূল ওয়েবসাইটের অন্য কোনো ফাংশন বা লজিক ব্রেক করবে না
        console.warn("Secure Copy System: Protected.");
    }
})();









//মেম্বার বাটন
const premiumBtn = document.querySelector('.premium-btn');

if (premiumBtn) {
    premiumBtn.addEventListener('mousedown', function() {
        this.style.transform = "scale(0.95)";
    });

    premiumBtn.addEventListener('mouseup', function() {
        this.style.transform = "translateY(-3px) scale(1)";
    });
}






//সাবস্ক্রাইব বাটন
// --- 3. UI Interaction and Scroll Handlers ---
        const scrollBtn = document.getElementById('newScrollTop');
        const subBtn = document.querySelector('.smart-sub-btn');
        
        window.addEventListener('scroll', () => {
            // Scroll to Top visibility
            if (window.pageYOffset > 300) {
                scrollBtn.classList.add('show');
            } else {
                scrollBtn.classList.remove('show');
            }

            // Intelligent Navbar Reaction
            if (window.scrollY > 100) {
                subBtn.style.transform = 'scale(0.92)';
                subBtn.style.opacity = '0.85';
            } else {
                subBtn.style.transform = 'scale(1)';
                subBtn.style.opacity = '1';
            }
        });







//ইনস্টাল পপ আপ 
document.addEventListener("DOMContentLoaded", () => {
  const installBtn = document.getElementById('smartInstallBtn');
  let deferredPrompt;

  if (!installBtn) return;

  // ১. ব্রাউজারের ডিফল্ট প্রম্পট আসার সাথে সাথে সেটাকে আটকে দিয়ে আমাদের বাটন দেখাবো
  window.addEventListener('beforeinstallprompt', (e) => {
    // ক্রোম বা অন্য ব্রাউজারের ডিফল্ট পপআপ (যা স্ক্রিনশটে দেখছেন) সেটি জোরপূর্বক আটকানো হলো
    e.preventDefault(); 
    
    // ইভেন্টটি সেভ করে রাখা হলো
    deferredPrompt = e;
    
    // ব্রাউজারের পপআপ আটকে এখন আমাদের ন্যাভবারের বাটনটি সরাসরি শো করানো হচ্ছে
    installBtn.style.setProperty('display', 'inline-flex', 'important');
    installBtn.style.opacity = '1';
    
    console.log("Browser's default prompt blocked. Custom Nav button is now forced to show.");
  });

  // ২. ন্যাভবারের বাটনে ক্লিক করলে তখন ব্রাউজারের আসল প্রম্পটটি ওপেন হবে
  installBtn.addEventListener('click', async () => {
    if (!deferredPrompt) return;
    
    // ইউজারের ক্লিকের পর পপআপটি ওপেন হবে
    deferredPrompt.prompt();
    
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response: ${outcome}`);
    
    // কাজ শেষ হলে বাটন হাইড
    deferredPrompt = null;
    installBtn.style.display = 'none';
  });

  // ৩. অলরেডি ইনস্টল করা থাকলে বাটন লুকিয়ে রাখা
  if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true) {
    installBtn.style.display = 'none';
  }

  window.addEventListener('appinstalled', () => {
    installBtn.style.display = 'none';
    deferredPrompt = null;
  });
});









//নামাজের সময়সূচী কন্টেইনার 
let prayerTimesData = {};
    let notificationsEnabled = false;

    // প্রাথমিক লোড
    fetchPrayerTimesByCity();

    // এন্টার চাপলে লোকেশন সার্চ হবে
    document.getElementById("city-input").addEventListener("keypress", function(event) {
        if (event.key === "Enter") fetchPrayerTimesByCity();
    });

    // নোটিফিকেশন টগল
    function toggleNotification() {
        const bell = document.getElementById('bell-toggle');
        if (!notificationsEnabled) {
            if ("Notification" in window) {
                Notification.requestPermission().then(permission => {
                    if (permission === "granted") {
                        notificationsEnabled = true;
                        bell.classList.add('active');
                        new Notification("অ্যালার্ট চালু হয়েছে", { body: "নামাজের সময় হলে আপনাকে জানানো হবে।" });
                    }
                });
            }
        } else {
            notificationsEnabled = false;
            bell.classList.remove('active');
        }
    }

    async function fetchPrayerTimesByCity() {
        let city = document.getElementById("city-input").value || "Sirajganj";
        
        // লোডিং স্কেলিটন চালু করা
        document.querySelectorAll('.p-time, #smart-prayer-date, #progress-status, #time-remaining').forEach(el => el.classList.add('skeleton-text'));

        try {
            // Aladhan API - City based
            const response = await fetch(`https://api.aladhan.com/v1/timingsByCity?city=${city}&country=BD&method=1&school=1`);
            const data = await response.json();
            
            if(data && data.data && data.data.timings) {
                prayerTimesData = data.data.timings;
                const dateInfo = data.data.date;

                // স্কেলিটন রিমুভ করে ডেটা বসানো
                document.querySelectorAll('.skeleton-text').forEach(el => el.classList.remove('skeleton-text'));

                document.getElementById('s-fajr').innerText = formatTo12Hour(prayerTimesData.Fajr);
                document.getElementById('s-sunrise').innerText = formatTo12Hour(prayerTimesData.Sunrise);
                document.getElementById('s-dhuhr').innerText = formatTo12Hour(prayerTimesData.Dhuhr);
                document.getElementById('s-asr').innerText = formatTo12Hour(prayerTimesData.Asr);
                document.getElementById('s-maghrib').innerText = formatTo12Hour(prayerTimesData.Maghrib);
                document.getElementById('s-isha').innerText = formatTo12Hour(prayerTimesData.Isha);

                // সেহরি ও ইফতার সময় (ফজর এবং মাগরিব)
                document.getElementById('sehri-time').innerText = formatTo12Hour(prayerTimesData.Fajr);
                document.getElementById('iftar-time').innerText = formatTo12Hour(prayerTimesData.Maghrib);

                // তারিখ আপডেট
                let hijriMonth = dateInfo.hijri.month.bn || dateInfo.hijri.month.en;
                document.getElementById('smart-prayer-date').innerText = `${dateInfo.readable} | ${dateInfo.hijri.day} ${hijriMonth}`;

                updateEngine();
            }
        } catch (error) {
            console.error("API Fetch Error:", error);
            document.getElementById('smart-prayer-date').innerText = "নেটওয়ার্ক এরর! আবার চেষ্টা করুন।";
            document.getElementById('smart-prayer-date').classList.remove('skeleton-text');
        }
    }

    function formatTo12Hour(time) {
        if(!time) return "--:--";
        let [hours, minutes] = time.split(':');
        hours = parseInt(hours);
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12;
        return `${String(hours).padStart(2, '0')}:${minutes} ${ampm}`;
    }

    function timeToMinutes(timeStr) {
        if (!timeStr) return 0;
        let [h, m] = timeStr.split(':');
        return parseInt(h) * 60 + parseInt(m);
    }

    // নিষিদ্ধ সময়ের লজিক (মাকরুহ ওয়াক্ত)
    function checkForbiddenTimes(currentMins) {
        const sunrise = timeToMinutes(prayerTimesData.Sunrise);
        const dhuhr = timeToMinutes(prayerTimesData.Dhuhr);
        const maghrib = timeToMinutes(prayerTimesData.Maghrib);

        // সূর্যোদয়ের পর ১৫ মিনিট, যোহরের আগে ১০ মিনিট, মাগরিবের আগে ১০ মিনিট
        if ((currentMins >= sunrise && currentMins <= sunrise + 15) || 
            (currentMins >= dhuhr - 10 && currentMins < dhuhr) ||
            (currentMins >= maghrib - 10 && currentMins < maghrib)) {
            return true;
        }
        return false;
    }

    function updateEngine() {
        if (Object.keys(prayerTimesData).length === 0) return;

        const now = new Date();
        let h = now.getHours();
        let m = String(now.getMinutes()).padStart(2, '0');
        let s = String(now.getSeconds()).padStart(2, '0');
        let ampm = h >= 12 ? 'PM' : 'AM';
        let displayH = String(h % 12 || 12).padStart(2, '0');
        
        document.getElementById('live-clock').innerText = `${displayH}:${m}:${s} ${ampm}`;
        const currentMinutes = h * 60 + now.getMinutes();
        
        const schedule = [
            { id: 'Fajr', name: 'ফজর', start: timeToMinutes(prayerTimesData.Fajr), end: timeToMinutes(prayerTimesData.Sunrise) },
            { id: 'Sunrise', name: 'ইশরাক/সূর্যোদয়', start: timeToMinutes(prayerTimesData.Sunrise), end: timeToMinutes(prayerTimesData.Dhuhr) },
            { id: 'Dhuhr', name: 'যোহর', start: timeToMinutes(prayerTimesData.Dhuhr), end: timeToMinutes(prayerTimesData.Asr) },
            { id: 'Asr', name: 'আসর', start: timeToMinutes(prayerTimesData.Asr), end: timeToMinutes(prayerTimesData.Maghrib) },
            { id: 'Maghrib', name: 'মাগরিব', start: timeToMinutes(prayerTimesData.Maghrib), end: timeToMinutes(prayerTimesData.Isha) },
            { id: 'Isha', name: 'এশা', start: timeToMinutes(prayerTimesData.Isha), end: 1440 }
        ];

        let currentPrayer = null;
        let nextPrayer = null;

        for (let i = 0; i < schedule.length; i++) {
            if (currentMinutes >= schedule[i].start && currentMinutes < schedule[i].end) {
                currentPrayer = schedule[i];
                nextPrayer = schedule[(i + 1) % schedule.length];
                break;
            }
        }

        if (!currentPrayer) {
            currentPrayer = { id: 'Isha', name: 'এশা', start: timeToMinutes(prayerTimesData.Isha), end: 1440 };
            nextPrayer = schedule[0]; 
        }

        // বক্স ডিজাইন আপডেট
        document.querySelectorAll('.s-prayer-box').forEach(box => box.classList.remove('active-prayer'));
        const activeBox = document.getElementById(`box-${currentPrayer.id}`);
        if (activeBox) activeBox.classList.add('active-prayer');

        // প্রোগ্রেস বার
        let totalDuration = 0, elapsed = 0, minutesLeft = 0;

        if (currentMinutes < currentPrayer.start) {
            totalDuration = (1440 - currentPrayer.start) + nextPrayer.start;
            elapsed = (1440 - currentPrayer.start) + currentMinutes;
            minutesLeft = nextPrayer.start - currentMinutes;
        } else {
            totalDuration = (currentPrayer.id === 'Isha') ? (1440 - currentPrayer.start) + nextPrayer.start : currentPrayer.end - currentPrayer.start;
            elapsed = currentMinutes - currentPrayer.start;
            minutesLeft = (currentPrayer.id === 'Isha') ? (1440 - currentMinutes) + nextPrayer.start : currentPrayer.end - currentMinutes;
        }

        let progressPercent = (elapsed / totalDuration) * 100;
        let barFill = document.getElementById('progress-bar-fill');
        barFill.style.width = `${Math.min(100, Math.max(0, progressPercent))}%`;

        // নিষিদ্ধ সময়ের অ্যালার্ট চেক
        const isForbidden = checkForbiddenTimes(currentMinutes);
        const alertBox = document.getElementById('forbidden-alert');
        const ramadanInfo = document.getElementById('ramadan-info');

        if(isForbidden) {
            alertBox.style.display = 'inline-block';
            ramadanInfo.style.display = 'none';
            barFill.classList.add('warning'); // প্রোগ্রেস বার লাল হবে
            document.getElementById('time-remaining').style.color = '#dc2626';
            document.getElementById('time-remaining').style.background = '#fef2f2';
        } else {
            alertBox.style.display = 'none';
            ramadanInfo.style.display = 'inline-block';
            barFill.classList.remove('warning');
            document.getElementById('time-remaining').style.color = '#059669';
            document.getElementById('time-remaining').style.background = '#ecfdf5';
        }

        let rHours = Math.floor(minutesLeft / 60);
        let rMinutes = minutesLeft % 60;

        document.getElementById('progress-status').innerHTML = `<strong>${currentPrayer.name}</strong> চলমান`;
        document.getElementById('time-remaining').innerText = `${rHours > 0 ? rHours + 'ঘ ' : ''}${rMinutes}মি বাকি`;
    }

    setInterval(updateEngine, 1000);
