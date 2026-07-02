/* =========================================================
   scrollbox.js — মেম্বার ফ্রেমের স্মার্ট স্ক্রলিং ইঞ্জিন
   • অটোমেটিক লুপ স্ক্রল সবসময় চলবে
   • মাউস/টাচ দিয়ে ধরে টানলে (drag/swipe) ম্যানুয়ালি ঘোরানো যাবে
   • মাউস হুইল দিয়েও স্ক্রল করা যাবে
   • হাত ছেড়ে দিলে হালকা জড়তা (momentum) সহ থেমে আবার অটো-স্ক্রল শুরু হবে
   ========================================================= */

let scrollPos = 0;
let autoSpeed = 0.55;          // অটো-স্ক্রলের গতি (px প্রতি ফ্রেম, ৬০fps ভিত্তিক)
let isPaused = false;
let isDragging = false;
let lastTime = 0;
let velocity = 0;

let dragStartY = 0;
let dragStartScroll = 0;
let lastDragY = 0;
let lastDragTime = 0;
let resumeTimer = null;

function getHalfHeight() {
    return scrollContent ? scrollContent.scrollHeight / 2 : 0;
}

// লুপ চালু থাকলে scrollPos-কে (-halfHeight, 0] রেঞ্জের মধ্যে মুড়িয়ে রাখা হয়,
// ফলে যেদিকেই টানা হোক না কেন তালিকাটা অসীম মনে হয়
function wrapScrollPos() {
    if (!window.loopEnabled) return;
    const halfHeight = getHalfHeight();
    if (halfHeight <= 0) return;
    while (scrollPos <= -halfHeight) scrollPos += halfHeight;
    while (scrollPos > 0) scrollPos -= halfHeight;
}

function applyTransform() {
    if (scrollContent) scrollContent.style.transform = `translateY(${scrollPos}px)`;
}

// নতুন করে রেন্ডার/ফিল্টার হলে স্ক্রল পজিশন রিসেট করার জন্য app.js থেকে কল হয়
function resetScrollPosition() {
    scrollPos = 0;
    velocity = 0;
    applyTransform();
}
window.resetScrollPosition = resetScrollPosition;

function scheduleResume(delay = 1200) {
    clearTimeout(resumeTimer);
    resumeTimer = setTimeout(() => {
        if (!isDragging && !(modal && modal.classList.contains('active'))) {
            isPaused = false;
        }
    }, delay);
}

function autoScrollLoop(time) {
    if (!lastTime) lastTime = time;
    const deltaTime = Math.min(time - lastTime, 50); // বড় ল্যাগ এড়াতে ক্যাপ
    lastTime = time;

    if (isDragging) {
        // ড্র্যাগ চলাকালীন pointermove ইভেন্টই পজিশন ঠিক করে
    } else if (Math.abs(velocity) > 0.03) {
        // মোমেন্টাম (ছেড়ে দেওয়ার পরের জড়তা)
        scrollPos += velocity * (deltaTime / 16.67);
        velocity *= 0.94;
        wrapScrollPos();
        applyTransform();
    } else if (!isPaused && window.loopEnabled) {
        scrollPos -= autoSpeed * (deltaTime / 16.67);
        wrapScrollPos();
        applyTransform();
    }

    requestAnimationFrame(autoScrollLoop);
}

function initScrollBoxInteractions() {
    if (!scrollBox || !scrollContent) return;

    // ডেস্কটপে মাউস হভার করলে অটো-স্ক্রল থামবে, সরে গেলে আবার চলবে
    scrollBox.addEventListener('mouseenter', () => { isPaused = true; clearTimeout(resumeTimer); });
    scrollBox.addEventListener('mouseleave', () => {
        if (!isDragging) scheduleResume(250);
    });

    // --- পয়েন্টার ড্র্যাগ (মাউস + টাচ একসাথে হ্যান্ডেল করে) ---
    scrollBox.addEventListener('pointerdown', (e) => {
        isDragging = true;
        isPaused = true;
        velocity = 0;
        dragStartY = e.clientY;
        dragStartScroll = scrollPos;
        lastDragY = e.clientY;
        lastDragTime = performance.now();
        scrollBox.classList.add('dragging');
        try { scrollBox.setPointerCapture(e.pointerId); } catch (err) {}
    });

    scrollBox.addEventListener('pointermove', (e) => {
        if (!isDragging) return;
        const delta = e.clientY - dragStartY;
        scrollPos = dragStartScroll + delta;
        wrapScrollPos();
        applyTransform();

        const now = performance.now();
        const dt = now - lastDragTime;
        if (dt > 0) velocity = ((e.clientY - lastDragY) / dt) * 16.67;
        lastDragY = e.clientY;
        lastDragTime = now;
    });

    function endDrag(e) {
        if (!isDragging) return;
        isDragging = false;
        scrollBox.classList.remove('dragging');
        try { scrollBox.releasePointerCapture(e.pointerId); } catch (err) {}
        scheduleResume(1000);
    }
    scrollBox.addEventListener('pointerup', endDrag);
    scrollBox.addEventListener('pointercancel', endDrag);

    // --- মাউস হুইল / ট্র্যাকপ্যাড দিয়ে স্ক্রল ---
    scrollBox.addEventListener('wheel', (e) => {
        e.preventDefault();
        isPaused = true;
        velocity = 0;
        scrollPos -= e.deltaY * 0.55;
        wrapScrollPos();
        applyTransform();
        scheduleResume(1100);
    }, { passive: false });
}

/* --- বাটন ধরে রেখে ম্যানুয়াল স্ক্রল (অ্যাক্সেসিবিলিটির জন্য রাখা হলো) --- */
let manualScrollInterval;
function startManualScroll(direction) {
    isPaused = true;
    velocity = 0;
    clearInterval(manualScrollInterval);
    manualScrollInterval = setInterval(() => {
        scrollPos -= direction * 4;
        wrapScrollPos();
        applyTransform();
    }, 16);
}
function stopManualScroll() {
    clearInterval(manualScrollInterval);
    scheduleResume(800);
}

document.addEventListener('DOMContentLoaded', initScrollBoxInteractions);
requestAnimationFrame(autoScrollLoop);
