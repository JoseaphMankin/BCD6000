function Find1985Topps() {
  var apiKey = PropertiesService.getScriptProperties().getProperty('CARDSIGHT_API_KEY');
  var baseUrl = "https://api.cardsight.ai/v1/";
  
  // Search for the main 1985 Topps release
  var url = baseUrl + "catalog/search?q=Topps 1985&type=release&segment=Baseball&take=20";
  var response = UrlFetchApp.fetch(url, {
    headers: { "X-API-Key": apiKey },
    muteHttpExceptions: true
  });
  
  var data = JSON.parse(response.getContentText());
  var releases = data.results || [];
  
  Logger.log("📋 1985 Topps Releases:");
  releases.forEach(function(r) {
    Logger.log("  " + r.name + " (ID: " + r.id + ")");
  });
}
