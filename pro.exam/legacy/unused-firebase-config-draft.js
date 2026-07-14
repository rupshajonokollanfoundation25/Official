// ==================== FIREBASE CONFIG FILE ====================
// File: pro.exam/firebase-config.js
// এই ফাইলে আপনার দুটি Firebase Projects এর কনফিগারেশন রয়েছে

// ==================== PROJECT 1: AUTHENTICATION & LOGIN ====================
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCIY-BYnwTFmgF15seuuqSwvig5FHNyRkI",
  authDomain: "pro-exam-centre.firebaseapp.com",
  databaseURL: "https://pro-exam-centre-default-rtdb.firebaseio.com",
  projectId: "pro-exam-centre",
  storageBucket: "pro-exam-centre.firebasestorage.app",
  messagingSenderId: "1060274973140",
  appId: "1:1060274973140:web:3933e72262987eac910e41",
  measurementId: "G-3QHYKVXHFR"
};

// ==================== PROJECT 2: QUESTIONS & EXAM DATA ====================
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA2FOd_BoCqcu49ijp5ffB1kdPB56PHz3Y",
  authDomain: "group-chat-74483.firebaseapp.com",
  databaseURL: "https://group-chat-74483-default-rtdb.firebaseio.com",
  projectId: "group-chat-74483",
  storageBucket: "group-chat-74483.firebasestorage.app",
  messagingSenderId: "1033238887345",
  appId: "1:1033238887345:web:2f4d10eabaf33e8e481b90",
  measurementId: "G-K3QHWJYRRP"
};

// ==================== INITIALIZE FIREBASE APPS ====================
// অ্যাপ 1: অথেন্টিকেশন এর জন্য
const firebaseAppAuth = firebase.initializeApp(firebaseConfigAuth, "auth");
const authDB = firebaseAppAuth.auth();
const realtimeDBAuth = firebaseAppAuth.database();

// অ্যাপ 2: প্রশ্ন এবং পরীক্ষার ডেটার জন্য
const firebaseAppQuestions = firebase.initializeApp(firebaseConfigQuestions, "questions");
const firestoreDB = firebaseAppQuestions.firestore();
const realtimeDBQuestions = firebaseAppQuestions.database();

console.log("✅ Firebase initialized successfully with two projects");
