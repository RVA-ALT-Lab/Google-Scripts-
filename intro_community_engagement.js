/* modified from @hubgit and http://stackoverflow.com/questions/30328636/google-apps-script-count-files-in-folder 
for this stackexchange question http://webapps.stackexchange.com/questions/86081/insert-image-from-google-drive-into-google-sheets by @twoodwar

JSON URL: https://spreadsheets.google.com/feeds/list/1uY_MO4gHvFCSsVCCfX-ARoJNMZWyxk48b13DweaIN5k/1/public/values?alt=json

*/
function execute(){
  var folderId = "0B0_3xNPNPu4gQnU3SzQwcDRlVTg"; 
  var folder = DriveApp.getFolderById(folderId);
  
  var sheet = SpreadsheetApp.getActiveSheet();
  sheet.clear(); 
  sheet.appendRow(["File Name", "Week", "Parent Folder Name", "URL", "Download Link", "Copy Link"]);
  
  loopSubFolders(folder, sheet); 
}

function loopSubFolders(parentFolder, sheet){
  var subFolders = parentFolder.getFolders(); 
  listFilesInFolder(subFolders.next(), sheet); 
  
  while(subFolders.hasNext()){
    listFilesInFolder(subFolders.next(), sheet); 
  }
  
}

function listFilesInFolder(folder, sheet) {
//writes the headers for the spreadsheet
  if (folder.getName() != 'Attachments'){
    var contents = folder.getFiles();  
    var cnt = 0;
    var file;

    while (contents.hasNext()) {
        var file = contents.next();
        cnt++;
// writes the various chunks to the spreadsheet- just delete anything you don't want
      
            data = [
                cleanTitle(file.getName()),
                weekNum(file.getName()),
                folder.getName(),
                file.getUrl(),
                file.getUrl().split('/edit')[0] + '/export?format=docx', 
                file.getUrl().split('/edit')[0] + '/copy'
            ];
      //prevent 0 week stuff from being written
      if (weekNum(file.getName()) != 0){
            sheet.appendRow(data);  
            sheet.sort(2);      
      }

    };
  }
};



//clean up file extensions in titles
function cleanTitle(title){
  if (title.indexOf('.')>0){
  var period = title.indexOf('.');
  var cleanTitle = title.substring(0, period);
  return cleanTitle;
  } else {
    return title;
  }
}


//add week number to spreadsheet
function weekNum(title){
  var reg = new RegExp('[0-9]+');
  if (reg.exec(title) && reg.exec(title) < 20){
    return reg.exec(title)[0];
  } else {
    return '0';
  }
}


//add manual trigger to spreadsheet
function onOpen() {
  var ui = SpreadsheetApp.getUi();
  // Or DocumentApp or FormApp.
  ui.createMenu('MAGIC BUTTON')
      .addItem('Get Docs', 'menuItem1')      
      .addToUi();
}

function menuItem1() {
  SpreadsheetApp.getUi() // Or DocumentApp or FormApp.
     execute();
}


