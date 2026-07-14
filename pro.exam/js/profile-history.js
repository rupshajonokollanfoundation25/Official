// ============================================================
// profile-history.js — স্টুডেন্ট প্রোফাইলের হিস্ট্রি ও অ্যানালিটিক্স
//
// === অপটিমাইজেশন নোট ===
// আগে fetchStudentHistory(uid) সরাসরি .on() দিয়ে লিসেনার বসাতো এবং
// লগইন/লগআউট বারবার হলে (পেজ রিলোড ছাড়াই) পুরনো লিসেনার কখনো বন্ধ হতো না —
// ফলে একই ডাটা একাধিকবার ডাউনলোড হতো। এখন attach/detach প্যাটার্নে রাখা হলো।
// ============================================================

let historyRef = null;

function attachHistoryListener(uid) {
    detachHistoryListener(); // নিরাপত্তার জন্য আগে থেকে চালু থাকলে বন্ধ করে নতুন করে বসানো হয়
    historyRef = db.ref('user_history/' + uid);
    historyRef.on('value', snap => {
        const list = document.getElementById('historyList');
        if (!snap.val()) {
            generateAnalytics(null); 
            return list.innerHTML = '<p class="text-center text-muted" style="margin-top: 20px;">কোনো হিস্টরি পাওয়া যায়নি।</p>';
        }
        let html = '';
        const data = snap.val();
        generateAnalytics(data); 

        Object.keys(data).reverse().forEach(key => {
            const h = data[key];
            const dateStr = new Date(h.date).toLocaleString('bn-BD', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
            html += `
            <div class="history-card">
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <h5>${h.subject} (${h.class})</h5>
                    <span style="font-size:12px; font-weight:bold; color:var(--primary);">${h.score} / ${h.total}</span>
                </div>
                <p style="font-size:12px; color:var(--text-muted); margin-bottom:8px;"><i class="far fa-clock"></i> ${dateStr}</p>
                <div style="display:flex; gap:10px; font-size:13px; margin-bottom:10px;">
                    <span style="color:var(--success)"><i class="fas fa-check"></i> সঠিক: ${h.correct}</span>
                    <span style="color:var(--danger)"><i class="fas fa-times"></i> ভুল: ${h.wrong}</span>
                </div>
                ${h.mistakesHTML ? `<button class="btn btn-outline" style="padding:6px; font-size:12px; width:100%; border-radius:6px;" onclick="toggleDetails('${key}')">ভুলগুলো দেখুন <i class="fas fa-chevron-down"></i></button>
                <div id="details-${key}" class="hidden mistake-box">
                    ${h.mistakesHTML}
                </div>` : '<div class="mistake-box" style="border-left-color:var(--success); color:var(--success);"><i class="fas fa-star"></i> কোনো ভুল নেই! অসাধারণ!</div>'}
            </div>`;
        });
        list.innerHTML = html;
    }, err => {
        document.getElementById('historyList').innerHTML = `<p class="text-center text-danger" style="margin-top: 20px;">ডাটাবেজ কানেকশন সমস্যা: ${err.message}</p>`;
    });
}

function detachHistoryListener() {
    if (historyRef) {
        historyRef.off();
        historyRef = null;
    }
}

function generateAnalytics(historyData) {
    const anal = document.getElementById('analContent');
    if(!historyData) return anal.innerHTML = '<p class="text-center text-muted" style="margin-top:20px;">পর্যাপ্ত ডাটা নেই।</p>';
    
    let subjects = {};
    Object.keys(historyData).forEach(key => {
        let h = historyData[key];
        if(!subjects[h.subject]) subjects[h.subject] = { total: 0, score: 0 };
        subjects[h.subject].total += parseInt(h.total);
        subjects[h.subject].score += parseFloat(h.score);
    });

    let html = '<h4 style="margin-bottom:15px; color:var(--text-main);">বিষয়ভিত্তিক একুরেসি</h4>';
    Object.keys(subjects).forEach(sub => {
        let s = subjects[sub];
        let percent = s.total > 0 ? ((s.score / s.total) * 100).toFixed(0) : 0;
        if(percent < 0) percent = 0;
        
        html += `<div style="margin-bottom:15px; font-size:14px; background:var(--surface); padding:10px; border-radius:8px; border:1px solid var(--border);">
            <div style="display:flex; justify-content:space-between; margin-bottom:5px;">
                <b style="color:var(--primary);">${sub}</b> <span style="font-weight:bold;">${percent}% Accuracy</span>
            </div>
            <div class="analytics-bar"><div class="analytics-fill" style="width:${percent}%"></div></div>
        </div>`;
    });
    anal.innerHTML = html;
}
