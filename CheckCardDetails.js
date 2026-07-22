function CheckCardDetails() {
  var apiKey = PropertiesService.getScriptProperties().getProperty('CARDSIGHT_API_KEY');
  var baseUrl = "https://api.cardsight.ai/v1/";
  
  // Use the Mike Trout card ID from your search
  var cardId = "550e8400-e29b-41d4-a716-446655440000";
  var url = baseUrl + "catalog/cards/" + cardId;
  
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
    Logger.log("🔍 FULL CARD DETAILS:");
    Logger.log(JSON.stringify(data, null, 2));
    
    Logger.log("\n🔍 CHECKING FOR FIELDS:");
    Logger.log("  Team: " + (data.teamName || data.team || "MISSING"));
    Logger.log("  Position: " + (data.position || "MISSING"));
    Logger.log("  Hall of Fame: " + (data.isHallOfFame || data.hallOfFame || "MISSING"));
    Logger.log("  Attributes: " + JSON.stringify(data.attributes));
    
  } catch (error) {
    Logger.log("❌ Error: " + error.message);
  }
}
