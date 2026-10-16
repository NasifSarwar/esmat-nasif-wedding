/**
 * RSVP receiver for the wedding site.
 * Paste this whole file into: Google Sheet → Extensions → Apps Script.
 * Then Deploy → New deployment → Web app (see README.md).
 */

var SHEET_NAME = "RSVPs";
var HEADERS = ["Time", "Name", "Attending", "Guests", "Phone", "Message", "Invite link name", "Language"];

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(10000); // stops two guests writing to the same row at once

  try {
    var sheet = getSheet_();
    var p = (e && e.parameter) || {};

    sheet.appendRow([
      new Date(),
      clean_(p.name),
      clean_(p.attending),
      Number(p.guests) || 0,
      clean_(p.phone),
      clean_(p.message),
      clean_(p.invitedAs),
      clean_(p.language)
    ]);

    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

// Open the web-app URL in a browser to check it is live.
function doGet() {
  return json_({ ok: true, message: "RSVP endpoint is running." });
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

// Stops text like "=SUM(...)" being treated as a formula, and limits length.
function clean_(v) {
  var s = String(v == null ? "" : v).slice(0, 500);
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
