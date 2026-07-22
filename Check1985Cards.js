function Check1985Cards() {
  var apiKey = PropertiesService.getScriptProperties().getProperty('CARDSIGHT_API_KEY');
  var baseUrl = "https://api.cardsight.ai/v1/";
  var releaseId = "84f9c4d0-f5e7-4b5f-b7ff-1ad57c738f85"; // 1985 Topps
  
  var url = baseUrl + "catalog/releases/" + releaseId + "/cards?take=20";
  
  var response = UrlFetchApp.fetch(url, {
    headers: { "X-API-Key": apiKey },
    muteHttpExceptions: true
  });
  
  var data = JSON.parse(response.getContentText());
  var cards = data.cards || [];
  
  Logger.log("📋 1985 Topps Base Set - First 20 Cards:");
  cards.forEach(function(c) {
    if (c.number == 15 || c.number == 16 || c.number == 20) {
      Logger.log("  Card #" + c.number + ": " + c.name);
    }
  });
}
