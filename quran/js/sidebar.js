// ---------- Sidebar: surah / juz / bookmarks lists, tabs, mobile drawer ----------
const listContainer = document.getElementById('listContainer');

async function fetchSurahList(){
  try{
    const res = await fetch(`${API}/surah`);
    const data = await res.json();
    state.surahList = data.data;
    renderSurahList();
    renderHero();
  }catch(e){
    listContainer.innerHTML = `<div class="error-box">সূরার তালিকা লোড করা যায়নি।<br><button onclick="fetchSurahList()">আবার চেষ্টা করুন</button></div>`;
  }
}

function renderSurahList(){
  listContainer.innerHTML = '';
  state.surahList.forEach(s => {
    const item = document.createElement('div');
    item.className = 'list-item';
    item.innerHTML = `<div class="badge-num">${toBn(s.number)}</div>
      <div class="li-text">
        <div class="li-title">${surahNamesBn[s.number-1] || s.englishName}</div>
        <div class="li-sub">${s.name}</div>
      </div>
      <div class="li-meta">${toBn(s.numberOfAyahs)} আয়াত</div>`;
    item.onclick = () => { openSurah(s.number); closeSidebarMobile(); };
    listContainer.appendChild(item);
  });
}

function renderJuzList(){
  listContainer.innerHTML = '';
  for(let i=1;i<=30;i++){
    const item = document.createElement('div');
    item.className = 'list-item';
    item.innerHTML = `<div class="badge-num">${toBn(i)}</div>
      <div class="li-text"><div class="li-title">পারা ${toBn(i)}</div></div>`;
    item.onclick = () => { openJuz(i); closeSidebarMobile(); };
    listContainer.appendChild(item);
  }
}

function renderBookmarksList(){
  const keys = Object.keys(state.bookmarks);
  if(keys.length === 0){
    listContainer.innerHTML = `<div class="empty-list-msg">এখনও কোনো আয়াত সংরক্ষণ করা হয়নি।<br>একটি আয়াত পড়ার সময় "☆ সংরক্ষণ করুন" বাটনে চাপুন।</div>`;
    return;
  }
  listContainer.innerHTML = '';
  keys.forEach(key => {
    const [surahNum, ayahInSurah] = key.split(':').map(Number);
    const s = state.surahList.find(x => x.number === surahNum);
    const item = document.createElement('div');
    item.className = 'list-item';
    item.innerHTML = `<div class="badge-num">${toBn(surahNum)}</div>
      <div class="li-text">
        <div class="li-title">${(s ? (surahNamesBn[surahNum-1]||s.englishName) : 'সূরা '+surahNum)}</div>
        <div class="li-sub">আয়াত ${toBn(ayahInSurah)}</div>
      </div>`;
    item.onclick = () => {
      openSurahAndScrollTo(surahNum, ayahInSurah);
      closeSidebarMobile();
    };
    listContainer.appendChild(item);
  });
}

function markSelected(idx){
  document.querySelectorAll('.list-item').forEach((el,i)=>el.classList.toggle('selected', i===idx));
}

function initSidebarTabs(){
  document.getElementById('tabSurah').onclick = () => {
    state.mode='surah';
    document.getElementById('tabSurah').classList.add('active');
    document.getElementById('tabJuz').classList.remove('active');
    document.getElementById('tabBookmarks').classList.remove('active');
    renderSurahList();
  };
  document.getElementById('tabJuz').onclick = () => {
    state.mode='juz';
    document.getElementById('tabJuz').classList.add('active');
    document.getElementById('tabSurah').classList.remove('active');
    document.getElementById('tabBookmarks').classList.remove('active');
    renderJuzList();
  };
  document.getElementById('tabBookmarks').onclick = () => {
    state.mode='bookmarks';
    document.getElementById('tabBookmarks').classList.add('active');
    document.getElementById('tabSurah').classList.remove('active');
    document.getElementById('tabJuz').classList.remove('active');
    renderBookmarksList();
  };
}

// ---------- Mobile sidebar drawer ----------
const sidebarEl = document.getElementById('sidebar');
const scrimEl = document.getElementById('scrim');

function closeSidebarMobile(){ sidebarEl.classList.remove('open'); scrimEl.style.display='none'; }

function initMobileSidebar(){
  document.getElementById('menuBtn').onclick = () => { sidebarEl.classList.add('open'); scrimEl.style.display='block'; };
  scrimEl.onclick = () => closeSidebarMobile();
}
