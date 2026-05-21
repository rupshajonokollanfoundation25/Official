import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword, sendPasswordResetEmail, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
import { getDatabase, ref, set, onDisconnect } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-database.js";

// 🔴 সিকিউরিটি জোন: এখানে আপনার অনুমোদিত ইমেইলগুলোর লিস্ট দিন
const ALLOWED_EMAILS = [
    "imranahmedimran8911@gmail.com",
    "imranmahbub9@gmail.com",
    "imran.info.me@gmail.com"
]; 

// আপনার ফায়ারবেস কনফিগারেশন
const firebaseConfig = {
  apiKey: "AIzaSyDZ-VBMlJsPscpM4RoxZDiPFOHfSzlLRDw",
  authDomain: "imran-bro-ddc88.firebaseapp.com",
  databaseURL: "https://imran-bro-ddc88-default-rtdb.firebaseio.com",
  projectId: "imran-bro-ddc88",
  storageBucket: "imran-bro-ddc88.firebasestorage.app",
  messagingSenderId: "1088716769061",
  appId: "1:1088716769061:web:c90307ec5f21899b27bccc"
};

// ফায়ারবেস ইনিশিয়ালাইজ
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);
const googleProvider = new GoogleAuthProvider();

// ==========================================
// UI Utilities (লোডার এবং স্মার্ট টোস্ট)
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
// স্মার্ট Auth Logic (মাল্টি-ইমেইল চেকিং)
// ==========================================
const loginSection = document.getElementById('login-section');
const dashboardSection = document.getElementById('dashboard-section');

// ১. ইমেইল-পাসওয়ার্ড দিয়ে লগইন
document.getElementById('btn-login-email').addEventListener('click', async () => {
    const email = document.getElementById('email-input').value.trim();
    const password = document.getElementById('password-input').value;

    if (!email || !password) return showToast('দয়া করে ইমেইল ও পাসওয়ার্ড দিন!');
    
    // ইমেইল লিস্টে আছে কিনা চেক করা
    if (!ALLOWED_EMAILS.includes(email)) return showToast('আপনি অনুমোদিত অ্যাডমিন নন!', 'error');

    showLoader();
    try {
        await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
        hideLoader();
        if(error.code === 'auth/invalid-credential') showToast('ভুল ইমেইল বা পাসওয়ার্ড!');
        else showToast(error.message);
    }
});

// ২. Google দিয়ে লগইন
document.getElementById('btn-login-google').addEventListener('click', async () => {
    showLoader();
    try {
        const result = await signInWithPopup(auth, googleProvider);
        
        // গুগল দিয়ে লগইন করলেও ইমেইল লিস্ট চেক করবে
        if (!ALLOWED_EMAILS.includes(result.user.email)) {
            await signOut(auth);
            hideLoader();
            showToast('অ্যাক্সেস ডিনাইড! শুধুমাত্র অনুমোদিত ইমেইল গ্রহণ করা হয়।', 'error');
        }
    } catch (error) {
        hideLoader();
        showToast('লগইন বাতিল করা হয়েছে!');
    }
});

// ৩. পাসওয়ার্ড রিসেট (Forgot Password)
document.getElementById('btn-forgot-password').addEventListener('click', async () => {
    const email = document.getElementById('email-input').value.trim();
    if (!email) return showToast('আগে বক্সে আপনার ইমেইলটি লিখুন!');
    
    showLoader();
    try {
        await sendPasswordResetEmail(auth, email);
        hideLoader();
        showToast('রিসেট লিংক আপনার ইমেইলে পাঠানো হয়েছে!', 'success');
    } catch (error) {
        hideLoader();
        showToast('সমস্যা হয়েছে: ' + error.message);
    }
});

// ৪. লগআউট
document.getElementById('btn-logout').addEventListener('click', () => {
    showLoader();
    signOut(auth);
});

// ৫. Auth State Observer (ইউজার লগইন থাকলে ড্যাশবোর্ড দেখাবে)
onAuthStateChanged(auth, (user) => {
    hideLoader();
    // লগইন সফল এবং ইমেইল লিস্টে থাকলে
    if (user && ALLOWED_EMAILS.includes(user.email)) {
        loginSection.classList.replace('active', 'hidden');
        dashboardSection.classList.replace('hidden', 'active');
        
        document.getElementById('user-name').innerText = user.displayName || "Pro Admin";
        if (user.photoURL) document.getElementById('user-photo').src = user.photoURL;
        
        // লগইন হওয়ার পর PeerJS চালু করা
        initWebRTC(); 
    } else {
        // লগআউট থাকলে বা অন্য কেউ হলে
        dashboardSection.classList.replace('active', 'hidden');
        loginSection.classList.replace('hidden', 'active');
        document.getElementById('email-input').value = '';
        document.getElementById('password-input').value = '';
        stopLiveStream();
    }
});

// ==========================================
// WebRTC (PeerJS) & Firebase Live Auto Sync
// ==========================================
let peer, myPeerId, currentStream;

function initWebRTC() {
    if (peer) return; // একবার চালু হলে আবার করবে না
    peer = new Peer();
    
    // কানেকশন ওপেন হলে আইডি সেট করা
    peer.on('open', (id) => {
        myPeerId = id;
        document.getElementById('my-id').innerText = id;
    });

    // কেউ কানেক্ট হতে চাইলে
    peer.on('call', (call) => {
        if (currentStream) call.answer(currentStream); // লাইভ থাকলে স্ক্রিন দিয়ে দিবে
        else call.answer(); // না থাকলে শুধু কানেকশন রিসিভ করবে
    });
}

const btnStartLive = document.getElementById('btn-start-live');
const btnStopLive = document.getElementById('btn-stop-live');
const statusIndicator = document.querySelector('.status-indicator');

// লাইভ স্ক্রিন শেয়ার শুরু করা
btnStartLive.addEventListener('click', async () => {
    try {
        // স্ক্রিন ক্যাপচার
        currentStream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
        
        // ব্রাউজার থেকে শেয়ার অফ করলে
        currentStream.getVideoTracks()[0].onended = stopLiveStream;

        // ম্যাজিক: Firebase এ ডাটা পুশ করা (যাতে ইউজাররা অটোমেটিক লাইভ পায়)
        const dbRef = ref(database, 'liveConfig/adminStream');
        await set(dbRef, { active: true, peerId: myPeerId, timestamp: Date.now() });
        
        // নেট চলে গেলে ডাটা অটো রিমুভ হবে
        onDisconnect(dbRef).remove(); 

        // UI আপডেট
        btnStartLive.classList.add('hidden');
        btnStopLive.classList.remove('hidden');
        statusIndicator.style.color = '#4ade80'; // গ্রিন কালার
        statusIndicator.style.boxShadow = '0 0 20px rgba(74, 222, 128, 0.5)';
        
        showToast('লাইভ ব্রডকাস্ট শুরু হয়েছে!', 'success');

    } catch (err) {
        showToast('স্ক্রিন শেয়ার বাতিল করা হয়েছে!');
    }
});

// লাইভ বন্ধ করার ফাংশন
async function stopLiveStream() {
    if (currentStream) {
        currentStream.getTracks().forEach(track => track.stop());
        currentStream = null;
    }
    
    // ফায়ারবেস থেকে লাইভ স্ট্যাটাস মুছে ফেলা
    await set(ref(database, 'liveConfig/adminStream'), null);
    
    // UI আপডেট
    btnStartLive.classList.remove('hidden');
    btnStopLive.classList.add('hidden');
    statusIndicator.style.color = 'var(--primary)'; // আগের কালার
    statusIndicator.style.boxShadow = 'none';
}

btnStopLive.addEventListener('click', stopLiveStream);
