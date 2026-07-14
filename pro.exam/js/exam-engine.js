// ============================================================
// exam-engine.js — পরীক্ষা চালনা: প্রশ্ন রেন্ডার, নেভিগেশন, টাইমার
// ============================================================
// --- EXAM ENGINE ---
// অপটিমাইজেশন নোট: আগে পুরো appData.questions (গোটা ব্যাংক) থেকে ফিল্টার করা
// হতো। এখন স্টুডেন্ট শুধু তার নির্বাচিত class+subject এর প্রশ্নগুলোই fetch করে —
// বাকি সব ক্লাস/বিষয়ের ডাটা তার ডিভাইসে নামেই না।
async function initializeExam() {
    const startBtn = document.querySelector('#step2Settings .btn-primary');
    if (startBtn) { startBtn.disabled = true; startBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> প্রশ্ন লোড হচ্ছে...'; }

    let filtered = [];
    try {
        const snap = await dbQuestions.ref(`qbank/${studentData.class}/${studentData.subject}`).once('value');
        if (snap.exists()) {
            const data = snap.val();
            filtered = Object.keys(data).map(id => ({ id, class: studentData.class, subject: studentData.subject, ...data[id] }));
        }
    } catch (err) {
        showToast('প্রশ্ন লোড করতে সমস্যা হয়েছে: ' + err.message, 'error');
        if (startBtn) { startBtn.disabled = false; startBtn.innerHTML = '<i class="fas fa-play-circle"></i> পরীক্ষা শুরু করুন'; }
        return;
    }

    if (startBtn) { startBtn.disabled = false; startBtn.innerHTML = '<i class="fas fa-play-circle"></i> পরীক্ষা শুরু করুন'; }
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
