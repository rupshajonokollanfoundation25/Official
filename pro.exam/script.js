// --- Theme Management ---
function initTheme() {
    const savedTheme = localStorage.getItem('proExamTheme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
}
function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('proExamTheme', next);
    updateThemeIcon(next);
}
function updateThemeIcon(theme) {
    const icon = document.getElementById('themeIcon');
    icon.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
}
initTheme();

// --- 1. Init Firebase & EmailJS ---
(function(){ emailjs.init("dtl9HyOi2wvJEUiRB"); })();

const firebaseConfigPrivate = {
    apiKey: "AIzaSyCIY-BYnwTFmgF15seuuqSwvig5FHNyRkI",
    authDomain: "pro-exam-centre.firebaseapp.com",
    databaseURL: "https://pro-exam-centre-default-rtdb.firebaseio.com", 
    projectId: "pro-exam-centre",
    storageBucket: "pro-exam-centre.firebasestorage.app",
    messagingSenderId: "1060274973140",
    appId: "1:1060274973140:web:3933e72262987eac910e41"
};

const firebaseConfigQuestions = {
    apiKey: "AIzaSyA2FOd_BoCqcu49ijp5ffB1kdPB56PHz3Y",
    authDomain: "group-chat-74483.firebaseapp.com",
    databaseURL: "https://group-chat-74483-default-rtdb.firebaseio.com",
    projectId: "group-chat-74483",
    storageBucket: "group-chat-74483.firebasestorage.app",
    messagingSenderId: "1033238887345",
    appId: "1:1033238887345:web:2f4d10eabaf33e8e481b90"
};

if (!firebase.apps.length) { 
    firebase.initializeApp(firebaseConfigPrivate); 
}

const questionApp = firebase.initializeApp(firebaseConfigQuestions, "QuestionApp");

const db = firebase.database(); 
const auth = firebase.auth(); 
const dbQuestions = questionApp.database(); 
const googleProvider = new firebase.auth.GoogleAuthProvider();

// --- State Variables ---
let appData = { questions: [], adminSettings: { negativeMarking: true } };
let studentData = { name: '', email: '', uid: '', class: '', subject: '', qCount: 0, timeMin: 0 };
let examState = { active: false, questions: [], answers: {}, currentIndex: 0, timerInterval: null };
let userBookmarks = [];

// --- Custom UI Utilities ---
function showToast(msg, type='success') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-triangle'}"></i> <span>${msg}</span>`;
    container.appendChild(toast);
    setTimeout(() => { toast.style.animation = 'slideOut 0.4s forwards'; setTimeout(() => toast.remove(), 400); }, 3000);
}

function switchView(viewId) {
    ['adminPanel', 'studentSetupView', 'examFocusUI', 'resultUI'].forEach(id => document.getElementById(id).classList.add('hidden'));
    document.getElementById(viewId).classList.remove('hidden');
    window.scrollTo({top: 0, behavior: 'smooth'});
}

// --- Sidebar Control Functions ---
function toggleProfileSidebar() {
    const sidebar = document.getElementById('profileSidebar');
    const overlay = document.getElementById('sidebarOverlay');
    if (sidebar.classList.contains('open')) {
        sidebar.classList.remove('open');
        overlay.classList.remove('active');
    } else {
        sidebar.classList.add('open');
        overlay.classList.add('active');
    }
}

function toggleDetails(key) {
    document.getElementById('details-' + key).classList.toggle('hidden');
}

function switchProfTab(tab) {
    document.getElementById('tabHist').classList.remove('active');
    document.getElementById('tabAnal').classList.remove('active');
    document.getElementById('tabBook').classList.remove('active');
    
    document.getElementById('historyList').classList.add('hidden');
    document.getElementById('analContent').classList.add('hidden');
    document.getElementById('bookContent').classList.add('hidden');
    
    if(tab==='hist') { document.getElementById('tabHist').classList.add('active'); document.getElementById('historyList').classList.remove('hidden'); }
    if(tab==='anal') { document.getElementById('tabAnal').classList.add('active'); document.getElementById('analContent').classList.remove('hidden'); }
    if(tab==='book') { document.getElementById('tabBook').classList.add('active'); document.getElementById('bookContent').classList.remove('hidden'); }
}

function fetchStudentHistory(uid) {
    db.ref('user_history/' + uid).on('value', snap => {
        const list = document.getElementById('historyList');
        if (!snap.val()) {
            generateAnalytics(null); 
            return list.innerHTML = '<p class="text-center text-muted" style="margin-top: 20px;">কোনো হিস্টরি পাওয়া যায়নি।</p>';
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

    let html = '<h4 style="margin-bottom:15px; color:var(--text-main);">বিষয়ভিত্তিক একুরেসি</h4>';
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
            
            fetchStudentHistory(user.uid); 
            syncBookmarks(); 
            fetchBookmarks(); 

            switchView('studentSetupView');
            showToast('গুগল লগইন সফল হয়েছে!');
        } else {
            switchView('adminPanel');
            closeLoginModal();
            showToast('অ্যাডমিন প্যানেলে স্বাগতম!');
            fetchAdminSettings();
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
function adminLogout() { auth.signOut(); }

// --- Database Fetch ---
dbQuestions.ref('questions').on('value', snap => {
    appData.questions = [];
    if(snap.val()) Object.keys(snap.val()).forEach(key => appData.questions.push({ id: key, ...snap.val()[key] }));
    renderAdminQList();
});

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
    showToast(`নেগেটিভ মার্কিং ${isNeg ? 'চালু' : 'বন্ধ'} করা হয়েছে।`);
}

// --- Admin Question Operations ---
document.getElementById('addQuestionForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('saveBtn'); btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> সেভ হচ্ছে...'; btn.disabled = true;
    
    const qData = {
        class: document.getElementById('qClass').value,
        subject: document.getElementById('qSubject').value.trim(),
        text: document.getElementById('qText').value.trim(),
        options: { A: document.getElementById('optA').value.trim(), B: document.getElementById('optB').value.trim(), C: document.getElementById('optC').value.trim(), D: document.getElementById('optD').value.trim() },
        correct: document.getElementById('qCorrect').value,
        explanation: document.getElementById('qExplanation').value.trim() 
    };

    try { await dbQuestions.ref('questions').push(qData); showToast('প্রশ্ন যুক্ত হয়েছে!'); e.target.reset(); } 
    catch (err) { showToast('এরর: ' + err.message, 'error'); }
    finally { btn.innerHTML = '<i class="fas fa-save"></i> সেভ করুন'; btn.disabled = false; }
});

async function processBulkImport() {
    const jsonStr = document.getElementById('bulkJsonInput').value.trim();
    if(!jsonStr) return showToast('JSON ডেটা দিন', 'error');
    try {
        const data = JSON.parse(jsonStr);
        if(!Array.isArray(data)) throw new Error("ডেটা অ্যারে (Array) ফরম্যাটে হতে হবে");
        
        showToast('আপলোড শুরু হয়েছে...', 'success');
        let count = 0;
        for(let q of data) {
            if(q.class && q.subject && q.text && q.options && q.correct) {
                await dbQuestions.ref('questions').push(q);
                count++;
            }
        }
        showToast(`${count} টি প্রশ্ন সফলভাবে আপলোড হয়েছে!`, 'success');
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
            <button onclick="deleteQuestion('${q.id}')" class="btn-icon" style="background:rgba(239, 68, 68, 0.1); color:var(--danger); border:none; cursor:pointer;"><i class="fas fa-trash-alt"></i></button>
        </div>`;
    });
}

function deleteQuestion(id) { 
    // Typo fixed below
    if(confirm('প্রশ্নটি মুছে ফেলতে চান? এটি আর ফেরত পাওয়া যাবে না।')) dbQuestions.ref('questions/'+id).remove(); 
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

// --- Leaderboard Logic ---
function openLeaderboard() {
    document.getElementById('leaderboardModal').style.display = 'grid';
    const list = document.getElementById('leaderboardList');
    list.innerHTML = '<p class="text-center text-muted" style="margin-top:20px;"><i class="fas fa-spinner fa-spin"></i> লোড হচ্ছে...</p>';
    
    db.ref('user_history').once('value').then(snap => {
        if(!snap.exists()) return list.innerHTML = '<p class="text-center text-muted" style="margin-top:20px;">কোনো ডাটা নেই</p>';
        let users = [];
        const data = snap.val();
        
        Object.keys(data).forEach(uid => {
            let totalScore = 0; let totalExams = 0; let name = "অজানা শিক্ষার্থী";
            Object.keys(data[uid]).forEach(key => {
                totalScore += parseFloat(data[uid][key].score || 0);
                totalExams++;
                if(data[uid][key].name) name = data[uid][key].name;
            });
            users.push({ uid, name, score: totalScore.toFixed(2), exams: totalExams });
        });
        
        users.sort((a,b) => b.score - a.score); 
        
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
    });
}
function closeLeaderboard() { document.getElementById('leaderboardModal').style.display = 'none'; }

// --- Student Setup Flow ---
function selectClass(cls) {
    studentData.class = cls;
    document.getElementById('btnSSC').className = cls==='SSC' ? 'btn btn-primary' : 'btn btn-outline';
    document.getElementById('btnHSC').className = cls==='HSC' ? 'btn btn-primary' : 'btn btn-outline';
    
    const subs = [...new Set(appData.questions.filter(q => q.class === cls).map(q => q.subject))];
    const grid = document.getElementById('subjectGrid');
    
    if(subs.length === 0) {
        grid.innerHTML = '<p style="color:var(--danger); grid-column:1/-1;">এই ক্লাসের কোনো প্রশ্ন নেই!</p>';
        document.getElementById('configWrapper').classList.add('hidden');
    } else {
        grid.innerHTML = '';
        subs.forEach(s => {
            const div = document.createElement('div');
            div.className = 'card'; div.style = 'margin:0; padding:15px; text-align:center; cursor:pointer; font-weight:600; transition:0.3s;';
            div.innerText = s;
            div.onclick = () => {
                document.querySelectorAll('#subjectGrid .card').forEach(el => { el.style.background='var(--surface)'; el.style.borderColor='var(--border)'; el.style.color='var(--text-main)'; });
                div.style.background = 'var(--primary-light)'; div.style.borderColor = 'var(--primary)'; div.style.color = 'var(--primary)';
                studentData.subject = s;
                document.getElementById('configWrapper').classList.remove('hidden');
                window.scrollTo({top: document.body.scrollHeight, behavior: 'smooth'});
            };
            grid.appendChild(div);
        });
    }
    document.getElementById('subjectWrapper').classList.remove('hidden');
}

function startExamValidation() {
    if(!studentData.subject) return showToast('বিষয় নির্বাচন করুন', 'error');
    studentData.qCount = parseInt(document.getElementById('userQCount').value);
    studentData.timeMin = parseInt(document.getElementById('userTimeLimit').value);
    
    if(!studentData.qCount || studentData.qCount < 1) return showToast('প্রশ্নের সংখ্যা দিন', 'error');
    if(!studentData.timeMin || studentData.timeMin < 1) return showToast('সময় দিন (মিনিট)', 'error');

    const lastExam = localStorage.getItem('last_exam_' + studentData.email);
    const now = new Date().getTime();
    if (lastExam && (now - lastExam < 180000)) { 
        const rem = Math.ceil((180000 - (now - lastExam)) / 1000);
        return showToast(`অপেক্ষা করুন! আবার পরীক্ষা দিতে পারবেন ${rem} সেকেন্ড পর।`, 'error');
    }

    initializeExam();
}

// --- EXAM ENGINE ---
function initializeExam() {
    let filtered = appData.questions.filter(q => q.class === studentData.class && q.subject === studentData.subject);
    if(filtered.length === 0) return showToast('পর্যাপ্ত প্রশ্ন নেই!', 'error');
    
    let limit = Math.min(studentData.qCount, filtered.length);
    examState.questions = filtered.sort(() => 0.5 - Math.random()).slice(0, limit); 
    examState.answers = {};
    examState.currentIndex = 0;
    examState.active = true;

    document.getElementById('timerBadgeUI').classList.remove('timer-critical');
    document.getElementById('reviewSection').classList.add('hidden');
    
    document.getElementById('examSubjectTitle').innerText = `${studentData.class} - ${studentData.subject}`;
    switchView('examFocusUI');
    
    const endTime = new Date().getTime() + (studentData.timeMin * 60 * 1000);
    sessionStorage.setItem('examEndTime', endTime);
    
    renderQuestionUI();
    runTimer();
}

function renderQuestionUI() {
    const q = examState.questions[examState.currentIndex];
    const total = examState.questions.length;
    const current = examState.currentIndex;

    document.getElementById('qCounterText').innerText = `Question ${current + 1} of ${total}`;
    document.getElementById('examProgress').style.width = `${((current) / total) * 100}%`;
    
    const bBtn = document.getElementById('bookmarkCurrentBtn');
    if(userBookmarks.includes(q.id)) {
        bBtn.classList.add('active');
        bBtn.innerHTML = '<i class="fas fa-bookmark"></i> সেভড';
    } else {
        bBtn.classList.remove('active');
        bBtn.innerHTML = '<i class="far fa-bookmark"></i> বুকমার্ক';
    }

    const qText = document.getElementById('liveQText');
    qText.style.opacity = 0;
    setTimeout(()=>{ qText.innerText = q.text; qText.style.opacity = 1; }, 150);

    let optsHtml = '';
    ['A','B','C','D'].forEach(opt => {
        const selected = examState.answers[current] === opt ? 'selected' : '';
        optsHtml += `<div class="option-label ${selected}" onclick="markAnswer('${opt}')" id="label-${opt}">
            <div class="option-letter">${opt}</div>
            <div style="flex:1;">${q.options[opt]}</div>
        </div>`;
    });
    document.getElementById('optionsRenderArea').innerHTML = optsHtml;

    document.getElementById('prevBtn').style.visibility = current === 0 ? 'hidden' : 'visible';
    if(current === total - 1) {
        document.getElementById('nextBtn').classList.add('hidden');
        document.getElementById('submitBtn').classList.remove('hidden');
    } else {
        document.getElementById('nextBtn').classList.remove('hidden');
        document.getElementById('submitBtn').classList.add('hidden');
    }
}

function markAnswer(opt) {
    examState.answers[examState.currentIndex] = opt;
    document.querySelectorAll('.option-label').forEach(el => el.classList.remove('selected'));
    document.getElementById(`label-${opt}`).classList.add('selected');
}

function navigateQuestion(step) { examState.currentIndex += step; renderQuestionUI(); }

function toggleBookmark() {
    if(!studentData.uid) return;
    const q = examState.questions[examState.currentIndex];
    const ref = db.ref(`bookmarks/${studentData.uid}/${q.id}`);
    const btn = document.getElementById('bookmarkCurrentBtn');
    
    if(userBookmarks.includes(q.id)) {
        ref.remove();
        userBookmarks = userBookmarks.filter(id => id !== q.id);
        btn.classList.remove('active');
        btn.innerHTML = '<i class="far fa-bookmark"></i> বুকমার্ক';
        showToast('বুকমার্ক রিমুভ হয়েছে!');
    } else {
        ref.set(q); 
        userBookmarks.push(q.id);
        btn.classList.add('active');
        btn.innerHTML = '<i class="fas fa-bookmark"></i> সেভড';
        showToast('প্রশ্ন বুকমার্ক করা হয়েছে!', 'success');
    }
    fetchBookmarks();
}

function syncBookmarks() {
    if(!studentData.uid) return;
    db.ref(`bookmarks/${studentData.uid}`).on('value', snap => {
        userBookmarks = snap.exists() ? Object.keys(snap.val()) : [];
    });
}

function fetchBookmarks() {
    if(!studentData.uid) return;
    db.ref(`bookmarks/${studentData.uid}`).on('value', snap => {
        const list = document.getElementById('bookContent');
        if(!snap.exists()) return list.innerHTML = '<p class="text-center text-muted" style="margin-top:20px;">কোনো বুকমার্ক নেই।</p>';
        let html = '';
        const data = snap.val();
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

function runTimer() {
    const badge = document.getElementById('timerBadgeUI');
    examState.timerInterval = setInterval(() => {
        const end = parseInt(sessionStorage.getItem('examEndTime'));
        const dist = end - new Date().getTime();
        
        if (dist <= 0) {
            clearInterval(examState.timerInterval);
            submitExamFinal();
        } else {
            let m = Math.floor((dist % (1000 * 60 * 60)) / (1000 * 60));
            let s = Math.floor((dist % (1000 * 60)) / 1000);
            document.getElementById('timerDisplay').innerText = `${m}:${s<10?'0':''}${s}`;
            
            if(dist < 60000 && !badge.classList.contains('timer-critical')) {
                badge.classList.add('timer-critical');
            }
        }
    }, 1000);
}

document.addEventListener("visibilitychange", () => {
    if (document.hidden && examState.active) {
        showToast('সতর্কতা: পরীক্ষার সময় অন্য ট্যাবে যাওয়া নিষেধ!', 'error');
    }
});

// --- Evaluation, Results & Review ---
function submitExamFinal() {
    examState.active = false;
    clearInterval(examState.timerInterval);
    sessionStorage.removeItem('examEndTime');

    let correct = 0, wrong = 0;
    const total = examState.questions.length;
    let mistakesHTMLForHistory = '';

    examState.questions.forEach((q, i) => {
        const userAns = examState.answers[i];
        if (userAns) {
            if (userAns === q.correct) {
                correct++;
            } else {
                wrong++;
                mistakesHTMLForHistory += `
                <div style="margin-bottom:10px; padding-bottom:8px; border-bottom:1px solid var(--border);">
                    <b><i class="fas fa-question-circle"></i></b> ${q.text}<br>
                    <span style="color:var(--danger);"><i class="fas fa-times"></i> আপনার উত্তর: ${q.options[userAns]}</span><br>
                    <span style="color:var(--success);"><i class="fas fa-check"></i> সঠিক উত্তর: ${q.options[q.correct]}</span>
                </div>`;
            }
        } else {
            mistakesHTMLForHistory += `
            <div style="margin-bottom:10px; padding-bottom:8px; border-bottom:1px solid var(--border);">
                <b><i class="fas fa-question-circle"></i></b> ${q.text}<br>
                <span style="color:var(--warning);"><i class="fas fa-exclamation-triangle"></i> আপনি কোনো উত্তর দেননি</span><br>
                <span style="color:var(--success);"><i class="fas fa-check"></i> সঠিক উত্তর: ${q.options[q.correct]}</span>
            </div>`;
        }
    });

    let negative = appData.adminSettings?.negativeMarking ? (wrong * 0.25) : 0;
    let finalScore = (correct - negative).toFixed(2);
    let percent = Math.round((correct / total) * 100);

    localStorage.setItem('last_exam_' + studentData.email, new Date().getTime());

    const userUid = auth.currentUser ? auth.currentUser.uid : studentData.uid;
    if(userUid) {
        db.ref('user_history/' + userUid).push({
            name: studentData.name, 
            date: new Date().getTime(),
            class: studentData.class,
            subject: studentData.subject,
            score: finalScore,
            total: total,
            correct: correct,
            wrong: wrong,
            mistakesHTML: mistakesHTMLForHistory
        }).catch(err => console.error("History Save Error:", err));
    }

    switchView('resultUI');
    animateValue("scoreDisplay", 0, parseFloat(finalScore), 1000);
    document.getElementById('percentDisplay').innerText = `${percent}% Accuracy`;
    document.getElementById('resCorrect').innerText = correct;
    document.getElementById('resWrong').innerText = wrong;
    document.getElementById('resNegative').innerText = negative.toFixed(2);
    document.getElementById('resTotal').innerText = total;

    generateReviewUI();
    dispatchEmailReport(correct, wrong, finalScore, total, percent, negative);
    showToast('পরীক্ষা সফলভাবে সম্পন্ন হয়েছে!', 'success');
}

function animateValue(id, start, end, duration) {
    if (start === end) return document.getElementById(id).innerHTML = end;
    let range = end - start;
    let current = start;
    let increment = end > start ? (range / (duration/20)) : -1;
    let stepTime = Math.abs(Math.floor(duration / range));
    let obj = document.getElementById(id);
    let timer = setInterval(function() {
        current += increment;
        if((increment > 0 && current >= end) || (increment < 0 && current <= end)){
            clearInterval(timer);
            obj.innerHTML = end;
        } else { obj.innerHTML = current.toFixed(2); }
    }, 20);
}

function generateReviewUI() {
    const area = document.getElementById('reviewContentArea');
    let html = '';
    examState.questions.forEach((q, i) => {
        const userAns = examState.answers[i];
        const isCorrect = userAns === q.correct;
        const isSkipped = !userAns;

        html += `<div class="review-box">
            <div class="review-q">প্রশ্ন ${i+1}: ${q.text}</div>`;
        
        ['A','B','C','D'].forEach(opt => {
            let cssClass = 'rev-opt';
            let icon = '';
            if(opt === q.correct) { cssClass += ' rev-correct'; icon='<i class="fas fa-check-circle" style="float:right;"></i>'; }
            else if(opt === userAns && !isCorrect) { cssClass += ' rev-wrong'; icon='<i class="fas fa-times-circle" style="float:right;"></i>'; }
            
            html += `<div class="${cssClass}"><b>${opt}.</b> ${q.options[opt]} ${icon}</div>`;
        });

        if(isSkipped) html += `<p style="color:var(--warning); margin-top:10px; font-weight:bold;"><i class="fas fa-exclamation-triangle"></i> আপনি উত্তর দেননি!</p>`;
        
        if (q.explanation) {
            html += `<div class="explanation-box"><i class="fas fa-lightbulb" style="color:var(--warning);"></i> <b>ব্যাখ্যা:</b> ${q.explanation}</div>`;
        }
        
        html += `</div>`;
    });
    area.innerHTML = html;
}

function toggleReviewMode() {
    const section = document.getElementById('reviewSection');
    section.classList.toggle('hidden');
    if(!section.classList.contains('hidden')) {
        window.scrollTo({top: section.offsetTop, behavior: 'smooth'});
    }
}

function dispatchEmailReport(c, w, score, total, pct, neg) {
    const statusTxt = document.getElementById('emailStatusText');
    statusTxt.innerHTML = '<i class="fas fa-spinner fa-spin"></i> ইমেইলে রিপোর্ট তৈরি হচ্ছে...';
    
    let details = "";
    examState.questions.forEach((q, i) => { details += `Q${i+1}: ${q.text}\nYour Ans: ${examState.answers[i]||'Skipped'} | Correct: ${q.correct}\n\n`; });

    const templateParams = {
        user_name: studentData.name, user_email: studentData.email, subject: studentData.subject,
        q_count: total, correct_count: c, wrong_count: w, negative_mark: neg.toFixed(2),
        final_score: score, percentage: pct + "%", solution_details: details
    };

    emailjs.send('service_272nuuq', 'template_hlm44yd', templateParams)
        .then(() => statusTxt.innerHTML = '<span style="color:#a7f3d0; font-weight:bold;"><i class="fas fa-check-circle"></i> ডিটেইলড রিপোর্ট ইমেইলে পাঠানো হয়েছে।</span>')
        .catch(() => statusTxt.innerHTML = '<span style="color:#fecaca;"><i class="fas fa-exclamation-circle"></i> ইমেইল সার্ভার ব্যস্ত আছে।</span>');
}

function resetToHome() {
    if(examState.active && !confirm('পরীক্ষা মাঝপথে বাতিল করতে চান?')) return;
    examState.active = false;
    clearInterval(examState.timerInterval);
    location.reload();
}









document.addEventListener('DOMContentLoaded', () => {
    const overlay = document.getElementById('pro-notice-overlay');
    const closeBtn = document.querySelector('.pro-close-btn');
    const displayDuration = 10000; // ২০ সেকেন্ড (মিলিসেকেন্ডে)
    let popupTimer;

    // সেশন স্টোরেজ চেক: ইউজার কি এই সেশনে আগে নোটিশ দেখেছে?
    if (!sessionStorage.getItem('noticeSeen')) {
        // পেজ লোড হওয়ার ৫০০ মিলিসেকেন্ড পর সুন্দরভাবে শো করবে
        setTimeout(() => {
            showNotice();
        }, 900);
    }

    function showNotice() {
        overlay.classList.add('active');
        
        // ২০ সেকেন্ড পর অটোমেটিক বন্ধ
        popupTimer = setTimeout(() => {
            closeNotice();
        }, displayDuration);
    }

    function closeNotice() {
        overlay.classList.remove('active');
        // সেশনে সেভ করে রাখছি যেন রিফ্রেশ দিলে আবার না আসে
        sessionStorage.setItem('noticeSeen', 'true');
        clearTimeout(popupTimer); // টাইমার ক্লিয়ার করা
    }

    // ১. ক্লোজ বাটনে ক্লিক করলে বন্ধ হবে
    if(closeBtn) {
        closeBtn.addEventListener('click', closeNotice);
    }

    // ২. পপ-আপের বাইরে (ব্যাকগ্রাউন্ডে) ক্লিক করলে বন্ধ হবে
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            closeNotice();
        }
    });

    // ৩. কীবোর্ডের 'Esc' বাটন চাপলে বন্ধ হবে
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && overlay.classList.contains('active')) {
            closeNotice();
        }
    });
});
