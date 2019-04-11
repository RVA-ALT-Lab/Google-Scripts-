/* modified from @hubgit and http://stackoverflow.com/questions/30328636/google-apps-script-count-files-in-folder
for this stackexchange question http://webapps.stackexchange.com/questions/86081/insert-image-from-google-drive-into-google-sheets by @twoodwar
*/
function listFilesInFolder(folderName) {
  //writes the headers for the spreadsheet
     var sheet = SpreadsheetApp.getActiveSheet();
     sheet.appendRow(["Name", "Date", "Size", "URL", "Download", "Description", "Image"]);
     var folderId = "YOUR_FOLDER_ID_GOES_HERE";

      var folder = DriveApp.getFolderById(folderId);
      var contents = folder.getFiles();

      var cnt = 0;
      var file;

      while (contents.hasNext()) {
          var file = contents.next();
          cnt++;

          Logger.log(file);
          Logger.log(cnt);
  // writes the various chunks to the spreadsheet- just delete anything you don't want
              data = [
                  file.getName(),
                  file.getDateCreated(),
                  file.getSize(),
                  file.getUrl(),
                  "https://docs.google.com/uc?export=download&confirm=no_antivirus&id=" + file.getId(),
                  file.getDescription(),
                  "=image(\"https://docs.google.com/uc?export=download&id=" + file.getId() +"\")",
              ];

              sheet.appendRow(data);



      };
  };