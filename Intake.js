function ShowQuickIntake() {
  var html = HtmlService.createHtmlOutputFromFile("QuickIntakeDialog")
    .setWidth(550)
    .setHeight(600);
  SpreadsheetApp.getUi().showModalDialog(html, "Quick Intake");
}

function GetSetsForBrandYear(brand, year) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(BCD.SHEETS.MASTER);
  if (!sheet) return [];
  var data = sheet.getDataRange().getValues();
  var headers = data[0];
  var brandCol = headers.indexOf("Brand");
  var yearCol = headers.indexOf("Year");
  var setCol = headers.indexOf("Set");
  var sets = {};
  for (var i = 1; i < data.length; i++) {
    if (String(data[i][brandCol]) === brand && String(data[i][yearCol]) === String(year)) {
      var set = data[i][setCol];
      if (set) sets[set] = true;
    }
  }
  return Object.keys(sets);
}

function ProcessQuickIntake(form) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(BCD.SHEETS.INVENTORY);
  var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  var brand = form.brand;
  var year = Number(form.year);
  var source = form.source || "";
  var userSelectedSet = form.set || "";

  // --- DICTATION FIX ---
  var numberWords = {
    "zero": 0, "one": 1, "two": 2, "three": 3, "four": 4,
    "five": 5, "six": 6, "seven": 7, "eight": 8, "nine": 9,
    "ten": 10, "eleven": 11, "twelve": 12, "thirteen": 13,
    "fourteen": 14, "fifteen": 15, "sixteen": 16, "seventeen": 17,
    "eighteen": 18, "nineteen": 19, "twenty": 20
  };

  var rawText = form.cards || "";
  var normalized = rawText.toLowerCase().trim();
  var processedText = normalized.replace(/\b(one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen|twenty|zero)\b/g, function(match) {
    return String(numberWords[match]);
  });
  processedText = processedText.replace(/[^0-9,\s]/g, '');
  var numbers = processedText.match(/\d+/g)?.map(Number) || [];

  if (numbers.length === 0) {
    throw new Error("No card numbers detected.");
  }

  // --- SET SELECTION: Use user's selection if provided ---
  var set = userSelectedSet;
  
  // Only auto-detect if user didn't select a set
  if (!set || set === "") {
    var checklist = ss.getSheetByName(BCD.SHEETS.MASTER);
    if (checklist) {
      var checkData = checklist.getDataRange().getValues();
      var checkHeaders = checkData[0];
      var cBrandCol = checkHeaders.indexOf("Brand");
      var cYearCol = checkHeaders.indexOf("Year");
      var cSetCol = checkHeaders.indexOf("Set");
      var foundSets = {};
      for (var i = 1; i < checkData.length; i++) {
        if (String(checkData[i][cBrandCol]) === brand && String(checkData[i][cYearCol]) === String(year)) {
          var s = checkData[i][cSetCol];
          if (s) foundSets[s] = true;
        }
      }
      var setList = Object.keys(foundSets);
      if (setList.length === 1) {
        set = setList[0];
      } else if (setList.length > 1) {
        set = setList[0];
      }
    }
  }

  // --- FORCE: Always use the user's selection if they provided one ---
  if (userSelectedSet && userSelectedSet !== "") {
    set = userSelectedSet;
  }

  Logger.log("Using Set: " + set + " (User selected: " + userSelectedSet + ")");

  var sourceTitle = GetSourceTitle(source);
  var notes = form.notes || "";
  var batchID = CreateBatch(sourceTitle, notes);

  var counts = {};
  numbers.forEach(function(card) {
    counts[card] = (counts[card] || 0) + 1;
  });

  var data = sheet.getDataRange().getValues();
  var added = 0;
  var updated = 0;

  Object.keys(counts).forEach(function(card) {
    var totalQty = counts[card];
    var inProgress = 1;
    var standby = totalQty - 1;
    var found = false;

    for (var i = 1; i < data.length; i++) {
      if (
        data[i][headers.indexOf("Brand")] == brand &&
        data[i][headers.indexOf("Year")] == year &&
        data[i][headers.indexOf("Set")] == set &&
        Number(data[i][headers.indexOf("Card #")]) == Number(card)
      ) {
        var inProgressCol = headers.indexOf("Quantity In Progress") + 1;
        var standbyCol = headers.indexOf("Quantity Standby") + 1;
        var currentInProgress = Number(data[i][inProgressCol - 1]) || 0;
        var currentStandby = Number(data[i][standbyCol - 1]) || 0;
        sheet.getRange(i + 1, inProgressCol).setValue(currentInProgress + 1);
        sheet.getRange(i + 1, standbyCol).setValue(currentStandby + standby);
        var updateCol = headers.indexOf("Last Updated") + 1;
        if (updateCol > 0) {
          sheet.getRange(i + 1, updateCol).setValue(new Date());
        }
        var sourceCol = headers.indexOf("Source") + 1;
        if (sourceCol > 0 && !data[i][sourceCol - 1]) {
          sheet.getRange(i + 1, sourceCol).setValue(source);
        }
        found = true;
        updated++;
        break;
      }
    }

    if (!found) {
      // --- FORCE: Always use the user's selected set when adding a new row ---
      var finalSet = set;
      
      // If the user selected a set, use it no matter what
      if (userSelectedSet && userSelectedSet !== "") {
        finalSet = userSelectedSet;
      }
      
      // If still empty, try to find it from the Master Checklist
      if (!finalSet || finalSet === "") {
        var checklist = ss.getSheetByName(BCD.SHEETS.MASTER);
        if (checklist) {
          var checkData = checklist.getDataRange().getValues();
          var checkHeaders = checkData[0];
          var cBrandCol = checkHeaders.indexOf("Brand");
          var cYearCol = checkHeaders.indexOf("Year");
          var cSetCol = checkHeaders.indexOf("Set");
          var cCardCol = checkHeaders.indexOf("Card #");
          for (var i = 1; i < checkData.length; i++) {
            if (
              String(checkData[i][cBrandCol]) === brand &&
              String(checkData[i][cYearCol]) === String(year) &&
              String(checkData[i][cCardCol]) === String(card)
            ) {
              finalSet = checkData[i][cSetCol] || set;
              break;
            }
          }
        }
      }

      var row = Array(headers.length).fill("");
      var idx = function(name) { return headers.indexOf(name); };

      if (idx("Brand") !== -1) row[idx("Brand")] = brand;
      if (idx("Year") !== -1) row[idx("Year")] = year;
      if (idx("Set") !== -1) row[idx("Set")] = finalSet;
      if (idx("Card #") !== -1) row[idx("Card #")] = Number(card);
      if (idx("Quantity In Progress") !== -1) row[idx("Quantity In Progress")] = 1;
      if (idx("Quantity Standby") !== -1) row[idx("Quantity Standby")] = standby;
      if (idx("Quantity Sold") !== -1) row[idx("Quantity Sold")] = 0;
      if (idx("Batch ID") !== -1) row[idx("Batch ID")] = batchID;
      if (idx("Source") !== -1) row[idx("Source")] = source;
      if (idx("Condition") !== -1) row[idx("Condition")] = BCD.DEFAULTS.CONDITION;
      if (idx("Quality Status") !== -1) row[idx("Quality Status")] = BCD.DEFAULTS.QUALITY;
      if (idx("Date Added") !== -1) row[idx("Date Added")] = new Date();
      if (idx("Last Updated") !== -1) row[idx("Last Updated")] = new Date();
      if (idx("Notes") !== -1) row[idx("Notes")] = notes;

      sheet.appendRow(row);
      added++;
    }
  });

  UpdateInventoryFromChecklist();
  UpdateSetCompletion();

  if (source) {
    UpdateSourceStats(source);
  }

  LogAction("Quick Intake", "Cards Read: " + numbers.length + " | New: " + added + " | Updated: " + updated + " | Batch: " + batchID + " | Source: " + source);

  return {
    added: added,
    updated: updated,
    total: numbers.length,
    batch: batchID,
    source: source
  };
}
