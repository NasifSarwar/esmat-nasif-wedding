/**
 * RSVP receiver for the wedding site.
 * Paste this whole file into: Google Sheet → Extensions → Apps Script.
 * Then Deploy → New deployment → Web app (see README.md).
 *
 * After ANY change to this file: Deploy → Manage deployments → Edit (pencil)
 * → Version: New version → Deploy. The web-app URL stays the same.
 *
 * How replies are stored:
 *  - one row per guest, identified by phone number + name
 *  - same phone + same name again  → their row is UPDATED (latest answer wins)
 *  - same phone + different name   → a separate row (families sharing a phone)
 *
 * Protections built in:
 *  - only the expected fields are saved, each checked and length-limited
 *  - text that could run as a spreadsheet formula is neutralised
 *  - bots that fill the hidden "website" field are silently ignored
 *  - forms sent faster than a human can type are ignored
 *  - rate limits: max 60 RSVPs a minute in total, max 3 per name+phone per 10 minutes
 *  - hard cap on total rows, so a flood cannot fill your Google Drive
 *  - errors never reveal internal details
 */

var SHEET_NAME = "RSVPs";
var HEADERS = ["Time", "Name", "Attending", "Guests", "Phone", "Message", "Invite link name", "Language"];
var COL_NAME = 2, COL_PHONE = 5;   // 1-based column numbers in HEADERS

var MAX_ROWS = 3000;            // total RSVPs ever accepted
var MAX_PER_MINUTE = 60;        // all guests together
var MAX_PER_PERSON = 3;         // same name + phone, per 10 minutes
var MIN_FILL_MS = 2500;         // a human needs at least this long to fill the form

function doPost(e) {
  var p = (e && e.parameter) || {};

  // 1. Honeypot: real people never see or fill this field. Pretend success.
  if (p.website) return json_({ ok: true, status: "saved" });

  // 2. Too fast to be a person (the page sends how long the form was open).
  var fillMs = Number(p.t);
  if (!isFinite(fillMs) || fillMs < MIN_FILL_MS) return json_({ ok: true, status: "saved" });

  // 3. Validate every field before touching the sheet.
  var name = text_(p.name, 80);
  var attending = p.attending === "Yes" || p.attending === "No" ? p.attending : "";
  var phone = phone_(p.phone);
  var message = text_(p.message, 500);
  var invitedAs = text_(p.invitedAs, 60);
  var language = p.language === "bn" ? "bn" : "en";
  if (!name || !attending) return fail_("invalid");
  if (!phone) return fail_("phone");

  // 4. Rate limits (CacheService is shared by all requests to this script).
  var cache = CacheService.getScriptCache();
  var minuteKey = "m" + Math.floor(Date.now() / 60000);
  var inMinute = Number(cache.get(minuteKey) || 0);
  if (inMinute >= MAX_PER_MINUTE) return fail_("busy");
  var who = phone + "|" + nameKey_(name);
  var personKey = "p" + Utilities.base64EncodeWebSafe(
    Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, who, Utilities.Charset.UTF_8));
  var byPerson = Number(cache.get(personKey) || 0);
  if (byPerson >= MAX_PER_PERSON) return fail_("busy");

  var lock = LockService.getScriptLock();
  try {
    if (!lock.tryLock(10000)) return fail_("busy");
    var sheet = getSheet_();
    var row = [new Date(), safe_(name), attending, 0, "'" + phone, safe_(message), safe_(invitedAs), language];

    // 5. Same phone + same name already in the sheet? Update that row.
    var existing = findRow_(sheet, phone, nameKey_(name));
    var status;
    if (existing) {
      sheet.getRange(existing, 1, 1, row.length).setValues([row]);
      status = "updated";
    } else {
      if (sheet.getLastRow() > MAX_ROWS) return fail_("full");
      sheet.appendRow(row);
      status = "saved";
    }

    cache.put(minuteKey, String(inMinute + 1), 120);
    cache.put(personKey, String(byPerson + 1), 600);
    return json_({ ok: true, status: status });
  } catch (err) {
    console.error(err); // visible to you in Apps Script → Executions, never sent to the visitor
    return fail_("error");
  } finally {
    lock.releaseLock();
  }
}

// Open the web-app URL in a browser to check it is live. Reveals nothing else.
function doGet() {
  return json_({ ok: true });
}

function getSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(HEADERS);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight("bold");
  }
  return sheet;
}

// Row number of an earlier reply with the same phone and name, or 0.
function findRow_(sheet, phone, nkey) {
  var last = sheet.getLastRow();
  if (last < 2) return 0;
  var names = sheet.getRange(2, COL_NAME, last - 1, 1).getValues();
  var phones = sheet.getRange(2, COL_PHONE, last - 1, 1).getValues();
  for (var i = 0; i < names.length; i++) {
    if (phone_(phones[i][0]) === phone && nameKey_(names[i][0]) === nkey) return i + 2;
  }
  return 0;
}

// Normalises a phone number so 01711-617527, +880 1711 617527 and ০১৭১১৬১৭৫২৭ all match.
function phone_(v) {
  var s = String(v == null ? "" : v)
    .replace(/[০-৯]/g, function (d) { return String(d.charCodeAt(0) - 0x09E6); }) // Bangla digits
    .replace(/[^0-9+]/g, "");
  var plus = s.charAt(0) === "+";
  s = s.replace(/\+/g, "");
  if (/^8801\d{9}$/.test(s)) s = "0" + s.slice(3);        // +880 1XXXXXXXXX → 01XXXXXXXXX
  else if (/^1[3-9]\d{8}$/.test(s)) s = "0" + s;          // 1XXXXXXXXX → 01XXXXXXXXX
  else if (plus) s = "+" + s;                              // other countries keep their +
  var digits = s.replace(/\D/g, "");
  return digits.length >= 8 && digits.length <= 15 ? s : "";
}

// Name comparison key: lowercase, single spaces, no punctuation.
function nameKey_(v) {
  return text_(v, 80).toLowerCase().replace(/[.'’\-]/g, "").replace(/\s+/g, " ").trim();
}

// Plain text only: removes control characters, trims, limits length.
function text_(v, max) {
  return String(v == null ? "" : v)
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F​-‏‪-‮⁦-⁩]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max);
}

// Stops spreadsheet formula injection (e.g. =HYPERLINK(...), +cmd, @SUM, leading tab).
function safe_(s) {
  return /^[=+\-@\t\r]/.test(s) ? "'" + s : s;
}

function fail_(reason) { return json_({ ok: false, status: reason }); }

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
