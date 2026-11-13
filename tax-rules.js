// Reviewed 13 November 2026. Pure preparation/screening models; never a filing decision.
export const TAX_RULES_VERSION = '20261113-tax1';
export const taxSources = {
  tariff: 'https://www.gesetze-im-internet.de/estg/__32a.html',
  allowance: 'https://www.gesetze-im-internet.de/estg/__9a.html',
  special: 'https://www.gesetze-im-internet.de/estg/__10.html',
  donations: 'https://www.gesetze-im-internet.de/estg/__10b.html',
  family: 'https://www.gesetze-im-internet.de/estg/__26.html',
  progression: 'https://www.gesetze-im-internet.de/estg/__32b.html',
  filing: 'https://www.gesetze-im-internet.de/estg/__46.html',
  india: 'https://www.incometax.gov.in/iec/foportal/help/all-topics/e-filing-services/non%20resident%20-faq',
  rbi: 'https://www.rbi.org.in/commonman/english/scripts/FAQs.aspx?Id=3',
  treaty: 'https://www.bundesfinanzministerium.de/Content/DE/Standardartikel/Themen/Steuern/Internationales_Steuerrecht/Staatenbezogene_Informationen/Laender_A_Z/Indien/1996-05-06-Indien-Abkommen-DBA.html',
  germany: 'https://www.gesetze-im-internet.de/ao_1977/__8.html',
  gifts: 'https://www.gesetze-im-internet.de/erbstg_1974/__30.html'
  ,capital: 'https://www.gesetze-im-internet.de/estg/__20.html'
  ,funds: 'https://www.gesetze-im-internet.de/invstg_2018/__20.html'
};

export function nonnegative(value, label, max = 10000000) {
  if (value === '' || value === null || value === undefined || typeof value === 'boolean') throw Error('Enter ' + label + '.');
  const number = Number(value);
  if (!Number.isFinite(number) || number < 0 || number > max) throw Error('Check ' + label + '.');
  return number;
}
const cents = number => Math.round((number + Number.EPSILON) * 100) / 100;
const year2026 = year => { if (String(year) !== '2026') throw Error('Numerical estimates support German tax year 2026 only.'); };

// EStG §32a(1),(5): annual taxable income, euro truncation, optional splitting.
export function tariff2026(taxableIncome, joint = false) {
  const income = Math.floor(nonnegative(taxableIncome, 'annual taxable income'));
  const x = Math.floor(income / (joint ? 2 : 1));
  let tax = 0;
  if (x > 277825) tax = .45 * x - 19470.38;
  else if (x > 69878) tax = .42 * x - 11135.63;
  else if (x > 17799) { const z = (x - 17799) / 10000; tax = (173.10 * z + 2397) * z + 1034.87; }
  else if (x > 12348) { const y = (x - 12348) / 10000; tax = (914.51 * y + 1400) * y; }
  return Math.floor(tax) * (joint ? 2 : 1);
}

export function taxEffect(input) {
  year2026(input.year);
  if (input.complex !== false && input.complex !== 'no') return { supported: false, reason: 'This model does not cover uncertain or part-year residence, foreign/progression income, capital-income special tariffs, tax credits or other special assessments. Prepare the records for an adviser instead.' };
  if (input.verified !== true && input.verified !== 'yes') return { supported: false, reason: 'First confirm that the candidate is eligible, belongs to 2026 and is not already included in the baseline taxable income.' };
  if (!['employment', 'additional'].includes(input.kind)) throw Error('Choose the deduction basis.');
  if (!['single', 'joint'].includes(input.assessment)) throw Error('Choose the assessment illustration.');
  if (input.kind === 'employment' && input.assessment === 'joint') return { supported: false, reason: 'For a joint example, work out each employee’s extra deduction above their own allowance first, then use the additional-deduction option. Do not apply one household-wide employee allowance.' };
  const income = nonnegative(input.income, 'taxable income');
  const spending = nonnegative(input.spending, 'actual out-of-pocket spending');
  const candidate = nonnegative(input.candidate, 'candidate eligible amount');
  const reimbursements = nonnegative(input.reimbursements, 'reimbursements');
  if (reimbursements > candidate) throw Error('Reimbursements cannot exceed the candidate amount in this example.');
  const netCandidate = cents(candidate - reimbursements);
  const allowance = input.kind === 'employment' ? 1230 : 0;
  const incrementalDeduction = cents(Math.max(0, netCandidate - allowance));
  const appliedDeduction = Math.min(Math.floor(income), incrementalDeduction);
  const before = tariff2026(income, input.assessment === 'joint');
  const after = tariff2026(Math.max(0, income - appliedDeduction), input.assessment === 'joint');
  return { supported: true, year: 2026, spending, candidate, reimbursements, netCandidate, allowance, incrementalDeduction, appliedDeduction, before, after, effect: before - after, unusedDeduction: cents(incrementalDeduction - appliedDeduction) };
}

export function donationCheck(input) {
  year2026(input.year);
  const paid = nonnegative(input.paid, 'donations paid');
  const refunded = nonnegative(input.refunded, 'donations refunded');
  if (refunded > paid) throw Error('Refunds cannot exceed donations paid.');
  const net = cents(paid - refunded);
  if (input.eligible !== 'yes' || input.receipt !== 'yes') return { supported: false, net, reason: 'Confirm an eligible recipient and acceptable donation evidence. Political donations, foundations, membership exclusions and donations directly to an Indian organisation require separate review; this ordinary charitable-donation model does not determine their treatment.' };
  const incomeBase = nonnegative(input.incomeBase, 'Gesamtbetrag der Einkünfte');
  const alreadyUsed = nonnegative(input.alreadyUsed, 'other donations using this limit');
  const ceiling = cents(incomeBase * .2);
  const remaining = cents(Math.max(0, ceiling - alreadyUsed));
  const candidate = Math.min(net, remaining);
  return { supported: true, year: 2026, net, ceiling, remaining, candidate, reviewCarryforward: cents(net - candidate) };
}

export function childcareCheck(input) {
  year2026(input.year);
  const paid = nonnegative(input.paid, 'total childcare payments for this child');
  const excluded = nonnegative(input.excluded, 'meals, lessons and excluded costs');
  const reimbursed = nonnegative(input.reimbursed, 'childcare reimbursements');
  if (excluded + reimbursed > paid) throw Error('Excluded costs and reimbursements exceed payments.');
  const net = cents(paid - excluded - reimbursed);
  if (input.qualifies !== 'yes' || input.bank !== 'yes' || input.invoice !== 'yes' || input.location !== 'germany') return { supported: false, net, reason: 'Review household membership, qualifying age/disability period, invoice and payment to the provider’s bank account. Children abroad, unclear conditions and cash payments are outside this numerical model.' };
  return { supported: true, year: 2026, net, candidate: cents(Math.min(4800, .8 * net)), ceiling: 4800 };
}

export function insuranceCheck(input) {
  year2026(input.year);
  if (!['basic', 'pension', 'other', 'work', 'private'].includes(input.kind)) throw Error('Choose the insurance/pension type.');
  const paid = nonnegative(input.paid, 'your own payments');
  const refunded = nonnegative(input.refunded, 'refunds or reimbursements');
  if (refunded > paid) throw Error('Refunds cannot exceed your payments.');
  const notes = {
    basic: 'Use the insurer’s tax certificate for the eligible basic health/care portion. Sickness-benefit adjustments, refunds and tax-free subsidies can change the figure; optional extras are separate.',
    pension: 'Reconcile the payroll/provider certificate, own payments, employer shares and pension category. Statutory/basic pension, occupational pension, Riester and private contracts have different limits and treatment.',
    other: 'Other qualifying insurance shares a limited allowance: commonly €1,900 for employees receiving health-insurance support, or €2,800 in relevant other cases. Basic health/care contributions can exhaust that space, leaving no additional deduction.',
    work: 'A documented professional share may belong to employment expenses. Keep private and work shares separate and compare with the employee allowance; do not also claim the same premium as a special expense.',
    private: 'Do not treat a private savings/insurance product as deductible without checking the specific contract, certification and tax rules. Fees, access restrictions, portability and later taxation also matter.'
  };
  return { year: 2026, netPaid: cents(paid - refunded), candidate: null, status: input.certificate === 'yes' && input.prefilled === 'yes' ? 'Reconcile prefilled amounts' : 'Evidence or prefilled-data review needed', note: notes[input.kind], duplicate: input.prefilled === 'yes' };
}

function optionalInteger(value, label, max) {
  if (value === '' || value === undefined || value === null) return null;
  const result = nonnegative(value, label, max);
  if (!Number.isInteger(result)) throw Error(label + ' must be a whole number.');
  return result;
}
export function indianResidency(input) {
  if (!['2024', '2025', '2026'].includes(String(input.year))) throw Error('Choose a supported Indian tax year.');
  const days = optionalInteger(input.days, 'Days in the selected Indian year', 365);
  if (days === null) throw Error('Enter days in the selected Indian year.');
  const prior4 = optionalInteger(input.prior4, 'Days in the preceding four years', 1461);
  const prior7 = optionalInteger(input.prior7, 'Days in the preceding seven years', 2557);
  const nrYears = optionalInteger(input.nrYears, 'Non-resident years in the preceding ten years', 10);
  if (prior4 !== null && prior7 !== null && prior7 < prior4) throw Error('Seven-year days cannot be fewer than four-year days.');
  const law = String(input.year) === '2026' ? 'Income-tax Act, 2025, section 6' : 'Income-tax Act, 1961, section 6';
  const review = reason => ({ status: 'Needs review', reason, law });
  if (!['citizen', 'pio', 'other'].includes(input.person) || !['general', 'visit', 'leaving'].includes(input.purpose)) return review('Confirm citizenship/PIO status and whether this is a visit, a departure for overseas employment or another situation. Crew day-count rules are not modelled.');
  const citizen = input.person === 'citizen';
  const specialVisitor = ['citizen', 'pio'].includes(input.person) && input.purpose === 'visit';
  let resident = days >= 182;
  let deemed = false;
  let visitorRNOR = false;
  let reason = resident ? 'The 182-day test is met.' : '';
  if (!resident) {
    if (citizen && input.purpose === 'leaving') reason = 'The overseas-employment departure exception uses the 182-day threshold.';
    else {
      let threshold = 60;
      if (specialVisitor) {
        if (!['yes', 'no'].includes(input.highIncome)) return review('The visiting citizen/PIO income test is unresolved: income other than foreign-source income above ₹15 lakh can change the threshold.');
        threshold = input.highIncome === 'yes' ? 120 : 182;
      }
      if (days >= threshold) {
        if (prior4 === null) return review('Enter preceding-four-year days to assess the alternative residence test.');
        resident = prior4 >= 365;
        visitorRNOR = resident && specialVisitor && threshold === 120;
        reason = 'Alternative test: ' + threshold + ' current-year days plus 365 preceding-four-year days ' + (resident ? 'met.' : 'not met.');
      } else reason = 'The applicable current-year day threshold is not met.';
    }
    // Deemed residence is considered only after the ordinary day tests fail.
    // It must never reclassify a person already ordinarily resident as RNOR.
    if (!resident && citizen && input.highIncome === 'yes' && input.liableElsewhere === 'no') { resident = true; deemed = true; reason = 'The deemed-resident conditions you selected require review; a day-count exemption alone is insufficient.'; }
    if (!resident && citizen && input.highIncome !== 'no' && input.liableElsewhere !== 'yes') return review('Resolve the ₹15 lakh and liable-to-tax-elsewhere questions before excluding deemed residence.');
  }
  if (!resident) return { status: 'Non-resident screening', reason, law };
  if (deemed || visitorRNOR || (nrYears !== null && nrYears >= 9) || (prior7 !== null && prior7 <= 729)) return { status: 'Resident — RNOR screening', reason: reason + ' A selected not-ordinarily-resident condition is met.', law };
  if (prior7 === null || nrYears === null) return { status: 'Resident — NOR review needed', reason: reason + ' Complete both the seven-year and ten-year history before distinguishing RNOR from ordinarily resident.', law };
  return { status: 'Resident — ordinarily resident screening', reason: reason + ' The modelled RNOR conditions are not met.', law };
}

export function transferQuote(totalDebit, quote) {
  const debit = nonnegative(totalDebit, 'total EUR debit');
  const feeEUR = nonnegative(quote.feeEUR, 'EUR fee');
  const rate = nonnegative(quote.rate, 'INR per EUR rate', 1000);
  const feeINR = nonnegative(quote.feeINR, 'INR deductions');
  if (rate <= 0 || feeEUR > debit) throw Error('Check the quote rate and EUR fee.');
  const received = cents((debit - feeEUR) * rate - feeINR);
  if (received < 0) throw Error('INR deductions exceed the converted amount.');
  return { debit, received, effectiveRate: debit ? received / debit : 0 };
}

const cellText = value => value === undefined || value === null ? '' : String(value);
export function csvCell(value) {
  let cell = cellText(value);
  if (/^[\s]*[=+@\-]/.test(cell) || /^[\t\r\n]/.test(cell)) cell = "'" + cell;
  return '"' + cell.replace(/"/g, '""') + '"';
}
export function recordsForYear(records, year) {
  if (!['2024', '2025', '2026'].includes(String(year))) throw Error('Choose a supported German tax year.');
  const list = Array.isArray(records) ? records.filter(r => r && typeof r === 'object') : [];
  return { selected: list.filter(r => String(r.year) === String(year)), unassigned: list.filter(r => !r.year) };
}
export function taxRecordsCSV(records, year) {
  const { selected } = recordsForYear(records, year);
  const rows = [['Tax year', 'Payment date', 'Category', 'Item', 'Actual spending EUR', 'Candidate deduction EUR (not refund)', 'Receipt reference', 'Details', 'Notes', 'Review warning', 'Recorded calculation inputs']];
  for (const r of selected) rows.push([r.year, r.paymentDate, r.category, r.item, r.actual ?? r.amount ?? '', typeof r.estimated === 'number' && Number.isFinite(r.estimated) ? r.estimated : 'Not assessed', r.receiptRef, r.details, r.note, r.warning, r.basis && typeof r.basis === 'object' ? JSON.stringify(r.basis) : 'Not recorded (older entry)']);
  return '\uFEFF' + rows.map(row => row.map(csvCell).join(',')).join('\r\n');
}
export const preparationEvidence = [
  ['year', 'Check the filing year and annual payroll/provider certificates'],
  ['receipts', 'Match each expense to an invoice or private receipt reference'],
  ['payment', 'Keep payment dates and bank-payment evidence privately'],
  ['purpose', 'Document work use, personal share and any qualifying conditions'],
  ['reimbursements', 'Reconcile employer payments, refunds and prefilled entries'],
  ['international', 'Collect Indian income/tax records and both countries’ residence timeline']
];
export function adviserText(state = {}, year = 2026) {
  const { selected, unassigned } = recordsForYear(state.expenses, year);
  const lines = ['ATLASEVERYDAY — ADVISER PREPARATION PACK', 'German tax year: ' + year, 'Preparation only. No tax return has been filed. Candidate deductions are not refunds.', 'Do not sum different tax categories or years. Keep original documents privately.', '', 'EVIDENCE CHECKLIST'];
  for (const [id, label] of preparationEvidence) lines.push((state.taxEvidence?.[year + ':' + id] === true ? '[x] ' : '[ ] ') + label);
  lines.push('', 'EXPENSE RECORDS FOR ' + year);
  for (const [index, r] of selected.entries()) lines.push((index + 1) + '. ' + cellText(r.category) + (r.item ? ' / ' + cellText(r.item) : ''), '  Payment date: ' + (r.paymentDate || 'not recorded') + '; actual spending EUR: ' + cellText(r.actual ?? r.amount ?? 'not recorded'), '  Candidate deduction EUR: ' + (typeof r.estimated === 'number' && Number.isFinite(r.estimated) ? r.estimated : 'not assessed'), '  Receipt: ' + (r.receiptRef || 'not recorded') + '; notes: ' + cellText(r.note), '  Basis: ' + cellText(r.details), '  Recorded inputs: ' + (r.basis && typeof r.basis === 'object' ? JSON.stringify(r.basis) : 'not recorded (older entry)'), '  Review: ' + cellText(r.warning));
  if (!selected.length) lines.push('No expense records for this tax year.');
  lines.push('', 'Records without a year: ' + unassigned.length + ' — omitted from year-specific totals and export. Review or re-create them with a year in the workspace.');
  const savedChecks = Array.isArray(state.taxChecks) ? state.taxChecks.filter(r => r && String(r.year) === String(year)) : [];
  lines.push('', 'SAVED PREPARATION CHECKS');
  for (const r of savedChecks) lines.push(cellText(r.label) + ': ' + cellText(r.summary));
  if (!savedChecks.length) lines.push('No checks saved for this year.');
  if (state.taxFinder && String(state.taxFinder.year) === String(year)) {
    lines.push('', 'SAVED OPPORTUNITY-FINDER ANSWERS (SELF-REPORTED)');
    for (const [key, value] of Object.entries(state.taxFinder)) if (typeof value === 'string') lines.push(key + ': ' + value);
  }
  if (state.taxEffect?.year === Number(year) && state.taxEffect?.supported === true) lines.push('', 'SAVED TARIFF ILLUSTRATION', 'Baseline taxable income EUR: ' + state.taxEffect.baselineIncome + '; assessment: ' + state.taxEffect.assessment + '; basis: ' + state.taxEffect.kind, 'Spending EUR: ' + state.taxEffect.spending + '; candidate EUR: ' + state.taxEffect.candidate + '; reimbursements EUR: ' + state.taxEffect.reimbursements + '; allowance accounted for EUR: ' + state.taxEffect.allowance + '; extra income deduction EUR: ' + state.taxEffect.incrementalDeduction, 'Tariff before EUR: ' + state.taxEffect.before + '; after EUR: ' + state.taxEffect.after, '2026 tariff-only effect EUR: ' + state.taxEffect.effect + '. Not a refund. Eligibility and input taxable income must be checked. No Soli, church tax, credits, benefits, progression or cross-border assessment.');
  lines.push('', 'ADVISER QUESTIONS', 'Which expenses qualify, and which allowance/prefilled entries already cover them?', 'Which receipts, work-use evidence and reimbursements need correction?', 'Does arrival/departure, family status or foreign income change filing obligations or treaty treatment?', 'Which items are deductions, direct credits, required declarations or unsupported estimates?', '', 'RULE REFERENCES (reviewed 13 November 2026)', ...Object.entries(taxSources).map(([name, url]) => name + ': ' + url));
  return lines.join('\n');
}
