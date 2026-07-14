// ============================================================
// notice-popup.js — পেজ লোডে প্রো-নোটিশ পপআপ (সেশন-ভিত্তিক)
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
    const overlay = document.getElementById('pro-notice-overlay');
    const closeBtn = document.querySelector('.pro-close-btn');
    const countdownEl = document.getElementById('countdown-number'); // HTML-এ এই আইডি থাকতে হবে
    
    let displayDuration = 20000; // ২০ সেকেন্ড
    let timeLeft = 20; 
    let popupTimer;
    let countdownInterval;

    // সেশন স্টোরেজ চেক
    if (!sessionStorage.getItem('noticeSeen')) {
        setTimeout(() => {
            showNotice();
        }, 900);
    }

    function showNotice() {
        overlay.classList.add('active');
        
        // ১. অটোমেটিক ক্লোজ টাইমার
        popupTimer = setTimeout(() => {
            closeNotice();
        }, displayDuration);

        // ২. কাউন্টডাউন টেক্সট আপডেট (20, 19, 18...)
        countdownInterval = setInterval(() => {
            timeLeft--;
            if (countdownEl) countdownEl.innerText = timeLeft;
            
            if (timeLeft <= 0) {
                clearInterval(countdownInterval);
            }
        }, 1000);
    }

    function closeNotice() {
        overlay.classList.remove('active');
        sessionStorage.setItem('noticeSeen', 'true');
        
        clearTimeout(popupTimer);
        clearInterval(countdownInterval);
    }

    // ক্লোজ বাটন ক্লিক
    if(closeBtn) {
        closeBtn.addEventListener('click', closeNotice);
    }

    // বাইরে ক্লিক করলে বন্ধ
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            closeNotice();
        }
    });

    // Esc বাটন প্রেস করলে বন্ধ
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && overlay.classList.contains('active')) {
            closeNotice();
        }
    });
});
