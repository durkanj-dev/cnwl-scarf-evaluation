# SCARF Programme Staff Evaluation Survey

**Central and North West London NHS Foundation Trust — 2026**

An independent, open-source staff survey evaluating the impact and value for money of CNWL's SCARF cultural framework programme.

---

## About this survey

This survey was designed to Ipsos research standards — balanced scales, neutral framing, no leading language — to provide an evidence base for assessing the impact of CNWL's SCARF programme, in which the Trust invested between £624,132 and £844,132 of public money.

The survey comprises 19 questions across five sections:

- **Section A** — Awareness and understanding (including unprompted acronym recall)
- **Section B** — Behavioural impact and cultural change
- **Section C** — Patient and carer impact
- **Section D** — Value for money and governance
- **Section E** — Staff demographics (anonymous)

All responses are anonymous. The survey is hosted openly on GitHub with full version history, providing complete transparency and tamper-proof evidence of the methodology.

---

## Deployment

### Step 1 — Fork or clone this repository

```bash
git clone https://github.com/YOUR_USERNAME/scarf-survey.git
```

### Step 2 — Set up Google Sheets backend

1. Go to [sheets.google.com](https://sheets.google.com) and create a new spreadsheet titled **SCARF Survey Results 2026**
2. Go to **Extensions > Apps Script**
3. Delete any existing code and paste the contents of `google-apps-script.js`
4. Click **Save**, then **Deploy > New deployment**
   - Type: **Web app**
   - Execute as: **Me**
   - Who has access: **Anyone**
5. Click **Deploy** and authorise when prompted
6. Copy the **Web app URL** (format: `https://script.google.com/macros/s/XXXXXXXX/exec`)

### Step 3 — Connect the survey to your Google Sheet

In `index.html`, find this line near the bottom:

```javascript
const GOOGLE_SCRIPT_URL = 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE';
```

Replace `YOUR_GOOGLE_APPS_SCRIPT_URL_HERE` with the URL from Step 2.

### Step 4 — Enable GitHub Pages

1. Go to your repository **Settings > Pages**
2. Source: **Deploy from a branch**
3. Branch: **main**, folder: **/ (root)**
4. Click **Save**

Your survey will be live at:
`https://YOUR_USERNAME.github.io/scarf-survey/`

---

## Generating summary statistics

Once responses are collected, open the Google Apps Script editor and run the `generateSummary()` function. This creates a **Summary** tab in your spreadsheet with:

- Mean scores for all numeric questions
- Frequency breakdowns for all categorical questions
- Percentage distributions suitable for senior management reporting

---

## Key research questions

This survey is designed to answer the following governance questions directly:

1. What proportion of CNWL staff can name all five SCARF values without prompting? (Q2)
2. Has the programme demonstrably changed staff behaviour? (Q5, Q7)
3. Do staff feel psychologically safer since SCARF was introduced? (Q8)
4. Has patient experience improved? (Q9, Q10)
5. Were staff aware of the scale of investment? (Q11)
6. How do staff rate value for money once informed of the cost? (Q12)
7. Do staff believe leadership embodies SCARF values in practice? (Q13)

---

## Version history

All changes to this survey are recorded in this repository's commit history, providing a tamper-proof audit trail of the methodology. This ensures that results cannot be challenged on the basis that questions were altered after data collection began.

---

## Formal proposal

This survey has been formally proposed to CNWL senior management as an instrument for evaluating the SCARF programme. A copy of the proposal letter is held on file.

---

*Designed to Ipsos research standards. Anonymous. Open source. CNWL SCARF Programme Evaluation 2026.*
