function PopulateKeyCards() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("KeyCards");
  
  if (!sheet) {
    SpreadsheetApp.getUi().alert("KeyCards sheet not found!");
    return;
  }
  
  var keyCards = [
    ["Topps", 1979, "Base Set", "116", "Ozzie Smith", "Rookie", "S-Tier"],
    ["Topps", 1979, "Base Set", "24", "Paul Molitor", "Rookie", "S-Tier"],
    ["Topps", 1979, "Base Set", "115", "Nolan Ryan", "Star", "A-Tier"],
    ["Topps", 1979, "Base Set", "650", "Pete Rose", "Star", "B-Tier"],
    ["Topps", 1980, "Base Set", "482", "Rickey Henderson", "Rookie", "S-Tier"],
    ["Topps", 1980, "Base Set", "580", "Nolan Ryan", "Star", "A-Tier"],
    ["Topps", 1980, "Base Set", "265", "Robin Yount", "Star", "A-Tier"],
    ["Topps", 1981, "Base Set", "147", "Harold Baines", "Rookie", "A-Tier"],
    ["Topps", 1981, "Base Set", "315", "Kirk Gibson", "Rookie", "A-Tier"],
    ["Topps", 1981, "Base Set", "240", "Nolan Ryan", "Star", "A-Tier"],
    ["Topps", 1981, "Base Set", "260", "Rickey Henderson", "Star", "A-Tier"],
    ["Topps", 1982, "Base Set", "21", "Cal Ripken Jr.", "Rookie", "S-Tier"],
    ["Topps", 1982, "Base Set", "395", "Ozzie Smith", "Star", "A-Tier"],
    ["Topps", 1982, "Base Set", "90", "Nolan Ryan", "Star", "A-Tier"],
    ["Topps", 1983, "Base Set", "482", "Tony Gwynn", "Rookie", "S-Tier"],
    ["Topps", 1983, "Base Set", "498", "Wade Boggs", "Rookie", "S-Tier"],
    ["Topps", 1983, "Base Set", "83", "Ryne Sandberg", "Rookie", "S-Tier"],
    ["Topps", 1983, "Base Set", "163", "Cal Ripken Jr.", "Star", "A-Tier"],
    ["Topps", 1984, "Base Set", "8", "Don Mattingly", "Rookie", "S-Tier"],
    ["Topps", 1984, "Base Set", "182", "Darryl Strawberry", "Rookie", "A-Tier"],
    ["Topps", 1984, "Base Set", "490", "Cal Ripken Jr.", "Star", "A-Tier"],
    ["Topps", 1984, "Topps Traded", "42T", "Dwight Gooden", "Rookie", "S-Tier"],
    ["Topps", 1985, "Base Set", "401", "Mark McGwire", "Rookie", "S-Tier"],
    ["Topps", 1985, "Base Set", "181", "Roger Clemens", "Rookie", "S-Tier"],
    ["Topps", 1985, "Base Set", "536", "Kirby Puckett", "Rookie", "S-Tier"],
    ["Topps", 1985, "Base Set", "620", "Dwight Gooden", "Star", "A-Tier"],
    ["Topps", 1986, "Base Set", "11", "Barry Bonds", "Rookie", "S-Tier"],
    ["Topps", 1986, "Base Set", "660", "Roger Clemens", "Star", "A-Tier"],
    ["Topps", 1986, "Base Set", "1", "Pete Rose", "Star", "B-Tier"],
    ["Topps", 1986, "Topps Traded", "50T", "Bo Jackson", "Rookie", "S-Tier"],
    ["Topps", 1986, "Topps Traded", "11T", "Barry Bonds", "Rookie", "S-Tier"],
    ["Topps", 1987, "Base Set", "320", "Barry Bonds", "Star", "A-Tier"],
    ["Topps", 1987, "Base Set", "634", "Rafael Palmeiro", "Rookie", "A-Tier"],
    ["Topps", 1987, "Base Set", "366", "Mark McGwire", "Star", "B-Tier"],
    ["Topps", 1988, "Base Set", "327", "Craig Biggio", "Rookie", "S-Tier"],
    ["Topps", 1988, "Base Set", "779", "Tom Glavine", "Rookie", "S-Tier"],
    ["Topps", 1988, "Base Set", "303", "Mark Grace", "Rookie", "A-Tier"],
    ["Topps", 1988, "Base Set", "7", "Roberto Alomar", "Rookie", "A-Tier"],
    ["Topps", 1989, "Base Set", "647", "Randy Johnson", "Rookie", "S-Tier"],
    ["Topps", 1989, "Base Set", "49", "Craig Biggio", "Star", "A-Tier"],
    ["Topps", 1989, "Base Set", "382", "John Smoltz", "Rookie", "S-Tier"],
    ["Topps", 1989, "Base Set", "343", "Gary Sheffield", "Rookie", "S-Tier"],
    ["Topps", 1989, "Topps Traded", "41T", "Ken Griffey Jr.", "Rookie", "S-Tier"],
    ["Topps", 1990, "Base Set", "414", "Frank Thomas", "Rookie", "S-Tier"],
    ["Topps", 1990, "Base Set", "336", "Sammy Sosa", "Rookie", "S-Tier"],
    ["Topps", 1990, "Base Set", "701", "Bernie Williams", "Rookie", "A-Tier"],
    ["Topps", 1990, "Base Set", "757", "Larry Walker", "Rookie", "A-Tier"],
    ["Topps", 1991, "Base Set", "333", "Chipper Jones", "Rookie", "S-Tier"],
    ["Topps", 1991, "Base Set", "755", "Jeff Bagwell", "Rookie", "S-Tier"],
    ["Topps", 1991, "Base Set", "36", "Ivan Rodriguez", "Rookie", "S-Tier"],
    ["Topps", 1991, "Base Set", "75", "Mike Mussina", "Rookie", "A-Tier"],
    ["Topps", 1992, "Base Set", "156", "Manny Ramirez", "Rookie", "S-Tier"]
  ];
  
  // Clear existing data (keep headers)
  var lastRow = sheet.getLastRow();
  if (lastRow > 1) {
    sheet.getRange(2, 1, lastRow - 1, 7).clearContent();
  }
  
  // Write data
  if (keyCards.length > 0) {
    sheet.getRange(2, 1, keyCards.length, 7).setValues(keyCards);
  }
  
  sheet.autoResizeColumns(1, 7);
  
  SpreadsheetApp.getUi().alert("Key Cards populated!\n\n" + keyCards.length + " cards added.");
}
