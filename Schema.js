/*
==========================================
 Card Database 6000
 Schema Definitions
 Version 1.0.2
==========================================
*/

const SCHEMA = {

  INVENTORY: [
    "Brand",
    "Year",
    "Set",
    "Card #",
    "Player",
    "Team",
    "Position",
    "Hall of Fame",
    "Rookie",
    "Condition",
    "Quality Status",
    "Quantity In Progress",
    "Quantity Standby",
    "Quantity Sold",
    "Batch ID",
    "Source",
    "Location",
    "Storage Box",
    "Notes",
    "Date Added",
    "Last Updated"
  ],

  MASTER: [
    "Brand",
    "Year",
    "Set",
    "Card #",
    "Player",
    "Team",
    "Position",
    "Hall of Fame",
    "Rookie",
    "Attributes",
    "Price Raw",
    "Price PSA 10",
    "Price PSA 9",
    "Parallel Count",
    "Future Stars",
    "Rookie Cup",
    "League Leaders",
    "Checklist",
    "Manager",
    "Multi Player",
    "Variation",
    "Error",
    "Image URL",
    "Card ID"
  ],

  SETS: [
    "Brand",
    "Year",
    "Set",
    "Total Cards",
    "Checklist Loaded",
    "Cards Known",
    "Unique Owned",
    "Total Owned",
    "Percent Complete",
    "Completion Status",
    "Quality Issues",
    "Last Updated"
  ],

  BATCHES: [
    "Batch ID",
    "Date Created",
    "Source",
    "Notes",
    "Status"
  ],

  AUDIT: [
    "Date",
    "Action",
    "Details"
  ],

  COMPLETED: [
    "Brand",
    "Year",
    "Set",
    "Date Completed",
    "Date Sold",
    "Sale Price",
    "Notes"
  ],

  SOURCES: [
    "Source ID",
    "Title",
    "Date Acquired",
    "Cost",
    "Location",
    "Story",
    "Status",
    "Total Cards",
    "Total Value",
    "Date Created",
    "Date Completed"
  ]
};
