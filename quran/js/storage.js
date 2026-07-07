// ---------- Shared state ----------
const state = {
  mode: 'surah',
  surahList: [],
  fontStep: 0,
  bookmarks: {},
  reciter: 'ar.alafasy',
  lastRead: null,
  playlist: [],
  playIndex: -1,
  isPlaying: false
};

// ---------- localStorage persistence ----------
// All data (bookmarks, reciter choice, last-read position) is kept in the
// browser's own localStorage, so it stays on the user's device between visits
// without needing any server or account.
const LS_KEYS = {
  bookmarks: 'qr_bookmarks',
  reciter: 'qr_reciter',
  lastRead: 'qr_last_read'
};

function loadPrefs(){
  try{
    const raw = localStorage.getItem(LS_KEYS.bookmarks);
    if(raw) state.bookmarks = JSON.parse(raw);
  }catch(e){ state.bookmarks = {}; }

  try{
    const r = localStorage.getItem(LS_KEYS.reciter);
    if(r) state.reciter = r;
  }catch(e){}

  try{
    const raw = localStorage.getItem(LS_KEYS.lastRead);
    if(raw) state.lastRead = JSON.parse(raw);
  }catch(e){ state.lastRead = null; }
}

function saveBookmarks(){
  try{ localStorage.setItem(LS_KEYS.bookmarks, JSON.stringify(state.bookmarks)); }catch(e){}
}
function saveReciter(){
  try{ localStorage.setItem(LS_KEYS.reciter, state.reciter); }catch(e){}
}
function saveLastRead(){
  try{ localStorage.setItem(LS_KEYS.lastRead, JSON.stringify(state.lastRead)); }catch(e){}
}
