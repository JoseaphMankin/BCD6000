function CheckAPIFields() {
  var apiKey = PropertiesService.getScriptProperties().getProperty('CARDSIGHT_API_KEY');
  var baseUrl = "https://api.cardsight.ai/v1/";
  
  if (!apiKey) {
    Logger.log("❌ API key not found.");
    return;
  }
  
  // First, find the 1980 Topps release
  var releaseUrl = baseUrl + "catalog/search?q=Topps 1980&type=release&segment=Baseball&take=5";
  
  try {
    var response = UrlFetchApp.fetch(releaseUrl, {
      headers: { "X-API-Key": apiKey },
      muteHttpExceptions: true
    });
    
    if (response.getResponseCode() !== 200) {
      Logger.log("❌ API error: " + response.getResponseCode());
      return;
    }
    
    var data = JSON.parse(response.getContentText());
    var releases = data.results || [];
    
    if (releases.length === 0) {
      Logger.log("❌ No releases found.");
      return;
    }
    
    Logger.log("📋 Found releases:");
    releases.forEach(function(r) {
      Logger.log("  " + r.name + " (ID: " + r.id + ")");
    });
    
    // Use the first release to get cards
    var releaseId = releases[0].id;
    var cardUrl = baseUrl + "catalog/releases/" + releaseId + "/cards?take=2";
    
    var cardResponse = UrlFetchApp.fetch(cardUrl, {
      headers: { "X-API-Key": apiKey },
      muteHttpExceptions: true
    });
    
    if (cardResponse.getResponseCode() !== 200) {
      Logger.log("❌ Card API error: " + cardResponse.getResponseCode());
      return;
    }
    
    var cardData = JSON.parse(cardResponse.getContentText());
    var cards = cardData.cards || [];
    
    if (cards.length === 0) {
      Logger.log("❌ No cards found.");
      return;
    }
    
    Logger.log("\n🔍 FIRST CARD FROM 1980 TOPPS:");
    Logger.log(JSON.stringify(cards[0], null, 2));
    
    Logger.log("\n🔍 CHECKING FOR FIELDS:");
    Logger.log("  Team: " + (cards[0].teamName || "MISSING"));
    Logger.log("  Position: " + (cards[0].position || "MISSING"));
    Logger.log("  Hall of Fame: " + (cards[0].isHallOfFame || "MISSING"));
    Logger.log("  Rookie: " + (cards[0].isRookie || "MISSING"));
    
  } catch (error) {
    Logger.log("❌ Error: " + error.message);
  }
}
