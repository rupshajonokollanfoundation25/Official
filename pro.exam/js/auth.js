// ============================================================
// auth.js — লগইন/লগআউট (স্টুডেন্ট গুগল লগইন + অ্যাডমিন ইমেইল লগইন)
// ============================================================
// --- Auth Logic ---
function studentGoogleLogin() {
    auth.signInWithPopup(googleProvider).catch((error) => {
        showToast('গুগল লগইন ব্যর্থ: ' + error.message, 'error');
    });
}

function confirmLogout() {
    if(confirm("আপনি কি নিশ্চিত যে আপনি লগআউট করতে চান?")) {
        adminLogout();
    }
}

auth.onAuthStateChanged(user => {
    if (user) {
        document.getElementById('adminLoginBtn').classList.add('hidden');
        document.getElementById('adminLogoutBtn').classList.remove('hidden');
        document.getElementById('leaderboardBtn').classList.remove('hidden'); 
        
        const isGoogleUser = user.providerData.some(p => p.providerId === 'google.com');
        
        if (isGoogleUser) {
            studentData.name = user.displayName;
            studentData.email = user.email;
            studentData.uid = user.uid;
            
            document.getElementById('step1Info').classList.add('hidden');
            document.getElementById('step2Settings').classList.remove('hidden');
            
            document.getElementById('profileBtn').classList.remove('hidden');
            document.getElementById('profName').innerText = user.displayName;
            document.getElementById('profEmail').innerText = user.email;
            if (user.photoURL) document.getElementById('profPic').src = user.photoURL;
            
            attachHistoryListener(user.uid);
            attachBookmarksListener();

            switchView('studentSetupView');
            showToast('গুগল লগইন সফল হয়েছে!');
        } else {
            switchView('adminPanel');
            closeLoginModal();
            showToast('অ্যাডমিন প্যানেলে স্বাগতম!');
            fetchAdminSettings();
            attachAdminQuestionsListener();
        }
    } else {
        document.getElementById('adminLoginBtn').classList.remove('hidden');
        document.getElementById('adminLogoutBtn').classList.add('hidden');
        document.getElementById('leaderboardBtn').classList.add('hidden');
        document.getElementById('profileBtn').classList.add('hidden');

        if(!examState.active && document.getElementById('resultUI').classList.contains('hidden')){
            document.getElementById('step1Info').classList.remove('hidden');
            document.getElementById('step2Settings').classList.add('hidden');
            switchView('studentSetupView');
        }
    }
});

function showLoginModal() { document.getElementById('adminLoginModal').style.display = 'grid'; }
function closeLoginModal() { document.getElementById('adminLoginModal').style.display = 'none'; document.getElementById('adminPass').value = ''; }
function processAdminLogin() {
    const email = document.getElementById('adminEmail').value;
    const pass = document.getElementById('adminPass').value;
    if(!email || !pass) return showToast('ইমেইল ও পাসওয়ার্ড দিন', 'error');
    auth.signInWithEmailAndPassword(email, pass).catch(err => showToast('লগইন ব্যর্থ: ' + err.message, 'error'));
}
function adminLogout() {
    // লগআউটের সময় সব সক্রিয় লিসেনার বন্ধ করে দেয়া হয়, যাতে পরবর্তী লগইনে
    // পুরনো লিসেনার জমে থেকে ডাটা দ্বিগুণ/তিনগুণ ডাউনলোড না হয়
    detachAdminQuestionsListener();
    detachHistoryListener();
    detachBookmarksListener();
    auth.signOut();
}
