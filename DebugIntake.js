function DebugIntake() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("Inventory");
  var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  
  Logger.log("🔍 Inventory Headers:");
  Logger.log(JSON.stringify(headers));
  
  Logger.log("🔍 Looking for 1984 Topps #28 in Inventory:");
  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (data[i][headers.indexOf("Brand")] === "Topps" && 
        data[i][headers.indexOf("Year")] === 1984 && 
        data[i][headers.indexOf("Card #")] === 28) {
      Logger.log("  Found: " + data[i][headers.indexOf("Set")] + " | " + data[i][headers.indexOf("Player")]);
    }
  }
}
