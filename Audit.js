/*
==========================================
 Card Database 6000
 Audit Log
 Version 1.0.0
==========================================
*/

function LogAction(action, details) {

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(BCD.SHEETS.AUDIT);

  if (!sheet) {
    sheet = ss.insertSheet(BCD.SHEETS.AUDIT);
    sheet.appendRow(SCHEMA.AUDIT);
    formatHeader(sheet);
  }

  sheet.appendRow([
    new Date(),
    action,
    details || ""
  ]);
}

function formatHeader(sheet) {
  const lastCol = sheet.getLastColumn();
  sheet.getRange(1, 1, 1, lastCol)
    .setFontWeight("bold")
    .setBackground("#d9ead3");
  sheet.setFrozenRows(1);
  sheet.autoResizeColumns(1, lastCol);
}