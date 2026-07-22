function DumpInventoryOzzie() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var inventory = ss.getSheetByName("Inventory");
  var data = inventory.getDataRange().getValues();
  var headers = data[0];
  
  var brandCol = headers.indexOf("Brand");
  var yearCol = headers.indexOf("Year");
  var cardCol = headers.indexOf("Card #");
  var playerCol = headers.indexOf("Player");
  
  Logger.log("🔍 ALL INVENTORY CARDS WITH 'Ozzie':");
  
  for (var i = 1; i < data.length; i++) {
    var player = data[i][playerCol];
    if (player && player.indexOf("Ozzie") !== -1) {
      Logger.log("  Brand: [" + data[i][brandCol] + "] Type: " + typeof data[i][brandCol]);
      Logger.log("  Year: [" + data[i][yearCol] + "] Type: " + typeof data[i][yearCol]);
      Logger.log("  Card #: [" + data[i][cardCol] + "] Type: " + typeof data[i][cardCol]);
      Logger.log("  Player: [" + data[i][playerCol] + "]");
      Logger.log("  ---");
    }
  }
  
  // Also check for card #393 specifically
  Logger.log("\n🔍 SEARCHING FOR CARD #393 IN INVENTORY:");
  for (var i = 1; i < data.length; i++) {
    if (data[i][cardCol] === 393 || data[i][cardCol] === "393") {
      Logger.log("  Found card #393:");
      Logger.log("  Brand: [" + data[i][brandCol] + "]");
      Logger.log("  Year: [" + data[i][yearCol] + "] (Type: " + typeof data[i][yearCol] + ")");
      Logger.log("  Player: [" + data[i][playerCol] + "]");
    }
  }
}
