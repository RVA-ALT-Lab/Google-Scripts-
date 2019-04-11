function myFunction() {


  var label = GmailApp.getUserLabelByName('wordpress');
  var threads = label.getThreads();

  threads.forEach(function(thread){
    var messages = thread.getMessages();

    messages.forEach(function(message){

      var subject = message.getSubject();
      var body = message.getPlainBody();

      var payload = {
        "documents": [
          {
            "language": "en",
            "id": "1",
            "text": body
          }
        ]
      };

      var params = {
        "method": "post",
        "payload": JSON.stringify(payload),
        "headers": {
          "Ocp-Apim-Subscription-Key": "Your Subscription Key",
          "Content-Type": "application/json",
          "Accept": "application/json"
        }

      }
      var phrases = UrlFetchApp.fetch('https://westus.api.cognitive.microsoft.com/text/analytics/v2.0/keyPhrases', params);
      var sentiment = UrlFetchApp.fetch('https://westus.api.cognitive.microsoft.com/text/analytics/v2.0/sentiment', params);

      var sentimentScore = JSON.parse(sentiment).documents[0].score;
      var keyPhrases = JSON.parse(phrases).documents[0].keyPhrases;

      var phraseString = keyPhrases.join(", ");
      Logger.log(keyPhrases);

      var contents = [subject, body, sentimentScore, phraseString ];
      SpreadsheetApp.getActiveSpreadsheet().getActiveSheet().appendRow(contents)



    })

  });
}
