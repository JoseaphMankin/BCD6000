function FetchChecklistFromCardSightSearch(brand, year) {

  var apiKey = PropertiesService.getScriptProperties().getProperty('CARDSIGHT_API_KEY');
  var baseUrl = "https://api.cardsight.ai/v1/";

  if (!apiKey) {
    SpreadsheetApp.getUi().alert("API key not found.");
    return;
  }

  var query = year + " " + brand;
  var searchUrl = baseUrl + "catalog/search?q=" + encodeURIComponent(query) + "&type=card&take=100";

  try {
    var response = UrlFetchApp.fetch(searchUrl, {
      headers: { "X-API-Key": apiKey },
      muteHttpExceptions: true
    });

    if (response.getResponseCode() !== 200) {
      throw new Error("API returned " + response.getResponseCode());
    }

    var data = JSON.parse(response.getContentText());

    if (!data.results || data.results.length === 0) {
      SpreadsheetApp.getUi().alert("No cards found for " + brand + " " + year);
      return;
    }

    // Log the first card to see what fields are available
    Logger.log("First card sample: " + JSON.stringify(data.results[0]));

    var cards = data.results.map(function(c) {
      // Extract attributes safely
      var attributes = c.attributes || [];
      
      return {
        brand: brand,
        year: String(year),
        set: c.setName || brand,
        "card #": String(c.number || ""),
        player: c.name || "",
        team: c.teamName || "",
        position: c.position || "",
        "hall of fame": c.isHallOfFame ? "Yes" : "No",
        "rookie": c.isRookie ? "Yes" : "No",
        attributes: attributes  // Pass the array through
      };
    });

    // Log the first mapped card
    Logger.log("First mapped card: " + JSON.stringify(cards[0]));

    WriteChecklistRows(cards);
    RegisterSet(cards);
    UpdateSetCompletion();

    SpreadsheetApp.getUi().alert(
      "Checklist imported from CardSight AI!\n\n" +
      "Brand: " + brand + "\n" +
      "Year: " + year + "\n" +
      "Cards added: " + cards.length
    );

    LogAction("Checklist Import (CardSight)", brand + " " + year + " | " + cards.length + " cards");

  } catch (error) {
    SpreadsheetApp.getUi().alert(
      "Error fetching from CardSight.\n\n" +
      "Error: " + error.message
    );
    Logger.log("Error: " + error.message);
  }
}

function TestFetch1990ToppsCardSight() {
  FetchChecklistFromCardSightSearch("Topps", 1990);
}
