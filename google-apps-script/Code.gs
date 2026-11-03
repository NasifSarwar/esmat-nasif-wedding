/**
 * RSVP receiver for the wedding site.
 * Paste this whole file into: Google Sheet → Extensions → Apps Script.
 * Then Deploy → New deployment → Web app (see README.md).
 *
 * After ANY change to this file: Deploy → Manage deployments → Edit (pencil)
 * → Version: New version → Deploy. The web-app URL stays the same.
 *
 * Protections built in:
 *  - only the expected fields are saved, each checked and length-limited
 *  - text that could run as a spreadsheet formula is neutralised
 *  - bots that fill the hidden "website" field are silently ignored
 *  - forms sent faster than a human can type are ignored
 *  - rate limits: max 30 RSVPs a minute in total, max 3 per name+phone per 10 minutes
 *  - hard cap on total rows, so a flood cannot fill your Google Drive
 *  - errors never reveal internal details
 */

var SHEET_NAME = "RSVPs";
var HEADERS = ["Time", "Name", "Attending", "Guests", "Phone", "Message", "Invite link name", "Language"];

var MAX_ROWS = 3000;            // total RSVPs ever accepted
var MAX_PER_MINUTE = 30;        // all guests together
var MAX_PER_PERSON = 3;         // same name + phone, per 10 minutes
var MIN_FILL_MS = 2500;         // a human needs at least this long to fill the form

function doPost(e) {
  var p = (e && e.parameter) || {};

  // 1. Honeypot: real people never see or fill this field.
  if (p.website) return ok_();

  // 2. Too fast to be a person (the page sends how long the form was open).
  var fillMs = Number(p.t);
  if (!isFinite(fillMs) || fillMs < MIN_FILL_MS) return ok_();

  // 3. Validate every field before touching the sheet.
  var name = text_(p.name, 80);
  var attending = p.attending === "Yes" || p.attending === "No" ? p.attending : "";
  var phone = String(p.phone || "").replace(/[^0-9\u09E6-\u09EF+\-\s()]/g, "").slice(0, 20).trim();
  var message = text_(p.message, 500);
  var invitedAs = text_(p.invitedAs, 60);
  var language = p.language === "bn" ? "bn" : "en";
  if (!name || !attending) return fail_();

  // 4. Rate limits (CacheService is shared by all requests to this script).
  var cache = CacheService.getScriptCache();
  var minuteKey = "m" + Math.floor(Date.now() / 60000);
  var inMinute = Number(cache.get(minuteKey) || 0);
  if (inMinute >= MAX_PER_MINUTE) return fail_();
  var personKey = "p" + Utilities.base64EncodeWebSafe(
    Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, (name + "|" + phone).toLowerCase(), Utilities.Charset.UTF_8));
  var byPerson = Number(cache.get(personKey) || 0);
  if (byPerson >= MAX_PER_PERSON) return ok_(); // quietly ignore repeats

  var lock = LockService.getScriptLock();
  try {
    if (!lock.tryLock(10000)) return fail_();
    var sheet = getSheet_();
    if (sheet.getLastRow() > MAX_ROWS) return fail_();

    sheet.appendRow([
      new Date(),
      safe_(name),
      attending,
      0,
      safe_(phone),
      safe_(message),
      safe_(invitedAs),
      language
    ]);

    cache.put(minuteKey, String(inMinute + 1), 120);
    cache.put(personKey, String(byPerson + 1), 600);
    return ok_();
  } catch (err) {
    console.error(err); // visible to you in Apps Script → Executions, never sent to the visitor
    return fail_();
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

function ok_() { return json_({ ok: true }); }
function fail_() { return json_({ ok: false }); }

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
