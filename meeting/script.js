import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { 
    getAuth, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    onAuthStateChanged, 
    signOut, 
    sendPasswordResetEmail, 
    updateProfile, 
    sendEmailVerification, 
    GoogleAuthProvider, 
    signInWithPopup 
} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyD80uA81X3bkwiousPwXpIv6OKkk1k2icA",
    authDomain: "rjfoundation-25.firebaseapp.com",
    projectId: "rjfoundation-25",
    storageBucket: "rjfoundation-25.firebasestorage.app",
    messagingSenderId: "469641336275",
    appId: "1:469641336275:web:e79889fb0247f352f04b26"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// নোটিফিকেশন ফাংশন
const notify = (msg, type) => {
    const el = document.getElementById('auth-msg');
    el.innerHTML = msg;
    el.style.display = 'block';
    el.style.background = type === 'err' ? '#ffebee' : '#e8f5e9';
    el.style.color = type === 'err' ? '#c62828' : '#2e7d32';
};

// গুগল সাইন ইন
document.getElementById('googleLoginBtn').addEventListener('click', () => {
    signInWithPopup(auth, provider).then((result) => {
        console.log("Google Login Success");
    }).catch((error) => {
        notify("⚠️ গুগল লগইন ব্যর্থ হয়েছে!", "err");
    });
});

window.togglePassword = (inputId, icon) => {
    const input = document.getElementById(inputId);
    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.replace('fa-eye', 'fa-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.replace('fa-eye-slash', 'fa-eye');
    }
};

window.showForm = (type) => {
    document.getElementById('login-form').style.display = type === 'login' ? 'block' : 'none';
    document.getElementById('signup-form').style.display = type === 'signup' ? 'block' : 'none';
    document.getElementById('reset-form').style.display = type === 'reset' ? 'block' : 'none';
    document.getElementById('auth-msg').style.display = 'none';
};

// রেজিস্ট্রেশন লজিক
document.getElementById('signupSubmit').addEventListener('click', () => {
    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const pass = document.getElementById('signup-pass').value;
    if(!name) return notify("⚠️ নাম লিখুন", "err");
    
    createUserWithEmailAndPassword(auth, email, pass).then((res) => {
        updateProfile(res.user, { displayName: name }).then(() => {
            sendEmailVerification(res.user).then(() => {
                notify("<b>সফলভাবে অ্যাকাউন্ট তৈরি হয়েছে!</b><br>আপনার ইমেইলে একটি ভেরিফিকেশন লিঙ্ক পাঠানো হয়েছে। লিঙ্কটি ক্লিক করে ভেরিফাই করুন। <br><i>(ইনবক্সে না পেলে Spam মেসেজে দেখুন)</i>", "success");
                signOut(auth); 
                setTimeout(() => showForm('login'), 8000); 
            });
        });
    }).catch(e => notify("⚠️ রেজিস্ট্রেশন হয়নি! ইমেইল সঠিক কি না বা পাসওয়ার্ড কমপক্ষে ৬ অক্ষর কি না দেখুন।", "err"));
});

// লগইন লজিক
document.getElementById('loginSubmit').addEventListener('click', () => {
    const email = document.getElementById('login-email').value;
    const pass = document.getElementById('login-pass').value;
    signInWithEmailAndPassword(auth, email, pass).catch(e => notify("⚠️ ইমেইল বা পাসওয়ার্ড ভুল অথবা ভেরিফিকেশন করা হয়নি!", "err"));
});

// পাসওয়ার্ড রিসেট
document.getElementById('resetSubmit').addEventListener('click', () => {
    const email = document.getElementById('reset-email').value;
    sendPasswordResetEmail(auth, email).then(() => notify("রিসেট লিঙ্ক পাঠানো হয়েছে!", "success")).catch(() => notify("ইউজার পাওয়া যায়নি!", "err"));
});

// লগআউট
window.logoutUser = () => signOut(auth);

// অথেন্টিকেশন স্টেট পরিবর্তন হ্যান্ডলার
onAuthStateChanged(auth, (user) => {
    if (user) {
        const isGoogleUser = user.providerData.some(p => p.providerId === 'google.com');
        
        if(user.emailVerified || isGoogleUser) {
            document.getElementById('auth-screen').style.display = 'none';
            document.getElementById('main-content').style.display = 'flex';
            
            const displayName = user.displayName || 'ইউজার';
            document.getElementById('userNameDisplay').innerText = `স্বাগতম, ${displayName}`;
            document.getElementById('userLiveBadge').innerText = displayName;

        } else {
            notify("<b>আপনার ইমেইলটি ভেরিফাই করা হয়নি!</b><br>অনুগ্রহ করে আপনার ইমেইল ইনবক্স (অথবা Spam ফোল্ডার) চেক করুন এবং লিঙ্কটি ক্লিক করুন।", "err");
            signOut(auth);
        }
    } else {
        document.getElementById('auth-screen').style.display = 'flex';
        document.getElementById('main-content').style.display = 'none';
    }
});

// ডার্ক মোড টগল
window.toggleDarkMode = () => {
    document.body.classList.toggle('dark-theme');
    const icon = document.querySelector('#themeIcon i');
    if(icon.classList.contains('fa-moon')) {
        icon.classList.replace('fa-moon', 'fa-sun');
    } else {
        icon.classList.replace('fa-sun', 'fa-moon');
    }
};

// সাইড মেনু টগল
window.toggleSideMenu = () => {
    const menu = document.getElementById('sideMenu');
    const overlay = document.getElementById('overlay');
    
    menu.classList.toggle('active');
    
    if (menu.classList.contains('active')) {
        overlay.style.display = 'block';
    } else {
        overlay.style.display = 'none';
    }
};
