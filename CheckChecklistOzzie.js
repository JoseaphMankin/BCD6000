function CheckChecklistOzzie() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var checklist = ss.getSheetByName("Master Checklist");
  var data = checklist.getDataRange().getValues();
  var headers = data[0];
  
  var brandCol = headers.indexOf("Brand");
  var yearCol = headers.indexOf("Year");
  var setCol = headers.indexOf("Set");
  var cardCol = headers.indexOf("Card #");
  var playerCol = headers.indexOf("Player");
  var teamCol = headers.indexOf("Team");
  var posCol = headers.indexOf("Position");
  var hofCol = headers.indexOf("Hall of Fame");
  var rookieCol = headers.indexOf("Rookie");
  
  Logger.log("🔍 Looking for 1980 Topps #393 in Master Checklist...");
  
  for (var i = 1; i < data.length; i++) {
    if (
      data[i][brandCol] === "Topps" &&
      data[i][yearCol] === 1980 &&
      data[i][cardCol] === 393
    ) {
      Logger.log("✅ Found!");
      Logger.log("  Player: [" + data[i][playerCol] + "]");
      Logger.log("  Team: [" + data[i][teamCol] + "]");
      Logger.log("  Position: [" + data[i][posCol] + "]");
      Logger.log("  Hall of Fame: [" + data[i][hofCol] + "]");
      Logger.log("  Rookie: [" + data[i][rookieCol] + "]");
      Logger.log("  Set: [" + data[i][setCol] + "]");
      break;
    }
  }
}
