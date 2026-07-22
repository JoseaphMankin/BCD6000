function FindBaseSet() {
  var apiKey = PropertiesService.getScriptProperties().getProperty('CARDSIGHT_API_KEY');
  var baseUrl = "https://api.cardsight.ai/v1/";
  
  // Search for the Base Set specifically
  var url = baseUrl + "catalog/search?q=1985 Topps Base Set&type=release&segment=Baseball&take=10";
  var response = UrlFetchApp.fetch(url, {
    headers: { "X-API-Key": apiKey },
    muteHttpExceptions: true
  });
  
  var data = JSON.parse(response.getContentText());
  var releases = data.results || [];
  
  Logger.log("📋 1985 Topps Base Set Releases:");
  releases.forEach(function(r) {
    Logger.log("  " + r.name + " (ID: " + r.id + ")");
  });
}
