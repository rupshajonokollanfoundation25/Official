// ============================================================
// results.js — ফলাফল হিসাব, রিভিউ UI, ইমেইল রিপোর্ট
// ============================================================
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

        // অপটিমাইজেশন নোট: লিডারবোর্ডের জন্য আর পুরো user_history স্ক্যান করতে হয় না।
        // প্রতি এক্সামের পর এই ছোট্ট leaderboard/{uid} নোডটি transaction দিয়ে আপডেট
        // হয় — লিডারবোর্ড খোলার সময় তাই এখন মাত্র কয়েক KB ডাটা পড়তে হয়।
        db.ref('leaderboard/' + userUid).transaction(current => {
            const prevScore = current && current.totalScore ? current.totalScore : 0;
            const prevExams = current && current.exams ? current.exams : 0;
            return {
                name: studentData.name,
                totalScore: parseFloat((prevScore + parseFloat(finalScore)).toFixed(2)),
                exams: prevExams + 1
            };
        }).catch(err => console.error("Leaderboard Update Error:", err));
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
