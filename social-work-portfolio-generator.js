function myFunction() {
  const Spreadsheet = SpreadsheetApp.getActiveSheet();
  const values = Spreadsheet.getDataRange().getValues();
  const masterFolder = DriveApp.getFolderById('master folder id here');
  const templateFolder = DriveApp.getFolderById('template folder id here');


  var incompleteCopyFound = false;
  // start at second row to skip headers
  var valueIndex = 2;

  while(!incompleteCopyFound){
    try {
    if(values[valueIndex - 1][4] == 'COMPLETED') {
      valueIndex++;
    } else {
      //do the copying stuff here
      //stop the while loop
      var studentFolder = createStudentFolder(valueIndex, masterFolder, templateFolder);

      //Update these two lines to address two email issue
      var studentEmail = values[valueIndex - 1][3].split('@')[0];
      var emailVariants = [studentEmail + '@vcu.edu', studentEmail + '@mymail.vcu.edu']
      DriveApp.getFolderById(studentFolder.id).addEditors(emailVariants);

      Spreadsheet.getRange(valueIndex, 5).setValue('COMPLETED')
      Spreadsheet.getRange(valueIndex, 6).setValue(studentFolder.url)
      Spreadsheet.getRange(valueIndex, 7).setValue(studentFolder.name)
      //share with the student
      incompleteCopyFound = true
    }
    }
    catch (exc) {
     //If we get an exception, we've either run out of rows or
     // something has gone wrong; either way break
     break;
    }
  }


}


function createStudentFolder (valueIndex, masterFolder, templateFolder) {
  const studentFolder = DriveApp.createFolder('BSW Portfolio Project ' + valueIndex)
  masterFolder.addFolder(studentFolder)
  copyTemplateContentsToStudentFolder(studentFolder, templateFolder )
  return {id: studentFolder.getId(), url: studentFolder.getUrl(), name: studentFolder.getName()}
}


function copyTemplateContentsToStudentFolder (studentFolder, templateFolder) {
  //Copy PDF of directions
  var templateFolderFiles = templateFolder.getFiles();
  while(templateFolderFiles.hasNext()) {
    var templateFolderFile = templateFolderFiles.next();
    templateFolderFile.makeCopy(templateFolderFile.getName(), studentFolder);
  }

  var competencyFolders = templateFolder.getFolders();
  while (competencyFolders.hasNext()){

    //Create Competency Level Folder
    var competencyFolder = competencyFolders.next();
    var newCompetencyFolder = DriveApp.createFolder(competencyFolder.getName())
    studentFolder.addFolder(newCompetencyFolder)

    //Descend and create assignment folders
    var assignmentFolders = competencyFolder.getFolders();
    while (assignmentFolders.hasNext()) {
      var assignmentFolder = assignmentFolders.next();
      var newAssignmentFolder = DriveApp.createFolder(assignmentFolder.getName());
      newCompetencyFolder.addFolder(newAssignmentFolder);

      //descend again and create assignment files
      var assignmentFiles = assignmentFolder.getFiles()
      while (assignmentFiles.hasNext()) {
        var assignmentFile = assignmentFiles.next();
        assignmentFile.makeCopy(assignmentFile.getName(), newAssignmentFolder)
      }

    }


  }

}