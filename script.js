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
const btn = document.querySelector('.smart-sub-btn');

btn.addEventListener('mouseenter', () => {
  // হ্যাপটিক ভাইব্রেশন সিমুলেশন (ঐচ্ছিক)
  if (window.navigator.vibrate) {
    window.navigator.vibrate(10);
  }
});

// স্ক্রল করলে বাটনটি হালকা ছোট হবে যাতে বিরক্তিকর না লাগে
window.addEventListener('scroll', () => {
  if (window.scrollY > 100) {
    btn.style.transform = 'scale(0.9)';
    btn.style.opacity = '0.8';
  } else {
    btn.style.transform = 'scale(1)';
    btn.style.opacity = '1';
  }
});








// ওয়েবসাইটের ভিউ কাউন্ট রিয়েলটাইম

// Firebase SDK ইমপোর্ট করা হচ্ছে
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getDatabase, ref, onValue, onDisconnect, set, push } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-database.js";

// তোর দেওয়া Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyDFmc_fjGRw_0bqj2ZLjUom-6VQvZtAwSQ",
  authDomain: "muslim-pro-eb32d.firebaseapp.com",
  databaseURL: "https://muslim-pro-eb32d-default-rtdb.firebaseio.com",
  projectId: "muslim-pro-eb32d",
  storageBucket: "muslim-pro-eb32d.firebasestorage.app",
  messagingSenderId: "701400663540",
  appId: "1:701400663540:web:ce595923530df62bde65a1",
  measurementId: "G-RFXK2XH0GQ"
};

// ফায়ারবেস ইনিশিয়ালাইজ করা
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// ডাটাবেস রেফারেন্স সেটআপ
const connectionsRef = ref(db, 'active_visitors');
const connectedRef = ref(db, '.info/connected');

// যখন কোনো ভিজিটর ওয়েবসাইটের সাথে কানেক্ট হবে
onValue(connectedRef, (snap) => {
    if (snap.val() === true) {
        // ভিজিটরের জন্য একটি নতুন চাইল্ড তৈরি করা
        const con = push(connectionsRef);
        
        // ভিজিটর বের হয়ে গেলে বা কানেকশন লস্ট হলে ডাটা রিমুভ হয়ে যাবে
        onDisconnect(con).remove();
        
        // ভিজিটরকে ডাটাবেসে 'true' হিসেবে সেট করা
        set(con, true);
    }
});

// মোট ভিজিটরের সংখ্যা গণনা করে HTML এ দেখানো
onValue(connectionsRef, (snap) => {
    // ডাটাবেসে থাকা মোট কানেকশন (ভিজিটর) সংখ্যা গোনা হচ্ছে
    const activeCount = snap.numChildren();
    
    // HTML ফাইলে সংখ্যা আপডেট করে দেওয়া হচ্ছে
    document.getElementById('live-count').innerText = activeCount;
});
