function DebugImport() {
  var apiKey = PropertiesService.getScriptProperties().getProperty('CARDSIGHT_API_KEY');
  var baseUrl = "https://api.cardsight.ai/v1/";
  
  // Fetch a single card (Rickey Henderson)
  var url = baseUrl + "catalog/search?q=Rickey Henderson 1980 Topps&type=card&take=1";
  
  var response = UrlFetchApp.fetch(url, {
    headers: { "X-API-Key": apiKey },
    muteHttpExceptions: true
  });
  
  var data = JSON.parse(response.getContentText());
  var card = data.results[0];
  
  Logger.log("🔍 RAW API DATA:");
  Logger.log(JSON.stringify(card, null, 2));
  
  // Now map it the way our script does
  var mapped = {
    brand: "Topps",
    year: "1980",
    set: card.setName || "Topps",
    "card #": String(card.number || ""),
    player: card.name || "",
    team: card.teamName || "",
    position: card.position || "",
    "hall of fame": card.isHallOfFame ? "Yes" : "No",
    "rookie": card.isRookie ? "Yes" : "No",
    attributes: card.attributes || []
  };
  
  Logger.log("\n🔍 MAPPED CARD:");
  Logger.log(JSON.stringify(mapped, null, 2));
  
  // Check if attributes contains RC
  var isRookie = mapped.attributes.indexOf("RC") !== -1;
  Logger.log("\n🔍 Is Rookie? " + isRookie);
}
