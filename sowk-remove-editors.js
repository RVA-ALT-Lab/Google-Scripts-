function removePermissions() {
  const Spreadsheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Data for Tom');
  const values = Spreadsheet.getDataRange().getValues();
  values.forEach(function(value, index) {
    Logger.log(value)
    Logger.log(index)
    if (index !== 0) {
      if (!value[8]){
        var student_email = value[3].split('@')[0].concat('@mymail.vcu.edu').toLowerCase()
        var folder_id = value[5].split('https://drive.google.com/drive/folders/')[1]
        var editors = DriveApp.getFolderById(folder_id).removeEditor(student_email)
        Spreadsheet.getRange(index + 1, 8).setValue('Access removed for ' + student_email + ' on ' + new Date())
      }
    }
  })
}