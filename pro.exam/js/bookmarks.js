// ============================================================
// bookmarks.js — প্রশ্ন বুকমার্ক করা/সরানো ও সিঙ্ক করা
//
// === অপটিমাইজেশন নোট ===
// আগে syncBookmarks() এবং fetchBookmarks() — দুটো আলাদা ফাংশনই একই পাথ
// (bookmarks/{uid}) এ আলাদা আলাদা .on() লিসেনার বসাতো। মানে প্রতিটি আপডেটে
// একই ডাটা দুইবার ডাউনলোড হতো। এখন একটাই লিসেনার (attachBookmarksListener)
// userBookmarks অ্যারে ও UI — দুটোই একসাথে আপডেট করে।
// ============================================================

let bookmarksRef = null;

function attachBookmarksListener() {
    if (!studentData.uid) return;
    detachBookmarksListener();
    bookmarksRef = db.ref(`bookmarks/${studentData.uid}`);
    bookmarksRef.on('value', snap => {
        const list = document.getElementById('bookContent');

        if (!snap.exists()) {
            userBookmarks = [];
            list.innerHTML = '<p class="text-center text-muted" style="margin-top:20px;">কোনো বুকমার্ক নেই।</p>';
            return;
        }

        const data = snap.val();
        userBookmarks = Object.keys(data);

        let html = '';
        Object.keys(data).forEach(key => {
            const q = data[key];
            html += `<div class="history-card" style="font-size:14px;">
                <b style="color:var(--primary)">${q.subject} (${q.class}):</b> <span style="font-weight:bold;">${q.text}</span><br>
                <div style="margin-top:8px; display:flex; flex-direction:column; gap:4px;">
                    <span style="color:var(--text-main);"><i class="far fa-circle text-muted"></i> A. ${q.options.A}</span>
                    <span style="color:var(--text-main);"><i class="far fa-circle text-muted"></i> B. ${q.options.B}</span>
                    <span style="color:var(--text-main);"><i class="far fa-circle text-muted"></i> C. ${q.options.C}</span>
                    <span style="color:var(--text-main);"><i class="far fa-circle text-muted"></i> D. ${q.options.D}</span>
                </div>
                <div style="margin-top:10px; color:var(--success); font-weight:bold; border-top:1px dashed var(--border); padding-top:8px;">
                    <i class="fas fa-check-circle"></i> সঠিক উত্তর: ${q.correct}
                </div>
            </div>`;
        });
        list.innerHTML = html;
    });
}

function detachBookmarksListener() {
    if (bookmarksRef) {
        bookmarksRef.off();
        bookmarksRef = null;
    }
}

function toggleBookmark() {
    if(!studentData.uid) return;
    const q = examState.questions[examState.currentIndex];
    const ref = db.ref(`bookmarks/${studentData.uid}/${q.id}`);
    const btn = document.getElementById('bookmarkCurrentBtn');
    
    if(userBookmarks.includes(q.id)) {
        ref.remove();
        btn.classList.remove('active');
        btn.innerHTML = '<i class="far fa-bookmark"></i> বুকমার্ক';
        showToast('বুকমার্ক রিমুভ হয়েছে!');
    } else {
        ref.set(q); 
        btn.classList.add('active');
        btn.innerHTML = '<i class="fas fa-bookmark"></i> সেভড';
        showToast('প্রশ্ন বুকমার্ক করা হয়েছে!', 'success');
    }
    // attachBookmarksListener() ইতিমধ্যে .on() দিয়ে লাইভ শুনছে, তাই userBookmarks ও
    // bookContent UI স্বয়ংক্রিয়ভাবেই আপডেট হয়ে যাবে — এখানে আলাদা করে আবার fetch করার দরকার নেই
}
