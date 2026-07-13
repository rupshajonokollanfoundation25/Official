// রূপসা জনকল্যাণ ফাউন্ডেশন — Donation page behavior

document.getElementById('displayYear').textContent = new Date().getFullYear();

/* Theme ------------------------------------------------------------ */
function toggleDarkMode() {
  document.body.classList.toggle('dark-theme');
  const icon = document.querySelector('#themeBtn i');
  icon.classList.toggle('fa-moon');
  icon.classList.toggle('fa-sun');
  localStorage.setItem('rjf-theme', document.body.classList.contains('dark-theme') ? 'dark' : 'light');
}

(function restoreTheme() {
  if (localStorage.getItem('rjf-theme') === 'dark') {
    document.body.classList.add('dark-theme');
    const icon = document.querySelector('#themeBtn i');
    if (icon) { icon.classList.remove('fa-moon'); icon.classList.add('fa-sun'); }
  }
})();

/* Side menu ---------------------------------------------------------- */
function toggleSideMenu() {
  document.getElementById('sideMenu').classList.toggle('active');
  document.getElementById('overlay').classList.toggle('active');
}

/* TrxID helper --------------------------------------------------------- */
const trxHelp = document.getElementById('trxHelp');
trxHelp.addEventListener('click', () => {
  alert('আপনার পেমেন্ট সফল হওয়ার পর ফিরতি এসএমএস-এ ৮-১০ অক্ষরের একটি আইডি পাবেন। উদাহরণ: CLD43KKDRG');
});
trxHelp.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); trxHelp.click(); }
});

/* Input sanitising ------------------------------------------------------ */
const nInp = document.getElementById('n');
const tInp = document.getElementById('tx');
const aInp = document.getElementById('a');

nInp.addEventListener('input', function () { this.value = this.value.replace(/[^a-zA-Z\s.]/g, ''); });
tInp.addEventListener('input', function () { this.value = this.value.toUpperCase().replace(/[^A-Z0-9]/g, ''); });

/* Quick amount buttons --------------------------------------------------- */
document.querySelectorAll('.amt-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.amt-btn').forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    aInp.value = btn.dataset.amt;
  });
});
aInp.addEventListener('input', () => {
  document.querySelectorAll('.amt-btn').forEach((b) => b.classList.toggle('active', b.dataset.amt === aInp.value));
});

/* Copy payment number ----------------------------------------------------- */
function copyNumber() {
  const num = document.getElementById('targetNum').textContent;
  navigator.clipboard.writeText(num).then(() => {
    const toast = document.getElementById('toast');
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2000);
  });
}

/* Reset after success ------------------------------------------------------ */
function resetForm() {
  const form = document.getElementById('donateForm');
  form.reset();
  document.getElementById('successOverlay').style.display = 'none';
  document.querySelectorAll('.amt-btn').forEach((b) => b.classList.remove('active'));

  const sBtn = document.getElementById('sBtn');
  const spinner = document.getElementById('btnSpinner');
  const btnText = document.getElementById('btnText');
  sBtn.disabled = false;
  btnText.textContent = 'CONFIRM DONATION';
  spinner.style.display = 'none';

  document.querySelectorAll('input, select').forEach((i) => i.classList.remove('invalid-signal'));

  if (typeof grecaptcha !== 'undefined') grecaptcha.reset();
}

/* Submit ------------------------------------------------------------------- */
document.getElementById('donateForm').addEventListener('submit', function (e) {
  e.preventDefault();

  // Honeypot: a real person never sees or fills this field. If it has a
  // value, silently drop the submission — no error shown, so a bot can't
  // tell it was caught.
  const honeypot = document.getElementById('website');
  if (honeypot && honeypot.value.trim() !== '') return;

  const recaptchaResponse = typeof grecaptcha !== 'undefined' ? grecaptcha.getResponse() : '';
  const recaptchaError = document.getElementById('recaptcha-error');
  if (!recaptchaResponse || recaptchaResponse.length === 0) {
    recaptchaError.style.display = 'block';
    return;
  }
  recaptchaError.style.display = 'none';

  const isN = /^[a-zA-Z\s.]{3,50}$/.test(nInp.value);
  const isE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(document.getElementById('e').value);
  const isA = Number(aInp.value) >= 30;
  const isM = document.getElementById('m').value !== '';
  const isT = tInp.value.trim().length >= 8;

  [
    [nInp, isN], [document.getElementById('e'), isE],
    [aInp, isA], [document.getElementById('m'), isM], [tInp, isT],
  ].forEach(([el, ok]) => el.classList.toggle('invalid-signal', !ok));

  if (!(isN && isE && isA && isM && isT)) return;

  const btn = document.getElementById('sBtn');
  const spinner = document.getElementById('btnSpinner');
  const btnText = document.getElementById('btnText');

  btnText.textContent = 'Processing...';
  spinner.style.display = 'block';
  btn.disabled = true;

  fetch('https://script.google.com/macros/s/AKfycbz-9za8KZDEr690CordlOIHRhD_LAfdocfY5zgwADX8pVmwALJFn3XjvJYMikbYLnWy/exec', {
    method: 'POST',
    mode: 'no-cors',
    body: JSON.stringify({
      name: nInp.value,
      email: document.getElementById('e').value,
      amount: aInp.value,
      method: document.getElementById('m').value,
      trx: tInp.value.trim(),
      recaptchaToken: recaptchaResponse, // verified server-side against the secret key
    }),
  }).then(() => {
    if (typeof confetti === 'function') {
      confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
    }
    document.getElementById('successOverlay').style.display = 'flex';
  }).catch(() => {
    btnText.textContent = 'CONFIRM DONATION';
    spinner.style.display = 'none';
    btn.disabled = false;
    alert('দুঃখিত, একটি সমস্যা হয়েছে। আবার চেষ্টা করুন।');
  });
});
