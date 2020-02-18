function logFiles() {
  Logger.log('this is running');
}

function getRootFiles() {
  var root = DriveApp.getRootFolder();
  var files = root.getFiles();
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = spreadsheet.getSheets()[0];
  while(files.hasNext()){
    var file = files.next();
    var folders = file.getParents();
    var parents = [];
    while (folders.hasNext()) {
      var folder = folders.next();
      var name = folder.getName();
      var parent = name + ' (' + folder.getId() + ')';
      parents.push(parent);
    }
    var file = [file.getId(),file.getName(), parents.join(', ')]
    Logger.log(file)
    spreadsheet.setActiveSheet(sheet).appendRow(file)

  }
  Logger.log('completed all files');
  return true;
}

function getRootFolders() {
  var root = DriveApp.getRootFolder();
  var folders = root.getFolders();
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Files')
  while (folders.hasNext()) {
      var folder = folders.next();
      var name = folder.getName();
      var parents = [];
      var parentFolders = folder.getParents()
      while (parentFolders.hasNext()) {
        var parentFolder = parentFolders.next();
        var parentFolderName = parentFolder.getName();
        var parent = parentFolderName + ' (' + parentFolder.getId() + ')';
        parents.push(parent);
      }
      var file = [folder.getId(), name, parents.join(', ')]
      spreadsheet.appendRow(file)
    }

  Logger.log('completed all files');
  return true;
}

function removeFileFromRootFolder(fileId) {
  Logger.log(fileId);
  var file = DriveApp.getFileById(fileId);
  var rootFolder = DriveApp.getRootFolder();
  rootFolder.removeFile(file);
}

function removeFolderFromRootFolder(folderId) {
  Logger.log(folderId);
  var folder = DriveApp.getFolderById(folderId)
  var rootFolder = DriveApp.getRootFolder();
  rootFolder.removeFolder(folder);
}

function logCurrentSelection () {
  var currentSelection = SpreadsheetApp.getActiveSpreadsheet().getActiveRange();
  Logger.log(currentSelection.getValues());
}

function processCurrentFileSelection () {
  var currentSelection = SpreadsheetApp.getActiveSpreadsheet().getActiveRange().getValues();
  currentSelection.forEach(function(row){
    removeFileFromRootFolder(row[0])
  })
}

function processCurrentFolderSelection () {
  var currentSelection = SpreadsheetApp.getActiveSpreadsheet().getActiveRange().getValues();
  currentSelection.forEach(function(row){
    removeFolderFromRootFolder(row[0])
  })
}
