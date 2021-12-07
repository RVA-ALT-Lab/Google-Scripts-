//sheets url https://docs.google.com/spreadsheets/d/1r07IrYJu3bDVN2NjVHBvMSVw696pC4Uq8PrVQXga6DU/edit#gid=1295007222

function generalUroEmail() {
  const recipient = 'SOMEONE***************************@middlebury.edu';//uro@middlebury.edu 
  const subject = 'SRPS senior work funding submission'
  const body = betterAllData();
  MailApp.sendEmail({
    to: recipient,
    subject: subject,
    htmlBody: body,
  });
}

function getDataElement(column){
   const sheet = SpreadsheetApp.getActiveSheet();
   const rows = sheet.getDataRange();
   const lastRow = rows.getLastRow();
   const qTitle = sheet.getRange(column+1).getValue();
   const qAnswer = sheet.getRange(column+lastRow).getValue();
   return qTitle + ' -- ' + qAnswer;
}

function betterAllData(){
  const sheet = SpreadsheetApp.getActiveSheet();
  const rows = sheet.getDataRange();
  const lastRow = rows.getLastRow();
  const newEntry = sheet.getRange('G'+lastRow+':AY'+lastRow).getValues();//Set range you want to get data from
  let body = '';
  let titleCount = 7;//account for difference between all rows and range selected so it needs to change based on the difference from the range and the total sheet columns
  for (var row in newEntry) {
    for (var col in newEntry[row]) {
    let question = sheet.getRange(1,titleCount+parseInt([col])).getValue();
    let answer = newEntry[row][col];
    if(answer != ''){
      body = body +`<strong>${question}</strong><br><p>${answer}</p></br>`;
    } else {
      body = body +`<strong>${question}</strong><br><p>Not Submitted</p></br>`;
    }
  }
}
return body;
}

function facultyAdvisorEmail() {
  const sheet = SpreadsheetApp.getActiveSheet();
  const rows = sheet.getDataRange();
  const lastRow = rows.getLastRow();

  const stuFirst = sheet.getRange('J'+lastRow).getValue();
  const stuLast = sheet.getRange('K'+lastRow).getValue();
  const studentName = stuFirst + ' ' +stuLast;
  const recipient = 'SOMEONE***************************@middlebury.edu';//FACULTY EMAIL
  const subject = 'SRPS Funding Application Support Request';

  let body = facultyEmailBody(studentName, '1424', 'Joe Smith');
  Logger.log(body);
  // MailApp.sendEmail({
  //   to: recipient,
  //   replyto: 'uro@middlebury.edu',
  //   subject: subject,
  //   htmlBody: body,
  // });
}

function facultyEmailBody(studentName, cost, advisorName){
  let emailBody = `Dear ${advisorName},<br>
                    <p>A student, ${studentName}, has submitted an SRPS request for senior work funding. Applications will not be reviewed until a faculty support statement is received. Please reply with a statement of support for the research proposal, the budget, and the student's preparedness to undertake the proposed work.<p> 
                   `;

if (cost > 350){
   emailBody = emailBody +`<p>Since this request was above $350, an endorsement (less than 500 words) explaining how the student's academic work has prepared them for this project and the rationale for the higher level of funding is needed.</p>`
}

if (cost < 350){
  emailBody = emailBody +`<p>Since this request was $350 or less, a reply with a statement that you have reviewed and support the request is enough. Please reply to uro@middlebury.edu with your response.</p>`
}

return emailBody;

}