// ============================================================
// firebase-config.js — Firebase অ্যাপ ইনিশিয়ালাইজেশন (Auth + Questions DB) + EmailJS
// এই ফাইলটি সবার আগে লোড হতে হবে, কারণ বাকি সব ফাইল db/auth/dbQuestions ব্যবহার করে
// ============================================================
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
const authQuestions = questionApp.auth(); // নতুন — dbQuestions (২য় প্রজেক্ট) এর জন্য আলাদা Auth session, এটা ছাড়া ঐ DB তে auth সবসময় null থাকতো
const googleProvider = new firebase.auth.GoogleAuthProvider();
