function Import1985ToppsSearch() {
  var apiKey = PropertiesService.getScriptProperties().getProperty('CARDSIGHT_API_KEY');
  var baseUrl = "https://api.cardsight.ai/v1/";
  
  var allCards = [];
  var skip = 0;
  var take = 100;
  var totalCount = 1;
  
  while (skip < totalCount) {
    var url = baseUrl + "catalog/search?q=Topps 1985&type=card&take=" + take + "&skip=" + skip;
    var response = UrlFetchApp.fetch(url, {
      headers: { "X-API-Key": apiKey },
      muteHttpExceptions: true
    });
    
    if (response.getResponseCode() !== 200) break;
    
    var data = JSON.parse(response.getContentText());
    var cards = data.results || [];
    totalCount = data.total_count || 0;
    
    cards.forEach(function(c) {
      allCards.push({
        brand: "Topps",
        year: "1985",
        set: c.setName || "Base Set",
        "card #": String(c.number || ""),
        player: c.name || "",
        team: "",
        position: "",
        "hall of fame": "No",
        rookie: "No"
      });
    });
    
    skip += take;
    Utilities.sleep(500);
  }
  
  // Delete existing 1985 Topps data
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var masterSheet = ss.getSheetByName("Master Checklist");
  if (masterSheet) {
    var data = masterSheet.getDataRange().getValues();
    var headers = data[0];
    var brandCol = headers.indexOf("Brand");
    var yearCol = headers.indexOf("Year");
    
    for (var i = data.length - 1; i >= 1; i--) {
      if (data[i][brandCol] === "Topps" && data[i][yearCol] === 1985) {
        masterSheet.deleteRow(i + 1);
      }
    }
  }
  
  WriteChecklistRows(allCards);
  RegisterSet(allCards);
  UpdateSetCompletion();
  
  SpreadsheetApp.getUi().alert("1985 Topps imported from global search!\n\nCards added: " + allCards.length);
}
