function DebugRickey() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("Master Checklist");
  var data = sheet.getDataRange().getValues();
  var headers = data[0];
  
  var playerCol = headers.indexOf("Player");
  var rookieCol = headers.indexOf("Rookie");
  var cardCol = headers.indexOf("Card #");
  
  Logger.log("🔍 Looking for Rickey Henderson in Master Checklist...");
  
  for (var i = 1; i < data.length; i++) {
    if (data[i][playerCol] && data[i][playerCol].indexOf("Rickey Henderson") !== -1) {
      Logger.log("✅ Found Rickey!");
      Logger.log("  Card #: " + data[i][cardCol]);
      Logger.log("  Rookie: [" + data[i][rookieCol] + "]");
      Logger.log("  Full row: " + JSON.stringify(data[i]));
    }
  }
}
