function GetSources() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("Sources");
  
  if (!sheet) {
    return [];
  }
  
  var data = sheet.getDataRange().getValues();
  if (data.length < 2) {
    return [];
  }
  
  var headers = data[0];
  var results = [];
  
  for (var i = 1; i < data.length; i++) {
    results.push({
      id: data[i][headers.indexOf("Source ID")],
      title: data[i][headers.indexOf("Title")],
      dateAcquired: data[i][headers.indexOf("Date Acquired")],
      cost: data[i][headers.indexOf("Cost")],
      location: data[i][headers.indexOf("Location")],
      story: data[i][headers.indexOf("Story")],
      status: data[i][headers.indexOf("Status")],
      totalCards: data[i][headers.indexOf("Total Cards")] || 0,
      totalValue: data[i][headers.indexOf("Total Value")] || 0,
      dateCreated: data[i][headers.indexOf("Date Created")],
      dateCompleted: data[i][headers.indexOf("Date Completed")]
    });
  }
  
  return results;
}

function GetActiveSources() {
  var sources = GetSources();
  if (!sources || !Array.isArray(sources)) {
    return [];
  }
  var active = [];
  for (var i = 0; i < sources.length; i++) {
    if (sources[i].status === "Active") {
      active.push(sources[i]);
    }
  }
  return active;
}

function GetActiveSourcesSimple() {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName("Sources");
    if (!sheet) {
      return [];
    }
    var data = sheet.getDataRange().getValues();
    if (data.length < 2) {
      return [];
    }
    var results = [];
    for (var i = 1; i < data.length; i++) {
      if (data[i][6] === "Active") {
        results.push({
          id: data[i][0],
          title: data[i][1],
          dateAcquired: data[i][2]
        });
      }
    }
    return results;
  } catch (e) {
    return [];
  }
}

function CreateSource(title, dateAcquired, cost, location, story) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("Sources");
  
  if (!sheet) {
    sheet = ss.insertSheet("Sources");
    sheet.appendRow(["Source ID", "Title", "Date Acquired", "Cost", "Location", "Story", "Status", "Total Cards", "Total Value", "Date Created", "Date Completed"]);
    sheet.getRange(1, 1, 1, 11).setFontWeight("bold");
  }
  
  var id = "SRC-" + Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "yyyyMMdd-HHmmss");
  sheet.appendRow([id, title, dateAcquired || new Date(), cost || 0, location || "", story || "", "Active", 0, 0, new Date(), ""]);
  return id;
}

function CreateSourceFromDialog(data) {
  try {
    var id = CreateSource(data.title, data.dateAcquired, data.cost, data.location, data.story);
    return { success: true, id: id };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

function ShowActiveSources() {
  var sources = GetActiveSources();
  if (sources.length === 0) {
    SpreadsheetApp.getUi().alert("No active sources.\n\nCreate a new source via:\nBCD6000 → Sources → New Source");
    return;
  }
  var message = "";
  for (var i = 0; i < sources.length; i++) {
    message += (i + 1) + ". " + sources[i].title + " (" + sources[i].dateAcquired + ")\n";
  }
  SpreadsheetApp.getUi().alert("Active Sources:\n\n" + message + "\n\nUse these in Quick Intake to track your cards.");
}
function GetActiveSourcesForDialog() {
  try {
    var sources = GetActiveSources();
    Logger.log("GetActiveSourcesForDialog: " + JSON.stringify(sources));
    return sources;
  } catch (error) {
    Logger.log("Error in GetActiveSourcesForDialog: " + error.message);
    return [];
  }
}

function GetSourcesJSON() {
  try {
    var sources = GetActiveSources();
    return JSON.stringify(sources);
  } catch (e) {
    return "[]";
  }
}

function GetSourceTitle(sourceId) {
  var sources = GetSources();
  for (var i = 0; i < sources.length; i++) {
    if (sources[i].id === sourceId) {
      return sources[i].title;
    }
  }
  return "Unknown Source";
}

function UpdateSourceStats(sourceId) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var inventory = ss.getSheetByName("Inventory");
    var sources = ss.getSheetByName("Sources");
    
    if (!inventory || !sources) return;
    
    var invData = inventory.getDataRange().getValues();
    var headers = invData[0];
    var sourceCol = headers.indexOf("Source");
    
    var count = 0;
    for (var i = 1; i < invData.length; i++) {
      if (invData[i][sourceCol] === sourceId) {
        count++;
      }
    }
    
    var srcData = sources.getDataRange().getValues();
    var srcHeaders = srcData[0];
    
    for (var i = 1; i < srcData.length; i++) {
      if (srcData[i][0] === sourceId) {
        sources.getRange(i + 1, srcHeaders.indexOf("Total Cards") + 1).setValue(count);
        break;
      }
    }
  } catch (e) {
    Logger.log("UpdateSourceStats error: " + e.message);
  }
}
