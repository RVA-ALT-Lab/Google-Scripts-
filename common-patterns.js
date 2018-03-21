//with published as HTML spreadsheets the following URL pattern will give you JSON
var docId = '1xkfPWIYFdZpE9v9JMlmWSObxIHIjOKQdjB7qb4Nrdps';
var url = 'https://spreadsheets.google.com/feeds/list/' + docId + '/1/public/values?alt=json';

//Google Scripts numbers formatting https://developers.google.com/sheets/api/guides/formats
//if you want to add/subtract time
var setFormat = mathPage.getRange('E' + lastRowMath + ':F' + lastRowMath).setNumberFormat('hh:mm:ss');

//set a range back to plain text
function plainText (){
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('Form Responses 1');
  var lastRow = sheet.getLastRow();
  var range = sheet.getRange('f'+ lastRow +':g'+lastRow);
  range.setNumberFormat('@STRING@'); // found this format https://stackoverflow.com/questions/13758913/format-a-google-sheets-cell-in-plaintext-via-apps-script  
}


//make referencing ranges on other worksheets work again (unless I'm missing something)

//=sheetRange("theworksheetname", "A3", "G55")

function sheetRange(targetName, colStart, colEnd) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var asName = ss.getActiveSheet().getSheetName();
  var tgSheet = ss.getSheetByName(targetName);
  var range = tgSheet.getRange(colStart + ':' + colEnd);
  var output;

  if(targetName == asName) {
    output = "Error: target sheet is active sheet !!";
  } else {
        output = range.getValues();
  }
  return output;
}