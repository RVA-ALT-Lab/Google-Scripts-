function myFunction() {
  
   var ss = SpreadsheetApp.getActiveSpreadsheet();
   var sheets = ss.getSheets();
   var sheet = ss.getSheetByName("data");
  
  
 var today = new Date();
 var dd = today.getDate()-1;
 var mm = today.getMonth()+1; //January is 0 DO NOT FORGET THIS
 var yyyy = today.getFullYear();
  var yesterday = yyyy + '/' + mm + '/' + dd;
  
  var query = "after:" + yesterday  + " label:support";
  
  var threads = GmailApp.search(query);
  Logger.log('threads len ' + threads.length);
  
  Logger.log(query);
  
  for (var i = 0; i < threads.length; i++) {
    var messages = threads[i].getMessages();
    Logger.log(messages);    
    for (var m = 0; m < messages.length; m++) {
       var supportStats = [];
     
      var from = messages[m].getFrom();
      Logger.log(from);
      var to = messages[m].getTo();
      Logger.log(to);
      var time = messages[m].getDate();
      Logger.log(time);
      var subject = messages[m].getSubject();
      Logger.log(subject);
      var mId = messages[m].getId();
      
      var mYear = time.getFullYear();
      var mMonth = time.getMonth()+1;
      var mDay = time.getDate();
      var messageDate = mYear + '/' + mMonth + '/' + mDay;
      Logger.log('msg date ' + messageDate);
      if (messageDate === yesterday) {
      supportStats.push(from);
      supportStats.push(to);
      supportStats.push(time);
      supportStats.push(subject);
      supportStats.push('https://mail.google.com/mail/u/0/#inbox/'+mId);
      SpreadsheetApp.getActiveSheet().appendRow(supportStats);
      }
    }

  }          

}
