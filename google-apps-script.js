// ============================================================
// SCARF PROGRAMME STAFF EVALUATION SURVEY
// Google Apps Script — receives POST requests and writes
// each submission as a new row in a Google Sheet.
// ============================================================

const SHEET_NAME = 'Responses';

const COLUMNS = [
  'Timestamp', 'Q1 — SCARF familiarity', 'Q2 — Acronym recall', 'Q3 — How learned', 
  'Q3 — Other', 'Q4 — Accessed materials', 'Q4a — Usefulness', 'Q5 — Work change', 
  'Q6 — Safe', 'Q6 — Compassionate', 'Q6 — Accountable', 'Q6 — Reflective', 
  'Q6 — Fair', 'Q7 — Culture change', 'Q8 — Psych safety', 'Q9 — Patient impact', 
  'Q10 — Complaints', 'Q11 — Aware of £600k', 'Q12 — Value for money', 
  'Q13 — Leadership', 'Q14 — Overall effectiveness', 'Q15 — Comments', 
  'Q16 — Staff group', 'Q17 — Service length', 'Q18 — Division', 'Q19 — Manager'
];

function doPost(e) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
    
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(COLUMNS);
      sheet.getRange(1, 1, 1, COLUMNS.length).setBackground('#005EB8').setFontColor('#ffffff').setFontWeight('bold');
    }

    const data = JSON.parse(e.postData.contents);
    const row = [
      data.timestamp, data.q1, data.q2, data.q3, data.q3_other, data.q4, data.q4a, data.q5,
      data.q6_Safe, data.q6_Compassionate, data.q6_Accountable, data.q6_Reflective, data.q6_Fair,
      data.q7, data.q8, data.q9, data.q10, data.q11, data.q12, data.q13, data.q14, data.q15,
      data.q16, data.q17, data.q18, data.q19
    ];

    sheet.appendRow(row);
    return ContentService.createTextOutput(JSON.stringify({status: 'ok'})).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({status: 'error', message: err.toString()})).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService.createTextOutput("SCARF Survey Endpoint Active.");
}