// ============================================================
// admin-panel.js — অ্যাডমিন প্যানেল: প্রশ্ন যোগ/মুছা, বাল্ক ইম্পোর্ট, CSV এক্সপোর্ট
//
// === অপটিমাইজেশন নোট ===
// আগে এখানে dbQuestions.ref('questions').on('value', ...) সরাসরি ফাইলের
// টপ-লেভেলে বসানো ছিল — মানে যেকোনো ভিজিটর (এমনকি সাধারণ স্টুডেন্ট) সাইটে
// ঢুকলেই পুরো প্রশ্ন ব্যাংক ডাউনলোড হয়ে যেত, এবং .on() কখনো বন্ধ (off) হতো না।
// এখন এই লিসেনার শুধু অ্যাডমিন লগইন করলেই চালু হয় (auth.js থেকে কল হয়) এবং
// লগআউট করলে বন্ধ (detach) হয়ে যায়।
//
// প্রশ্ন ব্যাংকের নতুন স্ট্রাকচার:
//   qbank/{class}/{subject}/{pushId}  → প্রতিটি প্রশ্ন
//   subjectsIndex/{class}/{subject}   → শুধু "true" (হালকা ইনডেক্স, স্টুডেন্ট সাইড
//                                        থেকে ক্লাস সিলেক্ট করলে কোন কোন বিষয় আছে
//                                        তা জানতে পুরো ব্যাংক না ছুঁয়েই কাজ চলে)
// ============================================================

let adminQuestionsRef = null; // অ্যাডমিন লগইন থাকা অবস্থায় সক্রিয় থাকা লিসেনারের রেফারেন্স

// অ্যাডমিন লগইন করলে auth.js থেকে এটি কল হয়
function attachAdminQuestionsListener() {
    if (adminQuestionsRef) return; // আগে থেকেই চালু থাকলে দ্বিতীয়বার লিসেনার বসাবে না
    adminQuestionsRef = dbQuestions.ref('qbank');
    adminQuestionsRef.on('value', snap => {
        appData.questions = [];
        const data = snap.val();
        if (data) {
            Object.keys(data).forEach(cls => {
                Object.keys(data[cls]).forEach(subject => {
                    Object.keys(data[cls][subject]).forEach(id => {
                        appData.questions.push({ id, class: cls, subject, ...data[cls][subject][id] });
                    });
                });
            });
        }
        renderAdminQList();
    });
}

// অ্যাডমিন লগআউট করলে auth.js থেকে এটি কল হয় — ডাটা খরচ বাঁচাতে লিসেনার বন্ধ করে দেয়
function detachAdminQuestionsListener() {
    if (adminQuestionsRef) {
        adminQuestionsRef.off();
        adminQuestionsRef = null;
    }
    appData.questions = [];
}

function fetchAdminSettings() {
    db.ref('settings').on('value', snap => {
        if(snap.val()) {
            appData.adminSettings = snap.val();
            document.getElementById('negMarkToggle').checked = appData.adminSettings.negativeMarking;
        } else {
            document.getElementById('negMarkToggle').checked = true; 
        }
    });
}

function saveAdminSettings() {
    const isNeg = document.getElementById('negMarkToggle').checked;
    db.ref('settings').set({ negativeMarking: isNeg });
    showToast(`নেগেটিভ মার্কিং ${isNeg ? 'চালু' : 'বন্ধ'} করা হয়েছে।`);
}

// --- Admin Question Operations ---
document.getElementById('addQuestionForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('saveBtn'); btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> সেভ হচ্ছে...'; btn.disabled = true;

    const cls = document.getElementById('qClass').value;
    const subject = document.getElementById('qSubject').value.trim();
    const qData = {
        text: document.getElementById('qText').value.trim(),
        options: { A: document.getElementById('optA').value.trim(), B: document.getElementById('optB').value.trim(), C: document.getElementById('optC').value.trim(), D: document.getElementById('optD').value.trim() },
        correct: document.getElementById('qCorrect').value,
        explanation: document.getElementById('qExplanation').value.trim() 
    };

    try {
        await dbQuestions.ref(`qbank/${cls}/${subject}`).push(qData);
        await dbQuestions.ref(`subjectsIndex/${cls}/${subject}`).set(true);
        showToast('প্রশ্ন যুক্ত হয়েছে!'); e.target.reset();
    } 
    catch (err) { showToast('এরর: ' + err.message, 'error'); }
    finally { btn.innerHTML = '<i class="fas fa-save"></i> সেভ করুন'; btn.disabled = false; }
});

async function processBulkImport() {
    const jsonStr = document.getElementById('bulkJsonInput').value.trim();
    if(!jsonStr) return showToast('JSON ডেটা দিন', 'error');
    try {
        const data = JSON.parse(jsonStr);
        if(!Array.isArray(data)) throw new Error("ডেটা অ্যারে (Array) ফরম্যাটে হতে হবে");
        
        showToast('আপলোড শুরু হয়েছে...', 'success');
        let count = 0;
        const subjectIndexUpdates = {};
        for(let q of data) {
            if(q.class && q.subject && q.text && q.options && q.correct) {
                const { class: cls, subject, ...qData } = q;
                await dbQuestions.ref(`qbank/${cls}/${subject}`).push(qData);
                subjectIndexUpdates[`subjectsIndex/${cls}/${subject}`] = true;
                count++;
            }
        }
        if (Object.keys(subjectIndexUpdates).length) await dbQuestions.ref().update(subjectIndexUpdates);
        showToast(`${count} টি প্রশ্ন সফলভাবে আপলোড হয়েছে!`, 'success');
        document.getElementById('bulkJsonInput').value = '';
    } catch (e) { showToast('JSON ফরমেট ভুল: ' + e.message, 'error'); }
}

function renderAdminQList() {
    const list = document.getElementById('adminQuestionList');
    document.getElementById('totalQCount').innerText = appData.questions.length;
    if(appData.questions.length === 0) return list.innerHTML = '<p class="text-center text-muted" style="margin-top:20px;">কোনো প্রশ্ন নেই</p>';
    list.innerHTML = '';
    appData.questions.slice().reverse().forEach(q => {
        list.innerHTML += `<div class="card" style="padding:15px; margin-bottom:10px; display:flex; justify-content:space-between; align-items:flex-start;">
            <div style="flex:1; padding-right:10px;">
                <span style="font-size:12px; background:var(--primary-light); color:var(--primary); padding:3px 8px; border-radius:6px; font-weight:bold;">${q.class} | ${q.subject}</span>
                <p style="margin-top:8px; font-size:15px; font-weight:600; color:var(--text-main);">${q.text}</p>
                <p style="font-size:13px; color:var(--success); margin-top:5px; font-weight:bold;"><i class="fas fa-check"></i> Ans: ${q.correct}</p>
                ${q.explanation ? `<p style="font-size:12px; color:var(--text-muted); margin-top:5px; padding-left:5px; border-left:2px solid var(--border);"><i class="fas fa-info-circle"></i> ${q.explanation}</p>` : ''}
            </div>
            <button onclick="deleteQuestion('${q.id}','${q.class}','${q.subject}')" class="btn-icon" style="background:rgba(239, 68, 68, 0.1); color:var(--danger); border:none; cursor:pointer;"><i class="fas fa-trash-alt"></i></button>
        </div>`;
    });
}

function deleteQuestion(id, cls, subject) { 
    if(confirm('প্রশ্নটি মুছে ফেলতে চান? এটি আর ফেরত পাওয়া যাবে না।')) dbQuestions.ref(`qbank/${cls}/${subject}/${id}`).remove(); 
}

function downloadCSV(filename, rows) {
    let csvContent = "data:text/csv;charset=utf-8," + rows.map(e => e.join(",")).join("\n");
    let encodedUri = encodeURI(csvContent);
    let link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", filename);
    document.body.appendChild(link); link.click(); document.body.removeChild(link);
}

function exportQuestionsCSV() {
    let rows = [["Class", "Subject", "Question", "Option_A", "Option_B", "Option_C", "Option_D", "Correct_Answer", "Explanation"]];
    appData.questions.forEach(q => {
        rows.push([q.class, q.subject, `"${q.text.replace(/"/g, '""')}"`, `"${q.options.A}"`, `"${q.options.B}"`, `"${q.options.C}"`, `"${q.options.D}"`, q.correct, `"${(q.explanation||"").replace(/"/g, '""')}"`]);
    });
    downloadCSV("ProExam_Question_Bank.csv", rows);
}

function exportResultsCSV() {
    db.ref('user_history').once('value').then(snap => {
        let rows = [["User_Name", "Date", "Class", "Subject", "Score", "Total", "Correct", "Wrong"]];
        if(snap.exists()) {
            const data = snap.val();
            Object.keys(data).forEach(uid => {
                Object.keys(data[uid]).forEach(key => {
                    let h = data[uid][key];
                    let dateStr = new Date(h.date).toLocaleString();
                    rows.push([`"${h.name || 'Unknown'}"`, `"${dateStr}"`, h.class, h.subject, h.score, h.total, h.correct, h.wrong]);
                });
            });
        } else {
            return showToast('কোনো রেজাল্ট ডাটা নেই', 'error');
        }
        downloadCSV("ProExam_All_Results.csv", rows);
    });
}

// ============================================================
// === এককালীন মাইগ্রেশন টুল (One-time Migration) ===
// পুরনো ফ্ল্যাট স্ট্রাকচার questions/{id} থেকে নতুন নেস্টেড স্ট্রাকচার
// qbank/{class}/{subject}/{id} এ ডাটা কপি করে, subjectsIndex বানায়,
// এবং user_history স্ক্যান করে leaderboard নোড তৈরি করে।
// অ্যাডমিন প্যানেল থেকে এটি ম্যানুয়ালি, মাত্র একবার চালাতে হবে।
// ============================================================
async function runOneTimeOptimizationMigration() {
    if (!confirm('এটি পুরনো ডাটা নতুন অপটিমাইজড স্ট্রাকচারে কপি করবে। এটি একবারই চালানো উচিত। এগিয়ে যেতে চান?')) return;
    showToast('মাইগ্রেশন শুরু হয়েছে, একটু সময় লাগতে পারে...', 'success');

    try {
        // ধাপ ১: প্রশ্ন ব্যাংক মাইগ্রেশন
        const qSnap = await dbQuestions.ref('questions').once('value');
        let qCount = 0;
        if (qSnap.exists()) {
            const data = qSnap.val();
            const updates = {};
            Object.keys(data).forEach(id => {
                const q = data[id];
                if (!q.class || !q.subject) return;
                const { class: cls, subject, ...rest } = q;
                updates[`qbank/${cls}/${subject}/${id}`] = rest;
                updates[`subjectsIndex/${cls}/${subject}`] = true;
                qCount++;
            });
            if (Object.keys(updates).length) await dbQuestions.ref().update(updates);
        }

        // ধাপ ২: user_history থেকে leaderboard তৈরি
        const hSnap = await db.ref('user_history').once('value');
        let lCount = 0;
        if (hSnap.exists()) {
            const data = hSnap.val();
            const lbUpdates = {};
            Object.keys(data).forEach(uid => {
                let totalScore = 0, exams = 0, name = 'অজানা শিক্ষার্থী';
                Object.keys(data[uid]).forEach(key => {
                    totalScore += parseFloat(data[uid][key].score || 0);
                    exams++;
                    if (data[uid][key].name) name = data[uid][key].name;
                });
                lbUpdates[`leaderboard/${uid}`] = { name, totalScore: parseFloat(totalScore.toFixed(2)), exams };
                lCount++;
            });
            if (Object.keys(lbUpdates).length) await db.ref().update(lbUpdates);
        }

        showToast(`মাইগ্রেশন সম্পন্ন! ${qCount} টি প্রশ্ন ও ${lCount} জন স্টুডেন্টের লিডারবোর্ড আপডেট হয়েছে। এখন চাইলে Firebase Console থেকে পুরনো 'questions' নোডটি ম্যানুয়ালি মুছে ফেলতে পারেন।`, 'success');
    } catch (err) {
        showToast('মাইগ্রেশনে সমস্যা হয়েছে: ' + err.message, 'error');
    }
}
