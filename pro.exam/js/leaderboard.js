// ============================================================
// leaderboard.js — টপ স্টুডেন্টস লিডারবোর্ড
//
// === অপটিমাইজেশন নোট ===
// আগে এখানে db.ref('user_history').once('value') দিয়ে প্রতিটি ইউজারের
// প্রতিটি এক্সাম-হিস্ট্রি এন্ট্রি স্ক্যান করে স্কোর যোগ করা হতো — ইউজার ও
// হিস্ট্রি যত বাড়বে, প্রতিবার লিডারবোর্ড খোলাই তত বেশি ডাটা খরচ করবে।
// এখন results.js প্রতি এক্সামের পর leaderboard/{uid} নোডে যোগফল আপডেট করে
// রাখে, তাই এখানে শুধু ওই ছোট নোডটাই পড়তে হয়। উপরন্তু ২ মিনিটের একটা
// sessionStorage ক্যাশ রাখা হলো, একই সেশনে বারবার খুললে দ্বিতীয়বার থেকে আর
// নেটওয়ার্ক কলই লাগবে না।
// ============================================================

const LEADERBOARD_CACHE_KEY = 'proExamLeaderboardCache';
const LEADERBOARD_CACHE_TTL_MS = 2 * 60 * 1000; // ২ মিনিট

function renderLeaderboard(users) {
    const list = document.getElementById('leaderboardList');
    if (users.length === 0) return list.innerHTML = '<p class="text-center text-muted" style="margin-top:20px;">কোনো ডাটা নেই</p>';

    let html = '';
    users.forEach((u, i) => {
        let medal = i===0?'<i class="fas fa-medal" style="color:#fbbf24; font-size:20px;"></i>':(i===1?'<i class="fas fa-medal" style="color:#94a3b8; font-size:20px;"></i>':(i===2?'<i class="fas fa-medal" style="color:#b45309; font-size:20px;"></i>':`<span style="color:var(--text-muted); font-weight:bold; font-size:16px;">#${i+1}</span>`));
        html += `<div class="leaderboard-row">
            <div style="font-weight:bold; font-size:16px; display:flex; align-items:center; gap:10px;">${medal} ${u.name}</div>
            <div style="text-align:right;">
                <div style="color:var(--primary); font-weight:bold; font-size:16px;">${u.score} Marks</div>
                <div style="font-size:12px; color:var(--text-muted)">${u.exams} Exams</div>
            </div>
        </div>`;
    });
    list.innerHTML = html;
}

// --- Leaderboard Logic ---
function openLeaderboard() {
    document.getElementById('leaderboardModal').style.display = 'grid';
    const list = document.getElementById('leaderboardList');

    // ক্যাশে সাম্প্রতিক ডাটা থাকলে সাথে সাথেই দেখিয়ে দেয়, নেটওয়ার্ক কল ছাড়াই
    try {
        const cached = JSON.parse(sessionStorage.getItem(LEADERBOARD_CACHE_KEY) || 'null');
        if (cached && (Date.now() - cached.time < LEADERBOARD_CACHE_TTL_MS)) {
            renderLeaderboard(cached.users);
            return;
        }
    } catch (e) { /* ক্যাশ পার্স করতে সমস্যা হলে সাইলেন্টলি ইগনোর করে নতুন করে fetch করবে */ }

    list.innerHTML = '<p class="text-center text-muted" style="margin-top:20px;"><i class="fas fa-spinner fa-spin"></i> লোড হচ্ছে...</p>';

    db.ref('leaderboard').once('value').then(snap => {
        if(!snap.exists()) return list.innerHTML = '<p class="text-center text-muted" style="margin-top:20px;">কোনো ডাটা নেই</p>';
        const data = snap.val();

        let users = Object.keys(data).map(uid => ({
            uid,
            name: data[uid].name || 'অজানা শিক্ষার্থী',
            score: (data[uid].totalScore || 0).toFixed(2),
            exams: data[uid].exams || 0
        }));

        users.sort((a,b) => b.score - a.score);

        sessionStorage.setItem(LEADERBOARD_CACHE_KEY, JSON.stringify({ time: Date.now(), users }));
        renderLeaderboard(users);
    }).catch(err => {
        list.innerHTML = `<p class="text-center text-danger" style="margin-top:20px;">লিডারবোর্ড লোড করতে সমস্যা হয়েছে: ${err.message}</p>`;
    });
}
function closeLeaderboard() { document.getElementById('leaderboardModal').style.display = 'none'; }
