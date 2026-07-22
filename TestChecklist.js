function Load1979TestChecklist() {

  const cards = [
    { Brand: "Topps", Year: 1979, Set: "Topps", "Card #": 1, Player: "Ozzie Smith", Team: "St. Louis Cardinals", Position: "SS", "Hall of Fame": "Yes", Rookie: "No" },
    { Brand: "Topps", Year: 1979, Set: "Topps", "Card #": 2, Player: "Eddie Murray", Team: "Baltimore Orioles", Position: "1B", "Hall of Fame": "Yes", Rookie: "No" },
    { Brand: "Topps", Year: 1979, Set: "Topps", "Card #": 3, Player: "Paul Molitor", Team: "Milwaukee Brewers", Position: "2B", "Hall of Fame": "Yes", Rookie: "No" },
    { Brand: "Topps", Year: 1979, Set: "Topps", "Card #": 4, Player: "Lou Whitaker", Team: "Detroit Tigers", Position: "2B", "Hall of Fame": "No", Rookie: "Yes" }
  ];

  WriteChecklistRows(cards);
  RegisterSet(cards);
  UpdateSetCompletion();

  SpreadsheetApp.getUi().alert(
    "1979 Topps test checklist loaded!\n\n" +
    "Cards: " + cards.length
  );
}