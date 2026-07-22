/*
==========================================
 Card Database 6000
 Database Upgrade Manager
 Version 1.0.0
==========================================
*/

function UpgradeDatabase() {

  LogAction("Database Upgrade", "Starting upgrade process");

  EnsureInventorySchema();
  EnsureAuditLog();
  EnsureBatchSchema();
  EnsureCompletedSetsSchema();

  // Update version in settings
  SetDatabaseVersion(BCD.VERSION);

  LogAction("Database Upgrade", "Upgrade complete - Version " + BCD.VERSION);

  SpreadsheetApp.getUi().alert(
    "Database upgrade complete.\n\nVersion: " + BCD.VERSION
  );
}

function EnsureInventorySchema() {

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(BCD.SHEETS.INVENTORY);

  if (!sheet) {
    sheet = ss.insertSheet(BCD.SHEETS.INVENTORY);
    sheet.appendRow(SCHEMA.INVENTORY);
    formatHeader(sheet);
    return;
  }

  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const requiredHeaders = SCHEMA.INVENTORY;

  // Add missing columns
  requiredHeaders.forEach(function(header) {
    if (headers.indexOf(header) === -1) {
      const col = sheet.getLastColumn() + 1;
      sheet.insertColumnAfter(sheet.getLastColumn());
      sheet.getRange(1, col).setValue(header).setFontWeight("bold").setBackground("#d9ead3");
      LogAction("Schema Update", "Added column: " + header + " (Inventory)");
    }
  });

  // Normalize header order
  const currentHeaders = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const data = sheet.getDataRange().getValues();

  // Rebuild rows in correct order
  const newRows = [];
  for (let i = 1; i < data.length; i++) {
    const row = [];
    requiredHeaders.forEach(function(header) {
      const idx = currentHeaders.indexOf(header);
      row.push(idx !== -1 ? data[i][idx] : "");
    });
    newRows.push(row);
  }

  sheet.clear();
  sheet.getRange(1, 1, 1, requiredHeaders.length).setValues([requiredHeaders]);
  if (newRows.length > 0) {
    sheet.getRange(2, 1, newRows.length, requiredHeaders.length).setValues(newRows);
  }

  formatHeader(sheet);
}

function EnsureAuditLog() {

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(BCD.SHEETS.AUDIT);

  if (!sheet) {
    sheet = ss.insertSheet(BCD.SHEETS.AUDIT);
    sheet.appendRow(SCHEMA.AUDIT);
    formatHeader(sheet);
  }

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(SCHEMA.AUDIT);
  }
}

function EnsureBatchSchema() {

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(BCD.SHEETS.BATCHES);

  if (!sheet) {
    sheet = ss.insertSheet(BCD.SHEETS.BATCHES);
    sheet.appendRow(SCHEMA.BATCHES);
    formatHeader(sheet);
  }

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(SCHEMA.BATCHES);
  }
}

function EnsureCompletedSetsSchema() {

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(BCD.SHEETS.COMPLETED);

  if (!sheet) {
    sheet = ss.insertSheet(BCD.SHEETS.COMPLETED);
    sheet.appendRow(SCHEMA.COMPLETED);
    formatHeader(sheet);
  }

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(SCHEMA.COMPLETED);
  }
}

function formatHeader(sheet) {

  const lastCol = sheet.getLastColumn();
  if (lastCol === 0) return;

  sheet.getRange(1, 1, 1, lastCol)
    .setFontWeight("bold")
    .setBackground("#d9ead3");
  sheet.setFrozenRows(1);
  sheet.autoResizeColumns(1, lastCol);
}