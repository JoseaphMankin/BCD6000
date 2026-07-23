function Check1981Keys() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var inventory = ss.getSheetByName("Inventory");
  var data = inventory.getDataRange().getValues();
  var headers = data[0];
  
  var brandCol = headers.indexOf("Brand");
  var yearCol = headers.indexOf("Year");
  var setCol = headers.indexOf("Set");
  var cardCol = headers.indexOf("Card #");
  var playerCol = headers.indexOf("Player");
  
  var keyCards = [
    { number: "147", player: "Harold Baines", tier: "A-Tier" },
    { number: "315", player: "Kirk Gibson", tier: "A-Tier" },
    { number: "240", player: "Nolan Ryan", tier: "A-Tier" },
    { number: "260", player: "Rickey Henderson", tier: "A-Tier" },
    { number: "180", player: "Pete Rose", tier: "B-Tier" },
    { number: "400", player: "Reggie Jackson", tier: "B-Tier" },
    { number: "700", player: "George Brett", tier: "B-Tier" }
  ];
  
  Logger.log("🔑 1981 Topps Key Cards:");
  Logger.log("==========================");
  
  keyCards.forEach(function(key) {
    var found = false;
    for (var i = 1; i < data.length; i++) {
      if (
        data[i][brandCol] === "Topps" &&
        data[i][yearCol] === 1981 &&
        data[i][cardCol] === key.number
      ) {
        found = true;
        Logger.log("✅ " + key.player + " #" + key.number + " (" + key.tier + ") — OWNED");
        break;
      }
    }
    if (!found) {
      Logger.log("❌ " + key.player + " #" + key.number + " (" + key.tier + ") — MISSING");
    }
  });
}
