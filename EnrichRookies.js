function EnrichRookieFlags() {
  var apiKey = PropertiesService.getScriptProperties().getProperty('CARDSIGHT_API_KEY');
  var baseUrl = "https://api.cardsight.ai/v1/";
  
  if (!apiKey) {
    SpreadsheetApp.getUi().alert("API key not found.");
    return;
  }
  
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var checklist = ss.getSheetByName(BCD.SHEETS.MASTER);
  
  if (!checklist) {
    SpreadsheetApp.getUi().alert("Master Checklist not found.");
    return;
  }
  
  var data = checklist.getDataRange().getValues();
  var headers = data[0];
  
  var idCol = headers.indexOf("Card ID");
  var playerCol = headers.indexOf("Player");
  var rookieCol = headers.indexOf("Rookie");
  
  if (idCol === -1) {
    SpreadsheetApp.getUi().alert("Card ID column not found.");
    return;
  }
  
  var updated = 0;
  var skipped = 0;
  var total = data.length - 1;
  
  SpreadsheetApp.getUi().alert("Enriching " + total + " cards... This may take a while.");
  
  for (var i = 1; i < data.length; i++) {
    var cardId = data[i][idCol];
    var rookie = data[i][rookieCol];
    
    // Skip if already has a Rookie flag
    if (rookie && rookie !== "") {
      skipped++;
      continue;
    }
    
    if (!cardId) {
      skipped++;
      continue;
    }
    
    try {
      var url = baseUrl + "catalog/cards/" + cardId;
      var response = UrlFetchApp.fetch(url, {
        headers: { "X-API-Key": apiKey },
        muteHttpExceptions: true
      });
      
      if (response.getResponseCode() === 200) {
        var cardData = JSON.parse(response.getContentText());
        var attributes = cardData.attributes || [];
        var isRookie = attributes.indexOf("RC") !== -1;
        
        if (isRookie) {
          checklist.getRange(i + 1, rookieCol + 1).setValue("Yes");
          updated++;
          Logger.log("✅ " + data[i][playerCol] + " (#" + data[i][headers.indexOf("Card #")] + ") is a rookie!");
        }
      }
      
      // Rate limit: wait 1 second between calls
      Utilities.sleep(1000);
      
    } catch (error) {
      Logger.log("❌ Error for " + cardId + ": " + error.message);
    }
    
    // Progress update every 10 cards
    if (i % 10 === 0) {
      Logger.log("Progress: " + i + "/" + total);
    }
  }
  
  SpreadsheetApp.getUi().alert(
    "Enrichment complete!\n\n" +
    "Updated: " + updated + "\n" +
    "Skipped (already set or no ID): " + skipped + "\n" +
    "Total processed: " + total
  );
}
