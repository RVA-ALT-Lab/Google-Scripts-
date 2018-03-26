function myFunction() {
  
  
  var threads = GmailApp.search('is:sent'); 
  
  threads.forEach(function(thread){ 
    var messages = thread.getMessages(); 
    
    messages.forEach(function(message){
      
      var subject = message.getSubject();
      var body = message.getPlainBody(); 
      
      var contents = [subject, body]; 
      SpreadsheetApp.getActiveSpreadsheet().getActiveSheet().appendRow(contents)
      Logger.log(contents); 
      
    }) 
    
  }); 
}

