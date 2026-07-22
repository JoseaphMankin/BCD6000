/*
==========================================
 Card Database 6000
 Batch Tracker
 Version 1.0.0
==========================================
*/

function CreateBatch(source, notes) {

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(BCD.SHEETS.BATCHES);

  if (!sheet) {
    sheet = ss.insertSheet(BCD.SHEETS.BATCHES);
    sheet.appendRow(SCHEMA.BATCHES);
    formatHeader(sheet);
  }

  const id = "BATCH-" + Utilities.formatDate(
    new Date(),
    Session.getScriptTimeZone(),
    "yyyyMMdd-HHmmss"
  );

  sheet.appendRow([
    id,
    new Date(),
    source || "",
    notes || "",
    "Active"
  ]);

  LogAction("Batch Created", id + " | " + source);

  return id;
}

function GetActiveBatch() {

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(BCD.SHEETS.BATCHES);

  if (!sheet) return "";

  const data = sheet.getDataRange().getValues();
  if (data.length < 2) return "";

  const last = data[data.length - 1];
  if (last[4] === "Active") return last[0];

  return "";
}

function CloseBatch(batchID) {

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(BCD.SHEETS.BATCHES);

  if (!sheet) return;

  const data = sheet.getDataRange().getValues();

  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === batchID) {
      sheet.getRange(i + 1, 5).setValue("Closed");
      LogAction("Batch Closed", batchID);
      return;
    }
  }
}