// ============================================================
// SCARF PROGRAMME STAFF EVALUATION SURVEY
// Google Apps Script — receives POST requests and writes
// each submission as a new row in a Google Sheet.
//
// SETUP INSTRUCTIONS (takes ~5 minutes):
//
// 1. Go to https://sheets.google.com and create a new spreadsheet
//    titled: "SCARF Survey Results 2026"
//
// 2. Go to Extensions > Apps Script
//
// 3. Delete any code in the editor and paste this entire file
//
// 4. Click Save (floppy disk icon)
//
// 5. Click Deploy > New deployment
//    - Type: Web app
//    - Execute as: Me
//    - Who has access: Anyone
//    Click Deploy and authorise when prompted.
//
// 6. Copy the Web app URL shown after deployment.
//    It will look like:
//    https://script.google.com/macros/s/XXXXXXXX/exec
//
// 7. In index.html, replace the placeholder:
//    const GOOGLE_SCRIPT_URL = 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE';
//    with your actual URL.
//
// 8. Commit and push index.html to GitHub. Done.
//
// Results appear in your Google Sheet in real time.
// ============================================================

const SHEET_NAME = 'Responses';

const COLUMNS = [
  'Timestamp',
  'Q1 — SCARF familiarity (1–5)',
  'Q2 — Unprompted acronym recall',
  'Q3 — How first learned',
  'Q3 — Other (specify)',
  'Q4 — Accessed training materials',
  'Q4a — Usefulness of materials (1–5)',
  'Q5 — Change to day-to-day work (1–5)',
  'Q6 — Safe (manager demonstration 1–5)',
  'Q6 — Compassionate (manager demonstration 1–5)',
  'Q6 — Accountable (manager demonstration 1–5)',
  'Q6 — Reflective (manager demonstration 1–5)',
  'Q6 — Fair (manager demonstration 1–5)',
  'Q7 — Culture change in team',
  'Q8 — Psychological safety',
  'Q9 — Patient and carer impact',
  'Q10 — SCARF applied in complaint handling',
  'Q11 — Aware of £600k spend',
  'Q12 — Value for money rating',
  'Q13 — Leadership embodies SCARF values',
  'Q14 — Overall programme effectiveness (1–5)',
  'Q15 — Open comments',
  'Q16 — Staff group',
  'Q17 — Length of service',
  'Q18 — CNWL division',
  'Q19 — Manages other staff'
];

function doPost(e) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(SHEET_NAME);

    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
      sheet.appendRow(COLUMNS);
      sheet.getRange(1, 1, 1, COLUMNS.length)
        .setBackground('#005EB8')
        .setFontColor('#ffffff')
        .setFontWeight('bold');
      sheet.setFrozenRows(1);
    }

    let data;
    try {
      data = JSON.parse(e.postData.contents);
    } catch (parseErr) {
      data = {};
    }

    const scarfValues = ['Safe','Compassionate','Accountable','Reflective','Fair'];

    const row = [
      data.timestamp || new Date().toISOString(),
      data.q1 || '',
      data.q2 || '',
      data.q3 || '',
      data.q3_other || '',
      data.q4 || '',
      data.q4a || '',
      data.q5 || '',
      data['q6_Safe'] || '',
      data['q6_Compassionate'] || '',
      data['q6_Accountable'] || '',
      data['q6_Reflective'] || '',
      data['q6_Fair'] || '',
      data.q7 || '',
      data.q8 || '',
      data.q9 || '',
      data.q10 || '',
      data.q11 || '',
      data.q12 || '',
      data.q13 || '',
      data.q14 || '',
      data.q15 || '',
      data.q16 || '',
      data.q17 || '',
      data.q18 || '',
      data.q19 || ''
    ];

    sheet.appendRow(row);

    const lastRow = sheet.getLastRow();
    if (lastRow % 2 === 0) {
      sheet.getRange(lastRow, 1, 1, COLUMNS.length)
        .setBackground('#f0f6ff');
    }

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'ok', row: lastRow }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'online', message: 'SCARF Survey endpoint is active.' }))
    .setMimeType(ContentService.MimeType.JSON);
}

// ============================================================
// OPTIONAL: SUMMARY STATISTICS
// Run this function manually from Apps Script to generate
// a summary tab with key findings for reporting.
// ============================================================

function generateSummary() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const dataSheet = ss.getSheetByName(SHEET_NAME);
  if (!dataSheet) {
    SpreadsheetApp.getUi().alert('No response data found.');
    return;
  }

  let summarySheet = ss.getSheetByName('Summary');
  if (summarySheet) ss.deleteSheet(summarySheet);
  summarySheet = ss.insertSheet('Summary');

  const data = dataSheet.getDataRange().getValues();
  const headers = data[0];
  const rows = data.slice(1);
  const n = rows.length;

  summarySheet.getRange(1,1).setValue('SCARF Programme Staff Survey — Summary Statistics');
  summarySheet.getRange(1,1).setFontSize(14).setFontWeight('bold').setFontColor('#005EB8');
  summarySheet.getRange(2,1).setValue(`Total responses: ${n}   |   Generated: ${new Date().toLocaleDateString('en-GB')}`);
  summarySheet.getRange(2,1).setFontColor('#777777');

  let outputRow = 4;

  function colIndex(label) {
    return headers.findIndex(h => h.includes(label));
  }

  function numericSummary(label, colLabel) {
    const idx = colIndex(colLabel);
    if (idx < 0) return;
    const vals = rows.map(r => parseInt(r[idx])).filter(v => !isNaN(v));
    if (vals.length === 0) return;
    const avg = (vals.reduce((a,b) => a+b, 0) / vals.length).toFixed(2);
    summarySheet.getRange(outputRow, 1).setValue(label);
    summarySheet.getRange(outputRow, 2).setValue(`Mean: ${avg} / 5`);
    summarySheet.getRange(outputRow, 3).setValue(`n=${vals.length}`);
    outputRow++;
  }

  function freqSummary(label, colLabel) {
    const idx = colIndex(colLabel);
    if (idx < 0) return;
    const freq = {};
    rows.forEach(r => {
      const v = r[idx];
      if (v) freq[v] = (freq[v] || 0) + 1;
    });
    summarySheet.getRange(outputRow, 1).setValue(label).setFontWeight('bold');
    outputRow++;
    Object.entries(freq).sort((a,b) => b[1]-a[1]).forEach(([k,v]) => {
      const pct = ((v/n)*100).toFixed(1);
      summarySheet.getRange(outputRow, 1).setValue(k);
      summarySheet.getRange(outputRow, 2).setValue(v);
      summarySheet.getRange(outputRow, 3).setValue(`${pct}%`);
      outputRow++;
    });
    outputRow++;
  }

  summarySheet.getRange(outputRow, 1).setValue('KEY METRICS').setFontWeight('bold').setFontColor('#005EB8');
  outputRow++;

  numericSummary('Q1 — SCARF familiarity (mean)', 'Q1');
  numericSummary('Q5 — Impact on day-to-day work (mean)', 'Q5');
  numericSummary('Q14 — Overall programme effectiveness (mean)', 'Q14');

  outputRow++;
  summarySheet.getRange(outputRow, 1).setValue('FREQUENCY BREAKDOWNS').setFontWeight('bold').setFontColor('#005EB8');
  outputRow++;

  freqSummary('Q7 — Culture change in team', 'Q7');
  freqSummary('Q8 — Psychological safety', 'Q8');
  freqSummary('Q11 — Aware of £600k spend', 'Q11');
  freqSummary('Q12 — Value for money', 'Q12');
  freqSummary('Q13 — Leadership embodies SCARF', 'Q13');

  summarySheet.autoResizeColumns(1, 3);
  SpreadsheetApp.getUi().alert('Summary generated successfully.');
}
