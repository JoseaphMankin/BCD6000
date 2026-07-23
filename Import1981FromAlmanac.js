function Import1981FromAlmanac() {
  var url = "https://www.baseball-almanac.com/players/1981_Topps_Baseball_Cards.shtml";
  
  var response = UrlFetchApp.fetch(url);
  var html = response.getContentText();
  
  // Find the table rows
  var rows = html.match(/<tr>.*?<\/tr>/gs);
  var cards = [];
  var inTable = false;
  
  for (var i = 0; i < rows.length; i++) {
    var row = rows[i];
    
    // Look for the start of the table
    if (row.indexOf('<table') !== -1 && row.indexOf('1981 Topps') !== -1) {
      inTable = true;
      continue;
    }
    
    if (!inTable) continue;
    if (row.indexOf('</table>') !== -1) break;
    
    // Extract cells
    var cells = row.match(/<td[^>]*>(.*?)<\/td>/gs);
    if (!cells || cells.length < 3) continue;
    
    var cardNum = cells[0].replace(/<[^>]*>/g, '').trim();
    var description = cells[1].replace(/<[^>]*>/g, '').trim();
    var notes = cells[2] ? cells[2].replace(/<[^>]*>/g, '').trim() : '';
    
    if (!cardNum || isNaN(cardNum)) continue;
    if (description === '' || description === 'Checklist') continue;
    if (description.indexOf('Checklist') !== -1) continue;
    
    // Clean up description
    description = description.replace(/\s+/g, ' ').trim();
    
    cards.push({
      brand: "Topps",
      year: "1981",
      set: "Base Set",
      "card #": cardNum,
      player: description,
      team: "",
      position: "",
      "hall of fame": "No",
      rookie: "No"
    });
  }
  
  // Delete existing 1981 Topps data
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var masterSheet = ss.getSheetByName("Master Checklist");
  if (masterSheet) {
    var data = masterSheet.getDataRange().getValues();
    var headers = data[0];
    var brandCol = headers.indexOf("Brand");
    var yearCol = headers.indexOf("Year");
    
    for (var i = data.length - 1; i >= 1; i--) {
      if (data[i][brandCol] === "Topps" && data[i][yearCol] === 1981) {
        masterSheet.deleteRow(i + 1);
      }
    }
  }
  
  WriteChecklistRows(cards);
  RegisterSet(cards);
  UpdateSetCompletion();
  
  SpreadsheetApp.getUi().alert("1981 Topps imported from Baseball Almanac!\n\nCards added: " + cards.length);
}
