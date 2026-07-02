/* =========================================================
   app.js — মূল অ্যাপ্লিকেশন লজিক
   (রেন্ডারিং, সার্চ/ফিল্টার, স্ট্যাটস, মোডাল)
   ========================================================= */

const scrollContent   = document.getElementById('scroll-content');
const scrollBox       = document.getElementById('scroll-box');
const modal            = document.getElementById('modal');
const searchInput      = document.getElementById('searchInput');
const categoryFilter   = document.getElementById('categoryFilter');
const resultCount      = document.getElementById('result-count');

// ফ্রেমের ভেতর লুপ (অটো-স্ক্রল) চালু রাখার জন্য ন্যূনতম সদস্য সংখ্যা
const MIN_MEMBERS_FOR_LOOP = 5;

/* ---------- ১. স্ট্যাটস ড্যাশবোর্ড ---------- */
function renderStats() {
    const total    = foundationMembers.length;
    const active   = foundationMembers.filter(m => m.status === 'active').length;
    const verified = foundationMembers.filter(m => m.memberid && m.memberid.trim() !== '').length;
    const categories = new Set(foundationMembers.map(m => m.category)).size;

    const statMap = {
        'stat-total': total,
        'stat-active': active,
        'stat-verified': verified,
        'stat-categories': categories
    };

    Object.entries(statMap).forEach(([id, value]) => {
        const el = document.getElementById(id);
        if (!el) return;
        animateCount(el, value);
    });
}

// সংখ্যা ০ থেকে টার্গেট পর্যন্ত মসৃণভাবে গোনার অ্যানিমেশন
function animateCount(el, target) {
    let current = 0;
    const duration = 900;
    const stepTime = Math.max(Math.floor(duration / Math.max(target, 1)), 20);
    const timer = setInterval(() => {
        current++;
        el.textContent = current;
        if (current >= target) clearInterval(timer);
    }, stepTime);
}

/* ---------- ২. মেম্বার কার্ড টেমপ্লেট ---------- */
function memberCardHTML(member) {
    const statusColor = member.status === 'active' ? '#10b981' : '#f59e0b';
    const statusLabel  = member.status === 'active' ? 'সক্রিয়' : 'নিষ্ক্রিয়';
    const verifiedBadge = (member.memberid && member.memberid.trim() !== '')
        ? `<span class="verified-badge" title="ভেরিফাইড সদস্য"><i class="fa-solid fa-circle-check"></i></span>`
        : '';

    return `
        <div class="member-card" tabindex="0" role="button"
             aria-label="${member.name} - বিস্তারিত দেখুন"
             onclick="openMemberModal(${member.id})"
             onkeypress="if(event.key === 'Enter') openMemberModal(${member.id})">
            <div class="img-wrapper">
                <img src="${member.image}" alt="${member.name}" loading="lazy"
                     onerror="this.src='https://via.placeholder.com/150'">
                <span class="status-dot" style="background-color:${statusColor};" title="${statusLabel}"></span>
                ${verifiedBadge}
            </div>
            <div class="member-info">
                <h3>${member.name}</h3>
                <p>${member.role}</p>
            </div>
            <div class="arrow-icon"><i class="fa-solid fa-arrow-right"></i></div>
        </div>
    `;
}

/* ---------- ৩. ক্রমানুসারে সাজিয়ে ফ্রেমের ভেতর রেন্ডারিং ---------- */
// pdobi/category অনুযায়ী নির্ধারিত গুরুত্বের ক্রমে সদস্যদের সাজানো হয়
function sortByCategoryOrder(list) {
    return [...list].sort((a, b) => {
        let ia = CATEGORY_ORDER.indexOf(a.category);
        let ib = CATEGORY_ORDER.indexOf(b.category);
        if (ia === -1) ia = CATEGORY_ORDER.length;
        if (ib === -1) ib = CATEGORY_ORDER.length;
        return ia - ib;
    });
}

function renderMembers(dataToRender = foundationMembers) {
    if (dataToRender.length === 0) {
        scrollContent.innerHTML = `
            <div class="empty-state show">
                <i class="fa-solid fa-user-slash"></i>
                <p>কোনো সদস্য পাওয়া যায়নি</p>
            </div>`;
        resultCount.textContent = '০ জন সদস্য পাওয়া গেছে';
        window.loopEnabled = false;
        if (typeof resetScrollPosition === 'function') resetScrollPosition();
        return;
    }

    resultCount.textContent = `${toBengaliNumber(dataToRender.length)} জন সদস্য পাওয়া গেছে`;

    const sortedList = sortByCategoryOrder(dataToRender);
    const cardsHTML = sortedList.map(memberCardHTML).join('');

    // পর্যাপ্ত সদস্য থাকলে নিরবচ্ছিন্ন লুপের জন্য কনটেন্ট দুইবার বসানো হয়,
    // কম সদস্য থাকলে (যেমন ফিল্টার করার পর) শুধু একবারই দেখানো হয় এবং অটো-স্ক্রল বন্ধ থাকে
    if (sortedList.length >= MIN_MEMBERS_FOR_LOOP) {
        scrollContent.innerHTML = cardsHTML + cardsHTML;
        window.loopEnabled = true;
    } else {
        scrollContent.innerHTML = cardsHTML;
        window.loopEnabled = false;
    }

    if (typeof resetScrollPosition === 'function') resetScrollPosition();
}

function toBengaliNumber(num) {
    const bn = ['০','১','২','৩','৪','৫','৬','৭','৮','৯'];
    return String(num).split('').map(d => (/\d/.test(d) ? bn[d] : d)).join('');
}

/* ---------- ৪. সার্চ + ফিল্টার ---------- */
function filterData() {
    const searchText   = searchInput.value.toLowerCase().trim();
    const categoryText = categoryFilter.value;

    const filteredList = foundationMembers.filter(member => {
        const matchesSearch = member.name.toLowerCase().includes(searchText) ||
                               member.role.toLowerCase().includes(searchText);
        const matchesCategory = (categoryText === 'all') || (member.category === categoryText);
        return matchesSearch && matchesCategory;
    });

    renderMembers(filteredList);
}

/* ---------- ৫. মোডাল কন্ট্রোল ---------- */
function openMemberModal(id) {
    const member = foundationMembers.find(m => m.id === id);
    if (!member) return;

    document.getElementById('modal-name').innerText = member.name;
    document.getElementById('modal-role').innerText = member.role;
    document.getElementById('modal-img').src = member.image;
    document.getElementById('modal-desc').innerText = (member.desc && member.desc !== 'none')
        ? member.desc
        : 'এই সদস্যের বিস্তারিত বিবরণ শীঘ্রই যুক্ত করা হবে।';

    const statusBadge = document.getElementById('modal-status');
    if (statusBadge) {
        const isActive = member.status === 'active';
        statusBadge.innerText = isActive ? '● সক্রিয় সদস্য' : '● নিষ্ক্রিয় সদস্য';
        statusBadge.style.color = isActive ? '#10b981' : '#f59e0b';
    }

    const memberIdBtn = document.getElementById('modal-memberid');
    const memberLink  = document.getElementById('modal-member-link');
    if (member.memberid && member.memberid.trim() !== '') {
        memberIdBtn.innerText = 'মেম্বার আইডি: ' + member.memberid.trim();
        memberLink.href = member.profileUrl || '#';
        memberLink.style.display = 'inline-block';
    } else {
        memberLink.style.display = 'none';
    }

    let socialHTML = '';
    if (member.facebook) {
        socialHTML += `<a href="${member.facebook}" target="_blank" rel="noopener" title="Facebook"><i class="fa-brands fa-facebook-f"></i></a>`;
    }
    if (member.whatsapp) {
        socialHTML += `<a href="${member.whatsapp}" target="_blank" rel="noopener" title="WhatsApp"><i class="fa-brands fa-whatsapp"></i></a>`;
    }
    if (member.github && member.github.trim() !== '') {
        socialHTML += `<a href="${member.github}" target="_blank" rel="noopener" title="GitHub"><i class="fa-brands fa-github"></i></a>`;
    }
    document.getElementById('modal-social').innerHTML = socialHTML;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function toggleModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

modal.addEventListener('click', (e) => {
    if (e.target === modal) toggleModal();
});
document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && modal.classList.contains('active')) toggleModal();
});

/* ---------- ৬. সার্চ বক্সে অটো-টাইপিং প্লেসহোল্ডার ---------- */
const placeholderTexts = ["নাম লিখে খুঁজুন...", "সভাপতি খুঁজুন...", "সাধারণ সম্পাদক খুঁজুন...", "কোষাধ্যক্ষ খুঁজুন...", "সদস্যদের খুঁজুন..."];
let textIndex = 0, charIndex = 0, isDeletingText = false;

function typeEffect() {
    if (document.activeElement === searchInput || searchInput.value.length > 0) {
        searchInput.setAttribute('placeholder', 'নাম লিখে খুঁজুন...');
        setTimeout(typeEffect, 1000);
        return;
    }
    const currentText = placeholderTexts[textIndex];

    if (isDeletingText) {
        searchInput.setAttribute('placeholder', currentText.substring(0, charIndex - 1));
        charIndex--;
    } else {
        searchInput.setAttribute('placeholder', currentText.substring(0, charIndex + 1));
        charIndex++;
    }

    let typeSpeed = isDeletingText ? 50 : 100;
    if (!isDeletingText && charIndex === currentText.length) {
        typeSpeed = 1500;
        isDeletingText = true;
    } else if (isDeletingText && charIndex === 0) {
        isDeletingText = false;
        textIndex = (textIndex + 1) % placeholderTexts.length;
        typeSpeed = 500;
    }
    setTimeout(typeEffect, typeSpeed);
}

/* ---------- ৭. স্ক্রল-টু-টপ + নাভবার রিঅ্যাকশন ---------- */
function initScrollHandlers() {
    const scrollBtn = document.getElementById('scrollTopBtn');
    const subBtn = document.querySelector('.smart-sub-btn');

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 400) {
            scrollBtn.classList.add('show');
        } else {
            scrollBtn.classList.remove('show');
        }
        if (subBtn) {
            if (window.scrollY > 100) {
                subBtn.style.transform = 'scale(0.92)';
                subBtn.style.opacity = '0.85';
            } else {
                subBtn.style.transform = 'scale(1)';
                subBtn.style.opacity = '1';
            }
        }
    });

    scrollBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

/* ---------- ৮. ইনিশিয়ালাইজেশন ---------- */
document.addEventListener('DOMContentLoaded', () => {
    renderStats();
    renderMembers();
    initScrollHandlers();
    setTimeout(typeEffect, 1000);

    searchInput.addEventListener('keyup', filterData);
    categoryFilter.addEventListener('change', filterData);
});
