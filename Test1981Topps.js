function Test1981Topps() {
  var apiKey = PropertiesService.getScriptProperties().getProperty('CARDSIGHT_API_KEY');
  var baseUrl = "https://api.cardsight.ai/v1/";
  
  // The three 1981 Topps releases from the playground
  var releases = [
    { id: "782c3070-61be-49a5-8fb8-64f6847e45e8", name: "Topps (release 1)" },
    { id: "334572e3-32ea-4789-8e01-b2af792a8c4c", name: "Topps (release 2)" },
    { id: "70797e6f-42e0-44a2-9cce-29f7abee4123", name: "Topps Traded" }
  ];
  
  var results = [];
  
  releases.forEach(function(release) {
    var url = baseUrl + "catalog/releases/" + release.id + "/cards?take=1";
    var response = UrlFetchApp.fetch(url, {
      headers: { "X-API-Key": apiKey },
      muteHttpExceptions: true
    });
    
    if (response.getResponseCode() === 200) {
      var data = JSON.parse(response.getContentText());
      var totalCount = data.total_count || 0;
      
      // Now get card #30
      var cardUrl = baseUrl + "catalog/releases/" + release.id + "/cards?take=1&skip=29";
      var cardResponse = UrlFetchApp.fetch(cardUrl, {
        headers: { "X-API-Key": apiKey },
        muteHttpExceptions: true
      });
      
      var cardData = JSON.parse(cardResponse.getContentText());
      var card30 = cardData.cards && cardData.cards.length > 0 ? cardData.cards[0] : null;
      
      results.push({
        name: release.name,
        totalCount: totalCount,
        card30: card30 ? card30.name : "NOT FOUND"
      });
    } else {
      results.push({
        name: release.name,
        totalCount: "ERROR",
        card30: "ERROR"
      });
    }
  });
  
  Logger.log("📋 1981 Topps Releases:");
  results.forEach(function(r) {
    Logger.log("  " + r.name + " — Total: " + r.totalCount + " — Card #30: " + r.card30);
  });
}
