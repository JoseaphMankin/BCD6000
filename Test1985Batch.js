function Test1985Batch() {
  var apiKey = PropertiesService.getScriptProperties().getProperty('CARDSIGHT_API_KEY');
  var baseUrl = "https://api.cardsight.ai/v1/";
  var releaseId = "84f9c4d0-f5e7-4b5f-b7ff-1ad57c738f85";
  
  var url = baseUrl + "catalog/releases/" + releaseId + "/cards?take=20";
  var response = UrlFetchApp.fetch(url, {
    headers: { "X-API-Key": apiKey },
    muteHttpExceptions: true
  });
  
  var data = JSON.parse(response.getContentText());
  var cards = data.cards || [];
  
  Logger.log("Total cards in response: " + cards.length);
  cards.forEach(function(c) {
    Logger.log("Card #" + c.number + ": " + c.name);
  });
}
