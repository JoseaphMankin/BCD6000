/*
==========================================
 Card Database 6000
 Maintenance Tools
 Version 1.0.0
==========================================
*/

function ResetCollection() {

  const ui = SpreadsheetApp.getUi();
  const response = ui.alert(
    "Reset Collection",
    "This will clear Inventory, Batches, and Audit Log.\n\nMaster Checklist and Sets will remain.\n\nContinue?",
    ui.ButtonSet.YES_NO
  );

  if (response !== ui.Button.YES) return;

  const sheets = [
    BCD.SHEETS.INVENTORY,
    BCD.SHEETS.BATCHES,
    BCD.SHEETS.AUDIT
  ];

  sheets.forEach(function(name) {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(name);
    if (sheet) {
      clearBelowHeader(sheet);
    }
  });

  LogAction("Collection Reset", "Inventory, Batches, and Audit Log cleared");

  ui.alert("Collection reset complete.");
}

function FactoryReset() {

  const ui = SpreadsheetApp.getUi();
  const response = ui.prompt(
    "FACTORY RESET",
    "This will erase ALL database data.\n\nType RESET to continue.",
    ui.ButtonSet.OK_CANCEL
  );

  if (response.getSelectedButton() !== ui.Button.OK) return;
  if (response.getResponseText() !== "RESET") {
    ui.alert("Factory reset cancelled.");
    return;
  }

  const sheets = [
    BCD.SHEETS.INVENTORY,
    BCD.SHEETS.MASTER,
    BCD.SHEETS.SETS,
    BCD.SHEETS.BATCHES,
    BCD.SHEETS.AUDIT,
    BCD.SHEETS.COMPLETED
  ];

  sheets.forEach(function(name) {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(name);
    if (sheet) {
      clearBelowHeader(sheet);
    }
  });

  // Reset settings
  writeSetting("Database Version", "0.0.0");
  writeSetting("Last Initialized", "");

  LogAction("Factory Reset", "All data cleared");

  ui.alert("Factory reset complete.\n\nDatabase is clean.");
}

function DatabaseHealthReport() {

  const inventory = getSheetCount(BCD.SHEETS.INVENTORY);
  const checklist = getSheetCount(BCD.SHEETS.MASTER);
  const sets = getSheetCount(BCD.SHEETS.SETS);
  const completed = getSheetCount(BCD.SHEETS.COMPLETED);

  LogAction("Health Report", "Generated");

  SpreadsheetApp.getUi().alert(
    BCD.NAME + " Health Report\n\n" +
    "Inventory Records: " + inventory + "\n" +
    "Checklist Cards: " + checklist + "\n" +
    "Sets Loaded: " + sets + "\n" +
    "Completed Sets: " + completed
  );
}

function clearBelowHeader(sheet) {

  const lastRow = sheet.getLastRow();
  const lastColumn = sheet.getLastColumn();

  if (lastRow > 1) {
    sheet.getRange(2, 1, lastRow - 1, lastColumn).clearContent();
  }
}

function getSheetCount(name) {

  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(name);
  if (!sheet) return 0;

  return Math.max(0, sheet.getLastRow() - 1);
}

function getDatabaseVersion() {

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const settings = ss.getSheetByName(BCD.SHEETS.SETTINGS);

  if (!settings || settings.getLastRow() === 0) return "0.0.0";

  const values = settings.getRange(1, 1, settings.getLastRow(), 2).getValues();

  for (let i = 0; i < values.length; i++) {
    if (values[i][0] === "Database Version") {
      return values[i][1] || "0.0.0";
    }
  }

  return "0.0.0";
}

function setDatabaseVersion(version) {

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const settings = ss.getSheetByName(BCD.SHEETS.SETTINGS);

  if (!settings) return;

  const values = settings.getRange(1, 1, Math.max(settings.getLastRow(), 1), 2).getValues();

  for (let i = 0; i < values.length; i++) {
    if (values[i][0] === "Database Version") {
      settings.getRange(i + 1, 2).setValue(version);
      return;
    }
  }

  settings.appendRow(["Database Version", version]);
}

function writeSetting(key, value) {

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const settings = ss.getSheetByName(BCD.SHEETS.SETTINGS);

  if (!settings) return;

  const values = settings.getRange(1, 1, Math.max(settings.getLastRow(), 1), 2).getValues();

  for (let i = 0; i < values.length; i++) {
    if (values[i][0] === key) {
      settings.getRange(i + 1, 2).setValue(value);
      return;
    }
  }

  settings.appendRow([key, value]);
}