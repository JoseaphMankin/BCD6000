function Check18_19_20() {
  var apiKey = PropertiesService.getScriptProperties().getProperty('CARDSIGHT_API_KEY');
  var baseUrl = "https://api.cardsight.ai/v1/";
  var releaseId = "84f9c4d0-f5e7-4b5f-b7ff-1ad57c738f85";
  
  var url = baseUrl + "catalog/releases/" + releaseId + "/cards?take=1000";
  var response = UrlFetchApp.fetch(url, {
    headers: { "X-API-Key": apiKey },
    muteHttpExceptions: true
  });
  var data = JSON.parse(response.getContentText());
  var cards = data.cards || [];
  
  var numbers = [18, 19, 20];
  numbers.forEach(function(num) {
    var found = cards.filter(function(c) { return c.number == num; });
    if (found.length > 0) {
      Logger.log("Card #" + num + ": " + found[0].name);
    } else {
      Logger.log("Card #" + num + ": NOT FOUND");
    }
  });
}
