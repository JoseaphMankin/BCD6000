function DumpOzzie() {
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
  
  Logger.log("🔍 Searching for 1980 Topps #393 with exact values...");
  
  for (var i = 1; i < data.length; i++) {
    var brand = data[i][brandCol];
    var year = data[i][yearCol];
    var card = data[i][cardCol];
    var player = data[i][playerCol];
    
    if (player && player.indexOf("Ozzie") !== -1) {
      Logger.log("✅ Found Ozzie!");
      Logger.log("  Brand: [" + brand + "] Type: " + typeof brand);
      Logger.log("  Year: [" + year + "] Type: " + typeof year);
      Logger.log("  Set: [" + data[i][setCol] + "]");
      Logger.log("  Card #: [" + card + "] Type: " + typeof card);
      Logger.log("  Player: [" + player + "]");
      Logger.log("  Team: [" + data[i][teamCol] + "]");
      Logger.log("  Position: [" + data[i][posCol] + "]");
      Logger.log("  Hall of Fame: [" + data[i][hofCol] + "]");
      Logger.log("  Rookie: [" + data[i][rookieCol] + "]");
      break;
    }
  }
}
