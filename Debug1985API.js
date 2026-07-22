function Debug1985API() {
  var apiKey = PropertiesService.getScriptProperties().getProperty('CARDSIGHT_API_KEY');
  var baseUrl = "https://api.cardsight.ai/v1/";
  var releaseId = "84f9c4d0-f5e7-4b5f-b7ff-1ad57c738f85";
  
  var url = baseUrl + "catalog/releases/" + releaseId + "/cards?take=5";
  var response = UrlFetchApp.fetch(url, {
    headers: { "X-API-Key": apiKey },
    muteHttpExceptions: true
  });
  
  var data = JSON.parse(response.getContentText());
  Logger.log("Response keys: " + Object.keys(data).join(", "));
  Logger.log("Total cards: " + data.total_count);
  Logger.log("First card sample: " + JSON.stringify(data.cards[0]));
}
