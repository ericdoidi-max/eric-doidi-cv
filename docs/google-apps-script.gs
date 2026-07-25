/**
 * Apps Script Web App attached to the "Suivi Fréquence Cardiaque - Chien" Google Sheet.
 *
 * Setup:
 * 1. Open the Google Sheet, then Extensions > Apps Script.
 * 2. Replace the content of Code.gs with this file, then Save.
 * 3. Deploy > New deployment > type "Web app".
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 4. Copy the resulting Web App URL into VITE_DOG_SHEET_WEBHOOK_URL (.env.local / Vercel env vars).
 */

function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
  var data = JSON.parse(e.postData.contents);

  var date = new Date(data.timestampIso || new Date());

  sheet.appendRow([
    Utilities.formatDate(date, Session.getScriptTimeZone(), 'yyyy-MM-dd'),
    Utilities.formatDate(date, Session.getScriptTimeZone(), 'HH:mm:ss'),
    data.dogName || '',
    data.respiratoryRate || '',
    data.ratio || '',
    data.estimatedHeartRate || '',
    data.notes || '',
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}
