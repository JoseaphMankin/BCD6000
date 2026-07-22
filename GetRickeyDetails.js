function GetRickeyDetails() {
  var apiKey = PropertiesService.getScriptProperties().getProperty('CARDSIGHT_API_KEY');
  var baseUrl = "https://api.cardsight.ai/v1/";
  
  // First, search for the card to get its ID
  var searchUrl = baseUrl + "catalog/search?q=Rickey Henderson 1980 Topps&type=card&take=1";
  
  var searchResponse = UrlFetchApp.fetch(searchUrl, {
    headers: { "X-API-Key": apiKey },
    muteHttpExceptions: true
  });
  
  var searchData = JSON.parse(searchResponse.getContentText());
  var card = searchData.results[0];
  var cardId = card.id;
  
  Logger.log("🔍 Card ID: " + cardId);
  
  // Now get the full details
  var detailUrl = baseUrl + "catalog/cards/" + cardId;
  var detailResponse = UrlFetchApp.fetch(detailUrl, {
    headers: { "X-API-Key": apiKey },
    muteHttpExceptions: true
  });
  
  var detailData = JSON.parse(detailResponse.getContentText());
  Logger.log("🔍 FULL DETAILS:");
  Logger.log(JSON.stringify(detailData, null, 2));
}
