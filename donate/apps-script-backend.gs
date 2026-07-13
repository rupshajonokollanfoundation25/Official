/**
 * রূপসা জনকল্যাণ ফাউন্ডেশন — Donation form backend (Google Apps Script)
 *
 * এই ফাইলটা তোমার Google Sheet-এর সাথে যুক্ত Apps Script প্রজেক্টে বসাও
 * (Extensions → Apps Script), আগের যা কোড ছিল তার জায়গায়।
 *
 * -----------------------------------------------------------------------
 * ধাপ ১ — reCAPTCHA secret key কোথাও কোডে না লিখে, Script Properties-এ রাখো:
 *   Apps Script এডিটরে বাঁ পাশে ⚙️ Project Settings → Script Properties
 *   → "Add script property" → নাম দাও RECAPTCHA_SECRET, মান-এ বসাও
 *   তোমার reCAPTCHA-র secret key (site key না, ওটা আলাদা — এটা
 *   google.com/recaptcha/admin থেকে পাবে)।
 *   এভাবে রাখলে key কখনো ব্রাউজারে বা কোডে প্রকাশ হয় না।
 * -----------------------------------------------------------------------
 */

function doPost(e) {
  const props = PropertiesService.getScriptProperties();
  const secret = props.getProperty('RECAPTCHA_SECRET');

  let data;
  try {
    data = JSON.parse(e.postData.contents);
  } catch (err) {
    return jsonResponse({ ok: false, error: 'invalid_payload' });
  }

  // ১. সার্ভার-সাইডে ক্যাপচা টোকেন যাচাই — ব্রাউজারের চেক কখনো বিশ্বাস করা যায় না,
  //    যে কেউ সেটা বাইপাস করে সরাসরি এই এন্ডপয়েন্টে ডেটা পাঠাতে পারে।
  const verify = UrlFetchApp.fetch('https://www.google.com/recaptcha/api/siteverify', {
    method: 'post',
    payload: { secret: secret, response: data.recaptchaToken || '' },
    muteHttpExceptions: true,
  });
  const verifyResult = JSON.parse(verify.getContentText());
  if (!verifyResult.success) {
    return jsonResponse({ ok: false, error: 'recaptcha_failed' });
  }

  // ২. ন্যূনতম ভ্যালিডেশন (ব্রাউজারের ভ্যালিডেশনের ওপর নির্ভর না করে)
  const name = String(data.name || '').trim();
  const email = String(data.email || '').trim();
  const amount = Number(data.amount);
  const method = String(data.method || '').trim();
  const trx = String(data.trx || '').trim();

  if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !(amount >= 30) || !method || trx.length < 8) {
    return jsonResponse({ ok: false, error: 'invalid_fields' });
  }

  // ৩. একই TrxID আগে জমা পড়েছে কিনা — ডাবল সাবমিশন ঠেকাতে
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Donations');
  const existing = sheet.getDataRange().getValues();
  const dup = existing.some((row) => String(row[4]).toUpperCase() === trx.toUpperCase());
  if (dup) {
    return jsonResponse({ ok: false, error: 'duplicate_trx' });
  }

  sheet.appendRow([new Date(), name, email, amount, trx, method]);

  return jsonResponse({ ok: true });
}

function jsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
