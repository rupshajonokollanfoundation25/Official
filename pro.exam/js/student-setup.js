// ============================================================
// student-setup.js — স্টুডেন্টের ক্লাস/বিষয়/কনফিগারেশন সিলেকশন ফ্লো
//
// === অপটিমাইজেশন নোট ===
// আগে এখানে appData.questions (পুরো প্রশ্ন ব্যাংক, যা আগে প্রতি ভিজিটেই লোড
// হতো) থেকে ফিল্টার করে বিষয়ের তালিকা বের করা হতো। এখন স্টুডেন্ট সাইডে পুরো
// ব্যাংক লোডই হয় না — তাই এখন হালকা subjectsIndex/{class} নোড থেকে (মাত্র
// কয়েক বাইট ডাটা) বিষয়ের তালিকা আনা হচ্ছে।
// ============================================================

async function selectClass(cls) {
    studentData.class = cls;
    document.getElementById('btnSSC').className = cls==='SSC' ? 'btn btn-primary' : 'btn btn-outline';
    document.getElementById('btnHSC').className = cls==='HSC' ? 'btn btn-primary' : 'btn btn-outline';

    const grid = document.getElementById('subjectGrid');
    document.getElementById('subjectWrapper').classList.remove('hidden');
    document.getElementById('configWrapper').classList.add('hidden');
    grid.innerHTML = '<p class="text-muted" style="grid-column:1/-1;"><i class="fas fa-spinner fa-spin"></i> বিষয় লোড হচ্ছে...</p>';

    let subs = [];
    try {
        const snap = await dbQuestions.ref('subjectsIndex/' + cls).once('value');
        subs = snap.exists() ? Object.keys(snap.val()) : [];
    } catch (err) {
        grid.innerHTML = `<p style="color:var(--danger); grid-column:1/-1;">বিষয় লোড করতে সমস্যা হয়েছে: ${err.message}</p>`;
        return;
    }

    if(subs.length === 0) {
        grid.innerHTML = '<p style="color:var(--danger); grid-column:1/-1;">এই ক্লাসের কোনো প্রশ্ন নেই!</p>';
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
}

async function startExamValidation() {
    if(!studentData.subject) return showToast('বিষয় নির্বাচন করুন', 'error');
    studentData.qCount = parseInt(document.getElementById('userQCount').value);
    studentData.timeMin = parseInt(document.getElementById('userTimeLimit').value);
    
    if(!studentData.qCount || studentData.qCount < 1) return showToast('প্রশ্নের সংখ্যা দিন', 'error');
    if(!studentData.timeMin || studentData.timeMin < 1) return showToast('সময় দিন (মিনিট)', 'error');

    const lastExam = localStorage.getItem('last_exam_' + studentData.email);
    const now = new Date().getTime();
    if (lastExam && (now - lastExam < 180000)) { 
        const rem = Math.ceil((180000 - (now - lastExam)) / 1000);
        return showToast(`অপেক্ষা করুন! আবার পরীক্ষা দিতে পারবেন ${rem} সেকেন্ড পর।`, 'error');
    }

    // --- গেস্ট ইউজারের জন্য ২টি ফ্রি পরীক্ষার সীমা যাচাই ---
    if (auth.currentUser && auth.currentUser.isAnonymous) {
        const snap = await db.ref('guest_usage/' + auth.currentUser.uid).once('value');
        const used = snap.exists() ? (snap.val().count || 0) : 0;
        if (used >= 2) {
            showToast('আপনার ২টি ফ্রি গেস্ট পরীক্ষা শেষ হয়ে গেছে! চালিয়ে যেতে Google দিয়ে সাইন-ইন করুন।', 'error');
            await auth.signOut();
            await authQuestions.signOut();
            return;
        }
    }

    initializeExam();
}
