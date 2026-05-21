import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword, sendPasswordResetEmail, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
import { getDatabase, ref, set, onDisconnect } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-database.js";

// 🔴 অনুমোদিত ইমেইল লিস্ট (এখানে আপনার ইচ্ছামত কমা দিয়ে মেইল যুক্ত করুন)
const ALLOWED_EMAILS = [
    "imranahmedimran8911@gmail.com",
    "admin1@example.com",
    "your-email@gmail.com"
]; 

// ফায়ারবেস কনফিগারেশন ডাটা
const firebaseConfig = {
  apiKey: "AIzaSyDZ-VBMlJsPscpM4RoxZDiPFOHfSzlLRDw",
  authDomain: "imran-bro-ddc88.firebaseapp.com",
  databaseURL: "https://imran-bro-ddc88-default-rtdb.firebaseio.com",
  projectId: "imran-bro-ddc88",
  storageBucket: "imran-bro-ddc88.firebasestorage.app",
  messagingSenderId: "1088716769061",
  appId: "1:1088716769061:web:c90307ec5f21899b27bccc"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);
const googleProvider = new GoogleAuthProvider();

// ==========================================
// UI ইউটিলিটি ফাংশন (টোস্ট ও লোডার)
// ==========================================
const loader = document.getElementById('loader');
const showLoader = () => loader.classList.remove('hidden');
const hideLoader = () => loader.classList.add('hidden');

function showToast(msg, type = 'error') {
    const toast = document.getElementById('toast');
    document.getElementById('toast-msg').innerText = msg;
    const icon = document.getElementById('toast-icon');
    
    toast.className = `toast show ${type}`;
    icon.className = type === 'success' ? 'fa-solid fa-circle-check' : 'fa-solid fa-circle-exclamation';
    
    setTimeout(() => toast.classList.remove('show'), 4000);
}

// ==========================================
// মডার্ন অথেন্টিকেশন কন্ট্রোল প্যানেল
// ==========================================
const loginSection = document.getElementById('login-section');
const dashboardSection = document.getElementById('dashboard-section');

// ইমেইল দিয়ে সাইন ইন
document.getElementById('btn-login-email').addEventListener('click', async () => {
    const email = document.getElementById('email-input').value.trim();
    const password = document.getElementById('password-input').value;

    if (!email || !password) return showToast('দয়া করে ইমেইল ও পাসওয়ার্ড দিন!');
    if (!ALLOWED_EMAILS.includes(email)) return showToast('আপনার এই প্যানেলে প্রবেশাধিকার নেই!', 'error');

    showLoader();
    try {
        await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
        hideLoader();
        if(error.code === 'auth/invalid-credential') showToast('ভুল ইমেইল বা পাসওয়ার্ড!');
        else showToast(error.message);
    }
});

// গুগল একাউন্ট দিয়ে সাইন ইন
document.getElementById('btn-login-google').addEventListener('click', async () => {
    showLoader();
    try {
        const result = await signInWithPopup(auth, googleProvider);
        if (!ALLOWED_EMAILS.includes(result.user.email)) {
            await signOut(auth);
            hideLoader();
            showToast('অ্যাক্সেস ডিনাইড! জিমেইল অনুমোদিত তালিকাভুক্ত নয়।', 'error');
        }
    } catch (error) {
        hideLoader();
        showToast('লগইন প্রসেস বাতিল করা হয়েছে!');
    }
});

// পাসওয়ার্ড রিসেট লিংক পাঠানো
document.getElementById('btn-forgot-password').addEventListener('click', async () => {
    const email = document.getElementById('email-input').value.trim();
    if (!email) return showToast('রিসেট লিংক পাঠাতে আগে ইমেইলটি বক্সে লিখুন!');
    
    showLoader();
    try {
        await sendPasswordResetEmail(auth, email);
        hideLoader();
        showToast('পাসওয়ার্ড রিসেট লিংক ইমেইলে পাঠানো হয়েছে!', 'success');
    } catch (error) {
        hideLoader();
        showToast('ত্রুটি: ' + error.message);
    }
});

// একাউন্ট সাইন আউট
document.getElementById('btn-logout').addEventListener('click', () => {
    showLoader();
    signOut(auth);
});

// লগইন অবস্থা পর্যবেক্ষণ (State Tracker)
onAuthStateChanged(auth, (user) => {
    hideLoader();
    if (user && ALLOWED_EMAILS.includes(user.email)) {
        loginSection.classList.replace('active', 'hidden');
        dashboardSection.classList.replace('hidden', 'active');
        
        document.getElementById('user-name').innerText = user.displayName || "Pro Admin";
        if (user.photoURL) document.getElementById('user-photo').src = user.photoURL;
        
        showToast('প্যানেলে স্বাগতম, অ্যাডমিন!', 'success');
        initWebRTC(); 
    } else {
        dashboardSection.classList.replace('active', 'hidden');
        loginSection.classList.replace('hidden', 'active');
        document.getElementById('email-input').value = '';
        document.getElementById('password-input').value = '';
        stopLiveStream();
    }
});

// ==========================================
// WebRTC (PeerJS) এবং ফায়ারবেস অটো-সিঙ্ক লজিক
// ==========================================
let peer, myPeerId, currentStream;

function initWebRTC() {
    if (peer) return; 
    peer = new Peer();
    
    peer.on('open', (id) => {
        myPeerId = id;
        document.getElementById('my-id').innerText = id;
    });

    peer.on('call', (call) => {
        if (currentStream) call.answer(currentStream);
        else call.answer();
    });
}

const btnStartLive = document.getElementById('btn-start-live');
const btnStopLive = document.getElementById('btn-stop-live');
const statusIndicator = document.querySelector('.status-indicator');

// স্ক্রিন শেয়ার শুরু করার ক্র্যাশ-প্রুফ লজিক
btnStartLive.addEventListener('click', async () => {
    // ব্রাউজার সিকিউরিটি এনভায়রনমেন্ট চেক
    if (!navigator.mediaDevices || !navigator.mediaDevices.getDisplayMedia) {
        return showToast('ইনসিকিউর কনটেক্সট! এটি চালু করতে VS Code Live Server বা HTTPS লিঙ্ক ব্যবহার করুন।', 'error');
    }

    let stream = null;
    showLoader();

    try {
        // প্রথম চেষ্টা: অডিও এবং ভিডিও দুটোর রিকোয়েস্ট পাঠানো
        stream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
    } catch (firstErr) {
        console.warn("Audio mix failed, trying video only...", firstErr);
        try {
            // দ্বিতীয় চেষ্টা (ফলব্যাক): অডিও ডিভাইসে ঝামেলা থাকলে কেবল ভিডিও ট্র্যাকিং ওপেন হবে
            stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        } catch (secondErr) {
            hideLoader();
            return showToast('শেয়ারিং উইন্ডো নির্বাচন করা হয়নি বা বাতিল করা হয়েছে।', 'error');
        }
    }

    hideLoader();

    if (stream) {
        currentStream = stream;
        currentStream.getVideoTracks()[0].onended = stopLiveStream;

        try {
            // ডাটাবেসে রিয়েল-টাইম আইডি পুশ করা
            const dbRef = ref(database, 'liveConfig/adminStream');
            await set(dbRef, { active: true, peerId: myPeerId, timestamp: Date.now() });
            onDisconnect(dbRef).remove(); 

            // ড্যাশবোর্ড বাটন টগল এবং গ্লোয়িং এফেক্ট
            btnStartLive.classList.add('hidden');
            btnStopLive.classList.remove('hidden');
            statusIndicator.style.color = '#4ade80';
            statusIndicator.style.boxShadow = '0 0 25px rgba(74, 222, 128, 0.6)';
            
            showToast('লাইভ ব্রডকাস্ট সফলভাবে চালু হয়েছে!', 'success');
        } catch (dbErr) {
            showToast('ফায়ারবেস ডাটাবেস রাইট এরর: রুলস চেক করুন।');
        }
    }
});

// লাইভ স্ক্রিন শেয়ার বন্ধ করার মেথড
async function stopLiveStream() {
    if (currentStream) {
        currentStream.getTracks().forEach(track => track.stop());
        currentStream = null;
    }
    
    try {
        await set(ref(database, 'liveConfig/adminStream'), null);
    } catch(e){}
    
    btnStartLive.classList.remove('hidden');
    btnStopLive.classList.add('hidden');
    statusIndicator.style.color = 'var(--primary)';
    statusIndicator.style.boxShadow = 'none';
}

btnStopLive.addEventListener('click', stopLiveStream);
