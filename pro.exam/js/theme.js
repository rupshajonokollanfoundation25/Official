// ============================================================
// theme.js — লাইট/ডার্ক থিম ম্যানেজমেন্ট
// ============================================================
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
