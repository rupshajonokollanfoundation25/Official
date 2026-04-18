// ==========================================
// প্রো-লেভেল ডাইনামিক ডাটাবেস (Array)
// প্রেজেন্স ইন্ডিকেটরের জন্য 'status' এবং ফিল্টারের জন্য 'category' যোগ করা হয়েছে
// ==========================================
const foundationMembers = [
    {
        id: 1,
        name: "ইঞ্জিনিয়ার রফিকুল ইসলাম",
        role: "প্রতিষ্ঠাতা পরিচালক",
        category: "প্রতিষ্ঠাতা পরিচালক",
        status: "active", // active হলে সবুজ, inactive হলে কমলা ডট দেখাবে
        image: "https://i.ibb.co.com/GvXXrwf7/FB-IMG-1771418638416.jpg",
        desc: "ফাউন্ডেশনের সামগ্রিক কার্যক্রম পরিচালনা এবং দিকনির্দেশনা প্রদান করেন।",
        facebook: "https://facebook.com",
        whatsapp: "https://wa.me/1234567890"
    },
    {
        id: 2,
        name: "হারুন অর রশিদ",
        role: "প্রতিষ্ঠাতা পরিচালক",
        category: "প্রতিষ্ঠাতা পরিচালক",
        status: "active",
        image: "https://i.ibb.co.com/PzfpYJm9/FB-IMG-1771418626588.jpg",
        desc: "মাঠ পর্যায়ের সার্বিক ব্যবস্থাপনা এবং সদস্যদের মাঝে সমন্বয় সাধন করেন।",
        facebook: "https://facebook.com",
        whatsapp: "" 
    },
    {
        id: 3,
        name: "মো: ওমর ফারুক",
        role: "সভাপতি",
        category: "সভাপতি",
        status: "active",
        image: "https://i.ibb.co.com/NnWNhPHh/1774421801136.jpg",
        desc: "ফাউন্ডেশনের সকল প্রকার অনুদান এবং ব্যয়ের স্বচ্ছ হিসাব রক্ষণাবেক্ষণ করেন।",
        facebook: "",
        whatsapp: "https://wa.me/1234567890"
    },
    {
        id: 4,
        name: "মনিরুল ইসলাম মনির",
        role: "সিনিয়র সহ-সভাপতি",
        category: "সিনিয়র সহ-সভাপতি",
        status: "inactive",
        image: "https://i.ibb.co.com/LdzT718H/img-1-1776439537863.jpg",
        desc: "জরুরি সেবা এবং প্রজেক্ট বাস্তবায়নে সরাসরি ভূমিকা পালন করেন।",
        facebook: "https://facebook.com",
        whatsapp: "https://wa.me/1234567890"
    },
    {
    id: 5,
        name: "নাঈম ইসলাম",
        role: "সাংগঠনিক সম্পাদক",
        category: "সাংগঠনিক সম্পাদক",
        status: "inactive",
        image: "https://i.ibb.co.com/gLSzV1Pv/img-1-1776439684132.jpg",
        desc: "জরুরি সেবা এবং প্রজেক্ট বাস্তবায়নে সরাসরি ভূমিকা পালন করেন।",
        facebook: "https://facebook.com",
        whatsapp: "https://wa.me/1234567890"
    },
    {
    id: 6,
        name: "কাওসার আহমেদ",
        role: "সাধারণ সম্পাদক",
        category: "সাধারণ সম্পাদক",
        status: "inactive",
        image: "https://i.ibb.co.com/Z6Kz0SdT/img-2-1776439752872.jpg",
        desc: "none",
        facebook: "https://facebook.com",
        whatsapp: "https://wa.me/1234567890"
    },
    {
        id: 7,
        name: "ইমরান আহমেদ",
        role: "প্রচার সম্পাদক",
        category: "প্রচার সম্পাদক",
        status: "active",
        image: "https://i.ibb.co.com/GfV0HT0n/IMG-20251217-095654.jpg",
        desc: "ইনি ফাউন্ডেশনের ওয়েবসাইট তৈরি করা সহ ফেসবুকে অ্যানাউন্সমেন্ট এবং ইউটিউবে ভিডিও আপলোড সহ সকল টেকনিক্যাল বিষয়ে এক্সপার্ট এনি ফাউন্ডেশন এর কার্যক্রম বিভিন্ন মানুষের মধ্যে ছড়িয়ে দেন।",
        facebook: "https://facebook.com/imran.ahmedddddd",
        whatsapp: "https://wa.me/8801957329211"
    },         
    
     {
        id: 8,
        name: "আব্দুল্লাহ্ আল ফাহিম",
        role: "সহ-সভাপতি",
        category: "সহ-সভাপতি",
        status: "inactive",
        image: "https://i.ibb.co.com/gYmBRMv/img-3-1776439810155.jpg",
        desc: "none",
        facebook: "https://facebook.com",
        whatsapp: "https://wa.me/1234567890"
    },
    
    
    {
        id: 9,
        name: "আবু সিয়াম",
        role: "সহ-সভাপতি",
        category: "সহ-সভাপতি",
        status: "inactive",
        image: "https://i.ibb.co.com/C315WJhX/img-4-1776439847482.jpg",
        desc: "none",
        facebook: "https://facebook.com",
        whatsapp: "https://wa.me/1234567890"
    },
    
    
    {
        id: 10,
        name: "কামরুল শেখ",
        role: "সহ-সভাপতি",
        category: "সহ-সভাপতি",
        status: "inactive",
        image: "https://i.ibb.co.com/SDbtMypJ/img-1-1776439894660.jpg",
        desc: "none",
        facebook: "https://facebook.com",
        whatsapp: "https://wa.me/1234567890"
    },
    
    
    
    {
        id: 11,
        name: "রায়হান খোকা",
        role: "সহ-সভাপতি",
        category: "সহ-সভাপতি",
        status: "inactive",
        image: "https://via.placeholder.com/150",
        desc: "none",
        facebook: "https://facebook.com",
        whatsapp: "https://wa.me/1234567890"
    },
    
    
    
    {
        id: 12,
        name: "শামিম",
        role: "সহ-সভাপতি",
        category: "সহ-সভাপতি",
        status: "inactive",
        image: "https://via.placeholder.com/150",
        desc: "none",
        facebook: "https://facebook.com",
        whatsapp: "https://wa.me/1234567890"
    },
    
    
    {
        id: 13,
        name: "হুমায়ন আহমেদ",
        role: "ক্রিয়া সম্পাদক",
        category: "ক্রিয়া সম্পাদক",
        status: "inactive",
        image: "https://i.ibb.co.com/x8JsW2bV/Screenshot-2026-04-17-21-44-20-022-com-microsoft-emmx-edit.jpg",
        desc: "খেলাধুলা এবং তার পাশাপাশি বিভিন্ন ধরনের ক্রিয়ায় অংশগ্রহণ করেন",
        facebook: "https://facebook.com",
        whatsapp: "https://wa.me/1234567890"
    },
    
    
    {
        id: 14,
        name: "সুমন আহমেদ",
        role: "দপ্তর সম্পাদক",
        category: "দপ্তর সম্পাদক",
        status: "inactive",
        image: "https://i.ibb.co.com/3YY1z5Wy/IMG-20250607-183611.jpg",
        desc: "ই ফাউন্ডেশন এর কাগজ পাতি এবং সকল দাপ্তরিক বিষয়ক জিনিসপত্র ইনার কাছে গচ্ছিত থাকে",
        facebook: "https://facebook.com",
        whatsapp: "https://wa.me/1234567890"
    },
    
    {
        id: 15,
        name: "মো: শামিম আহমেদ",
        role: "যুগ্ম সাধারণ সম্পাদক",
        category: "যুগ্ম সাধারণ সম্পাদক",
        status: "inactive",
        image: "https://via.placeholder.com/150",
        desc: "none",
        facebook: "https://facebook.com",
        whatsapp: "https://wa.me/1234567890"
    },
    
    
    {
        id: 16,
        name: "হুমায়ন কবির",
        role: "সংস্কৃতি বিষয়ক সম্পাদক",
        category: "সংস্কৃতি বিষয়ক সম্পাদক",
        status: "inactive",
        image: "https://i.ibb.co.com/gLXWCHjC/img-2-1776440001717.jpg",
        desc: "ইনি বিভিন্ন ধরনের সাংস্কৃতিক অনুষ্ঠানের এবং খেলাধুলাতে অবস্থান করেন",
        facebook: "https://facebook.com",
        whatsapp: "https://wa.me/1234567890"
    },
    
    
    {
        id: 17,
        name: "মো আব্দুস সাত্তার",
        role: "কোষাধ্যক্ষ",
        category: "কোষাধ্যক্ষ",
        status: "inactive",
        image: "https://i.ibb.co.com/ynnR8jyV/img-2-1771574187607.jpg",
        desc: "ফাউন্ডেশনের সকল হিসাব এবং ফাউন্ডেশনের টাকা উত্তোলন করে থাকেন",
        facebook: "https://facebook.com",
        whatsapp: "https://wa.me/1234567890"
    },
    
    
    {
        id: 18,
        name: "মো মুন্না",
        role: "সাধারণ সদস্য",
        category: "সাধারণ সদস্য",
        status: "inactive",
        image: "https://via.placeholder.com/150",
        desc: "none",
        facebook: "https://facebook.com",
        whatsapp: "https://wa.me/1234567890"
    },
    
    
    {
        id: 19,
        name: "মো সেলিম রেজা",
        role: "সমাজসেবা বিষয়ক সম্পাদক",
        category: "সমাজসেবা বিষয়ক সম্পাদক",
        status: "inactive",
        image: "https://via.placeholder.com/150",
        desc: "none",
        facebook: "https://facebook.com",
        whatsapp: "https://wa.me/1234567890"
    },
    
    
    {
        id: 20,
        name: "মো শাহাদৎ হোসেন",
        role: "সমাজসেবা বিষয়ক সম্পাদক",
        category: "সমাজসেবা বিষয়ক সম্পাদক",
        status: "inactive",
        image: "https://via.placeholder.com/150",
        desc: "none",
        facebook: "https://facebook.com",
        whatsapp: "https://wa.me/1234567890"
    },
    
    
    {
        id: 21,
        name: "ছফের তালুকদার",
        role: "উপদেষ্টা",
        category: "উপদেষ্টা",
        status: "inactive",
        image: "https://via.placeholder.com/150",
        desc: "none",
        facebook: "https://facebook.com",
        whatsapp: "https://wa.me/1234567890"
    },
    
    
    {
        id: 22,
        name: "আসলাম তালুকদার",
        role: "উপদেষ্টা",
        category: "উপদেষ্টা",
        status: "inactive",
        image: "https://via.placeholder.com/150",
        desc: "none",
        facebook: "https://facebook.com",
        whatsapp: "https://wa.me/1234567890"
    },
    
    
    
    {
        id: 23,
        name: "মোস্তাফিজুর রহমান",
        role: "উপদেষ্টা",
        category: "উপদেষ্টা",
        status: "inactive",
        image: "https://via.placeholder.com/150",
        desc: "none",
        facebook: "https://facebook.com",
        whatsapp: "https://wa.me/1234567890"
    },
    
    
    
    {
        id: 24,
        name: "তরিকুল ইসলাম",
        role: "উপদেষ্টা",
        category: "উপদেষ্টা",
        status: "inactive",
        image: "https://via.placeholder.com/150",
        desc: "none",
        facebook: "https://facebook.com",
        whatsapp: "https://wa.me/1234567890"
    },
    
    
    
    {
        id: 25,
        name: "মিনু মিয়া",
        role: "উপদেষ্টা",
        category: "উপদেষ্টা",
        status: "inactive",
        image: "https://via.placeholder.com/150",
        desc: "none",
        facebook: "https://facebook.com",
        whatsapp: "https://wa.me/1234567890"
    },
    
    
    
    {
        id: 26,
        name: "আমজাদ",
        role: "উপদেষ্টা",
        category: "উপদেষ্টা",
        status: "inactive",
        image: "https://via.placeholder.com/150",
        desc: "none",
        facebook: "https://facebook.com",
        whatsapp: "https://wa.me/1234567890"
    },
    
    
    {
        id: 27,
        name: "লোমান",
        role: "উপদেষ্টা",
        category: "উপদেষ্টা",
        status: "inactive",
        image: "https://via.placeholder.com/150",
        desc: "none",
        facebook: "https://facebook.com",
        whatsapp: "https://wa.me/1234567890"
    },
    
    
    
    
    {
        id: 28,
        name: "উল্লাস সরকার",
        role: "উপদেষ্টা",
        category: "উপদেষ্টা",
        status: "inactive",
        image: "https://via.placeholder.com/150",
        desc: "none",
        facebook: "https://facebook.com",
        whatsapp: "https://wa.me/1234567890"
    },
    
    
    
    {
        id: 29,
        name: "ইসাছিন আরাফাত",
        role: "সাধারণ সদস্য",
        category: "সাধারণ সদস্য",
        status: "inactive",
        image: "https://via.placeholder.com/150",
        desc: "none",
        facebook: "https://facebook.com",
        whatsapp: "https://wa.me/1234567890"
    },
    
    
    
    {
        id: 30,
        name: "জুয়েল",
        role: "সাধারণ সদস্য",
        category: "সাধারণ সদস্য",
        status: "inactive",
        image: "https://via.placeholder.com/150",
        desc: "none",
        facebook: "https://facebook.com",
        whatsapp: "https://wa.me/1234567890"
    },
    
    
    
    
    {
        id: 31,
        name: "সোহাগ",
        role: "সাধারণ সদস্য",
        category: "সাধারণ সদস্য",
        status: "inactive",
        image: "https://via.placeholder.com/150",
        desc: "none",
        facebook: "https://facebook.com",
        whatsapp: "https://wa.me/1234567890"
    },
    
    
    {
        id: 32,
        name: "মুসলিম",
        role: "সাধারণ সদস্য",
        category: "সাধারণ সদস্য",
        status: "inactive",
        image: "https://via.placeholder.com/150",
        desc: "none",
        facebook: "https://facebook.com",
        whatsapp: "https://wa.me/1234567890"
    },
    
    
    {
        id: 33,
        name: "রাজ্জাক",
        role: "সাধারণ সদস্য",
        category: "সাধারণ সদস্য",
        status: "inactive",
        image: "https://via.placeholder.com/150",
        desc: "none",
        facebook: "https://facebook.com",
        whatsapp: "https://wa.me/1234567890"
    },
    
    
    
    {
        id: 34,
        name: "শাহাদৎ",
        role: "সাধারণ সদস্য",
        category: "সাধারণ সদস্য",
        status: "inactive",
        image: "https://via.placeholder.com/150",
        desc: "none",
        facebook: "https://facebook.com",
        whatsapp: "https://wa.me/1234567890"
    },
    
    
    {
        id: 35,
        name: "মো সাইদুল ইসলাম",
        role: "উপদেষ্টা",
        category: "উপদেষ্টা",
        status: "inactive",
        image: "https://via.placeholder.com/150",
        desc: "none",
        facebook: "https://facebook.com",
        whatsapp: "https://wa.me/1234567890"
    },
    
    
    {
        id: 36,
        name: "আবুল কালাম আজাদ",
        role: "উপদেষ্টা",
        category: "উপদেষ্টা",
        status: "inactive",
        image: "https://via.placeholder.com/150",
        desc: "none",
        facebook: "https://facebook.com",
        whatsapp: "https://wa.me/1234567890"
    },
    
    
    {
        id: 37,
        name: "",
        role: "",
        category: "",
        status: "inactive",
        image: "https://via.placeholder.com/150",
        desc: "জরুরি সেবা এবং প্রজেক্ট বাস্তবায়নে সরাসরি ভূমিকা পালন করেন।",
        facebook: "https://facebook.com",
        whatsapp: "https://wa.me/1234567890"
    },
    
];

const scrollContent = document.getElementById('scroll-content');
const scrollBox = document.getElementById('scroll-box');
const modal = document.getElementById('modal');

// ডাটা রেন্ডার করার ফাংশন (পরিবর্তিত করা হয়েছে ফিল্টার ও প্রেজেন্স ডট সাপোর্ট করার জন্য)
function renderMembers(dataToRender = foundationMembers) {
    let htmlString = '';
    
    if(dataToRender.length === 0) {
        scrollContent.innerHTML = `<div style="text-align:center; color:var(--text-sub); padding:30px;">কোনো সদস্য পাওয়া যায়নি</div>`;
        return;
    }

    dataToRender.forEach(member => {
        // স্ট্যাটাস অনুযায়ী ডটের কালার (Active = Green, Inactive = Orange/Red)
        let statusColor = member.status === 'active' ? '#10b981' : '#f59e0b';

        htmlString += `
            <div class="member-card" onclick="openMemberModal(${member.id})">
                <div class="img-wrapper">
                    <img src="${member.image}" alt="${member.name}" loading="lazy">
                    <span class="status-dot" style="background-color: ${statusColor};"></span>
                </div>
                <div class="member-info">
                    <h3>${member.name}</h3>
                    <p>${member.role}</p>
                </div>
                <div class="arrow-icon"><i class="fa-solid fa-arrow-right"></i></div>
            </div>
        `;
    });
    scrollContent.innerHTML = htmlString + htmlString; // আগের মতোই ডাবল করা হলো
}

renderMembers();

// --- নতুন ফিল্টার এবং সার্চ ফাংশন ---
function filterData() {
    let searchText = document.getElementById('searchInput').value.toLowerCase();
    let categoryText = document.getElementById('categoryFilter').value;

    let filteredList = foundationMembers.filter(member => {
        let matchesSearch = member.name.toLowerCase().includes(searchText);
        let matchesCategory = (categoryText === 'all') || (member.category === categoryText);
        return matchesSearch && matchesCategory;
    });
    
    scrollPos = 0; // ফিল্টার করলে স্ক্রল পজিশন রিসেট হবে
    renderMembers(filteredList);
}

// --- স্মুথ স্ক্রলিং লজিক (60FPS) (আগের মতই) ---
let scrollPos = 0;
let speed = 0.6; 
let isPaused = false;
let lastTime = 0;

function smoothScroll(time) {
    if (!lastTime) lastTime = time;
    const deltaTime = time - lastTime;
    lastTime = time;

    if (!isPaused && scrollContent.scrollHeight > 0) {
        scrollPos -= speed * (deltaTime / 16.67); 
        const halfHeight = scrollContent.scrollHeight / 2;
        
        if (Math.abs(scrollPos) >= halfHeight) {
            scrollPos = 0;
        }
        scrollContent.style.transform = `translateY(${scrollPos}px)`;
    }
    requestAnimationFrame(smoothScroll);
}

requestAnimationFrame(smoothScroll);

scrollBox.addEventListener('mouseenter', () => isPaused = true);
scrollBox.addEventListener('mouseleave', () => {
    if (!modal.classList.contains('active')) isPaused = false;
});

// --- নতুন ম্যানুয়াল স্ক্রল কন্ট্রোল লজিক ---
let manualScrollInterval;
function startManualScroll(direction) {
    isPaused = true;
    manualScrollInterval = setInterval(() => {
        scrollPos -= direction * 4; // ক্লিক করে ধরে রাখলে স্ক্রল হবে
        scrollContent.style.transform = `translateY(${scrollPos}px)`;
    }, 16);
}

function stopManualScroll() {
    clearInterval(manualScrollInterval);
    if (!modal.classList.contains('active')) isPaused = false;
}

// --- পপ-আপ (Modal) কন্ট্রোল (আগের মতই) ---
function openMemberModal(id) {
    const member = foundationMembers.find(m => m.id === id);
    if(member) {
        document.getElementById('modal-name').innerText = member.name;
        document.getElementById('modal-role').innerText = member.role;
        document.getElementById('modal-img').src = member.image;
        document.getElementById('modal-desc').innerText = member.desc;

        // সোশ্যাল লিংক সেটআপ
        let socialHTML = '';
        if(member.facebook) {
            socialHTML += `<a href="${member.facebook}" target="_blank" title="Facebook"><i class="fa-brands fa-facebook-f"></i></a>`;
        }
        if(member.whatsapp) {
            socialHTML += `<a href="${member.whatsapp}" target="_blank" title="WhatsApp"><i class="fa-brands fa-whatsapp"></i></a>`;
        }
        document.getElementById('modal-social').innerHTML = socialHTML;

        modal.classList.add('active');
        isPaused = true;
    }
}

function toggleModal() {
    modal.classList.remove('active');
    isPaused = false;
}

// কীবোর্ড Esc এবং বাইরের ক্লিকে পপ-আপ বন্ধ হওয়া
modal.addEventListener('click', toggleModal);
document.addEventListener('keydown', function(event) {
    if (event.key === "Escape" && modal.classList.contains('active')) toggleModal();
});

// ==========================================
// নতুন যুক্ত করা অটো-টাইপিং ইফেক্ট (Search Bar Placeholder)
// ==========================================
const typingInput = document.getElementById('searchInput');
const placeholderTexts = ["নাম লিখে খুঁজুন...", "সভাপতি খুঁজুন...", "সাধারণ সম্পাদক খুঁজুন...", "কোষাধ্যক্ষ খুঁজুন...","সদস্যদের খুঁজুন...",];
let textIndex = 0;
let charIndex = 0;
let isDeletingText = false;

function typeEffect() {
    // যদি ইনপুটে কিছু লেখা থাকে অথবা ফোকাস থাকে, তাহলে টাইপিং অফ থাকবে
    if(document.activeElement === typingInput || typingInput.value.length > 0) {
        typingInput.setAttribute('placeholder', "নাম লিখে খুঁজুন...");
        setTimeout(typeEffect, 1000);
        return;
    }

    const currentText = placeholderTexts[textIndex];
    
    if (isDeletingText) {
        typingInput.setAttribute('placeholder', currentText.substring(0, charIndex - 1));
        charIndex--;
    } else {
        typingInput.setAttribute('placeholder', currentText.substring(0, charIndex + 1));
        charIndex++;
    }

    let typeSpeed = isDeletingText ? 50 : 100;

    if (!isDeletingText && charIndex === currentText.length) {
        typeSpeed = 1500; // টাইপ শেষ হলে কিছুক্ষণ দাঁড়াবে
        isDeletingText = true;
    } else if (isDeletingText && charIndex === 0) {
        isDeletingText = false;
        textIndex = (textIndex + 1) % placeholderTexts.length;
        typeSpeed = 500; // নতুন শব্দ শুরুর আগে একটু গ্যাপ
    }

    setTimeout(typeEffect, typeSpeed);
}

// পেজ লোড হওয়ার ১ সেকেন্ড পর টাইপিং শুরু হবে
setTimeout(typeEffect, 1000);
