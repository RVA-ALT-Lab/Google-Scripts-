//with published as HTML spreadsheets the following URL pattern will give you JSON
var docId = '1xkfPWIYFdZpE9v9JMlmWSObxIHIjOKQdjB7qb4Nrdps';
var url = 'https://spreadsheets.google.com/feeds/list/' + docId + '/1/public/values?alt=json';

//Google Scripts numbers formatting https://developers.google.com/sheets/api/guides/formats
//if you want to add/subtract time
var setFormat = mathPage.getRange('E' + lastRowMath + ':F' + lastRowMath).setNumberFormat('hh:mm:ss');

//set a range back to plain text
function plainText (){
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('Form Responses 1');
  var lastRow = sheet.getLastRow();
  var range = sheet.getRange('f'+ lastRow +':g'+lastRow);
  range.setNumberFormat('@STRING@'); // found this format https://stackoverflow.com/questions/13758913/format-a-google-sheets-cell-in-plaintext-via-apps-script  
}


//make referencing ranges on other worksheets work again (unless I'm missing something)

//=sheetRange("theworksheetname", "A3", "G55")

function sheetRange(targetName, colStart, colEnd) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var asName = ss.getActiveSheet().getSheetName();
  var tgSheet = ss.getSheetByName(targetName);
  var range = tgSheet.getRange(colStart + ':' + colEnd);
  var output;

  if(targetName == asName) {
    output = "Error: target sheet is active sheet !!";
  } else {
        output = range.getValues();
  }
  return output;
}


//YOUTUBE DATA GATHERING ***********************************************************
function getVideos (){
 var ss = SpreadsheetApp.getActiveSpreadsheet();
 var sheet = ss.getSheetByName('videos'); //ASSUMES LIST OF VIDEO URLS ON A SHEET NAMED VIDEOS
 var last = sheet.getLastRow();
 var videos = sheet.getRange("A1:A"+last).getValues();
  for (var i = 0; i < videos.length; i++){
    var vidId = getVideoId(videos[i][0]);
    getYTdata(vidId);
  } 
  
}

function getYTdata(vidId) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("data"); //ASSUMES WRITING DATA TO A SHEET NAMED DATA
  var apiKey = '****************************YOUR API KEY HERE*********************************'; //ASSUMES YOU HAVE AN API KEY TO USE
  var url = 'https://www.googleapis.com/youtube/v3/videos?id=' + vidId + '&key=' + apiKey + '&part=snippet,contentDetails,statistics,status'; 
  
  var currentTime = new Date();
  
  var response = UrlFetchApp.fetch(url); // get feed
  var json = response.getContentText(); //
  var data = JSON.parse(json);
  var stats = [];
  
    stats.push(currentTime);
    stats.push(data.items[0].snippet.title);
    stats.push(data.items[0].statistics.viewCount);
    stats.push(data.items[0].statistics.likeCount);
    stats.push(data.items[0].statistics.dislikeCount);
    stats.push(data.items[0].statistics.commentCount);
    stats.push(data.items[0].snippet.publishedAt);
    stats.push(data.items[0].snippet.thumbnails.high.url);
    stats.push('https://www.youtube.com/watch?v=' + vidId);
  sheet.appendRow(stats);
  
}

function getVideoId(url){
 var start = url.indexOf("?v=")+3;
 var end = findEnd(url);
  var id = url.substring(start,end);
  return id;
  
}

function findEnd(url){
   var end = url.indexOf("&"); 
   if (end > 0) {
    return end;
   } else {
     return url.length;
   }
}
  