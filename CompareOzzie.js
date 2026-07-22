function CompareOzzie() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var checklist = ss.getSheetByName("Master Checklist");
  var inventory = ss.getSheetByName("Inventory");
  
  var checkData = checklist.getDataRange().getValues();
  var invData = inventory.getDataRange().getValues();
  
  var checkHeaders = checkData[0];
  var invHeaders = invData[0];
  
  // Find Ozzie in Master Checklist
  Logger.log("🔍 MASTER CHECKLIST ENTRY:");
  for (var i = 1; i < checkData.length; i++) {
    if (
      checkData[i][checkHeaders.indexOf("Brand")] === "Topps" &&
      checkData[i][checkHeaders.indexOf("Year")] === 1980 &&
      checkData[i][checkHeaders.indexOf("Card #")] === "393"
    ) {
      Logger.log("  Player: " + checkData[i][checkHeaders.indexOf("Player")]);
      Logger.log("  Team: " + checkData[i][checkHeaders.indexOf("Team")]);
      Logger.log("  Position: " + checkData[i][checkHeaders.indexOf("Position")]);
      Logger.log("  Hall of Fame: " + checkData[i][checkHeaders.indexOf("Hall of Fame")]);
      Logger.log("  Rookie: " + checkData[i][checkHeaders.indexOf("Rookie")]);
    }
  }
  
  // Find Ozzie in Inventory
  Logger.log("\n🔍 INVENTORY ENTRY:");
  for (var i = 1; i < invData.length; i++) {
    if (
      invData[i][invHeaders.indexOf("Brand")] === "Topps" &&
      invData[i][invHeaders.indexOf("Year")] === 1980 &&
      invData[i][invHeaders.indexOf("Card #")] === "393"
    ) {
      Logger.log("  Player: " + invData[i][invHeaders.indexOf("Player")]);
      Logger.log("  Team: " + invData[i][invHeaders.indexOf("Team")]);
      Logger.log("  Position: " + invData[i][invHeaders.indexOf("Position")]);
      Logger.log("  Hall of Fame: " + invData[i][invHeaders.indexOf("Hall of Fame")]);
      Logger.log("  Rookie: " + invData[i][invHeaders.indexOf("Rookie")]);
    }
  }
}
