function Import1981Almanac() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var importSheet = ss.getSheetByName("1981_Topps_Almanac");
  var masterSheet = ss.getSheetByName("Master Checklist");
  
  if (!importSheet || !masterSheet) {
    SpreadsheetApp.getUi().alert("Import sheet or Master Checklist not found.");
    return;
  }
  
  var data = importSheet.getDataRange().getValues();
  var cards = [];
  
  for (var i = 0; i < data.length; i++) {
    var row = data[i];
    
    // Column A has the card number
    var cardNum = String(row[0]).trim();
    if (!cardNum || isNaN(cardNum)) continue;
    
    // Column B has the player name (and sometimes extra info)
    var player = String(row[1]).trim();
    if (!player) continue;
    
    // If column B has multiple names (like "Reggie Jackson Home Run Leaders")
    // we want just the player name, not the extra text
    // But for now, we'll keep it simple and use the whole thing
    
    // Skip checklist cards
    if (player.toLowerCase().indexOf('checklist') !== -1) continue;
    
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
  
  Logger.log("Parsed " + cards.length + " cards");
  
  if (cards.length === 0) {
    SpreadsheetApp.getUi().alert("No cards parsed. Check the format.");
    return;
  }
  
  // Delete existing 1981 Topps data
  if (masterSheet) {
    var data = masterSheet.getDataRange().getValues();
    var headers = data[0];
    var brandCol = headers.indexOf("Brand");
    var yearCol = headers.indexOf("Year");
    
    for (var i = data.length - 1; i >= 1; i--) {
      if (data[i][brandCol] === "Topps" && data[i][yearCol] === 1981) {
        masterSheet.deleteRow(i + 1);
      }
    }
  }
  
  WriteChecklistRows(cards);
  RegisterSet(cards);
  UpdateSetCompletion();
  
  SpreadsheetApp.getUi().alert("1981 Topps imported!\n\nCards added: " + cards.length);
}
