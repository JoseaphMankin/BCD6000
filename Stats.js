function UpdateSetCompletion() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sets = ss.getSheetByName(BCD.SHEETS.SETS);
  var inventory = ss.getSheetByName(BCD.SHEETS.INVENTORY);
  var checklist = ss.getSheetByName(BCD.SHEETS.MASTER);

  if (!sets || !inventory || !checklist) {
    throw new Error("Missing required sheets.");
  }

  var setData = sets.getDataRange().getValues();
  var invData = inventory.getDataRange().getValues();
  var checkData = checklist.getDataRange().getValues();

  var setHeaders = setData[0];
  var invHeaders = invData[0];
  var checkHeaders = checkData[0];

  // Build checklist counts per set
  var checklistCounts = {};
  for (var i = 1; i < checkData.length; i++) {
    var key = makeSetKey(
      checkData[i][checkHeaders.indexOf("Brand")],
      checkData[i][checkHeaders.indexOf("Year")],
      checkData[i][checkHeaders.indexOf("Set")]
    );
    if (!checklistCounts[key]) checklistCounts[key] = 0;
    checklistCounts[key]++;
  }

  // Build inventory counts per set
  var owned = {};
  for (var i = 1; i < invData.length; i++) {
    var key = makeSetKey(
      invData[i][invHeaders.indexOf("Brand")],
      invData[i][invHeaders.indexOf("Year")],
      invData[i][invHeaders.indexOf("Set")]
    );
    if (!owned[key]) {
      owned[key] = { unique: {}, total: 0, qualityIssues: 0 };
    }
    var cardNumber = invData[i][invHeaders.indexOf("Card #")];
    var quality = invData[i][invHeaders.indexOf("Quality Status")] || "Keeper";
    var inProgress = Number(invData[i][invHeaders.indexOf("Quantity In Progress")]) || 0;
    var standby = Number(invData[i][invHeaders.indexOf("Quantity Standby")]) || 0;
    if (inProgress > 0 || standby > 0) {
      owned[key].unique[cardNumber] = true;
    }
    owned[key].total += inProgress + standby;
    if (quality === "Upgrade Needed" || quality === "Placeholder") {
      owned[key].qualityIssues++;
    }
  }

  // Update Sets sheet
  for (var i = 1; i < setData.length; i++) {
    var row = setData[i];
    var key = makeSetKey(row[0], row[1], row[2]);
    var checklistTotal = checklistCounts[key] || 0;
    var ownedData = owned[key] || { unique: {}, total: 0, qualityIssues: 0 };
    var uniqueOwned = Object.keys(ownedData.unique).length;
    var totalOwned = ownedData.total || 0;
    var percent = checklistTotal > 0 ? uniqueOwned / checklistTotal : 0;

    updateSetField(sets, i + 1, setHeaders, "Total Cards", checklistTotal);
    updateSetField(sets, i + 1, setHeaders, "Checklist Loaded", checklistTotal > 0 ? "Yes" : "No");
    updateSetField(sets, i + 1, setHeaders, "Cards Known", checklistTotal);
    updateSetField(sets, i + 1, setHeaders, "Unique Owned", uniqueOwned);
    updateSetField(sets, i + 1, setHeaders, "Total Owned", totalOwned);
    updateSetField(sets, i + 1, setHeaders, "Percent Complete", percent);
    updateSetField(sets, i + 1, setHeaders, "Completion Status", getCompletionStatus(percent, checklistTotal, ownedData.qualityIssues));
    updateSetField(sets, i + 1, setHeaders, "Quality Issues", ownedData.qualityIssues);
    updateSetField(sets, i + 1, setHeaders, "Last Updated", new Date());
  }

  // --- Build the Dashboard ---
  BuildDashboard();

  LogAction("Set Completion Updated", "Stats recalculated for " + (setData.length - 1) + " sets");
}

function BuildDashboard() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("Dashboard");
  if (!sheet) {
    sheet = ss.insertSheet("Dashboard");
  }
  sheet.clear();

  var setsData = ss.getSheetByName(BCD.SHEETS.SETS).getDataRange().getValues();
  var headers = setsData[0];

  var brandCol = headers.indexOf("Brand");
  var yearCol = headers.indexOf("Year");
  var setCol = headers.indexOf("Set");
  var totalCol = headers.indexOf("Total Cards");
  var uniqueCol = headers.indexOf("Unique Owned");
  var percentCol = headers.indexOf("Percent Complete");

  // --- HEADER ---
  sheet.getRange("A1").setValue("📊 Collection Dashboard");
  sheet.getRange("A1").setFontWeight("bold").setFontSize(20);

  // --- STATS CARDS ---
  var activeSets = 0;
  var totalCards = 0;
  var totalUnique = 0;
  var setsOver50 = 0;
  var nextTarget = "";
  var nextPercent = 0;

  var setList = [];

  for (var i = 1; i < setsData.length; i++) {
    var owned = Number(setsData[i][uniqueCol]) || 0;
    var total = Number(setsData[i][totalCol]) || 0;
    if (owned > 0) {
      activeSets++;
      totalCards += total;
      totalUnique += owned;
      var percent = total > 0 ? (owned / total) * 100 : 0;
      if (percent >= 50) {
        setsOver50++;
      }
      setList.push({
        name: setsData[i][brandCol] + " " + setsData[i][yearCol] + " " + setsData[i][setCol],
        owned: owned,
        total: total,
        percent: percent
      });
    }
  }

  // Find the set with the highest percent (next to complete)
  setList.sort(function(a, b) { return b.percent - a.percent; });
  if (setList.length > 0) {
    nextTarget = setList[0].name;
    nextPercent = setList[0].percent;
  }

  // Row 3: Active Sets
  sheet.getRange("A3").setValue("📦 Active Sets");
  sheet.getRange("A3").setFontWeight("bold").setFontSize(12);
  sheet.getRange("A4").setValue(activeSets);
  sheet.getRange("A4").setFontSize(16);

  // Row 3: Total Cards
  sheet.getRange("C3").setValue("🃏 Total Cards");
  sheet.getRange("C3").setFontWeight("bold").setFontSize(12);
  sheet.getRange("C4").setValue(totalCards);
  sheet.getRange("C4").setFontSize(16);

  // Row 3: Unique Owned
  sheet.getRange("E3").setValue("✅ Unique Owned");
  sheet.getRange("E3").setFontWeight("bold").setFontSize(12);
  sheet.getRange("E4").setValue(totalUnique);
  sheet.getRange("E4").setFontSize(16);

  // Row 3: Sets at 50%+ (this is a COUNT, not a percentage!)
  sheet.getRange("G3").setValue("🎯 Sets at 50%+");
  sheet.getRange("G3").setFontWeight("bold").setFontSize(12);
  sheet.getRange("G4").setValue(setsOver50);
  sheet.getRange("G4").setFontSize(16);

  // Row 5: Next to Complete
  sheet.getRange("A5").setValue("🏆 Next to Complete");
  sheet.getRange("A5").setFontWeight("bold").setFontSize(12);
  sheet.getRange("A6").setValue(nextTarget + " (" + Math.round(nextPercent * 100) / 100 + "%)");
  sheet.getRange("A6").setFontSize(14);

  // --- TOP 3 CLOSEST TO COMPLETION ---
  var topRow = 8;
  sheet.getRange(topRow, 1).setValue("🏆 Top 3 Closest to Completion");
  sheet.getRange(topRow, 1).setFontWeight("bold").setFontSize(14);
  topRow++;

  var sorted = setList.slice().sort(function(a, b) { return b.percent - a.percent; });
  var top3 = sorted.slice(0, 3);

  if (top3.length === 0) {
    sheet.getRange(topRow, 1).setValue("No sets started yet.");
  } else {
    sheet.getRange(topRow, 1).setValue("Set");
    sheet.getRange(topRow, 2).setValue("Owned");
    sheet.getRange(topRow, 3).setValue("Total");
    sheet.getRange(topRow, 4).setValue("%");
    sheet.getRange(topRow, 1, 1, 4).setFontWeight("bold");
    topRow++;

    for (var i = 0; i < top3.length; i++) {
      var s = top3[i];
      sheet.getRange(topRow + i, 1).setValue(s.name);
      sheet.getRange(topRow + i, 2).setValue(s.owned);
      sheet.getRange(topRow + i, 3).setValue(s.total);
      sheet.getRange(topRow + i, 4).setValue(Math.round(s.percent * 100) / 100 + "%");
    }
    topRow += top3.length + 2;
  }

  // --- ALL SETS ---
  sheet.getRange(topRow, 1).setValue("All Sets");
  sheet.getRange(topRow, 1).setFontWeight("bold").setFontSize(14);
  topRow++;

  sheet.getRange(topRow, 1).setValue("Set");
  sheet.getRange(topRow, 2).setValue("Owned");
  sheet.getRange(topRow, 3).setValue("Total");
  sheet.getRange(topRow, 4).setValue("%");
  sheet.getRange(topRow, 1, 1, 4).setFontWeight("bold");
  topRow++;

  for (var i = 0; i < setList.length; i++) {
    var s = setList[i];
    sheet.getRange(topRow + i, 1).setValue(s.name);
    sheet.getRange(topRow + i, 2).setValue(s.owned);
    sheet.getRange(topRow + i, 3).setValue(s.total);
    sheet.getRange(topRow + i, 4).setValue(Math.round(s.percent * 100) / 100 + "%");
  }

  sheet.autoResizeColumns(1, 4);
}

function makeSetKey(brand, year, set) {
  return String(brand).toLowerCase() + "|" + String(year) + "|" + String(set).toLowerCase();
}

function updateSetField(sheet, row, headers, field, value) {
  var col = headers.indexOf(field);
  if (col !== -1) {
    sheet.getRange(row, col + 1).setValue(value);
  }
}

function getCompletionStatus(percent, checklistTotal, qualityIssues) {
  if (checklistTotal === 0) return "Needs Checklist";
  if (percent >= 1 && qualityIssues === 0) return "Complete";
  if (percent >= 1 && qualityIssues > 0) return "Complete - Upgrades Needed";
  if (percent >= 0.9) return "Almost There";
  if (percent >= 0.5) return "Collecting";
  return "Just Started";
}
