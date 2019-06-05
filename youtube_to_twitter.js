function getYTdata(userData) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("gangnam");//I chose a page called gangam for this, you can do what you want
  var apiKey = 'YOURAPIKEYFORYOUTUBEGOESHERE';//*****************************************
  var vidId = '9bZkp7q19f0'; //the video ID you want stats on
  var url = 'https://www.googleapis.com/youtube/v3/videos?id=' + vidId + '&key=' + apiKey + '&part=snippet,contentDetails,statistics,status'; 
  
  var currentTime = new Date();
  
  var response = UrlFetchApp.fetch(url); // get feed
  var json = response.getContentText(); //
  var data = JSON.parse(json);
 	
  var totalViews = data.items[0].statistics.viewCount; //get view count
    Logger.log(totalViews); //testing
  
  var totalTime = ((((totalViews*252)/60)/60)/24)/365; //probably the right math to get seconds to years for a video that lasts 252 seconds
  Logger.log(totalTime);
  
  var lastRow = sheet.getLastRow();//gets last row of view data to do some math to get view differences
  var range = sheet.getRange(lastRow,3);
  var oldViews = range.getValue();
  
  var response = UrlFetchApp.fetch(url); // get feed
  var json = response.getContentText(); //
  var data = JSON.parse(json);
  var stats = [];
 	
    stats.push(currentTime);
    stats.push(data.items[0].snippet.title);
    stats.push(data.items[0].statistics.viewCount);
    stats.push(data.items[0].statistics.likeCount);
    stats.push(data.items[0].statistics.dislikeCount);
    stats.push(data.items[0].statistics.favoriteCount);
    stats.push(data.items[0].statistics.commentCount);
    stats.push(data.items[0].contentDetails.duration);
    stats.push(data.items[0].snippet.publishedAt);
    stats.push(data.items[0].snippet.channelTitle);
    stats.push(data.items[0].snippet.thumbnails.high.url);
    stats.push('https://www.youtube.com/watch?v=' + vidId);
    stats.push(data.items[0].statistics.viewCount-oldViews);
    var moreViews = data.items[0].statistics.viewCount-oldViews;
  
	SpreadsheetApp.getActiveSpreadsheet().getSheetByName("gangnam").appendRow(stats);
  
    Logger.log('data * ' + data.items[0].statistics.viewCount);
  
  var twitterMessage = "Gangnam Style has been viewed "+ numberWithCommas(totalViews) + " times. That's " + numberWithCommas(moreViews) + " more views than last week. #endofdays"; //YOUR NICE MESSAGE

  status = twitterMessage ;
  

  //INSTALL TWITTER LIB AS RESOURCE https://script.google.com/macros/library/versions/d/11dB74uW9VLpgvy1Ax3eBZ8J7as0ZrGtx4BPw7RKK-JQXyAJHBx98pY-7 *********************

  var twitterKeys= {
    TWITTER_CONSUMER_KEY: "YOURTWITTERKEY",//REPLACE ALL THESE WITH YOUR THINGS**************************************
    TWITTER_CONSUMER_SECRET: "YOURTWITTERSECRET",
    TWITTER_ACCESS_TOKEN: "TOKEN",
    TWITTER_ACCESS_SECRET: "SECRET"    
  };
  
  var props = PropertiesService.getScriptProperties();
  
  props.setProperties(twitterKeys);
  
  var service = new Twitter.OAuth(props);
  var  twit = new Twitter.OAuth(props);
  
  if ( service.hasAccess() ) {
    var response = twit.sendTweet(status);
    
    if (response) {
      
      Logger.log("Tweet ID " + response.id_str);
      
    } else {
      
      // Tweet could not be sent
      // Go to View -> Logs to see the error message
      
    }
  }

  
}

//from https://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript
function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}