function getSourceData(){
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheets = ss.getSheets();
  var sheet = ss.getSheetByName("Form Responses 1");
  var values = sheet.getDataRange().getValues();
  var okToSend = false;
 

  values.forEach(function(value, index) {
    var vetted = value[0];//vetted
    var sent = value[1];//sent
    Logger.log('index count='+index);
    if (vetted == 'x' && sent != 'sent') {
      var studentMessage = value[3];
      var studentName = value[8];
      if(studentName === "ANONYMOUS"){
       studentName = "Anonymous" 
      }
            
      var facultyFirst = value[4];
      var facultyLast = value[5];
      var facultyEmail = value[6];
      
     Logger.log('send ' + studentMessage);
       createDocument(facultyFirst, facultyLast, facultyEmail, studentMessage, studentName)
       sheet.getRange('B'+(index+1)).setValue('sent')
    }
    
  })

}


function createDocument(facultyFirst, facultyLast, facultyEmail, studentMessage, studentName){
  var sourceDocument = DriveApp.getFileById('1oapqTzlJ60NZCpKTmsDlaezM43Yc_-EdUIW4PKSZ5RQ');
  var newDocument = sourceDocument.makeCopy('Thank you ' + facultyFirst + ' ' + facultyLast, DriveApp.getFolderById('1gHwlUSKWhmmQ8CW64QteBZkxmxVdQT4b'));//add destination as second param w folder id
  var newId = newDocument.getId();
  
  var activeDoc = DocumentApp.openById(newId);
  var body = activeDoc.getBody();
  body.replaceText("<<faculty_first>>", facultyFirst);
  body.replaceText("<<faculty_last>>", facultyLast);
  body.replaceText("<<message>>", studentMessage);  
  body.replaceText("<<student_name>>", studentName);
  DocumentApp.openById(newId).addViewer(facultyEmail); 
  
  var emailBody = body;
  Logger.log(emailBody);
  
  var documentLink = DocumentApp.openById(newId).getUrl();
  sendEmail(facultyFirst, facultyLast, facultyEmail, documentLink, newId);
}


function sendEmail(facultyFirst, facultyLast, facultyEmail, documentLink, documentId){
  //var file = DriveApp.getFileById(documentId);
  var emailBody = '<p>Dear '+ facultyFirst + ' ' + facultyFirst+ ',</p><br><p>During this time of uncertainty we find it extremely important to share gratitude whenever we can. Attached, please '
 + '<a href="' + documentLink + '"> find a comment thanking you for your hard work, compassion, and efforts on behalf of our students.</a>.</p><br><p>Sincerely,<br>Kim Case and the CTLE</p>'
  MailApp.sendEmail({
    to: facultyEmail,
    subject: 'Thank a Professor',
    htmlBody: emailBody,
    replyTo: 'ctle@vcu.edu',
  });
  
} 


