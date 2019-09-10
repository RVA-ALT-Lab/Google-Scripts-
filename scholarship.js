function onFormSubmission(){
   var sheet = SpreadsheetApp.getActiveSheet();
   var rows = sheet.getDataRange();
   var lastRow = rows.getLastRow();  
   var email = sheet.getRange(lastRow,5).getValue();
   var lastName = sheet.getRange(lastRow,3).getValue();
   addStudentToResourceFolder(email);
   makeStudentFolder(email, lastName);
}

//add student to particular resource folder
function addStudentToResourceFolder(email){
  var id = '****FOLDER ID******';//base resource folder id - moved to personal bc team fail
  var folder = DriveApp.getFolderById(id);
  folder.addViewer(email);//add student email as viewer
}


//make student folder and make google doc in there for them w editor rights
function makeStudentFolder(email, lastName){
  var holderId = '****FOLDER ID******';//Applicant Folders - top level folder - moved to personal account bc team fails
  var draftId = createFolderBasic(holderId, lastName+'_Essay Drafts');//create folder
  var draftFolder = DriveApp.getFolderById(draftId);//get folder
  draftFolder.addEditor(email);//add student as editor
  var document = DocumentApp.create(lastName +' essay draft'); 
  DriveApp.getFileById(document.getId()).addEditor(email); 
  DriveApp.getFolderById(draftId).addFile( DriveApp.getFileById(document.getId()) );
}


function createFolderBasic(folderID, folderName) {
  var folder = DriveApp.getFolderById(folderID);
  var newFolder = folder.createFolder(folderName);
  return newFolder.getId();
};
