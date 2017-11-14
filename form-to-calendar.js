function makeEvent (title,time,date,description){
 var event = CalendarApp.getCalendarById('yourveryspecialcalendarid@vcu.edu').createEvent(title,
     new Date(date + ' ' + time),
     new Date(date + ' ' + time),
   {location: 'VCU'}); //could be a form field 
  event.setDescription(description)
  event.addEmailReminder((60*24)); //adds a reminder - you can add multiple
}


function getData(){
  makePlain();
  var ss = SpreadsheetApp.getActive().getActiveSheet();
  var lastRow = ss.getLastRow();
  var range = ss.getRange('B'+lastRow + ':E'+lastRow); //adjust depending on your form and number of fields
  var value = range.getValues();
  var title = value[0][0];
  var description = value[0][1]
  var date = value[0][2];
  var time = value[0][3];
  makeEvent(title,time,date,description);
}


//stupid google form makes entries into date format even when set to plain text so this fixes that
function makePlain(){
  var ss = SpreadsheetApp.getActive().getActiveSheet();
  var lastRow = ss.getLastRow();
  var range = ss.getRange('D1:E'+lastRow);//adjust range to reflect your date column
  range.setNumberFormat('@STRING@');
}