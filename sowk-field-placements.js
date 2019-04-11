function setCleanEmail() {
  //getting
  var ss = SpreadsheetApp.getActiveSpreadsheet(); //gets the spreadsheet you attached the script to
  var sheet = ss.getSheetByName('Form Responses 1');
  var lastRow = sheet.getLastRow();
  var fullEmail = sheet.getRange('C'+lastRow).getValue();

  //chopping
  var atSymbol = fullEmail.search("@");
  var cleanEmail = fullEmail.substr(0,atSymbol)

  //setting
  sheet.getRange('D'+lastRow).setValue(cleanEmail);
  Logger.log(cleanEmail);
}

function makeSupervisorFormula(sup){
  var supervisor = "'"+sup+"'";
  var formula = '=QUERY(IMPORTRANGE("https://docs.google.com/spreadsheets/d/GET_YOUR_OWN/","student list!A:K"),"SELECT * WHERE Col1=' + supervisor +'")';
  return formula;
}

function makeSupervisorSheet(sup){
  var ssNew = SpreadsheetApp.create(sup);
  var id = ssNew.getId();
  var sheet = ssNew.getSheets()[0];

  var cell = sheet.getRange("A1");
  var formula = makeSupervisorFormula(sup);
  cell.setFormula(formula);
  var protection = cell.protect().setDescription('Sorry this links elsewhere.');
  protection.addEditor('foo@vcu.edu');
  protection.addEditor('bar@vcu.edu');

  var file = DriveApp.getFileById(id);
  var folder = DriveApp.getFolderById('GET_YOUR_OWN');
  folder.addFile(file);
}

function allSups(){
  var sups = ['foo bar','bar foo', 'etc', 'etc'];

 sups.forEach(function(sup){
  makeSupervisorSheet(sup);
});
}