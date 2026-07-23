function Debug1981Import() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var importSheet = ss.getSheetByName("1981_Topps_Almanac");
  
  if (!importSheet) {
    SpreadsheetApp.getUi().alert("Import sheet not found.");
    return;
  }
  
  var data = importSheet.getDataRange().getValues();
  Logger.log("Total rows in import sheet: " + data.length);
  
  var cards = [];
  
  for (var i = 0; i < data.length && i < 20; i++) {
    var text = String(data[i][0]).trim();
    Logger.log("Row " + i + ": " + text);
    
    if (!text) continue;
    
    var match = text.match(/^(\d+)\s+(.+)/);
    if (!match) {
      Logger.log("  No match for row " + i);
      continue;
    }
    
    var cardNum = match[1];
    var player = match[2].trim();
    
    Logger.log("  Card #" + cardNum + ": " + player);
    
    cards.push({
      brand: "Topps",
      year: "1981",
      set: "Base Set",
      "card #": cardNum,
      player: player,
      team: "",
      position: "",
      "hall of fame": "No",
      rookie: "No"
    });
  }
  
  Logger.log("Total cards parsed: " + cards.length);
}
