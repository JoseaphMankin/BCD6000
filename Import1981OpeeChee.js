function Import1981OpeeChee() {
  var apiKey = PropertiesService.getScriptProperties().getProperty('CARDSIGHT_API_KEY');
  var baseUrl = "https://api.cardsight.ai/v1/";
  var releaseId = "24702acf-8bf4-4870-ba3f-8211e85848fe"; // 1981 O-Pee-Chee
  
  var allCards = [];
  var skip = 0;
  var take = 100;
  var totalCount = 0;
  
  // Get total count
  var firstUrl = baseUrl + "catalog/releases/" + releaseId + "/cards?take=1";
  var firstResponse = UrlFetchApp.fetch(firstUrl, {
    headers: { "X-API-Key": apiKey },
    muteHttpExceptions: true
  });
  
  if (firstResponse.getResponseCode() !== 200) {
    Logger.log("Error getting total count");
    return;
  }
  
  var firstData = JSON.parse(firstResponse.getContentText());
  totalCount = firstData.total_count || 0;
  
  Logger.log("Total O-Pee-Chee cards: " + totalCount);
  
  while (skip < totalCount) {
    var url = baseUrl + "catalog/releases/" + releaseId + "/cards?take=" + take + "&skip=" + skip;
    var response = UrlFetchApp.fetch(url, {
      headers: { "X-API-Key": apiKey },
      muteHttpExceptions: true
    });
    
    if (response.getResponseCode() !== 200) break;
    
    var data = JSON.parse(response.getContentText());
    var cards = data.cards || [];
    
    cards.forEach(function(c) {
      allCards.push({
        brand: "Topps",          // <-- Rename to Topps
        year: "1981",
        set: "Base Set",
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
  
  Logger.log("Total cards fetched: " + allCards.length);
  
  // Delete existing 1981 Topps data
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var masterSheet = ss.getSheetByName("Master Checklist");
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
  
  WriteChecklistRows(allCards);
  RegisterSet(allCards);
  UpdateSetCompletion();
  
  SpreadsheetApp.getUi().alert("1981 Topps imported from O-Pee-Chee!\n\nCards added: " + allCards.length);
}
