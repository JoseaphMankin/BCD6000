function GetKnownCard() {
  var apiKey = PropertiesService.getScriptProperties().getProperty('CARDSIGHT_API_KEY');
  var baseUrl = "https://api.cardsight.ai/v1/";
  
  // Search for 1979 Topps Ozzie Smith
  var url = baseUrl + "catalog/search?q=Ozzie Smith 1979 Topps&type=card&take=5";
  
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
    var cards = data.results || [];
    
    if (cards.length === 0) {
      Logger.log("❌ No cards found.");
      return;
    }
    
    Logger.log("✅ Found " + cards.length + " cards:");
    cards.forEach(function(card, i) {
      Logger.log("  " + (i+1) + ". " + card.name + " (" + card.releaseYear + " " + card.releaseName + " #" + card.number + ")");
      Logger.log("     ID: " + card.id);
      Logger.log("     Attributes: " + JSON.stringify(card.attributes));
    });
    
    // Get details for the first card
    var cardId = cards[0].id;
    var detailUrl = baseUrl + "catalog/cards/" + cardId;
    var detailResponse = UrlFetchApp.fetch(detailUrl, {
      headers: { "X-API-Key": apiKey },
      muteHttpExceptions: true
    });
    
    if (detailResponse.getResponseCode() !== 200) {
      Logger.log("❌ Detail error: " + detailResponse.getResponseCode());
      return;
    }
    
    var detailData = JSON.parse(detailResponse.getContentText());
    Logger.log("\n🔍 FULL DETAILS FOR FIRST CARD:");
    Logger.log(JSON.stringify(detailData, null, 2));
    
  } catch (error) {
    Logger.log("❌ Error: " + error.message);
  }
}
