function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu("BCD6000")
    .addItem("Quick Intake", "ShowQuickIntake")
    .addSeparator()
    .addSubMenu(
      ui.createMenu("Checklist")
        .addItem("Get Checklist from CardSight", "ShowGetChecklistDialog")
        .addItem("Import Checklist (CSV)", "ImportChecklistCSV")
        .addItem("Process Checklist Import", "ProcessChecklistImport")
    )
    .addSeparator()
    .addSubMenu(
      ui.createMenu("Sources")
        .addItem("New Source", "ShowNewSourceDialog")
        .addItem("Active Sources", "ShowActiveSources")
    )
    .addSeparator()
    .addSubMenu(
      ui.createMenu("Collection")
        .addItem("Enrich Inventory from Checklist", "UpdateInventoryFromChecklist")
        .addItem("Update Set Completion", "UpdateSetCompletion")
    )
    .addSeparator()
    .addSubMenu(
      ui.createMenu("Reports")
        .addItem("Card Hunt Report", "OpenCardHuntSelector")
    )
    .addSeparator()
    .addSubMenu(
      ui.createMenu("Maintenance")
        .addItem("Upgrade Database", "UpgradeDatabase")
        .addItem("Reset Collection", "ResetCollection")
        .addItem("Factory Reset", "FactoryReset")
        .addItem("Database Health Report", "DatabaseHealthReport")
    )
    .addSeparator()
    .addItem("Version", "ShowVersion")
    .addToUi();
}

function ShowGetChecklistDialog() {
  var html = HtmlService.createHtmlOutputFromFile("GetChecklistDialog")
    .setWidth(450)
    .setHeight(480)
    .setTitle("Get Checklist");
  SpreadsheetApp.getUi().showModalDialog(html, "Get Checklist");
}

function ShowNewSourceDialog() {
  var html = HtmlService.createHtmlOutputFromFile("NewSourceDialog")
    .setWidth(450)
    .setHeight(520)
    .setTitle("New Source");
  SpreadsheetApp.getUi().showModalDialog(html, "New Source");
}

function SearchCardSightReleases(brand, year) {
  var apiKey = PropertiesService.getScriptProperties().getProperty('CARDSIGHT_API_KEY');
  var baseUrl = "https://api.cardsight.ai/v1/";
  if (!apiKey) return [];
  try {
    var url = baseUrl + "catalog/search?q=" + encodeURIComponent(year + " " + brand) + "&type=release&segment=Baseball&take=20";
    var response = UrlFetchApp.fetch(url, {
      headers: { "X-API-Key": apiKey },
      muteHttpExceptions: true
    });
    if (response.getResponseCode() !== 200) return [];
    var data = JSON.parse(response.getContentText());
    return data.results || [];
  } catch (error) {
    Logger.log("SearchReleases error: " + error.message);
    return [];
  }
}

function GetChecklistFromDialog(params) {
  var apiKey = PropertiesService.getScriptProperties().getProperty('CARDSIGHT_API_KEY');
  var baseUrl = "https://api.cardsight.ai/v1/";
  var brand = params.brand;
  var year = params.year;
  var releaseName = params.releaseName;
  var autoClose = params.autoClose !== false;

  if (!apiKey) {
    return { success: false, message: "API key not found." };
  }

  try {
    var searchUrl = baseUrl + "catalog/search?q=" + encodeURIComponent(year + " " + brand) + "&type=release&segment=Baseball&take=20";
    var response = UrlFetchApp.fetch(searchUrl, {
      headers: { "X-API-Key": apiKey },
      muteHttpExceptions: true
    });

    if (response.getResponseCode() !== 200) {
      return { success: false, message: "API returned " + response.getResponseCode() };
    }

    var data = JSON.parse(response.getContentText());
    var releases = data.results || [];

    var shouldImportAll = !releaseName || releaseName === "";

    var totalAdded = 0;
    var totalSkipped = 0;
    var setsImported = [];

    for (var r = 0; r < releases.length; r++) {
      var release = releases[r];

      if (!shouldImportAll && release.name !== releaseName) continue;

      var testUrl = baseUrl + "catalog/releases/" + release.id + "/cards?take=1";
      var testResponse = UrlFetchApp.fetch(testUrl, {
        headers: { "X-API-Key": apiKey },
        muteHttpExceptions: true
      });

      if (testResponse.getResponseCode() !== 200) continue;
      var testData = JSON.parse(testResponse.getContentText());
      if (testData.total_count === 0) continue;

      var skip = 0;
      var take = 100;
      var totalCount = 0;

      var firstUrl = baseUrl + "catalog/releases/" + release.id + "/cards?take=1";
      var firstResponse = UrlFetchApp.fetch(firstUrl, {
        headers: { "X-API-Key": apiKey },
        muteHttpExceptions: true
      });

      if (firstResponse.getResponseCode() !== 200) continue;
      var firstData = JSON.parse(firstResponse.getContentText());
      totalCount = firstData.total_count || 0;

      if (totalCount === 0) continue;

      var cards = [];
      while (skip < totalCount) {
        var url = baseUrl + "catalog/releases/" + release.id + "/cards?take=" + take + "&skip=" + skip;
        var cardResponse = UrlFetchApp.fetch(url, {
          headers: { "X-API-Key": apiKey },
          muteHttpExceptions: true
        });

        if (cardResponse.getResponseCode() !== 200) break;

        var cardData = JSON.parse(cardResponse.getContentText());
        var cardResults = cardData.cards || [];

        cardResults.forEach(function(c) {
          var set = release.name || c.setName || brand;
          // --- NO RENAME ---
          cards.push({
            brand: brand,
            year: String(year),
            set: set,
            "card #": String(c.number || ""),
            player: c.name || "",
            team: c.teamName || "",
            position: c.position || "",
            "hall of fame": c.isHallOfFame ? "Yes" : "No",
            rookie: c.isRookie ? "Yes" : "No"
          });
        });

        skip += take;
        Utilities.sleep(1000);
      }

      var beforeCount = getChecklistCount();
      WriteChecklistRows(cards);
      var afterCount = getChecklistCount();

      var added = afterCount - beforeCount;
      var skipped = cards.length - added;

      totalAdded += added;
      totalSkipped += skipped;
      setsImported.push(release.name + " (" + cards.length + " cards)");
    }

    RebuildSets();

    var message = "✅ Checklist Import Complete\n\n" +
                  "Brand: " + brand + "\n" +
                  "Year: " + year + "\n" +
                  "Sets imported: " + setsImported.length + "\n" +
                  "Cards added: " + totalAdded + "\n" +
                  "Duplicates skipped: " + totalSkipped + "\n\n" +
                  "Sets:\n" + setsImported.join("\n");

    SpreadsheetApp.getUi().alert(message);

    return {
      success: true,
      cardsAdded: totalAdded,
      duplicatesSkipped: totalSkipped,
      total: totalAdded + totalSkipped
    };

  } catch (error) {
    Logger.log("Error: " + error.message);
    return { success: false, message: error.message };
  }
}

function getChecklistCount() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(BCD.SHEETS.MASTER);
  if (!sheet) return 0;
  return Math.max(0, sheet.getLastRow() - 1);
}

function RebuildSets() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("Sets");
  
  if (sheet) {
    var lastRow = sheet.getLastRow();
    if (lastRow > 1) {
      sheet.getRange(2, 1, lastRow - 1, sheet.getLastColumn()).clearContent();
    }
  }
  
  var master = ss.getSheetByName("Master Checklist");
  if (!master) return;
  
  var data = master.getDataRange().getValues();
  var headers = data[0];
  
  var brandCol = headers.indexOf("Brand");
  var yearCol = headers.indexOf("Year");
  var setCol = headers.indexOf("Set");
  
  var sets = {};
  
  for (var i = 1; i < data.length; i++) {
    var brand = data[i][brandCol];
    var year = data[i][yearCol];
    var set = data[i][setCol];
    var key = brand + "|" + year + "|" + set;
    if (!sets[key]) {
      sets[key] = { brand: brand, year: year, set: set, count: 0 };
    }
    sets[key].count++;
  }
  
  var setHeaders = ["Brand", "Year", "Set", "Total Cards", "Checklist Loaded", "Cards Known", "Unique Owned", "Total Owned", "Percent Complete", "Completion Status", "Quality Issues", "Last Updated"];
  if (sheet) {
    sheet.clear();
    sheet.appendRow(setHeaders);
  }
  
  for (var s in sets) {
    var setData = sets[s];
    if (sheet) {
      sheet.appendRow([
        setData.brand,
        setData.year,
        setData.set,
        setData.count,
        "Yes",
        setData.count,
        0,
        0,
        0,
        "Just Started",
        0,
        new Date()
      ]);
    }
  }
}
