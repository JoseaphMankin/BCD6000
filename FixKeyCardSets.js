function FixKeyCardSets() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("KeyCards");
  
  if (!sheet) {
    SpreadsheetApp.getUi().alert("KeyCards sheet not found!");
    return;
  }
  
  var data = sheet.getDataRange().getValues();
  var headers = data[0];
  
  var setCol = headers.indexOf("Set");
  var brandCol = headers.indexOf("Brand");
  var yearCol = headers.indexOf("Year");
  var cardCol = headers.indexOf("Card #");
  
  var updated = 0;
  
  for (var i = 1; i < data.length; i++) {
    var set = data[i][setCol];
    
    // If the set is "Base Set", change it to the brand name
    if (set === "Base Set") {
      var brand = data[i][brandCol];
      data[i][setCol] = brand; // e.g., "Topps" instead of "Base Set"
      updated++;
    }
  }
  
  // Write back the changes
  sheet.getRange(2, 1, data.length - 1, headers.length).setValues(data.slice(1));
  
  SpreadsheetApp.getUi().alert("Fixed " + updated + " KeyCards to use brand name as set.");
}
