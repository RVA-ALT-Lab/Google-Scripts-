function onOpen() {
  var ui = SpreadsheetApp.getUi();
  // Or DocumentApp or FormApp.
  ui.createMenu('📈 Refresh YouTube Data')
      .addItem('Get New Data', 'youTubeDataFetcher')
      .addToUi();
}


function youTubeDataFetcher(){
  var apiKey = '************';// replace this with your API client ID but leave in quotes
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sourceSheet = ss.getSheetByName('Sheet1');
  var destinationSheet = ss.getSheetByName('vape life')
  var vidURLs = sourceSheet.getRange("A2:A"+sourceSheet.getLastRow()).getValues();
  destinationSheet.getRange("A2:G30").clearContent();
  vidURLs.forEach(function(video){
    var videoLink = video[0];
    var videoId = videoLink.split("=")[1];
    if (videoId){
      //WHERE YT data things happen
      
      var url = 'https://www.googleapis.com/youtube/v3/videos?id=' + videoId + '&key=' + apiKey + '&part=snippet,statistics'; 
      var response = UrlFetchApp.fetch(url); // get feed
      var json = response.getContentText(); //
      var data = JSON.parse(json);
      var stats = [];
    

      try {
        stats.push(videoLink);
      } catch (err){
        stats.push('failed attempt');
      }      try {
        stats.push(data.items[0].snippet.title);
      } catch (err){
        stats.push('failed attempt');
      }
     try{
        stats.push(data.items[0].statistics.viewCount);
      } catch (err){
        stats.push('failed attempt');
      }
      try {
        stats.push(data.items[0].statistics.likeCount);
      } catch (err){
        stats.push('failed attempt');
      }
      try{
        stats.push(data.items[0].statistics.dislikeCount);
      } catch (err){
        stats.push('failed attempt');
      }
      try{
          stats.push(data.items[0].snippet.channelTitle);
      } catch (err){
        stats.push('failed attempt');
      }
      try{
        stats.push(data.items[0].statistics.commentCount);
      }catch (err){
        stats.push('failed attempt');
      }
      destinationSheet.appendRow(stats);
    }
  })

}


 
//  try {
  //adddlert("Welcome guest!");
//}
//catch(err) {
  //document.getElementById("demo").innerHTML = err.message;
//}