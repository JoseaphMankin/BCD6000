function Check1980Topps() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var checklist = ss.getSheetByName("Master Checklist");
  
  if (!checklist) {
    Logger.log("❌ Master Checklist sheet not found!");
    return;
  }
  
  var data = checklist.getDataRange().getValues();
  var headers = data[0];
  
  var brandCol = headers.indexOf("Brand");
  var yearCol = headers.indexOf("Year");
  var setCol = headers.indexOf("Set");
  var cardCol = headers.indexOf("Card #");
  var playerCol = headers.indexOf("Player");
  
  Logger.log("📋 All 1980 Topps cards in Master Checklist:");
  var found = 0;
  for (var i = 1; i < data.length; i++) {
    if (
      data[i][brandCol] === "Topps" &&
      data[i][yearCol] === 1980
    ) {
      Logger.log("  Card #" + data[i][cardCol] + ": " + data[i][playerCol]);
      found++;
    }
  }
  
  if (found === 0) {
    Logger.log("❌ No 1980 Topps cards found in Master Checklist.");
    Logger.log("   Check if the set name is different (e.g., 'Topps' vs 'Base Set').");
  } else {
    Logger.log("✅ Found " + found + " cards.");
  }
}
