function GetRealCardId() {
  var apiKey = PropertiesService.getScriptProperties().getProperty('CARDSIGHT_API_KEY');
  var baseUrl = "https://api.cardsight.ai/v1/";
  
  // Search for 1980 Topps card #393 (Ozzie)
  var url = baseUrl + "catalog/search?q=Topps 1980 393&type=card&take=1";
  
  try {
    var response = UrlFetchApp.fetch(url, {
      headers: { "X-API-Key": apiKey },
      muteHttpExceptions: true
    });
    
    if (response.getResponseCode() !== 200) {
      Logger.log("❌ Error: " + response.getResponseCode());
      return;
    }
    
    var data = JSON.parse(response.getContentText());
    var card = data.results[0];
    
    if (!card) {
      Logger.log("❌ No card found.");
      return;
    }
    
    Logger.log("✅ Found card!");
    Logger.log("  ID: " + card.id);
    Logger.log("  Name: " + card.name);
    Logger.log("  Card #: " + card.number);
    Logger.log("  Set: " + card.setName);
    Logger.log("  Release: " + card.releaseName);
    Logger.log("  Year: " + card.releaseYear);
    
    // Now get the full details
    var detailUrl = baseUrl + "catalog/cards/" + card.id;
    var detailResponse = UrlFetchApp.fetch(detailUrl, {
      headers: { "X-API-Key": apiKey },
      muteHttpExceptions: true
    });
    
    if (detailResponse.getResponseCode() !== 200) {
      Logger.log("❌ Detail error: " + detailResponse.getResponseCode());
      return;
    }
    
    var detailData = JSON.parse(detailResponse.getContentText());
    Logger.log("\n🔍 FULL CARD DETAILS:");
    Logger.log(JSON.stringify(detailData, null, 2));
    
  } catch (error) {
    Logger.log("❌ Error: " + error.message);
  }
}
