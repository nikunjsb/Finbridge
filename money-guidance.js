// Educational prompts only. Answers record document checks, never eligibility.
const escape = value => String(value ?? '').replace(/[&<>"']/g, character => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[character]));
export const moneyReviewDate = '12 November 2026';
export const moneyCheckOptions = [['','Not answered'],['review','Need to check'],['done','Checked'],['na','Not relevant to me']];
export const moneyCheckGroups = [
  {name:'Your pay and records',items:[
    {id:'payslip',name:'Read the deductions on your payslip',detail:'Match the tax and insurance lines to your own payroll statement. Check the employee share separately from employer contributions.',route:'guide/salary',action:'Understand my payslip'},
    {id:'identifiers',name:'Locate your tax and insurance identifiers',detail:'Find your Steuer-ID and social-insurance number in your records. Keep the numbers privately; this check does not ask you to enter them.',route:'guide/salary',action:'Find the important fields'},
    {id:'settings',name:'Check the personal details used by payroll',detail:'Review tax class, health insurer and recorded church-tax status. Ask payroll about discrepancies and which authority can correct them.',route:'taxclasses',action:'Review tax classes'},
    {id:'certificates',name:'Keep your annual payroll certificates',detail:'Save the Lohnsteuerbescheinigung from each employer and compare it with your payslips for the same year.',route:'guide/salary',action:'Review the records to keep'}
  ]},
  {name:'Your tax-return preparation',items:[
    {id:'filing',name:'Check which tax years need attention',detail:'List returns already filed, outstanding notices and any filing obligation. Mandatory and voluntary returns have different deadlines.',route:'guide/arrival-tax',action:'Review filing questions'},
    {id:'partyear',name:'Review the year you arrived or left',detail:'Gather German and foreign income for that calendar year. A part-year stay can change the assessment but does not guarantee a refund.',route:'guide/arrival-tax',action:'Read the arrival-year guide'},
    {id:'expenses',name:'Sort work expenses and reimbursements',detail:'Keep invoices, work-use evidence and employer payments for equipment, professional training and relocation. A deduction is not the same as cash back.',route:'taxguide',action:'Explore possible claims'},
    {id:'workdays',name:'Keep a dated work-location record',detail:'Separate office attendance, home working and business trips. Check overlap rules and employer subsidies before using the tax workspace.',route:'guide/commute',action:'Review work-day records'}
  ]},
  {name:'Your Germany–India paperwork',items:[
    {id:'twohomes',name:'Check any household you maintain away from work',detail:'If you maintain a main household in India or elsewhere, review your own household, centre of life, running-cost contributions and work-related second accommodation.',route:'doublehousehold',action:'Check double-household evidence'},
    {id:'parents',name:'Document financial support to relatives',detail:'Separate essential support from gifts. Collect the recipient’s financial evidence, declarations and payment trail before considering a claim.',route:'parentsguide',action:'Prepare family-support documents'},
    {id:'banking',name:'Review your Indian bank-account status',detail:'Check account redesignation and KYC with your bank when your FEMA status changes. Banking status and income-tax residence are separate questions.',route:'guide/accounts',action:'Review Indian accounts'},
    {id:'foreignincome',name:'Collect statements for Indian income',detail:'List interest, rent, dividends and investment income. An Indian tax exemption does not settle German reporting or treaty treatment.',route:'guide/indianinterest',action:'Review cross-border income'}
  ]},
  {name:'Your family and longer-term plans',items:[
    {id:'health',name:'Review health cover for the whole household',detail:'Consider who may join you, their income, eligibility and cover during a move. Ask the insurer to confirm family-cover conditions.',route:'healthcompare',action:'Review health insurance'},
    {id:'pension',name:'Check your pension record and employer plan',detail:'Locate your statutory record or relevant professional pension records, and any company-pension documents. Review gaps, employer contributions and what happens if you leave.',route:'guide/retirement',action:'Review pension arrangements'},
    {id:'investments',name:'Check investment costs, tax and access',detail:'Locate broker statements, fees and cancellation or residency restrictions. Moving abroad can also require an exit-tax review.',route:'guide/capitaltax',action:'Review investment-tax questions'},
    {id:'departure',name:'Review contracts before a possible move',detail:'List insurance, pension, banking and other contracts with their contact details. Ask what can continue, change or end when you return to India.',route:'journey/return',action:'Plan a return to India'}
  ]}
];
export const moneyCheckItems = moneyCheckGroups.flatMap(group => group.items);
export function moneyCheckSummary(answers = {}) {
  const safe = answers && typeof answers === 'object' && !Array.isArray(answers) ? answers : {};
  const status = item => ['review','done','na'].includes(safe[item.id]) ? safe[item.id] : '';
  return {
    done:moneyCheckItems.filter(item => status(item) === 'done').length,
    na:moneyCheckItems.filter(item => status(item) === 'na').length,
    review:moneyCheckItems.filter(item => status(item) === 'review').length,
    unanswered:moneyCheckItems.filter(item => !status(item)).length,
    next:[...moneyCheckItems.filter(item => status(item) === 'review'),...moneyCheckItems.filter(item => !status(item))].slice(0,3)
  };
}
export function moneyCheckProgress(answers) {
  const summary = moneyCheckSummary(answers);
  return `${summary.done} checked · ${summary.na} not relevant · ${summary.review} need checking · ${summary.unanswered} unanswered`;
}
export function moneyNextSteps(answers) {
  const {next} = moneyCheckSummary(answers);
  return next.length ? '<div class="grid">'+next.map(item => '<a class="card link" href="#'+item.route+'"><div class="tag">Next action</div><h3>'+escape(item.name)+'</h3><p>'+escape(item.detail)+'</p><span class="arrow">'+escape(item.action)+' →</span></a>').join('')+'</div>' : '<div class="card"><h3>Every point has a recorded status</h3><p>Revisit these checks when your job, family, residence or the relevant tax year changes. A completed checklist does not establish tax eligibility or confirm that your finances are suitable.</p><a class="biglink" href="#discover">Explore guides and tools →</a></div>';
}
export function moneyCheckPage(answers, {title}) {
  const safe = answers && typeof answers === 'object' && !Array.isArray(answers) ? answers : {};
  return title('WORK & MONEY / PERSONAL CHECKLIST','Check your money and paperwork','Sixteen practical checks for life between Germany and India. Use your documents to decide what you have checked and what needs attention.')+
    '<div class="note"><b>Your answers stay in this browser.</b> Only checklist choices are saved. Keep payslips, account numbers and documents privately; no upload is needed. Use <a class="biglink" href="#settings">Privacy & backup</a> to export or clear local data.</div>'+
    '<div class="card fb-money-summary"><h2>Your next three actions</h2><p>Items marked “Need to check” appear first, followed by unanswered items in checklist order. Choose “Not relevant to me” only after considering your situation.</p><p id="moneyCheckProgress" role="status">'+moneyCheckProgress(safe)+'</p></div><div id="moneyCheckNextSteps">'+moneyNextSteps(safe)+'</div>'+
    moneyCheckGroups.map((group,index) => '<section class="fb-money-group" aria-labelledby="moneyGroup'+index+'"><div class="sectionhead"><h2 id="moneyGroup'+index+'">'+escape(group.name)+'</h2></div><div class="card">'+group.items.map(item => '<div class="fb-money-item"><div><label for="moneyCheck-'+item.id+'"><b>'+escape(item.name)+'</b></label><p class="muted" id="moneyHelp-'+item.id+'">'+escape(item.detail)+'</p><a class="biglink" href="#'+item.route+'">'+escape(item.action)+' →</a></div><select id="moneyCheck-'+item.id+'" data-money-check="'+item.id+'" aria-describedby="moneyHelp-'+item.id+'">'+moneyCheckOptions.map(([value,label]) => '<option value="'+value+'" '+((safe[item.id] === value || (!['review','done','na'].includes(safe[item.id]) && value === ''))?'selected':'')+'>'+label+'</option>').join('')+'</select></div>').join('')+'</div></section>').join('')+
    '<div class="row fb-money-actions"><button type="button" class="button secondary" id="moneyCheckReset">Reset this checklist</button><a class="button secondary" href="#tax">Open tax workspace →</a></div><p id="moneyCheckSaveStatus" class="muted" role="status">Checklist guidance reviewed '+moneyReviewDate+'. Your choices do not determine a claim or a refund.</p>';
}

export const householdEvidence = [
  ['mainhome','Main household and centre of life','Keep household and address records, your living arrangements and evidence explaining why this is your main home. Having family or property in India alone does not establish the complete claim.'],
  ['contribution','Your share of household running costs','Retain bank payments and records of household costs showing your financial participation. Distinguish these from gifts or investment transfers.'],
  ['workreason','Reason for the accommodation near work','Keep the employment and first-workplace details together with the second rental agreement or hostel invoices.'],
  ['monthlycosts','Monthly second-accommodation costs','Itemize qualifying bills and payments by month. Keep furniture and other separately assessed costs distinguishable.'],
  ['journeys','Actual trips to the main household','Record trip dates and routes. For flights retain tickets, invoices and payment records; do not put flight kilometres into the distance allowance.'],
  ['payments','Employer payments and overlapping claims','List reimbursements and allowances. Reconcile home trips, ordinary commuting and other expense entries for the same tax year.']
];
export const departureEvidence = [
  ['payroll','Employment and tax records','Keep annual wage-tax certificates from each employer, final payslips, filed returns and tax-assessment notices.'],
  ['pension','Pension records and written answers','Keep the Versicherungsverlauf or professional pension record, company-plan terms and any individual DRV assessment.'],
  ['health','Health-insurance transition confirmation','Ask the insurer for the cover end or continuation date, requirements and any documented option to resume cover later. Employment ending alone does not settle every membership.'],
  ['residence','Residence and registration documents','Retain relevant registration/deregistration confirmations and advice on immigration status. Review tax residence separately.'],
  ['contracts','Provider and contract summary','List account/contract contacts, address updates, cancellation confirmations, broker residency rules and access for final bills and refunds.']
];
export function moneyEvidencePanel(kind, saved = {}) {
  const items = kind === 'departure' ? departureEvidence : householdEvidence;
  const prefix = kind === 'departure' ? 'departure' : 'household';
  return '<section class="fb-money-evidence"><div class="sectionhead"><h2>'+(prefix === 'departure' ? 'Your departure document pack' : 'Your double-household document pack')+'</h2></div><div class="card"><p>Mark evidence you have collected or reviewed. These choices stay in this browser; keep the documents themselves privately. A tick does not establish eligibility.</p>'+items.map(([id,name,detail]) => '<label class="fb-money-evidence-item"><input type="checkbox" data-money-evidence="'+prefix+':'+id+'" '+(saved?.[prefix+':'+id] === true?'checked':'')+'><span><b>'+escape(name)+'</b><small>'+escape(detail)+'</small></span></label>').join('')+'<p class="muted" role="status" id="moneyEvidenceStatus-'+prefix+'">'+items.filter(([id]) => saved?.[prefix+':'+id] === true).length+' of '+items.length+' evidence groups reviewed.</p></div></section>';
}

const payrollLines = [
  ['Lohnsteuer / LSt','Wage tax withheld','Your employer sends this tax payment to the tax office. It is withholding towards the annual assessment; your tax class affects the calculation.','Check tax class, taxable gross, payroll period and any bonus or allowance.'],
  ['Solidaritätszuschlag / SolZ','Solidarity surcharge','A surcharge linked to income tax, with exemption and transition rules. A zero line can be correct; it is not a fixed percentage of gross salary.','Ask payroll which withholding calculation applies if the amount changes.'],
  ['Kirchensteuer / KiSt','Church tax','May apply according to membership in a tax-collecting religious community and the relevant rules. An unexpected deduction needs a record check.','Check the religious-status record and ask payroll or the responsible authority about corrections.'],
  ['RV / Rentenversicherung','Statutory pension insurance','Usually shown as separate employee and employer contributions. Some professional pension arrangements require different payroll treatment.','Compare the employee deduction with your pension record or relevant professional pension documents.'],
  ['KV / Krankenversicherung','Health insurance','For standard statutory employment, the general contribution and insurer-specific additional contribution are shared with the employer. Private insurance is handled differently.','Check the insurer, employee contribution and any separately shown employer payment.'],
  ['PV / Pflegeversicherung','Long-term care insurance','Separate from health insurance. Child-related rules affect the employee share; a childless surcharge is borne by the employee. Saxony has a different ordinary employer/employee split.','Check the information held by payroll about children, age and the applicable state rules.'],
  ['AV / Arbeitslosenversicherung','Unemployment insurance','A social-insurance contribution for covered employment, normally split between the employee and employer. Special employment categories can follow different rules.','Check whether your employment is covered and distinguish employee from employer amounts.']
];
export function payslipGuide({title}) {
  return '<a class="biglink" href="#salary">← Monthly salary calculator</a>'+title('WORK / UNDERSTAND YOUR PAY','Read your German payslip','Use your actual payroll statement to follow gross pay, tax deductions, social insurance and the amount transferred to your bank.')+
    '<div class="note">Keep the statement beside you. This explainer does not upload or read it. Labels vary by payroll provider; the employer’s contribution is a separate amount, not another deduction from your stated gross salary.</div>'+
    '<div class="grid two"><div class="card"><h3>Start with the different gross figures</h3><p><b>Gesamtbrutto</b> is total gross remuneration. <b>Steuerbrutto</b> is the basis used for tax; <b>SV-Brutto</b> is the social-insurance basis. These can differ because individual pay components have different treatment.</p><p>Separate regular salary, recurring allowances, bonuses and benefits before comparing two months.</p></div><div class="card"><h3>Net pay and the bank transfer can differ</h3><p>After taxes and employee contributions, other deductions or additions can affect the payout. Compare <b>Netto</b> with <b>Auszahlungsbetrag</b> and review reimbursements, advances or other payroll adjustments.</p><p>Ask payroll to explain an unfamiliar line before assuming it is tax.</p></div></div>'+
    '<div class="sectionhead"><h2>The seven common tax and insurance lines</h2></div><div class="fb-payslip-lines">'+payrollLines.map(([label,name,meaning,check]) => '<article class="card"><div class="tag">'+escape(label)+'</div><h3>'+escape(name)+'</h3><p>'+escape(meaning)+'</p><p class="muted"><b>Check:</b> '+escape(check)+'</p></article>').join('')+'</div>'+
    '<div class="sectionhead"><h2>Keep the right identifiers and year-end records</h2></div><div class="card guidebody"><p>Your <b>Steuer-ID</b> identifies you for tax. Your <b>Sozialversicherungsnummer / Versicherungsnummer</b> belongs to your social-insurance or pension record. They are different identifiers; keep them securely.</p><p>Collect a <b>Lohnsteuerbescheinigung</b> from each employer for the relevant calendar year and compare it with your records. A payslip deduction does not mean your employer has filed your personal income-tax return.</p><p>For pay-component questions, start with payroll. For insurance membership or pension-record questions, contact the relevant insurer or pension institution.</p></div>'+
    '<div class="row fb-money-actions"><a class="button" href="#moneycheck">Check my next actions →</a><a class="button secondary" href="#taxclasses">Compare tax classes →</a></div>'+
    '<div class="sectionhead"><h2>Official references</h2></div><div class="card guidebody"><p><a class="biglink" href="https://www.gesetze-im-internet.de/entgbv/__1.html" target="_blank" rel="noopener noreferrer">Payroll statement requirements: Entgeltbescheinigungsverordnung §1 ↗</a></p><p><a class="biglink" href="https://www.gesetze-im-internet.de/estg/__39b.html" target="_blank" rel="noopener noreferrer">Income Tax Act §39b: wage-tax withholding ↗</a></p><p><a class="biglink" href="https://www.bundesgesundheitsministerium.de/beitraege" target="_blank" rel="noopener noreferrer">BMG: statutory health contributions ↗</a></p><p><a class="biglink" href="https://www.gesetze-im-internet.de/sgb_11/__58.html" target="_blank" rel="noopener noreferrer">SGB XI §58: employee and employer care-insurance shares ↗</a></p><p><b>Reviewed:</b> '+moneyReviewDate+'. This rate-independent explanation covers common payroll labels; special employment and professional arrangements need their own review.</p></div>';
}

export function healthHouseholdReview() {
  return '<div class="sectionhead"><h2>Review cover as your household changes</h2></div><div class="card guidebody"><p>Compare your whole household over time: who may join you, their income and employment, future children, possible income changes and a move abroad.</p><ul><li><b>Family cover:</b> statutory insurance can cover eligible relatives without an extra contribution, subject to residence, income, age and other conditions. Ask the insurer to confirm eligibility.</li><li><b>Private cover:</b> obtain a quote for each person who needs cover, including deductibles and the employer contribution. Review future premiums and the conditions for changing systems.</li><li><b>Departure:</b> request written confirmation of when cover ends or continues. Ending employment and ending insurance membership are separate questions.</li></ul><p>This comparison tool calculates statutory employee health contributions only. It does not decide whether private insurance is suitable.</p><a class="biglink" href="https://verwaltung.bund.de/leistungsverzeichnis/de/leistung/99134042017000" target="_blank" rel="noopener noreferrer">Federal portal: family-insurance eligibility ↗</a><p class="muted">Household review checked '+moneyReviewDate+'.</p></div>';
}
