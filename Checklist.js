function WriteChecklistRows(cards) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(BCD.SHEETS.MASTER);

  if (!sheet) {
    sheet = ss.insertSheet(BCD.SHEETS.MASTER);
    sheet.appendRow(SCHEMA.MASTER);
    formatHeader(sheet);
  }

  var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  var data = sheet.getDataRange().getValues();

  var existing = {};

  for (var i = 1; i < data.length; i++) {
    var brand = data[i][headers.indexOf("Brand")];
    var year = data[i][headers.indexOf("Year")];
    var set = data[i][headers.indexOf("Set")];
    var cardNum = data[i][headers.indexOf("Card #")];
    
    if (brand && year && set && cardNum !== undefined && cardNum !== "") {
      var key = String(brand) + "|" + String(year) + "|" + String(set) + "|" + String(cardNum);
      existing[key] = true;
    }
  }

  var hallOfFame = [
    "Hank Aaron", "Roberto Clemente", "Willie Mays", "Mickey Mantle",
    "Ted Williams", "Stan Musial", "Lou Gehrig", "Babe Ruth",
    "Jackie Robinson", "Roy Campanella", "Richie Ashburn", "Ernie Banks",
    "Yogi Berra", "George Brett", "Rod Carew", "Steve Carlton",
    "Gary Carter", "Orlando Cepeda", "Reggie Jackson", "Fergie Jenkins",
    "Al Kaline", "Harmon Killebrew", "Bob Lemon", "Greg Maddux",
    "Eddie Mathews", "Willie McCovey", "Joe Morgan", "Eddie Murray",
    "Phil Niekro", "Tony Perez", "Gaylord Perry", "Brooks Robinson",
    "Frank Robinson", "Mike Schmidt", "Tom Seaver", "Ozzie Smith",
    "Duke Snider", "Warren Spahn", "Willie Stargell", "Don Sutton",
    "Carl Yastrzemski", "Robin Yount", "Dave Winfield", "Cal Ripken",
    "Rickey Henderson", "Ken Griffey Jr.", "Pedro Martinez", "Randy Johnson",
    "John Smoltz", "Tom Glavine", "Frank Thomas", "Jeff Bagwell",
    "Craig Biggio", "Derek Jeter", "Mariano Rivera", "David Ortiz",
    "Tony Gwynn", "Kirby Puckett", "Paul Molitor", "Wade Boggs",
    "Dennis Eckersley", "Rollie Fingers", "Goose Gossage", "Bruce Sutter",
    "Andre Dawson", "Barry Larkin", "Roberto Alomar", "Joe Torre",
    "Carlton Fisk", "Johnny Bench", "Ken Griffey Jr."
  ];

  var rookieYears = {
    "Rickey Henderson": 1980,
    "Ozzie Smith": 1979,
    "Cal Ripken": 1981,
    "Cal Ripken Jr.": 1981,
    "Ken Griffey Jr.": 1989,
    "Tony Gwynn": 1983,
    "Wade Boggs": 1982,
    "Don Mattingly": 1984,
    "Barry Bonds": 1986,
    "Frank Thomas": 1990,
    "Jeff Bagwell": 1991,
    "Craig Biggio": 1989,
    "Derek Jeter": 1993,
    "Mariano Rivera": 1995,
    "David Ortiz": 1997,
    "Pedro Martinez": 1992,
    "Randy Johnson": 1989,
    "Greg Maddux": 1987,
    "Tom Glavine": 1988,
    "John Smoltz": 1989,
    "Mike Trout": 2011,
    "Roberto Alomar": 1988,
    "Barry Larkin": 1986,
    "Kirby Puckett": 1984,
    "Paul Molitor": 1978,
    "Robin Yount": 1974,
    "Dave Winfield": 1974,
    "Eddie Murray": 1977,
    "George Brett": 1973,
    "Carl Yastrzemski": 1960,
    "Johnny Bench": 1968,
    "Joe Morgan": 1965,
    "Steve Carlton": 1965,
    "Tom Seaver": 1967,
    "Rollie Fingers": 1968,
    "Bruce Sutter": 1976,
    "Goose Gossage": 1972,
    "Dennis Eckersley": 1975,
    "Gary Carter": 1974,
    "Andre Dawson": 1976,
    "Phil Niekro": 1964,
    "Gaylord Perry": 1962,
    "Fergie Jenkins": 1965,
    "Greg Maddux": 1987,
    "Carlton Fisk": 1969,
    "Jim Rice": 1974,
    "Reggie Jackson": 1967,
    "Willie Stargell": 1962,
    "Al Kaline": 1953,
    "Harmon Killebrew": 1954,
    "Eddie Mathews": 1952,
    "Duke Snider": 1947,
    "Warren Spahn": 1942,
    "Hank Aaron": 1954,
    "Willie Mays": 1951,
    "Mickey Mantle": 1951,
    "Ted Williams": 1939,
    "Stan Musial": 1941,
    "Lou Gehrig": 1923,
    "Babe Ruth": 1914,
    "Jackie Robinson": 1947,
    "Roy Campanella": 1948,
    "Richie Ashburn": 1948,
    "Ernie Banks": 1953,
    "Yogi Berra": 1946,
    "Orlando Cepeda": 1958,
    "Roberto Clemente": 1955
  };

  var rowsToAdd = [];
  var added = 0;
  var skipped = 0;
  var setsToRegister = {};

  cards.forEach(function(card) {
    var brand = String(card.brand || card.Brand || "");
    var year = String(card.year || card.Year || "");
    var set = String(card.set || card.Set || "");
    var cardNum = String(card["card #"] || card["Card #"] || "");
    var player = String(card.player || card.Player || "");

    if (!cardNum || cardNum === "") {
      skipped++;
      return;
    }

    var key = brand + "|" + year + "|" + set + "|" + cardNum;

    if (existing[key]) {
      skipped++;
      return;
    }

    var setKey = brand + "|" + year + "|" + set;
    if (!setsToRegister[setKey]) {
      setsToRegister[setKey] = { brand: brand, year: year, set: set };
    }

    var row = Array(headers.length).fill("");
    
    var fieldMap = {
      "Brand": brand,
      "Year": year,
      "Set": set,
      "Card #": cardNum,
      "Player": player,
      "Team": card.team || card.Team || "",
      "Position": card.position || card.Position || "",
      "Hall of Fame": card["hall of fame"] || card["Hall of Fame"] || "No",
      "Rookie": card.rookie || card.Rookie || "No",
      "Attributes": card.attributes || "",
      "Price Raw": card.price_raw || "",
      "Price PSA 10": card.price_psa10 || "",
      "Price PSA 9": card.price_psa9 || "",
      "Parallel Count": card.parallel_count || 0,
      "Future Stars": card.future_stars || "No",
      "Rookie Cup": card.rookie_cup || "No",
      "League Leaders": card.league_leaders || "No",
      "Checklist": card.checklist || "No",
      "Manager": card.manager || "No",
      "Multi Player": card.multi_player || "No",
      "Variation": card.variation || "No",
      "Error": card.error || "No",
      "Image URL": card.image_url || "",
      "Card ID": card.card_id || ""
    };

    headers.forEach(function(header, index) {
      if (fieldMap[header] !== undefined) {
        row[index] = fieldMap[header];
      }
    });

    var attributes = card.attributes || "";
    if (attributes.indexOf("RC") !== -1) {
      var rookieIdx = headers.indexOf("Rookie");
      if (rookieIdx !== -1) row[rookieIdx] = "Yes";
    }

    var cardYear = parseInt(year);
    var rookieYear = rookieYears[player];
    if (rookieYear && cardYear === rookieYear) {
      var rookieIdx = headers.indexOf("Rookie");
      if (rookieIdx !== -1) row[rookieIdx] = "Yes";
    }

    var isHallOfFame = false;
    for (var h = 0; h < hallOfFame.length; h++) {
      if (player.indexOf(hallOfFame[h]) !== -1) {
        isHallOfFame = true;
        break;
      }
    }
    
    if (isHallOfFame) {
      var hofIdx = headers.indexOf("Hall of Fame");
      if (hofIdx !== -1) row[hofIdx] = "Yes";
    }

    rowsToAdd.push(row);
    existing[key] = true;
    added++;
  });

  if (rowsToAdd.length > 0) {
    var startRow = sheet.getLastRow() + 1;
    var numRows = rowsToAdd.length;
    var numCols = headers.length;
    sheet.getRange(startRow, 1, numRows, numCols).setValues(rowsToAdd);
  }

  // Register all sets that were imported
  for (var s in setsToRegister) {
    var setData = setsToRegister[s];
    var cardExample = {
      brand: setData.brand,
      year: setData.year,
      set: setData.set
    };
    RegisterSet([cardExample]);
  }

  // No alert here — let the caller handle it
  return { added: added, skipped: skipped, sets: Object.keys(setsToRegister).length };
}

function RegisterSet(cards) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(BCD.SHEETS.SETS);

  if (!sheet) {
    sheet = ss.insertSheet(BCD.SHEETS.SETS);
    sheet.appendRow(SCHEMA.SETS);
    formatHeader(sheet);
  }

  var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  
  var first = cards[0];
  var brand = first.brand || first.Brand || "";
  var year = first.year || first.Year || "";
  var set = first.set || first.Set || "";
  
  var count = cards.length;

  var data = sheet.getDataRange().getValues();
  var found = false;

  for (var i = 1; i < data.length; i++) {
    if (
      String(data[i][0]) == String(brand) &&
      String(data[i][1]) == String(year) &&
      String(data[i][2]) == String(set)
    ) {
      found = true;
      if (headers.indexOf("Checklist Loaded") !== -1) {
        sheet.getRange(i + 1, headers.indexOf("Checklist Loaded") + 1).setValue("Yes");
      }
      if (headers.indexOf("Cards Known") !== -1) {
        sheet.getRange(i + 1, headers.indexOf("Cards Known") + 1).setValue(count);
      }
      if (headers.indexOf("Total Cards") !== -1) {
        sheet.getRange(i + 1, headers.indexOf("Total Cards") + 1).setValue(count);
      }
      break;
    }
  }

  if (!found) {
    var row = Array(headers.length).fill("");
    if (headers.indexOf("Brand") !== -1) row[headers.indexOf("Brand")] = brand;
    if (headers.indexOf("Year") !== -1) row[headers.indexOf("Year")] = year;
    if (headers.indexOf("Set") !== -1) row[headers.indexOf("Set")] = set;
    if (headers.indexOf("Total Cards") !== -1) row[headers.indexOf("Total Cards")] = count;
    if (headers.indexOf("Checklist Loaded") !== -1) row[headers.indexOf("Checklist Loaded")] = "Yes";
    if (headers.indexOf("Cards Known") !== -1) row[headers.indexOf("Cards Known")] = count;
    if (headers.indexOf("Last Updated") !== -1) row[headers.indexOf("Last Updated")] = new Date();
    sheet.appendRow(row);
  }
}