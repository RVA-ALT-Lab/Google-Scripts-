//runs on trigger form submit
function newSubmission(){
  let email = newEntryEmail();
  checkExistingTab(email);//make the internal tab sheets w sub function to make separate view sheet for student
}

//add week count runs on trigger of form submit
function setWeekCount(){
   const sheet = SpreadsheetApp.getActiveSheet();
   const rows = sheet.getDataRange();
   const lastRow = rows.getLastRow();
   const weekCell = sheet.getRange('N'+ lastRow);
   weekCell.setFormula("=ISOWEEKNUM(A"+ lastRow+")");
}


//make sure it stays sorted by week even if things are entered late which was easier than doing a sort on the import at the student sheet level
function sortByWeek(){
   const sheet = SpreadsheetApp.getActiveSheet();
   const range = sheet.getRange("A2:N");
   range.sort(14);
}

//get email
function newEntryEmail(){
   const sheet = SpreadsheetApp.getActiveSheet();
   const rows = sheet.getDataRange();
   const lastRow = rows.getLastRow();
   return sheet.getRange("B"+lastRow).getValue();
}

//check for individual tab for student email
function checkExistingTab(email){
  const workbook = SpreadsheetApp.getActiveSpreadsheet();
  if(workbook.getSheetByName(email)){
    Logger.log('hooray, you exist')
  } else {
    let totalSheets = workbook.getSheets();
    Logger.log(totalSheets.length)
    let newSheet = workbook.insertSheet(totalSheets.length);
    newSheet.setName(email);
    let cell = newSheet.getRange('A1');
    cell.setFormula("=QUERY('Form Responses 1'!A:N, \"Select * WHERE (B ='"+email+"')\")");
    //makeNewSoloSheet(email);//make the single sheet for student view and share it
     cloneStudentSheet(email);
  }
}

//clone student sheet from template . . . keep in mind you have to manually approve data integration (importrange) with main sheet
function cloneStudentSheet(email){
    const studentTemplate = DriveApp.getFileById('1XDW5KkaIKDCbAhJL6b-MOhai7SNuCqKEUA3l0MT9Fbg');
    const destFolder = DriveApp.getFolderById('1HhSnE0JOPPIwV-QBwAFths5oQRZLXgxN'); 
    const summarySheet = 'https://docs.google.com/spreadsheets/d/1faVkK_dor-0GytL3GMSrbEdw3qcEBR-dIioCQwZNZ1U';
    const newStudentSheet = studentTemplate.makeCopy(email+' reflective practice log', destFolder).getId(); 
    Logger.log(newStudentSheet);
    SpreadsheetApp.openById(newStudentSheet).getRange('A1').setFormula('=IMPORTRANGE("'+summarySheet+'","'+email+'!A:N")');
    addImportrangePermission(newStudentSheet);
}

//from https://stackoverflow.com/a/68498535
function addImportrangePermission(newStudentSheet) {
  // id of the spreadsheet to add permission to import

  // donor or source spreadsheet id, you should get it somewhere
  const donorId = SpreadsheetApp.getActiveSpreadsheet().getId();

  // adding permission by fetching this url
  const url = `https://docs.google.com/spreadsheets/d/${newStudentSheet}/externaldata/addimportrangepermissions?donorDocId=${donorId}`;

  const token = ScriptApp.getOAuthToken();

  const params = {
    method: 'post',
    headers: {
      Authorization: 'Bearer ' + token,
    },
    muteHttpExceptions: true
  };
  
  UrlFetchApp.fetch(url, params);
}


function tester(){
  cloneStudentSheet('bionicteaching@gmail.com')
}

/*
**OLD ABANDONED STUFF
**
**
*/
//make new sheet to share with student
// function makeNewSoloSheet(email){
//   const newSheet = SpreadsheetApp.create(email + ' log');
//   newSheet.addViewer(email);
//   const summarySheet = 'https://docs.google.com/spreadsheets/d/1faVkK_dor-0GytL3GMSrbEdw3qcEBR-dIioCQwZNZ1U';
//   newSheet.getRange('A1').setFormula('=IMPORTRANGE('+summarySheet+',"'+email+'!A:N")');
//   const newSheetId = newSheet.getId();
//   const theSheet = DriveApp.getFileById(newSheetId);
//   theSheet.moveTo(DriveApp.getFolderById('1HhSnE0JOPPIwV-QBwAFths5oQRZLXgxN'))
// }

//Opting to copy template and replace data because making charts this ways seems harder
// function chartMaker(range, sheet) {
//   var sheet = SpreadsheetApp.getActiveSheet();
//   var chartBuilder = sheet.newChart();
//   chartBuilder.addRange(range)
//       .setChartType(Charts.ChartType.COLUMN)
//       .setOption('title', 'My Line Chart!');
//   sheet.insertChart(chartBuilder.build());
// }


