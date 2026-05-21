import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword, sendPasswordResetEmail, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
import { getDatabase, ref, set, onDisconnect } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyDZ-VBMlJsPscpM4RoxZDiPFOHfSzlLRDw",
  authDomain: "imran-bro-ddc88.firebaseapp.com",
  databaseURL: "https://imran-bro-ddc88-default-rtdb.firebaseio.com",
  projectId: "imran-bro-ddc88",
  storageBucket: "imran-bro-ddc88.firebasestorage.app",
  messagingSenderId: "1088716769061",
  appId: "1:1088716769061:web:c90307ec5f21899b27bccc",
  measurementId: "G-VDXLSDEL2S"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const database = getDatabase(app);

// 🔴 শুধুমাত্র এই ইমেইলটি লগইন করতে পারবে! 
const ALLOWED_ADMIN_EMAIL = "admin@example.com"; // এখানে আপনার আসল ইমেইল দিন

// UI Elements
const loginSection = document.getElementById('login-section');
const dashboardSection = document.getElementById('dashboard-section');
const emailInput = document.getElementById('email-input');
const passwordInput = document.getElementById('password-input');

// কাস্টম টোস্ট ফাংশন (Smart Error Handling)
function showToast(msg, type = "error") {
    const toast = document.getElementById('toast-box');
    const icon = document.getElementById('toast-icon');
    document.getElementById('toast-msg').innerText = msg;
    
    toast.className = "toast show " + type;
    icon.className = type === "error" ? "fa-solid fa-circle-xmark" : "fa-solid fa-circle-check";
    
    setTimeout(() => { toast.classList.remove('show'); }, 3000);
}

// ==========================================
// লগইন সিস্টেম
// ==========================================

// ইমেইল-পাসওয়ার্ড লগইন
document.getElementById('btn-login-email').addEventListener('click', () => {
    const email = emailInput.value.trim();
    const password = passwordInput.value;

    if (!email || !password) return showToast("ইমেইল এবং পাসওয়ার্ড দিন!");
    
    // সিকিউরিটি চেক
    if (email !== ALLOWED_ADMIN_EMAIL) {
        return showToast("আপনার এই প্যানেলে প্রবেশাধিকার নেই!", "error");
    }

    signInWithEmailAndPassword(auth, email, password)
        .catch(error => {
            if(error.code === 'auth/wrong-password') showToast("ভুল পাসওয়ার্ড!");
            else if(error.code === 'auth/user-not-found') showToast("এই ইমেইলটি রেজিস্টার্ড নয়!");
            else showToast(error.message);
        });
});

// গুগল লগইন
document.getElementById('btn-login-google').addEventListener('click', () => {
    signInWithPopup(auth, provider).then((result) => {
        // গুগল দিয়ে লগইন করার পরও ইমেইল চেক করবে
        if (result.user.email !== ALLOWED_ADMIN_EMAIL) {
            signOut(auth); // ইমেইল না মিললে সাথে সাথে লগআউট
            showToast("আপনি অনুমোদিত অ্যাডমিন নন!", "error");
        }
    }).catch(error => showToast(error.message, "error"));
});

// পাসওয়ার্ড রিসেট (Forgot Password)
document.getElementById('btn-forgot-password').addEventListener('click', () => {
    const email = emailInput.value.trim();
    if (!email) {
        return showToast("পাসওয়ার্ড রিসেট করতে আগে বক্সে ইমেইল লিখুন!", "error");
    }
    
    sendPasswordResetEmail(auth, email)
        .then(() => showToast("পাসওয়ার্ড রিসেট লিংক ইমেইলে পাঠানো হয়েছে!", "success"))
        .catch(error => showToast("সমস্যা হয়েছে: " + error.message, "error"));
});

// লগআউট
document.getElementById('btn-logout').addEventListener('click', () => signOut(auth));

// ==========================================
// Auth State Observer
// ==========================================
onAuthStateChanged(auth, (user) => {
    if (user && user.email === ALLOWED_ADMIN_EMAIL) {
        // লগইন সফল
        loginSection.classList.remove('active');
        dashboardSection.classList.remove('hidden');
        dashboardSection.classList.add('active');
        
        document.getElementById('user-name').innerText = user.displayName || "Admin";
        if(user.photoURL) document.getElementById('user-photo').src = user.photoURL;
        
        showToast("লগইন সফল হয়েছে!", "success");
        initPeer();
    } else {
        // লগআউট বা ভুল ইউজার
        dashboardSection.classList.remove('active');
        dashboardSection.classList.add('hidden');
        loginSection.classList.add('active');
        emailInput.value = "";
        passwordInput.value = "";
        stopLiveStream();
    }
});

// ==========================================
// PeerJS এবং লাইভ ব্রডকাস্ট লজিক (আগের মতোই)
// ==========================================
let peer, currentPeerId, localStream;

function initPeer() {
    if(peer) return;
    peer = new Peer();
    peer.on('open', (id) => {
        currentPeerId = id;
        document.getElementById('my-id').innerText = id;
    });
    peer.on('call', (call) => {
        if(localStream) call.answer(localStream);
        else call.answer();
    });
}

const btnStartLive = document.getElementById('btn-start-live');
const btnStopLive = document.getElementById('btn-stop-live');

btnStartLive.addEventListener('click', async () => {
    try {
        localStream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
        localStream.getVideoTracks()[0].onended = stopLiveStream;

        const liveRef = ref(database, 'live/admin_stream');
        set(liveRef, { active: true, peerId: currentPeerId });
        onDisconnect(liveRef).remove();

        btnStartLive.classList.add('hidden');
        btnStopLive.classList.remove('hidden');
        showToast("লাইভ ব্রডকাস্ট শুরু হয়েছে!", "success");
    } catch (err) {
        showToast("স্ক্রিন শেয়ার বাতিল করা হয়েছে!", "error");
    }
});

function stopLiveStream() {
    if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
        localStream = null;
    }
    set(ref(database, 'live/admin_stream'), null);
    btnStartLive.classList.remove('hidden');
    btnStopLive.classList.add('hidden');
}
