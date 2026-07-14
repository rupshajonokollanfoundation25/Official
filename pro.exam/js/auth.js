// ============================================================
// auth.js — লগইন/লগআউট (স্টুডেন্ট গুগল লগইন + গেস্ট লগইন + অ্যাডমিন ইমেইল লগইন)
//
// === আপডেট নোট ===
// dbQuestions একটি সম্পূর্ণ আলাদা Firebase প্রজেক্টে (group-chat-74483) থাকায়
// এখানে auth (মূল প্রজেক্ট) দিয়ে লগইন করলেই ঐ প্রজেক্টে auth != null হয় না।
// তাই এখন Google/Guest/Admin — প্রতিটি লগইনেই দুই প্রজেক্টেই (auth + authQuestions)
// একসাথে সাইন-ইন করা হচ্ছে, যাতে Realtime Database Rules সঠিকভাবে auth যাচাই করতে পারে।
//
// গেস্ট মোড: সাইনআপ ছাড়াই Firebase Anonymous Auth দিয়ে সর্বোচ্চ ২টি ফ্রি পরীক্ষা।
// ============================================================

function studentGoogleLogin() {
    auth.signInWithPopup(googleProvider).then(() => {
        // cross-project credential reuse কাজ করে না (audience mismatch), তাই ২য় প্রজেক্টে আলাদাভাবে সাইন-ইন করানো হচ্ছে
        return authQuestions.signInWithPopup(googleProvider);
    }).catch((error) => {
        showToast('গুগল লগইন ব্যর্থ: ' + error.message, 'error');
    });
}

function continueAsGuest() {
    auth.signInAnonymously().then(() => {
        return authQuestions.signInAnonymously();
    }).catch((error) => {
        showToast('গেস্ট মোড চালু করতে সমস্যা হয়েছে: ' + error.message, 'error');
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
            showToast('গুগল লগইন সফল হয়েছে!');
        } else if (user.isAnonymous) {
            // --- গেস্ট ইউজার ---
            studentData.name = 'গেস্ট ইউজার';
            studentData.email = '';
            studentData.uid = user.uid;

            document.getElementById('profileBtn').classList.add('hidden'); // গেস্টের প্রোফাইল/হিস্ট্রি প্যানেল নেই
            document.getElementById('step1Info').classList.add('hidden');
            document.getElementById('step2Settings').classList.remove('hidden');

            switchView('studentSetupView');
            showToast('গেস্ট হিসেবে প্রবেশ করেছেন। সর্বোচ্চ ২টি পরীক্ষা দিতে পারবেন।');
        } else {
            // --- অ্যাডমিন (ইমেইল/পাসওয়ার্ড) ---
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
    if(!email || !pass) return showToast('ইমেইল ও পাসওয়ার্ড দিন', 'error');
    auth.signInWithEmailAndPassword(email, pass)
        .then(() => authQuestions.signInWithEmailAndPassword(email, pass)) // group-chat-74483 তেও একই ইমেইল/পাসওয়ার্ড দিয়ে অ্যাডমিন ইউজার ম্যানুয়ালি তৈরি করে রাখতে হবে
        .catch(err => showToast('লগইন ব্যর্থ: ' + err.message, 'error'));
}

function adminLogout() {
    // লগআউটের সময় সব সক্রিয় লিসেনার বন্ধ করে দেয়া হয়, যাতে পরবর্তী লগইনে
    // পুরনো লিসেনার জমে থেকে ডাটা দ্বিগুণ/তিনগুণ ডাউনলোড না হয়
    detachAdminQuestionsListener();
    detachHistoryListener();
    detachBookmarksListener();
    auth.signOut();
    authQuestions.signOut();
}
