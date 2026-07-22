/*
==========================================
 Card Database 6000
 Version Manager
 Version 1.0.0
==========================================
*/

function GetDatabaseVersion() {

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const settings = ss.getSheetByName(BCD.SHEETS.SETTINGS);

  if (!settings || settings.getLastRow() === 0) {
    return "0.0.0";
  }

  const values = settings.getRange(1, 1, settings.getLastRow(), 2).getValues();

  for (let i = 0; i < values.length; i++) {
    if (values[i][0] === "Database Version") {
      return values[i][1] || "0.0.0";
    }
  }

  return "0.0.0";
}

function SetDatabaseVersion(version) {

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const settings = ss.getSheetByName(BCD.SHEETS.SETTINGS);

  if (!settings) {
    throw new Error("Settings sheet not found.");
  }

  const values = settings.getRange(1, 1, Math.max(settings.getLastRow(), 1), 2).getValues();

  for (let i = 0; i < values.length; i++) {
    if (values[i][0] === "Database Version") {
      settings.getRange(i + 1, 2).setValue(version);
      return;
    }
  }

  settings.appendRow(["Database Version", version]);
}

function ShowVersion() {

  const version = GetDatabaseVersion();

  SpreadsheetApp.getUi().alert(
    BCD.NAME + "\n\n" +
    "Database Version: " + version + "\n" +
    "App Version: " + BCD.VERSION + "\n\n" +
    (version === BCD.VERSION ? "✅ Current" : "⚠️ Update Available")
  );
}