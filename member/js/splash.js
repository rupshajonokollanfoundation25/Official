/* =========================================================
   splash.js — লোডিং স্প্ল্যাশ স্ক্রিন
   ========================================================= */
(function () {
    const progressBar    = document.getElementById('progress-bar');
    const percentageText = document.getElementById('percentage');
    const splash          = document.getElementById('splash-screen');

    if (!progressBar || !splash) return;

    const totalDuration  = 2500; // মিলিসেকেন্ড
    const updateInterval = 50;
    const step = 100 / (totalDuration / updateInterval);

    let progress = 0;

    const timer = setInterval(() => {
        progress += step;
        if (progress >= 100) {
            progress = 100;
            clearInterval(timer);
            hideSplashScreen();
        }
        const currentProgress = Math.floor(progress);
        progressBar.style.width = currentProgress + '%';
        percentageText.textContent = currentProgress + '%';
    }, updateInterval);

    function hideSplashScreen() {
        splash.classList.add('fade-out');
        setTimeout(() => {
            splash.style.display = 'none';
        }, 800);
    }
})();
