// ============================================================
// scroll-handlers.js — স্ক্রল-টু-টপ বাটন ও নেভবার স্ক্রল ইফেক্ট
// ============================================================
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
