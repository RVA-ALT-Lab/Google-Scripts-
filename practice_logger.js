function newSubmission(){
  let email = newEntryEmail();
  checkExistingTab(email);//make the internal tab sheets w sub function to make separate view sheet for student
}

function newEntryEmail(){
   const sheet = SpreadsheetApp.getActiveSheet();
   const rows = sheet.getDataRange();
   const lastRow = rows.getLastRow();
   return sheet.getRange("B"+lastRow).getValue();
}

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
    cell.setFormula("=QUERY('Form Responses 1'!A:D, \"Select A,C,D WHERE (B ='"+email+"')\")");
    makeNewSoloSheet(email);//make the single sheet for student view and share it
  }
}

function makeNewSoloSheet(email){
  const newSheet = SpreadsheetApp.create(email + ' log');
  newSheet.addViewer(email);
  newSheet.getRange('A1').setFormula('=IMPORTRANGE("https://docs.google.com/spreadsheets/d/1CgnVaFGK__BD0qPDVaoCMkhhD6wBiBBD7NHDaqnCwJw/","'+email+'!A:D")');
  const newSheetId = newSheet.getId();
  const theSheet = DriveApp.getFileById(newSheetId);
  theSheet.moveTo(DriveApp.getFolderById('1HhSnE0JOPPIwV-QBwAFths5oQRZLXgxN'))
}

function tester(){
  //1k23U1EJ5-zFJomRpLLkyrPtUMdf_gcf6rBvIiPNJ4wM
 const theSheet = DriveApp.getFileById('1k23U1EJ5-zFJomRpLLkyrPtUMdf_gcf6rBvIiPNJ4wM');
  theSheet.moveTo(DriveApp.getFolderById('1HhSnE0JOPPIwV-QBwAFths5oQRZLXgxN'))
}

