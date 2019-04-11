var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();

var USERS_TABLE = spreadsheet.getSheets()[0];
var IDEAS_TABLE = spreadsheet.getSheets()[1];
var VOTES_TABLE = spreadsheet.getSheets()[2];

function registerUser(user){

  var data = getTableData(USERS_TABLE);

  if (!tableContainsUser(data, user)){

    USERS_TABLE.appendRow([user.email, user.name]);

    return {
      success: true,
      message: "User with the email " + user.email + " was added successfully",
      authUser: user
    };

  } else {

    return {
     error: true,
     message: "User with the email " + user.email + " is already registered"
    };
  }
}

function loginUser(user){
var data = USERS_TABLE.getDataRange().getValues();

  if (tableContainsUser(data, user)){
   return {
      success: true,
      message: "User with the email " + user.email + " is already registered",
      authUser: user
    };

  } else {

    return {
     error: true,
     message: "User with the email " + user.email + " has not registered"
    };
  }

}

function getTableData(table){

  return table.getDataRange().getValues();

}

function tableContainsUser(data, user){

  var tableContainsUser = false;

  for( var i = 0; i < data.length; i++){

    if (data[i][0]){

      if(data[i][0].toLowerCase() == user.email.toLowerCase()){

        tableContainsUser = true;
      }

    }

  }


  return tableContainsUser;

}

function addIdea(user, idea){
  var data = getTableData(IDEAS_TABLE);
  if(!tableContainsUser(data, user)){

    IDEAS_TABLE.appendRow([user.email, idea.name, idea.description, idea.image]);

    return {
      success: true,
      message: "Idea with the name '"+ idea.name + "' has been submitted by " + user.email + "." ,
      authUser: user
    };

  } else {

    return {
     error: true,
     message: "User with the email " + user.email + " has already submitted an idea."
    };

  }




}

function getIdeas(){

  var data = getTableData(IDEAS_TABLE);
  var ideas = [];

  for (var i = 0; i < data.length; i++){

    var idea = {
      email: data[i][0],
      name: data[i][1],
      description: data[i][2],
      image: data[i][3],
    }

    idea.voteCount = countVotes(idea);
    ideas.push(idea);
  }

  return {
      success: true,
      message: "Ideas have been rendered.",
      ideas: ideas,
    };
}

function countVotes(idea){
 var voteCount = 0;
 var data = getTableData(VOTES_TABLE);
  for (var i = 0; i < data.length; i++){
    if (data[i][1] == idea.email){
      voteCount++;
    }
  }

  return voteCount;

}

function addVote(user, idea){

  var data = getTableData(VOTES_TABLE);

  if(!tableContainsUser(data, user)){
    VOTES_TABLE.appendRow([user.email, idea.email]);
    return {
      success: true,
      message: "You cast your vote for'"+ idea.name + ".'",
      authUser: user
    };

  } else {

    return {
     error: true,
     message: "User with the email " + user.email + " has already voted for an idea."
    };

  }

}

function doGet(){

return HtmlService.createHtmlOutputFromFile('Index').setSandboxMode(HtmlService.SandboxMode.IFRAME)
.setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);

}
