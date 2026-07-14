// ============================================================
// ui-utils.js — টোস্ট নোটিফিকেশন, ভিউ সুইচিং, সাইডবার ও ট্যাব কন্ট্রোল
// ============================================================
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
