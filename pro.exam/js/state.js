// ============================================================
// state.js — অ্যাপ্লিকেশনের গ্লোবাল স্টেট ভ্যারিয়েবল
// ============================================================
// --- State Variables ---
let appData = { questions: [], adminSettings: { negativeMarking: true } };
let studentData = { name: '', email: '', uid: '', class: '', subject: '', qCount: 0, timeMin: 0 };
let examState = { active: false, questions: [], answers: {}, currentIndex: 0, timerInterval: null };
let userBookmarks = [];
