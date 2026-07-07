// ---------- Theme toggle ----------
function initTheme(){
  document.getElementById('themeBtn').onclick = () => {
    const body = document.body;
    const dark = body.getAttribute('data-theme') === 'dark';
    body.setAttribute('data-theme', dark ? 'light' : 'dark');
    document.getElementById('themeLabel').textContent = dark ? 'নাইট মোড' : 'ডে মোড';
  };
}

// ---------- Font size buttons (reader toolbar) ----------
function initFontControls(){
  document.getElementById('incFont').onclick = () => { state.fontStep = Math.min(state.fontStep+1, 6); applyFontSize(); };
  document.getElementById('decFont').onclick = () => { state.fontStep = Math.max(state.fontStep-1, -3); applyFontSize(); };
}

// ---------- App init ----------
(async function init(){
  loadPrefs();
  initTheme();
  initFontControls();
  initMobileSidebar();
  initSidebarTabs();
  initSearch();
  initPlayer();
  fetchSurahList();
})();
