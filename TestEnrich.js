function TestEnrich() {
  Logger.log("🔍 Running UpdateInventoryFromChecklist...");
  try {
    UpdateInventoryFromChecklist();
    Logger.log("✅ UpdateInventoryFromChecklist completed.");
  } catch (error) {
    Logger.log("❌ Error: " + error.message);
  }
  
  // Check if Ozzie got updated
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var inventory = ss.getSheetByName("Inventory");
  var data = inventory.getDataRange().getValues();
  var headers = data[0];
  
  for (var i = 1; i < data.length; i++) {
    if (data[i][headers.indexOf("Player")] === "Ozzie Smith") {
      Logger.log("\n🔍 Ozzie after enrichment:");
      Logger.log("  Team: [" + data[i][headers.indexOf("Team")] + "]");
      Logger.log("  Position: [" + data[i][headers.indexOf("Position")] + "]");
      Logger.log("  Hall of Fame: [" + data[i][headers.indexOf("Hall of Fame")] + "]");
      Logger.log("  Rookie: [" + data[i][headers.indexOf("Rookie")] + "]");
    }
  }
}
