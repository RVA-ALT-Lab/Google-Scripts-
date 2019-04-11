function myFunction() {
  var calendar = CalendarApp.getCalendarById('calendar id');
  var spreadsheet = SpreadsheetApp.getActiveSheet();

  var events = calendar.getEventsForDay(new Date());
  events.forEach(function(event){
    var date = new Date();
    var title = event.getTitle();
    var includeOwner = true;
    var creator = event.getCreators()[0];
    var guests = event.getGuestList().map(function(eventGuest){return eventGuest.getEmail();});
    guests.push(creator);
    var staff = guests.join(',');
    var description = event.getDescription();
    var startTime = event.getStartTime();
    var endTime = event.getEndTime();
    var totalTime = ((((new Date(endTime).getTime() - new Date(startTime).getTime()) / 1000)) / 60) * guests.length;
    var eventToAdd = [date, title, staff, description, startTime, endTime, totalTime]
    spreadsheet.appendRow(eventToAdd);
    Logger.log(eventToAdd);
  })
}
