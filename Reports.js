function OpenCardHuntSelector() {
  var html = HtmlService.createHtmlOutputFromFile("CardHuntSelector")
    .setWidth(420)
    .setHeight(520);
  SpreadsheetApp.getUi().showModalDialog(html, "Card Hunt Report");
}

function GenerateCardHuntReport(brand, year, setName) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();

  if (!brand || !year || !setName) {
    SpreadsheetApp.getUi().alert("Please enter Brand, Year, and Set.");
    return;
  }

  var reportName = "Card Hunt Report";
  var sheet = ss.getSheetByName(reportName);
  if (sheet) ss.deleteSheet(sheet);
  sheet = ss.insertSheet(reportName);

  var checklist = ss.getSheetByName(BCD.SHEETS.MASTER);
  var inventory = ss.getSheetByName(BCD.SHEETS.INVENTORY);

  if (!checklist || !inventory) {
    SpreadsheetApp.getUi().alert("Missing required sheets.");
    return;
  }

  var checklistData = checklist.getDataRange().getValues();
  var inventoryData = inventory.getDataRange().getValues();

  var ch = checklistData[0];
  var ih = inventoryData[0];

  var cBrand = ch.indexOf("Brand");
  var cYear = ch.indexOf("Year");
  var cSet = ch.indexOf("Set");
  var cCard = ch.indexOf("Card #");
  var cPlayer = ch.indexOf("Player");

  var iBrand = ih.indexOf("Brand");
  var iYear = ih.indexOf("Year");
  var iSet = ih.indexOf("Set");
  var iCard = ih.indexOf("Card #");
  var iQuality = ih.indexOf("Quality Status");

  var checklistCards = [];

  for (var i = 1; i < checklistData.length; i++) {
    if (
      String(checklistData[i][cBrand]) === brand &&
      String(checklistData[i][cYear]) === year &&
      String(checklistData[i][cSet]) === setName
    ) {
      checklistCards.push({
        number: checklistData[i][cCard],
        player: checklistData[i][cPlayer]
      });
    }
  }

  var owned = {};
  var upgrades = [];

  for (var i = 1; i < inventoryData.length; i++) {
    if (
      String(inventoryData[i][iBrand]) === brand &&
      String(inventoryData[i][iYear]) === year &&
      String(inventoryData[i][iSet]) === setName
    ) {
      var cardNum = inventoryData[i][iCard];
      var quality = inventoryData[i][iQuality] || "Keeper";

      owned[cardNum] = true;

      if (quality === "Upgrade Needed" || quality === "Placeholder") {
        upgrades.push({
          number: cardNum,
          quality: quality
        });
      }
    }
  }

  var missing = [];
  checklistCards.forEach(function(card) {
    if (!owned[card.number]) {
      missing.push(card);
    }
  });

  var uniqueOwned = Object.keys(owned).length;

  // --- PAGE-BASED GRID LAYOUT ---
  var ROWS_PER_PAGE = 30;
  var COLS = 3;
  var CARDS_PER_PAGE = ROWS_PER_PAGE * COLS;

  var row = 1;
  var titleText = brand + " " + year + " " + setName + " — Missing Checklist";
  var summaryText = "Owned: " + uniqueOwned + " / " + checklistCards.length + "  |  Missing: " + missing.length;

  var totalPages = Math.ceil(missing.length / CARDS_PER_PAGE);

  for (var p = 0; p < totalPages; p++) {
    var startIndex = p * CARDS_PER_PAGE;
    var pageCards = missing.slice(startIndex, startIndex + CARDS_PER_PAGE);

    // Only show title and summary on the FIRST page
    if (p === 0) {
      // Title
      sheet.getRange(row, 1, 1, 6).merge();
      sheet.getRange(row, 1).setValue("📋 " + titleText + " (Page " + (p + 1) + "/" + totalPages + ")");
      sheet.getRange(row, 1).setFontWeight("bold").setFontSize(14).setHorizontalAlignment("center");
      row += 1;

      // Summary
      sheet.getRange(row, 1, 1, 6).merge();
      sheet.getRange(row, 1).setValue(summaryText);
      sheet.getRange(row, 1).setFontSize(11).setHorizontalAlignment("center");
      row += 1;
    } else {
      // Just a small page indicator for subsequent pages
      sheet.getRange(row, 1, 1, 6).merge();
      sheet.getRange(row, 1).setValue("— Page " + (p + 1) + "/" + totalPages + " —");
      sheet.getRange(row, 1).setFontWeight("bold").setFontSize(12).setHorizontalAlignment("center");
      row += 1;
    }

    // Column headers (only on first page, or all pages? Let's keep them on all pages)
    var headers = ["Card", "Player", "Card", "Player", "Card", "Player"];
    for (var h = 0; h < 6; h++) {
      sheet.getRange(row, h + 1).setValue(headers[h]);
      sheet.getRange(row, h + 1).setFontWeight("bold").setFontSize(10);
    }
    row += 1;

    // Distribute cards into 3 columns (vertical)
    var col1 = [];
    var col2 = [];
    var col3 = [];
    var perCol = Math.ceil(pageCards.length / 3);

    pageCards.forEach(function(card, index) {
      if (index < perCol) {
        col1.push(card);
      } else if (index < perCol * 2) {
        col2.push(card);
      } else {
        col3.push(card);
      }
    });

    var maxRows = Math.max(col1.length, col2.length, col3.length);

    for (var r = 0; r < maxRows; r++) {
      if (r < col1.length) {
        sheet.getRange(row + r, 1).setValue("☐ " + col1[r].number);
        sheet.getRange(row + r, 2).setValue(col1[r].player);
      }
      if (r < col2.length) {
        sheet.getRange(row + r, 3).setValue("☐ " + col2[r].number);
        sheet.getRange(row + r, 4).setValue(col2[r].player);
      }
      if (r < col3.length) {
        sheet.getRange(row + r, 5).setValue("☐ " + col3[r].number);
        sheet.getRange(row + r, 6).setValue(col3[r].player);
      }
    }

    row += maxRows + 3;
  }

  // --- FORMATTING ---
  sheet.setColumnWidth(1, 80);
  sheet.setColumnWidth(2, 180);
  sheet.setColumnWidth(3, 80);
  sheet.setColumnWidth(4, 180);
  sheet.setColumnWidth(5, 80);
  sheet.setColumnWidth(6, 180);

  var lastRow = sheet.getLastRow();
  if (lastRow > 0) {
    sheet.getRange(1, 1, lastRow, 6)
      .setWrap(true)
      .setVerticalAlignment("middle")
      .setFontSize(10);
  }

  sheet.setFrozenRows(0);

  LogAction("Card Hunt Report", brand + " " + year + " " + setName);
}

function PrintCardHuntReport() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("Card Hunt Report");
  if (!sheet) {
    SpreadsheetApp.getUi().alert("No report found. Please generate one first.");
    return;
  }

  ss.setActiveSheet(sheet);
  SpreadsheetApp.getUi().alert(
    "📄 Print Ready\n\n" +
    "1. Click File → Print\n" +
    "2. Select 'Current sheet'\n" +
    "3. Choose 'Landscape' orientation\n" +
    "4. Adjust margins to 'Narrow'\n" +
    "5. Click Print"
  );
}
