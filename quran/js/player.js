// ---------- Audio playback engine ----------
const audioEl = document.getElementById('audioEl');
const playerBar = document.getElementById('playerBar');

function fmtTime(sec){
  if(!isFinite(sec) || sec < 0) sec = 0;
  const m = Math.floor(sec/60), s = Math.floor(sec%60);
  return toBn(m) + ':' + toBn(String(s).padStart(2,'0'));
}

function playAtIndex(idx, userInitiated){
  if(idx < 0 || idx >= state.playlist.length) return;
  const item = state.playlist[idx];
  state.playIndex = idx;
  audioEl.src = `${AUDIO_CDN}/${state.reciter}/${item.globalNumber}.mp3`;
  audioEl.play().then(()=>{ state.isPlaying = true; syncPlayingUI(); }).catch(()=>{ state.isPlaying = false; syncPlayingUI(); });
  document.getElementById('playerRef').textContent = `আয়াত ${toBn(item.numberInSurah)}`;
  document.getElementById('playerTitle').textContent = item.title;
  playerBar.classList.add('visible');
  state.lastRead = { surah: item.surah, ayah: item.numberInSurah };
  saveLastRead();
  const card = document.getElementById(`ayah-${item.key.replace(':','-')}`);
  if(card && userInitiated) card.scrollIntoView({behavior:'smooth', block:'center'});
}

function pausePlayback(){
  audioEl.pause();
  state.isPlaying = false;
  syncPlayingUI();
}

function resumePlayback(){
  if(state.playIndex === -1){ if(state.playlist.length){ playAtIndex(0, false); } return; }
  audioEl.play().then(()=>{ state.isPlaying = true; syncPlayingUI(); }).catch(()=>{});
}

function syncPlayingUI(){
  document.querySelectorAll('.ayah-card').forEach(c => c.classList.remove('playing'));
  document.querySelectorAll('.play-toggle').forEach(b => { b.classList.remove('is-playing'); b.textContent = '▶ শুনুন'; });
  if(state.playIndex >= 0){
    const item = state.playlist[state.playIndex];
    const card = document.querySelector(`.ayah-card[data-key="${item.key}"]`);
    if(card){
      const btn = card.querySelector('.play-toggle');
      if(state.isPlaying){
        card.classList.add('playing');
        if(btn){ btn.classList.add('is-playing'); btn.textContent = '❚❚ চলছে'; }
      }
    }
  }
  const ppBtn = document.getElementById('playPauseBtn');
  if(ppBtn) ppBtn.textContent = state.isPlaying ? '❚❚' : '▶';
}

function initPlayer(){
  const reciterSelect = document.getElementById('reciterSelect');
  reciterSelect.innerHTML = reciters.map(r => `<option value="${r.id}">${r.name}</option>`).join('');
  reciterSelect.value = state.reciter;

  reciterSelect.addEventListener('change', () => {
    state.reciter = reciterSelect.value;
    saveReciter();
    if(state.playIndex >= 0 && state.isPlaying){ playAtIndex(state.playIndex, true); }
  });

  document.getElementById('playPauseBtn').onclick = () => { state.isPlaying ? pausePlayback() : resumePlayback(); };
  document.getElementById('prevBtn').onclick = () => { if(state.playIndex > 0) playAtIndex(state.playIndex - 1, true); };
  document.getElementById('nextBtn').onclick = () => { if(state.playIndex < state.playlist.length - 1) playAtIndex(state.playIndex + 1, true); };
  document.getElementById('playerClose').onclick = () => {
    audioEl.pause(); audioEl.removeAttribute('src');
    state.isPlaying=false; state.playIndex=-1;
    playerBar.classList.remove('visible');
    syncPlayingUI();
  };

  audioEl.addEventListener('ended', () => {
    const autoplayChk = document.getElementById('autoplayChk');
    if(autoplayChk.checked && state.playIndex < state.playlist.length - 1){
      playAtIndex(state.playIndex + 1, false);
    } else {
      state.isPlaying = false;
      syncPlayingUI();
    }
  });
  audioEl.addEventListener('timeupdate', () => {
    document.getElementById('curTime').textContent = fmtTime(audioEl.currentTime);
    if(audioEl.duration){
      document.getElementById('seekBar').value = (audioEl.currentTime / audioEl.duration) * 100;
      document.getElementById('durTime').textContent = fmtTime(audioEl.duration);
    }
  });
  audioEl.addEventListener('pause', () => { if(state.isPlaying){ state.isPlaying=false; syncPlayingUI(); } });
  audioEl.addEventListener('play', () => { if(!state.isPlaying){ state.isPlaying=true; syncPlayingUI(); } });

  document.getElementById('seekBar').addEventListener('input', (e) => {
    if(audioEl.duration) audioEl.currentTime = (e.target.value/100) * audioEl.duration;
  });
}
