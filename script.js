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

