//access to  1KoDAPooOCtbr0p6qO-kmo1orBUWCXkhr as viewer
//target applicant folder id 1DOQ1xila6KmX6MsgIaIEQSfXYNapiW1u
//make folder named Last Name, First Name_Fulbright Folder
//copy of 1B6kwEVqKUYosBNnCJeFYSF0WA3u7Juk5LWbP0FVMOjY
//copy of 1NqOqfEmNTLKbkl9yOpdaVuVuLXfMQPzbg7O62kRiTqo named Last Name, First Name_Fulbright Drafts


function onFormSubmission(){
   var sheet = SpreadsheetApp.getActiveSheet();
   var rows = sheet.getDataRange();
   var lastRow = rows.getLastRow();  
   var firstName = sheet.getRange(lastRow,2).getValue();
   var lastName = sheet.getRange(lastRow,3).getValue();
   var email = sheet.getRange(lastRow,6).getValue();
   var atSymbol = email.search('@');
   var cleanEmail = email.substring(0,atSymbol);
  
   addStudentToResourceFolder(cleanEmail);
   makeStudentFolder(cleanEmail, lastName, firstName, sheet, lastRow);
}



function addStudentToResourceFolder(emailClean){
  var id = '1KoDAPooOCtbr0p6qO-kmo1orBUWCXkhr';//id of resource folder
  var folder = DriveApp.getFolderById(id);
  folder.addViewers([emailClean + '@vcu.edu', emailClean + '@mymail.vcu.edu']);//add student email versions as viewer
}

function makeStudentFolder(emailClean, lastName, firstName, sheet, lastRow){
  var holderId = '1DOQ1xila6KmX6MsgIaIEQSfXYNapiW1u';//Applicant Folders - top level folder
  var draftId = createFolderBasic(holderId, lastName+ ', ' + firstName +'_Fullbright Folder');//create folder
  var draftFolder = DriveApp.getFolderById(draftId);//get folder
  var directions = DriveApp.getFileById('1B6kwEVqKUYosBNnCJeFYSF0WA3u7Juk5LWbP0FVMOjY');//copy 
  directions.makeCopy('Fulbright Essay Prompts and Instructions', draftFolder)
  
  draftFolder.setOwner('mrsisson@vcu.edu');
  draftFolder.addEditors([emailClean + '@vcu.edu', emailClean + '@mymail.vcu.edu']);//add student as editor
  var draftDoc = DriveApp.getFileById('1B6kwEVqKUYosBNnCJeFYSF0WA3u7Juk5LWbP0FVMOjY');//copy 
  draftDoc.makeCopy(lastName +', '+ firstName +'_Fulbright Drafts', draftFolder);  
}


function createFolderBasic(folderID, folderName) {
  var folder = DriveApp.getFolderById(folderID);
  var newFolder = folder.createFolder(folderName);
  return newFolder.getId();
};