function CreateKeyCardsSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // Check if KeyCards sheet already exists
  var sheet = ss.getSheetByName("KeyCards");
  if (sheet) {
    SpreadsheetApp.getUi().alert("KeyCards sheet already exists.");
    return;
  }
  
  // Create the sheet
  sheet = ss.insertSheet("KeyCards");
  
  // Add headers
  var headers = ["Brand", "Year", "Set", "Card #", "Player", "Category", "Tier"];
  sheet.appendRow(headers);
  
  // Format header
  var lastCol = headers.length;
  sheet.getRange(1, 1, 1, lastCol)
    .setFontWeight("bold")
    .setBackground("#d9ead3");
  sheet.setFrozenRows(1);
  sheet.autoResizeColumns(1, lastCol);
  
  SpreadsheetApp.getUi().alert("KeyCards sheet created successfully!");
}
