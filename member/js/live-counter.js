/* =========================================================
   live-counter.js — রিয়েল-টাইম ভিজিটর কাউন্টার (Firebase)
   ========================================================= */
(function () {
    const firebaseConfig = {
        apiKey: "AIzaSyDC0H-DW3avFnMRmipaI3qSyYLnb2B3CEU",
        authDomain: "rating-revieww.firebaseapp.com",
        databaseURL: "https://rating-revieww-default-rtdb.firebaseio.com",
        projectId: "rating-revieww",
        storageBucket: "rating-revieww.firebasestorage.app",
        messagingSenderId: "936802340652",
        appId: "1:936802340652:web:9283ff8a9ffcbee6686689"
    };

    function startSmartTracker() {
        if (typeof firebase === 'undefined') return;

        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
        }
        const db = firebase.database();
        const onlineUsersRef = db.ref('live_website_visitors');
        const counterDisplay = document.getElementById('active-users');
        const countBox = document.querySelector('.live-count-box');

        if (!counterDisplay || !countBox) return;

        let currentCount = 0;

        db.ref('.info/connected').on('value', (snap) => {
            if (snap.val() === true) {
                const myConnectionRef = onlineUsersRef.push();
                myConnectionRef.onDisconnect().remove();
                myConnectionRef.set({
                    device: navigator.platform,
                    joinedAt: firebase.database.ServerValue.TIMESTAMP
                });
            }
        });

        onlineUsersRef.on('value', (snapshot) => {
            const newCount = snapshot.numChildren() || 0;
            if (newCount !== currentCount) {
                counterDisplay.innerText = newCount;
                countBox.classList.remove('pop-anim');
                void countBox.offsetWidth;
                countBox.classList.add('pop-anim');
                currentCount = newCount;
            }
        });
    }

    document.addEventListener('DOMContentLoaded', startSmartTracker);
})();
