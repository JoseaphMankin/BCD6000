function FetchFullChecklistFromCardSight(brand, year, releaseId) {

  var apiKey = PropertiesService.getScriptProperties().getProperty('CARDSIGHT_API_KEY');
  var baseUrl = "https://api.cardsight.ai/v1/";

  if (!apiKey) {
    SpreadsheetApp.getUi().alert("API key not found.");
    return;
  }

  if (!releaseId) {
    SpreadsheetApp.getUi().alert("No release ID provided.");
    return;
  }

  var allCards = [];
  var skip = 0;
  var take = 100;
  var totalCount = 0;

  try {

    var firstUrl = baseUrl + "catalog/releases/" + releaseId + "/cards?take=1";
    var firstResponse = UrlFetchApp.fetch(firstUrl, {
      headers: { "X-API-Key": apiKey },
      muteHttpExceptions: true
    });

    if (firstResponse.getResponseCode() !== 200) {
      throw new Error("API returned " + firstResponse.getResponseCode());
    }

    var firstData = JSON.parse(firstResponse.getContentText());
    totalCount = firstData.total_count || 0;

    if (totalCount === 0) {
      SpreadsheetApp.getUi().alert("No cards found for this release.");
      return;
    }

    while (skip < totalCount) {

      var url = baseUrl + "catalog/releases/" + releaseId + "/cards?take=" + take + "&skip=" + skip;
      var response = UrlFetchApp.fetch(url, {
        headers: { "X-API-Key": apiKey },
        muteHttpExceptions: true
      });

      if (response.getResponseCode() !== 200) {
        throw new Error("API returned " + response.getResponseCode());
      }

      var data = JSON.parse(response.getContentText());
      var cards = data.cards || [];

      cards.forEach(function(c) {
        var prices = c.prices || {};
        var attributes = c.attributes || [];
        
        allCards.push({
          // Core fields
          brand: brand,
          year: String(year),
          set: c.setName || brand,
          "card #": String(c.number || ""),
          player: c.name || "",
          team: c.teamName || "",
          position: c.position || "",
          "hall of fame": c.isHallOfFame ? "Yes" : "No",
          "rookie": c.isRookie ? "Yes" : "No",
          
          // Extended fields — grab everything
          attributes: attributes.join(", "),
          "price_raw": prices.raw || "",
          "price_psa10": prices["psa-10"] || "",
          "price_psa9": prices["psa-9"] || "",
          "parallel_count": c.parallelCount || 0,
          "future_stars": c.isFutureStar ? "Yes" : "No",
          "rookie_cup": c.isRookieCup ? "Yes" : "No",
          "league_leaders": c.isLeagueLeader ? "Yes" : "No",
          "checklist": c.isChecklist ? "Yes" : "No",
          "manager": c.isManager ? "Yes" : "No",
          "multi_player": c.isMultiPlayer ? "Yes" : "No",
          "variation": c.isVariation ? "Yes" : "No",
          "error": c.isError ? "Yes" : "No",
          "image_url": c.imageUrl || "",
          "card_id": c.id || ""
        });
      });

      skip += take;
      Logger.log("Fetched " + allCards.length + " of " + totalCount + " cards");
      Utilities.sleep(1000);
    }

    Logger.log("Total cards fetched: " + allCards.length);

    WriteChecklistRows(allCards);
    RegisterSet(allCards);
    UpdateSetCompletion();

    SpreadsheetApp.getUi().alert(
      "Full checklist imported from CardSight AI!\n\n" +
      "Brand: " + brand + "\n" +
      "Year: " + year + "\n" +
      "Total cards: " + allCards.length
    );

    LogAction("Full Checklist Import (CardSight)", brand + " " + year + " | " + allCards.length + " cards");

  } catch (error) {
    SpreadsheetApp.getUi().alert(
      "Error fetching from CardSight.\n\n" +
      "Error: " + error.message
    );
    Logger.log("Error: " + error.message);
  }
}

function TestFetch1990ToppsBase() {
  FetchFullChecklistFromCardSight("Topps", 1990, "4f37199f-d1b2-4615-89ff-8a93cc2b55a4");
}

function TestFetch1990ToppsTraded() {
  FetchFullChecklistFromCardSight("Topps", 1990, "6fce613b-7241-43cd-abe9-bdebe7babf17");
}
