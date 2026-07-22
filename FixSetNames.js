function FixSetNames() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // Fix Master Checklist
  var master = ss.getSheetByName("Master Checklist");
  if (master) {
    var data = master.getDataRange().getValues();
    var headers = data[0];
    var setCol = headers.indexOf("Set");
    var brandCol = headers.indexOf("Brand");
    var yearCol = headers.indexOf("Year");
    
    for (var i = 1; i < data.length; i++) {
      if (data[i][brandCol] === "Topps" && data[i][yearCol] === 1985 && data[i][setCol] === "Topps") {
        master.getRange(i + 1, setCol + 1).setValue("Base Set");
      }
    }
  }
  
  // Fix Sets sheet
  var sets = ss.getSheetByName("Sets");
  if (sets) {
    var data = sets.getDataRange().getValues();
    var headers = data[0];
    var setCol = headers.indexOf("Set");
    var brandCol = headers.indexOf("Brand");
    var yearCol = headers.indexOf("Year");
    
    for (var i = 1; i < data.length; i++) {
      if (data[i][brandCol] === "Topps" && data[i][yearCol] === 1985 && data[i][setCol] === "Topps") {
        sets.getRange(i + 1, setCol + 1).setValue("Base Set");
      }
    }
  }
  
  SpreadsheetApp.getUi().alert("Set names updated! 'Topps' → 'Base Set' for 1985 Topps.");
}
