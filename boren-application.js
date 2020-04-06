//form url https://docs.google.com/forms/d/1OoYvNNa0_Nbbsk-s-cooQDUNFhKy9FMWUi8j6neZ6Zk/edit#responses

function onFormSubmission(){
   var sheet = SpreadsheetApp.getActiveSheet();
   var rows = sheet.getDataRange();
   var lastRow = rows.getLastRow();  
   var email = sheet.getRange(lastRow,2).getValue();
   var atSymbol = email.search('@');
   //Logger.log(email.substring(0,atSymbol))
   //Logger.log(email + '@vcu.edu')
   var vcuSucks = email.substring(0,atSymbol)
   var lastName = sheet.getRange(lastRow,4).getValue();
   Logger.log(lastName);
   addStudentToResourceFolder(vcuSucks);
   makeStudentFolder(vcuSucks, lastName, sheet, lastRow);
}


function addStudentToResourceFolder(emailClean){
  var id = '18f-tuvKgsgpce8_uYOuu-VuyfaMe8GMI';//base resource folder id - moved to personal bc team fail
  var folder = DriveApp.getFolderById(id);
  folder.addViewers([emailClean + '@vcu.edu', emailClean + '@mymail.vcu.edu']);//add student email versions as viewer
}

function makeStudentFolder(emailClean, lastName, sheet, lastRow){
  var holderId = '1eDOerefoNe9-wcKLLtMN5Zq4svPFLZXv';//Applicant Folders - top level folder - moved to personal account bc team fails
  var draftId = createFolderBasic(holderId, lastName+'_Boren Application');//create folder
  var draftFolder = DriveApp.getFolderById(draftId);//get folder
  var directions = DriveApp.getFileById('1B0p6Fsjsm8xoTq3dAkn01trDFs-DwR-eJfg7lIJDirA')
  directions.makeCopy('Instructions: Boren Draft File', draftFolder)
  
  draftFolder.setOwner('mrsisson@vcu.edu');
  draftFolder.addEditors([emailClean + '@vcu.edu', emailClean + '@mymail.vcu.edu']);//add student as editor
  var document = DocumentApp.create(lastName +' essay draft'); 

  //Stem one
  var headingOne = document.getBody().appendParagraph("Essay 1. National Security")
  headingOne.setHeading(DocumentApp.ParagraphHeading.HEADING2)
  var parOne = document.getBody().appendParagraph("Explain the significance of your proposed country, region, and language to U.S. national security. The Boren Awards recognize a broad definition of national security, but you should make a specific, detailed, and focused argument. [800 words]");
  parOne.setBold(true);
  parOne.appendPageBreak();
  
  //Stem Two
  var headingTwo = document.getBody().appendParagraph("Essay 2. Motivation and Public Service Careers")
  headingTwo.setHeading(DocumentApp.ParagraphHeading.HEADING2)
  var parTwo = document.getBody().appendParagraph("Please discuss the following points in one integrated essay, giving equal attention to each point. You can discuss the points in any order. (Scholarship - 800 words; Fellowship - 1000 words)")
  parTwo.setBold(true);
  var item1 = document.getBody().appendListItem("Think about a previous experience that has led to growth or a personal quality. Reflect upon it and describe how it will assist you in preparing to spend significant time overseas studying a critical foreign language and culture [+ for Fellows: and, if applicable, conducting your proposed research].");
  item1.setBold(true);
  item1.setGlyphType(DocumentApp.GlyphType.BULLET)
  var item2 = document.getBody().appendListItem("Explain how the country and language you selected will help you achieve your career goals, including your plans to fulfill the federal service requirement. Be specific. If appropriate, you may also include relevant past academic, extracurricular, volunteer, internship, and professional experiences.");
  item2.setBold(true);
  item2.setGlyphType(DocumentApp.GlyphType.BULLET)
  var item3 = document.getBody().appendListItem("As you will be committing to working for the federal government for at least one year, describe what makes you interested in federal service and what you will bring as a leader in the federal workforce.");
  item3.setBold(true);
  item3.setGlyphType(DocumentApp.GlyphType.BULLET)
  item3.appendPageBreak();
  
  //Stem Three
  var headingThree = document.getBody().appendParagraph("Essay 3. Study Plan Summary")
  headingThree.setHeading(DocumentApp.ParagraphHeading.HEADING2)
  var parThree = document.getBody().appendParagraph("Scholarship: Describe the basic structure of your proposed Boren-funded program, with particular focus on language acquisition. Fellowship: Describe the basic structure of your proposed Boren-funded study, with particular focus on language acquisition. [250 words]")
  parThree.setBold(true);
  parThree.appendPageBreak();
  
  DriveApp.getFileById(document.getId()).addEditors([emailClean + '@vcu.edu', emailClean + '@mymail.vcu.edu']); 
  DriveApp.getFolderById(draftId).addFile(DriveApp.getFileById(document.getId()) );
  DriveApp.getFileById(document.getId()).setOwner('mrsisson@vcu.edu');
  var url =  DriveApp.getFolderById(draftId).getUrl();
  makeLink(url);
}

function createFolderBasic(folderID, folderName) {
  var folder = DriveApp.getFolderById(folderID);
  var newFolder = folder.createFolder(folderName);
  return newFolder.getId();
};

function makeLink(url){
   var sheet = SpreadsheetApp.getActiveSheet();
   var rows = sheet.getDataRange();
   var lastRow = rows.getLastRow();
   var name = sheet.getRange('D'+lastRow).getValue();
   var formula = '=HYPERLINK("' + url + '","' + name +'")'
   sheet.getRange('D'+lastRow).setFormula(formula);
}


