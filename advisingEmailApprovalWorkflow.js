function sendEmail(e){
var studentName = e.values[2]; 
var advisorName = e.values[1];
var studentEmail = e.values[4];
var class = e.values[8];
                           
var email = 'Hi, ' + studentName + 
           '\nWe have requested an override into ' + class
            + ' on your behalf. We will contact you once a decision has been reached.\n Best,\n ' + 'Advising Staff\nSchool of World Studies Office of Advising\nVirginia Commonwealth University\n817 West Franklin Street, Suite 221\nRichmond, VA 23284-2021'; 

  
  MailApp.sendEmail(studentEmail, 'Your Override Has Been Submitted', email); 
}

function onOpen( ){
// This line calls the SpreadsheetApp and gets its UI   
// Or DocumentApp or FormApp.
  var ui = SpreadsheetApp.getUi();
 
//These lines create the menu items and 
// tie them to functions we will write in Apps Script
  
 ui.createMenu('Approve/Deny Request')
      .addItem('Approve', 'processApproval')
      .addItem('Deny', 'processDenial')
      .addToUi();
}

function approveRequest(data){
  var sheet = SpreadsheetApp.getActiveSheet();
  var studentEmail = data.rowValues[0][4]; 
  var studentName = data.rowValues[0][2];
  var courseName = data.rowValues[0][8];
  
  //set timestamp
  sheet.getRange(data.row, 11).setValue('Approved'); 
  sheet.getRange(data.row, 12).setValue( Utilities.formatDate(new Date(), "EST", "yyyy-MM-dd HH:mm:ss ")); 
  
  var emailBody = 'Hello ' + studentName + '<br> Congratulations! Your override request for ' + courseName + ' has been approved! Please follow the outlined steps to add the course to your class schedule:' +
    '<ul>' +
      '<li>Log in to EServices.</li>' +
      '<li>Click on the "student" tab</li>' +
      '<li>Select Registration</li>' +
      '<li>Click on add/drop class.</li>' +
      '<li>Enter the 5 digit CRN of your requested course.</li>' +
     '</ul>' + 
       '<br>By following the steps outlined above, you should have no trouble registering for the course; but if you have any questions, please do not hesitate to email us.' +
        '<br>Best,<br> ' + 'Advising Staff<br>School of World Studies Office of Advising<br>Virginia Commonwealth University<br>817 West Franklin Street, Suite 221<br>Richmond, VA 23284-2021';

  MailApp.sendEmail(studentEmail, 'APPROVED override request', emailBody, {htmlBody: emailBody}); 
  
}

function denyRequest(data){

  var sheet = SpreadsheetApp.getActiveSheet(); 
  var timestamp = data.rowValues[0][12]; 
  var studentEmail = data.rowValues[0][4]; 
  var studentName = data.rowValues[0][2];
  var courseName = data.rowValues[0][8];
  
  var emailBody = 'Hello ' + studentName + '<br><br>We wish we had better news for you but unfortunately, your override request has been denied.' +
    '<br><br>Best,<br> ' + 'Advising Staff<br>School of World Studies Office of Advising<br>Virginia Commonwealth University<br>817 West Franklin Street, Suite 221<br>Richmond, VA 23284-2021';

  
  //set timestamp
  sheet.getRange(data.row, 11).setValue('Denied'); 
  sheet.getRange(data.row, 12).setValue( Utilities.formatDate(new Date(), "EST", "yyyy-MM-dd HH:mm:ss ")); 
  
  MailApp.sendEmail(studentEmail, 'DENIED override request', emailBody, {htmlBody: emailBody}); 
  
}

function processApproval(){

  var data = getRowValues(); 
  
  var timestamp = data.rowValues[0][11];
  
  if (timestamp) {
    var ui = SpreadsheetApp.getUi();
    var response = ui.alert('It looks like this has already been approved/denied. Are you sure you want to continue?', ui.ButtonSet.YES_NO);

    // Process the user's response.
    if (response == ui.Button.YES) {
      approveRequest(data)
    } else {
      Logger.log('The user clicked "No" or the close button in the dialog\'s title bar.');
    }
  } else {
    approveRequest(data); 
  }

}

function processDenial(){

  var data = getRowValues(); 
  
  var timestamp = data.rowValues[0][11];
  
  if (timestamp) {
    var ui = SpreadsheetApp.getUi();
    var response = ui.alert('It looks like this has already been approved/denied. Are you sure you want to continue?', ui.ButtonSet.YES_NO);

    // Process the user's response.
    if (response == ui.Button.YES) {
      denyRequest(data)
    } else {
      Logger.log('The user clicked "No" or the close button in the dialog\'s title bar.');
    }
  } else {
    denyRequest(data); 
  }

}


function getRowValues(){

  var sheet = SpreadsheetApp.getActiveSheet();
  var range = sheet.getActiveRange(); 
   
  var row = range.getRowIndex();
  var rowValues = sheet.getRange(row , 1, 1, 12).getValues();
  
  return {rowValues: rowValues, row: row}; 

}