// === ১. সিকিউরিটি গার্ড (অ্যান্টি-ইনস্পেক্ট এবং অ্যান্টি-কপি) ===
document.addEventListener('contextmenu', event => event.preventDefault()); // Right Click Disable
document.onkeydown = function(e) {
    if(e.keyCode == 123) return false; // F12 Disable
    if(e.ctrlKey && e.shiftKey && e.keyCode == 'I'.charCodeAt(0)) return false; // Ctrl+Shift+I Disable
    if(e.ctrlKey && e.shiftKey && e.keyCode == 'J'.charCodeAt(0)) return false; // Ctrl+Shift+J Disable
    if(e.ctrlKey && e.keyCode == 'U'.charCodeAt(0)) return false; // Ctrl+U Disable
};

// === ২. ফায়ারবেস কনফিগারেশন ===
const firebaseConfig = {
    apiKey: "AIzaSyD80uA81X3bkwiousPwXpIv6OKkk1k2icA",
    authDomain: "rjfoundation-25.firebaseapp.com",
    projectId: "rjfoundation-25",
    storageBucket: "rjfoundation-25.firebasestorage.app",
    messagingSenderId: "469641336275",
    appId: "1:469641336275:web:e79889fb0247f352f04b26",
    databaseURL: "https://rjfoundation-25-default-rtdb.firebaseio.com" 
};

if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// === ৩. ইউআরএল চেকিং এবং UI সেটআপ ===
document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const mode = urlParams.get('mode');
    const actionCode = urlParams.get('oobCode');

    if (mode === 'verifyEmail' && actionCode) {
        document.getElementById('verify-ui').style.display = 'block';
    } else if (mode === 'resetPassword' && actionCode) {
        document.getElementById('reset-ui').style.display = 'block';
    } else {
        showMsg("অবৈধ বা মেয়াদোত্তীর্ণ লিঙ্ক! নিরাপত্তা জনিত কারণে রিডাইরেক্ট করা হচ্ছে...", false);
        setTimeout(() => window.location.href = "/", 3500);
    }

    // ইভেন্ট লিসেনার যুক্ত করা
    const passInput = document.getElementById('new-password');
    if(passInput) passInput.addEventListener('input', validatePassword);
    
    document.getElementById('togglePassword').addEventListener('click', togglePassVisibility);
    
    const submitBtn = document.getElementById('submit-btn');
    if(submitBtn) submitBtn.addEventListener('click', handlePasswordReset);
    
    const verifyBtn = document.getElementById('verify-btn');
    if(verifyBtn) verifyBtn.addEventListener('click', handleEmailVerification);
});

// === ৪. আল্ট্রা স্ট্রিক্ট পাসওয়ার্ড ভ্যালিডেশন ===
function validatePassword() {
    // ইনপুট স্যানিটাইজেশন (শুধু নিরাপদ ক্যারেক্টার অ্যালাও করবে)
    let rawInput = document.getElementById('new-password').value;
    const sanitizedInput = rawInput.replace(/<[^>]*>?/gm, ''); // XSS রোধ
    document.getElementById('new-password').value = sanitizedInput;
    
    const pass = sanitizedInput;
    const rules = {
        len: pass.length >= 8,
        upper: /[A-Z]/.test(pass),
        num: /[0-9]/.test(pass),
        special: /[!@#$%^&*(),.?":{}|<>]/.test(pass)
    };

    let strength = 0;
    for (const key in rules) {
        const el = document.getElementById(`rule-${key}`);
        if (rules[key]) {
            el.classList.add('valid');
            strength += 25;
        } else {
            el.classList.remove('valid');
        }
    }

    const bar = document.getElementById('strength-bar');
    bar.style.width = strength + "%";
    
    if(strength < 50) bar.style.backgroundColor = "#e0245e";
    else if(strength < 100) bar.style.backgroundColor = "#ffad1f";
    else bar.style.backgroundColor = "#17bf63";

    document.getElementById('submit-btn').disabled = (strength < 100);
}

function togglePassVisibility() {
    const input = document.getElementById('new-password');
    const type = input.type === 'password' ? 'text' : 'password';
    input.type = type;
    this.classList.toggle('fa-eye-slash');
}

// === ৫. রেট-লিমিটেড ফাংশন (স্প্যাম ক্লিক রোধ) ===
let isProcessing = false;

async function handleEmailVerification() {
    if (isProcessing) return;
    isProcessing = true;
    
    const actionCode = new URLSearchParams(window.location.search).get('oobCode');
    const btn = document.getElementById('verify-btn');
    toggleLoading(btn, true);
    
    try {
        await auth.applyActionCode(actionCode);
        showMsg("সফল! আপনার ইমেইল নিরাপদভাবে ভেরিফাই হয়েছে।", true);
        setTimeout(() => window.location.href = "/meeting/", 3000);
    } catch (error) {
        showMsg("লিঙ্কটি আর কাজ করছে না। দয়া করে নতুন লিঙ্ক রিকোয়েস্ট করুন।");
        toggleLoading(btn, false);
        isProcessing = false;
    }
}

async function handlePasswordReset() {
    if (isProcessing) return;
    isProcessing = true;

    const newPassword = document.getElementById('new-password').value;
    const actionCode = new URLSearchParams(window.location.search).get('oobCode');
    const btn = document.getElementById('submit-btn');
    toggleLoading(btn, true);
    
    try {
        await auth.verifyPasswordResetCode(actionCode);
        await auth.confirmPasswordReset(actionCode, newPassword);
        showMsg("অ্যাকাউন্ট সুরক্ষিত! পাসওয়ার্ড আপডেট হয়েছে।", true);
        setTimeout(() => window.location.href = "/meeting/", 3000);
    } catch (error) {
        showMsg("সিকিউরিটি টোকেন এক্সপায়ার হয়েছে। পুনরায় চেষ্টা করুন।");
        toggleLoading(btn, false);
        isProcessing = false;
    }
}

function toggleLoading(btn, isLoading) {
    btn.disabled = isLoading;
    btn.innerHTML = isLoading ? '<i class="fas fa-circle-notch fa-spin"></i> সিকিউর প্রসেসিং...' : btn.innerText;
}

function showMsg(text, success = false) {
    const msgDiv = document.getElementById('message');
    msgDiv.innerText = text;
    msgDiv.style.display = 'block';
    msgDiv.style.background = success ? "#e8f5e9" : "#ffebee";
    msgDiv.style.color = success ? "#2e7d32" : "#c62828";
    msgDiv.style.border = success ? "1px solid #c8e6c9" : "1px solid #ffcdd2";
}
