function ManualEnrichOzzie() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var inventory = ss.getSheetByName("Inventory");
  var checklist = ss.getSheetByName("Master Checklist");
  
  var invData = inventory.getDataRange().getValues();
  var checkData = checklist.getDataRange().getValues();
  
  var invHeaders = invData[0];
  var checkHeaders = checkData[0];
  
  // Find Ozzie in Inventory
  var invRow = null;
  var invIndex = -1;
  for (var i = 1; i < invData.length; i++) {
    if (
      invData[i][invHeaders.indexOf("Brand")] === "Topps" &&
      invData[i][invHeaders.indexOf("Year")] === 1980 &&
      invData[i][invHeaders.indexOf("Card #")] === "393"
    ) {
      invRow = invData[i];
      invIndex = i + 1;
      break;
    }
  }
  
  if (!invRow) {
    Logger.log("❌ Ozzie not found in Inventory.");
    return;
  }
  
  Logger.log("✅ Found Ozzie in Inventory at row " + invIndex);
  
  // Find Ozzie in Master Checklist
  var checkRow = null;
  for (var i = 1; i < checkData.length; i++) {
    if (
      checkData[i][checkHeaders.indexOf("Brand")] === "Topps" &&
      checkData[i][checkHeaders.indexOf("Year")] === 1980 &&
      checkData[i][checkHeaders.indexOf("Card #")] === "393"
    ) {
      checkRow = checkData[i];
      break;
    }
  }
  
  if (!checkRow) {
    Logger.log("❌ Ozzie not found in Master Checklist.");
    return;
  }
  
  Logger.log("✅ Found Ozzie in Master Checklist.");
  
  // Fields to copy
  var fields = ["Team", "Position", "Hall of Fame", "Rookie"];
  var updates = [];
  
  fields.forEach(function(field) {
    var invCol = invHeaders.indexOf(field);
    var checkCol = checkHeaders.indexOf(field);
    if (invCol !== -1 && checkCol !== -1) {
      var value = checkRow[checkCol];
      if (value && value !== "") {
        inventory.getRange(invIndex, invCol + 1).setValue(value);
        updates.push(field + " -> " + value);
      }
    }
  });
  
  Logger.log("✅ Updated fields: " + updates.join(", "));
  Logger.log("✅ Manual enrichment complete!");
}
