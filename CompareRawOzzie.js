function CompareRawOzzie() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var inventory = ss.getSheetByName("Inventory");
  var checklist = ss.getSheetByName("Master Checklist");
  
  var invData = inventory.getDataRange().getValues();
  var checkData = checklist.getDataRange().getValues();
  
  var invHeaders = invData[0];
  var checkHeaders = checkData[0];
  
  // Get Inventory Ozzie
  var invRow = null;
  for (var i = 1; i < invData.length; i++) {
    if (invData[i][invHeaders.indexOf("Player")] === "Ozzie Smith") {
      invRow = invData[i];
      break;
    }
  }
  
  // Get Checklist Ozzie (1980 Topps)
  var checkRow = null;
  for (var i = 1; i < checkData.length; i++) {
    if (
      checkData[i][checkHeaders.indexOf("Brand")] === "Topps" &&
      checkData[i][checkHeaders.indexOf("Year")] === 1980 &&
      checkData[i][checkHeaders.indexOf("Card #")] === 393
    ) {
      checkRow = checkData[i];
      break;
    }
  }
  
  Logger.log("🔍 INVENTORY Ozzie:");
  Logger.log("  Brand: [" + invRow[invHeaders.indexOf("Brand")] + "]");
  Logger.log("  Year: [" + invRow[invHeaders.indexOf("Year")] + "]");
  Logger.log("  Card #: [" + invRow[invHeaders.indexOf("Card #")] + "]");
  Logger.log("  Set: [" + invRow[invHeaders.indexOf("Set")] + "]");
  
  Logger.log("\n🔍 MASTER CHECKLIST Ozzie:");
  Logger.log("  Brand: [" + checkRow[checkHeaders.indexOf("Brand")] + "]");
  Logger.log("  Year: [" + checkRow[checkHeaders.indexOf("Year")] + "]");
  Logger.log("  Card #: [" + checkRow[checkHeaders.indexOf("Card #")] + "]");
  Logger.log("  Set: [" + checkRow[checkHeaders.indexOf("Set")] + "]");
  
  // Compare
  Logger.log("\n🔍 COMPARISON:");
  Logger.log("  Brand matches: " + (invRow[invHeaders.indexOf("Brand")] === checkRow[checkHeaders.indexOf("Brand")]));
  Logger.log("  Year matches: " + (invRow[invHeaders.indexOf("Year")] === checkRow[checkHeaders.indexOf("Year")]));
  Logger.log("  Card # matches: " + (invRow[invHeaders.indexOf("Card #")] === checkRow[checkHeaders.indexOf("Card #")]));
}
