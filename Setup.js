/*
==========================================
 Card Database 6000
 Setup Engine
 Version 1.0.0
==========================================
*/

function InitializeDatabase() {

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const ui = SpreadsheetApp.getUi();

  // Confirm
  const response = ui.alert(
    "Initialize Database",
    "This will delete ALL existing sheets and create a fresh BCD6000 database.\n\nContinue?",
    ui.ButtonSet.YES_NO
  );

  if (response !== ui.Button.YES) {
    return;
  }

  // Delete all sheets
  const sheets = ss.getSheets();
  for (let i = 0; i < sheets.length; i++) {
    if (sheets[i].getName() !== BCD.SHEETS.SETTINGS) {
      ss.deleteSheet(sheets[i]);
    }
  }

  // Rename Settings sheet
  const settings = ss.getSheetByName(BCD.SHEETS.SETTINGS);
  if (settings) {
    settings.setName(BCD.SHEETS.SETTINGS);
  }

  // Create all sheets from Schema
  const sheetNames = Object.keys(SCHEMA);
  for (let i = 0; i < sheetNames.length; i++) {
    const name = sheetNames[i];
    // Skip Settings because it already exists
    if (name === "SETTINGS") continue;

    let sheet = ss.getSheetByName(BCD.SHEETS[name]);
    if (!sheet) {
      sheet = ss.insertSheet(BCD.SHEETS[name]);
    }

    // Build the sheet with headers
    const headers = SCHEMA[name];
    sheet.clear();
    sheet.appendRow(headers);

    // Format header
    const lastCol = headers.length;
    sheet.getRange(1, 1, 1, lastCol)
      .setFontWeight("bold")
      .setBackground("#d9ead3");
    sheet.setFrozenRows(1);
    sheet.autoResizeColumns(1, lastCol);
  }

  // Write initial Settings
  writeSetting("Database Version", BCD.VERSION);
  writeSetting("Default Condition", BCD.DEFAULTS.CONDITION);
  writeSetting("Default Set Type", BCD.DEFAULTS.SET_TYPE);
  writeSetting("Default Quality", BCD.DEFAULTS.QUALITY);
  writeSetting("Last Initialized", new Date().toISOString());

  // Log the action
  LogAction("Database Initialized", "Version " + BCD.VERSION);

  ui.alert(
    BCD.NAME + " Initialized",
    "Database created successfully!\n\nVersion: " + BCD.VERSION +
    "\nSheets: " + Object.keys(SCHEMA).length,
    ui.ButtonSet.OK
  );
}

/*
==========================================
 Helper: Write setting to Settings sheet
==========================================
*/

function writeSetting(key, value) {

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(BCD.SHEETS.SETTINGS);

  if (!sheet) {
    throw new Error("Settings sheet not found!");
  }

  const data = sheet.getDataRange().getValues();

  for (let i = 0; i < data.length; i++) {
    if (String(data[i][0]).trim() === key) {
      sheet.getRange(i + 1, 2).setValue(value);
      return;
    }
  }

  sheet.appendRow([key, value]);
}