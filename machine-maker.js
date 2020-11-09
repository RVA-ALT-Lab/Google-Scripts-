//BUILDS MENU
function onOpen() {
  var ui = SpreadsheetApp.getUi();
  // Or DocumentApp or FormApp.
  ui.createMenu('Machine Maker 😃')
      .addItem('Create Maker Sheet', 'makeMachineSheet')      
      .addToUi();
}

//MAKES OUR VARIABLE SHEET
function makeMachineSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var machineSheet = ss.insertSheet('Machine Maker');
  machineSheet.getRange('A1').setValue('What is the ID of the folder that will hold all applications? 👉').setBackground("#efefef")
  machineSheet.getRange('A2').setValue('What is the ID of the folder you want to give view access to? 👉').setBackground("#efefef")
  machineSheet.getRange('A3').setValue('What is the scholarship name? 👉').setBackground("#efefef")
  machineSheet.getRange('A4').setValue('List the files (use the file ID) to copy to the lastname, firstname_topfoldername folder. 👇').setBackground("#efefef")
  
  machineSheet.setColumnWidth(1, 470);
  machineSheet.setColumnWidth(2, 300);
  
//  var rights = SpreadsheetApp.newDataValidation().requireValueInList(['edit','view']);
//  machineSheet.getRange("B3:B20").setDataValidation(rights);

   SpreadsheetApp.getUi() // Or DocumentApp or FormApp.
     .alert('Your machine maker details sheet is now ready.');
}


//ON FORM SUBMISSION THIS STUFF HAPPENS
function FormSubmissionActions(){
  //get data from machine maker sheet
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var machineSheet = ss.getSheetByName('Machine Maker')
  var contentDestinationID = machineSheet.getRange("B1").getValue();//the folder ID where we save the new content
  var viewThisFolderID = machineSheet.getRange("B2").getValue();//the folder ID where we are giving view access 
  var scholarshipName = machineSheet.getRange("B3").getValue();//the scholarship name
  
   var formSheet = ss.getSheetByName('Form Responses 1');
   var rows = formSheet.getDataRange();
   var lastRow = rows.getLastRow();  
   var email = formSheet.getRange(lastRow,2).getValue();
   var firstName = formSheet.getRange(lastRow,3).getValue();
   var lastName = formSheet.getRange(lastRow,4).getValue();
 
   addStudentToResourceFolder(email, viewThisFolderID);
   makeStudentFolder(email, lastName, firstName, formSheet, lastRow, contentDestinationID, scholarshipName);
  

}


function addStudentToResourceFolder(email, id){
  var folder = DriveApp.getFolderById(id);
  if (email.search('vcu.edu')){
    var atSymbol = email.search('@');
    var cleanEmail = email.substring(0,atSymbol);
    folder.addViewers([cleanEmail + '@vcu.edu', cleanEmail + '@mymail.vcu.edu']);//add student email versions as viewer
  }
  else {
    folder.addViewers(email);
  }
}

function makeStudentFolder(email, lastName, firstName, sheet, lastRow, holderId, scholarshipName){
  Logger.log(holderId)
  var draftId = createFolderBasic(holderId, lastName+ ', ' + firstName +'_' + scholarshipName + ' Folder');//create folder
  var draftFolder = DriveApp.getFolderById(draftId);//get folder
  
  draftFolder.setOwner('mrsisson@vcu.edu');
   if (email.search('vcu.edu')){
    var atSymbol = email.search('@');
    var cleanEmail = email.substring(0,atSymbol);
     draftFolder.addEditors([cleanEmail + '@vcu.edu', cleanEmail + '@mymail.vcu.edu']);//add student as editor 
   } else {
          draftFolder.addEditors([email]);//add student as editor 
   }
  copyAllThings(lastName, firstName, draftFolder);
  var url =  DriveApp.getFolderById(draftId).getUrl();
  makeLink(url);
}


function createFolderBasic(folderID, folderName) {
  var folder = DriveApp.getFolderById(folderID);
  var newFolder = folder.createFolder(folderName);
  return newFolder.getId();
};


function makeLink(url){
   var sheet =  SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Form Responses 1');
   var rows = sheet.getDataRange();
   var lastRow = rows.getLastRow();
   var name = sheet.getRange('D'+lastRow).getValue();
   var formula = '=HYPERLINK("' + url + '","' + name +'")'
   sheet.getRange('D'+lastRow).setFormula(formula);
}


function copyAllThings(lastName, firstName, draftFolder){
   var sheet =  SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Machine Maker');
   var rows = sheet.getDataRange();
   var lastRow = rows.getLastRow();
   var range = sheet.getRange('A5:A'+lastRow);
   Logger.log(range.getValues());
   Logger.log(range.getValues().length)
   for (var i = 0; i < range.getValues().length; i++) {
    var fileId = range.getValues()[i]; 
    var draftDoc = DriveApp.getFileById(fileId);//copy 
    var fileName = draftDoc.getName();
    draftDoc.makeCopy(lastName +', '+ firstName +'_'+ fileName  + ' Drafts', draftFolder);
   }

}