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
  var emailBody = '<p>Dear '+ facultyFirst + ' ' + facultyLast+ ',</p><br><p>During this time of great uncertainty, we find it extremely important to share gratitude whenever we can.'+
    'The Center for Teaching and Learning Excellence created the "Thank a Professor" initiative for students, alumni, VCU colleagues, or students\' family members to submit a message of gratitude. A message thanking you is shared with you below (<a href="' + documentLink + '">attached</a>).</p>'
 + '<br>' +
   '<p>In appreciation for all you do for our students,<br></p>' +
    '<p>Kim A. Case, Ph.D.<br><strong>Director of Faculty Success</strong><br><a href="https://provost.vcu.edu/">Office of the Provost</a><br><a href="https://ctle.vcu.edu/">Center for Teaching and Learning Excellence</a><br><a href="https://gsws.vcu.edu/">Professor of Gender, Sexuality, and Women\'s Studies</a><br>Affiliate Professor of Psychology<br>Virginia Commonwealth University</p>';
  MailApp.sendEmail({
    to: facultyEmail,
    subject: 'Thank a Professor',
    htmlBody: emailBody,
    replyTo: 'ctle@vcu.edu',
  });
  
} 


