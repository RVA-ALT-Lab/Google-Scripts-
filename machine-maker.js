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
  machineSheet.getRange('A3').setValue('List the files (use the file ID) to copy to the lastname, firstname_topfoldername folder. 👇').setBackground("#efefef")
  
  machineSheet.setColumnWidth(1, 450);
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
  var conentDestinationID = machineSheet.getRange("B1").getValue();//the folder ID where we save the new content
  var viewThisFolderID = machineSheet.getRange("B2").getValue();//the folder ID where we are giving view access 
  Logger.log(conentDestinationID);
  Logger.log(viewThisFolderID);
   
   var formSheet = ss.getSheetByName('Form Responses 1');
   var rows = formSheet.getDataRange();
   var lastRow = rows.getLastRow();  
   var email = formSheet.getRange(lastRow,2).getValue();
   var firstName = formSheet.getRange(lastRow,3).getValue();
   var lastName = formSheet.getRange(lastRow,4).getValue();
 
   var atSymbol = email.search('@');
   var cleanEmail = email.substring(0,atSymbol);
 
   addStudentToResourceFolder(cleanEmail, viewThisFolderID);
   makeStudentFolder(cleanEmail, lastName, firstName, formSheet, lastRow, conentDestinationID);
  

}


//folder id = 1UK658kWUOjdfSAYdqf86u5RmfrLUQ_3F name is test scholarship


function addStudentToResourceFolder(emailClean, id){
  var folder = DriveApp.getFolderById(id);
  folder.addViewers([emailClean + '@vcu.edu', emailClean + '@mymail.vcu.edu']);//add student email versions as viewer
}

function makeStudentFolder(emailClean, lastName, firstName, sheet, lastRow, holderId){
  var draftId = createFolderBasic(holderId, lastName+ ', ' + firstName +'_Fulbright Folder');//create folder
  var draftFolder = DriveApp.getFolderById(draftId);//get folder
  
  draftFolder.setOwner('mrsisson@vcu.edu');
  draftFolder.addEditors([emailClean + '@vcu.edu', emailClean + '@mymail.vcu.edu']);//add student as editor
  var draftDoc = DriveApp.getFileById('1NqOqfEmNTLKbkl9yOpdaVuVuLXfMQPzbg7O62kRiTqo');//copy 
  draftDoc.makeCopy(lastName +', '+ firstName +'_Fulbright Drafts', draftFolder);  
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
   var name = sheet.getRange('C'+lastRow).getValue();
   var formula = '=HYPERLINK("' + url + '","' + name +'")'
   sheet.getRange('D'+lastRow).setFormula(formula);
}