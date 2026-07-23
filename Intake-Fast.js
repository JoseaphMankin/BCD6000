function ProcessQuickIntake(form) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(BCD.SHEETS.INVENTORY);
  var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  
  var brand = form.brand;
  var year = Number(form.year);
  var source = form.source || "";
  var userSelectedSet = form.set || "";
  var notes = form.notes || "";

  // --- EXTRACT NUMBERS ---
  var rawText = form.cards || "";
  var numbers = rawText.match(/\d+/g)?.map(Number) || [];
  
  if (numbers.length === 0) {
    throw new Error("No card numbers detected.");
  }

  // --- DETERMINE SET ---
  var set = userSelectedSet;
  if (!set || set === "") {
    // Try to find the set from the Master Checklist
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
      if (setList.length > 0) {
        set = setList[0];
      }
    }
  }
  
  if (!set) set = brand; // fallback

  // --- GET SOURCE INFO ---
  var sourceTitle = GetSourceTitle(source);
  var batchID = CreateBatch(sourceTitle, notes);

  // --- PROCESS EACH CARD ---
  var added = 0;
  var updated = 0;
  var keyCardHits = [];

  // Load existing inventory into memory for quick lookup
  var data = sheet.getDataRange().getValues();
  var invIndex = {};
  for (var i = 1; i < data.length; i++) {
    var key = String(data[i][headers.indexOf("Brand")]) + "|" +
              String(data[i][headers.indexOf("Year")]) + "|" +
              String(data[i][headers.indexOf("Set")]) + "|" +
              String(data[i][headers.indexOf("Card #")]);
    invIndex[key] = i;
  }

  // Load KeyCards for alert detection
  var keyCards = GetKeyCards();
  var keyCardLookup = {};
  for (var k = 0; k < keyCards.length; k++) {
    var kc = keyCards[k];
    var kcKey = kc.brand + "|" + String(kc.year) + "|" + kc.card;
    keyCardLookup[kcKey] = kc;
  }

  // Count duplicates
  var counts = {};
  numbers.forEach(function(card) {
    counts[card] = (counts[card] || 0) + 1;
  });

  var rowsToAdd = [];

  Object.keys(counts).forEach(function(card) {
    var totalQty = counts[card];
    var standby = totalQty - 1;
    var key = String(brand) + "|" + String(year) + "|" + String(set) + "|" + String(card);
    var foundIndex = invIndex[key];

    if (foundIndex !== undefined) {
      // Update existing
      var row = foundIndex + 1;
      var inProgressCol = headers.indexOf("Quantity In Progress") + 1;
      var standbyCol = headers.indexOf("Quantity Standby") + 1;
      var currentInProgress = Number(data[foundIndex][headers.indexOf("Quantity In Progress")]) || 0;
      var currentStandby = Number(data[foundIndex][headers.indexOf("Quantity Standby")]) || 0;
      sheet.getRange(row, inProgressCol).setValue(currentInProgress + 1);
      sheet.getRange(row, standbyCol).setValue(currentStandby + standby);
      var updateCol = headers.indexOf("Last Updated") + 1;
      if (updateCol > 0) {
        sheet.getRange(row, updateCol).setValue(new Date());
      }
      updated++;
    } else {
      // Add new
      var row = Array(headers.length).fill("");
      var idx = function(name) { return headers.indexOf(name); };

      if (idx("Brand") !== -1) row[idx("Brand")] = brand;
      if (idx("Year") !== -1) row[idx("Year")] = year;
      if (idx("Set") !== -1) row[idx("Set")] = set;
      if (idx("Card #") !== -1) row[idx("Card #")] = Number(card);
      if (idx("Quantity In Progress") !== -1) row[idx("Quantity In Progress")] = 1;
      if (idx("Quantity Standby") !== -1) row[idx("Quantity Standby")] = standby;
      if (idx("Quantity Sold") !== -1) row[idx("Quantity Sold")] = 0;
      if (idx("Batch ID") !== -1) row[idx("Batch ID")] = batchID;
      if (idx("Source") !== -1) row[idx("Source")] = source;
      if (idx("Condition") !== -1) row[idx("Condition")] = BCD.DEFAULTS.CONDITION || "Raw";
      if (idx("Quality Status") !== -1) row[idx("Quality Status")] = BCD.DEFAULTS.QUALITY || "Keeper";
      if (idx("Date Added") !== -1) row[idx("Date Added")] = new Date();
      if (idx("Last Updated") !== -1) row[idx("Last Updated")] = new Date();
      if (idx("Notes") !== -1) row[idx("Notes")] = notes;

      rowsToAdd.push(row);
      added++;
    }

    // Check for Key Card
    var kcKey = brand + "|" + String(year) + "|" + String(card);
    var match = keyCardLookup[kcKey];
    if (match) {
      keyCardHits.push({
        player: match.player,
        card: match.card,
        tier: match.tier,
        category: match.category
      });
    }
  });

  // Batch write new rows
  if (rowsToAdd.length > 0) {
    sheet.getRange(sheet.getLastRow() + 1, 1, rowsToAdd.length, headers.length).setValues(rowsToAdd);
  }

  // Update source stats (lightweight)
  if (source) {
    try { UpdateSourceStats(source); } catch(e) {}
  }

  LogAction("Quick Intake", "Cards Read: " + numbers.length + " | New: " + added + " | Updated: " + updated);

  return {
    added: added,
    updated: updated,
    total: numbers.length,
    batch: batchID,
    source: source,
    keyHits: keyCardHits
  };
}
