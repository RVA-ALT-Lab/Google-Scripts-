function myFunction(e) {
  //e.values is an array of form values
  var timestamp = e.values[0];
  var firstName = e.values[1];
  var lastName = e.values[2];
  var title = e.values[3];

  //file is the template file, and you get it by ID
  var file = DriveApp.getFileById('id of doc template to copy');

  //We can make a copy of the template, name it, and optionally tell it what folder to live in
  //file.makeCopy will return a Google Drive file object
  var copy = file.makeCopy(lastName + ',' + firstName, DriveApp.getFolderById('folder where copy will live'));

  //Once we've got the new file created, we need to open it as a document by using its ID
  var doc = DocumentApp.openById(copy.getId());

  //Since everything we need to change is in the body, we need to get that
  var body = doc.getBody();

  //Then we call all of our replaceText methods
  body.replaceText('{{First Name}}', firstName);
  body.replaceText('{{Last Name}}', lastName);
  body.replaceText('{{Title}}', title);

  //Lastly we save and close the document to persist our changes
  doc.saveAndClose();
}
