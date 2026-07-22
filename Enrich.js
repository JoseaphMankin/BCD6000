function UpdateInventoryFromChecklist() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var inventory = ss.getSheetByName("Inventory");
  var checklist = ss.getSheetByName("Master Checklist");
  
  if (!inventory || !checklist) {
    Logger.log("❌ Inventory or Master Checklist not found.");
    return;
  }
  
  var invData = inventory.getDataRange().getValues();
  var checkData = checklist.getDataRange().getValues();
  
  var invHeaders = invData[0];
  var checkHeaders = checkData[0];
  
  // Build lookup from Master Checklist using Brand|Year|Set|Card#
  var lookup = {};
  for (var i = 1; i < checkData.length; i++) {
    var brand = checkData[i][checkHeaders.indexOf("Brand")];
    var year = checkData[i][checkHeaders.indexOf("Year")];
    var set = checkData[i][checkHeaders.indexOf("Set")];
    var card = checkData[i][checkHeaders.indexOf("Card #")];
    var key = String(brand) + "|" + String(year) + "|" + String(set) + "|" + String(card);
    lookup[key] = checkData[i];
  }
  
  // Fields to copy from checklist to inventory
  var fields = ["Set", "Player", "Team", "Position", "Hall of Fame", "Rookie", "Future Stars", "Rookie Cup", "League Leaders", "Checklist", "Manager", "Multi Player", "Variation", "Error", "Image URL", "Card ID"];
  
  var updated = 0;
  
  // Loop through inventory and match using the EXACT set from inventory
  for (var i = 1; i < invData.length; i++) {
    var brand = invData[i][invHeaders.indexOf("Brand")];
    var year = invData[i][invHeaders.indexOf("Year")];
    var set = invData[i][invHeaders.indexOf("Set")];
    var card = invData[i][invHeaders.indexOf("Card #")];
    var key = String(brand) + "|" + String(year) + "|" + String(set) + "|" + String(card);
    
    var match = lookup[key];
    
    if (match) {
      fields.forEach(function(field) {
        var invCol = invHeaders.indexOf(field);
        var checkCol = checkHeaders.indexOf(field);
        
        if (invCol !== -1 && checkCol !== -1) {
          var value = match[checkCol];
          if (value && value !== "") {
            inventory.getRange(i + 1, invCol + 1).setValue(value);
          }
        }
      });
      updated++;
    }
  }
  
  Logger.log("✅ Enriched " + updated + " cards.");
  return updated;
}
