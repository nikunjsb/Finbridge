// Reviewed 14 November 2026. Bounded preparation models, not filing decisions.
export const WORKBENCH_VERSION = '20261114';
export const workbenchSources = {
  employment: 'https://www.gesetze-im-internet.de/estg/__9.html',
  home: 'https://www.gesetze-im-internet.de/estg/__4.html',
  allowance: 'https://www.gesetze-im-internet.de/estg/__9a.html',
  depreciation: 'https://www.gesetze-im-internet.de/estg/__7.html',
  equipment: 'https://www.gesetze-im-internet.de/estg/__6.html',
  digital: 'https://lsth.bundesfinanzministerium.de/esth/2022/C-Anhaenge/Anhang-01/V/anhang-1-V.html',
  education: 'https://www.gesetze-im-internet.de/estg/__10.html',
  maintenance: 'https://www.gesetze-im-internet.de/estg/__33a.html',
  tariff: 'https://www.gesetze-im-internet.de/estg/__32a.html',
  countries: 'https://www.bundesfinanzministerium.de/Content/DE/Downloads/BMF_Schreiben/Steuerarten/Einkommensteuer/2025-12-02-beruecks-auslaendischer-verhaeltnisse.pdf?__blob=publicationFile&v=4',
  foreignSupport: 'https://www.bundesfinanzministerium.de/Content/DE/Downloads/BMF_Schreiben/Steuerarten/Einkommensteuer/2025-10-15-ausland-hinweise-unterhaltsaufw.pdf?__blob=publicationFile&v=4',
  supportGeneral: 'https://esth.bundesfinanzministerium.de/esth/2025/B-Anhaenge/Anhang-03/II/anhang-3-II.html',
  assets: 'https://amtliche-handbuecher.bundesfinanzministerium.de/esth/2025/A-Einkommensteuergesetz/IV-Tarif-31-34b/Paragraf-33a/paragraf-33a.html',
  household: 'https://www.gesetze-im-internet.de/estg/__35a.html'
};
const round = n => Math.round((n + Number.EPSILON) * 100) / 100;
function n(value, label, max = 1e7) {
  if (value === '' || value == null || typeof value === 'boolean') throw Error('Enter ' + label + '.');
  const result = Number(value);
  if (!Number.isFinite(result) || result < 0 || result > max) throw Error('Check ' + label + '.');
  return result;
}
function integer(value, label, max, min = 0) {
  const result = n(value, label, max);
  if (!Number.isInteger(result) || result < min) throw Error(label + ' must be a whole number between ' + min + ' and ' + max + '.');
  return result;
}
function yearOf(value) {
  const year = Number(value);
  if (![2025, 2026].includes(year)) throw Error('These preparation tools support 2025 and 2026 only.');
  return year;
}
function dateOf(value, year, label, purchase = false) {
  const text = String(value || '');
  const date = new Date(text + 'T00:00:00Z');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(text) || !Number.isFinite(date.valueOf()) || date.toISOString().slice(0, 10) !== text || (purchase ? date.getUTCFullYear() > year || date.getUTCFullYear() < 2000 : date.getUTCFullYear() !== year)) throw Error('Check ' + label + ' and selected tax year.');
  return date;
}
function list(value, label, max) {
  if (!Array.isArray(value) || value.length > max || value.some(x => !x || typeof x !== 'object' || Array.isArray(x))) throw Error('Check ' + label + '.');
  return value;
}
const yes = value => value === 'yes';
const base = (kind, year) => ({ kind, year, version: WORKBENCH_VERSION, issues: [] });

export function workExpenses(input) {
  const year = yearOf(input.year), result = base('work', year);
  const distance = Math.floor(n(input.distance, 'one-way commuting distance', 1000));
  if (!['car', 'public', 'other'].includes(input.transport)) throw Error('Choose the commuting transport.');
  const publicPaid = n(input.publicPaid, 'annual public-transport costs');
  const commuteRefund = n(input.commuteRefund, 'commuting benefits that reduce the deduction');
  const otherEmployment = n(input.otherEmployment, 'other verified employment expenses');
  const days = list(input.days, 'dated attendance records', 366), costs = list(input.costs, 'work-cost records', 128);
  const seen = new Set();
  let office = 0, home = 0, travel = 0, travelGross = 0, travelRefunds = 0;
  for (const row of days) {
    dateOf(row.date, year, 'attendance date');
    if (seen.has(row.date)) throw Error('Duplicate/overlapping workday: ' + row.date + '. Use one classification per date; split-day exceptions need separate review.');
    seen.add(row.date);
    if (row.kind === 'office') office++;
    else if (row.kind === 'home') home++;
    else if (row.kind === 'off') continue;
    else if (['travel-none', 'travel-8', 'travel-full', 'travel-arrival'].includes(row.kind)) {
      travel++;
      const paid = n(row.paid, 'business transport/accommodation cost'), km = n(row.km, 'business kilometres in your own car', 5000), refunded = n(row.refunded, 'business-travel reimbursement');
      let meal = row.kind === 'travel-full' ? 28 : row.kind === 'travel-none' ? 0 : 14;
      if (meal && !yes(input.travelConditions)) result.issues.push('Confirm domestic meal-duration, overnight arrival/departure and three-month/same-location rules before using meal allowances.');
      const breakfast = row.breakfast === 'yes' ? 5.6 : 0, lunch = row.lunch === 'yes' ? 11.2 : 0, dinner = row.dinner === 'yes' ? 11.2 : 0;
      meal = Math.max(0, meal - breakfast - lunch - dinner);
      const gross = paid + km * .3 + meal;
      if (refunded > gross + .005) throw Error('Business-travel reimbursement exceeds supported costs on ' + row.date + '; review its payroll treatment.');
      travelGross += gross; travelRefunds += refunded;
    } else throw Error('Choose a valid attendance classification.');
  }
  const daily = year === 2026 ? distance * .38 : Math.min(distance, 20) * .3 + Math.max(distance - 20, 0) * .38;
  const rawCommute = daily * office;
  const capped = input.transport === 'car' ? rawCommute : Math.min(rawCommute, 4500);
  const commuteBeforeRefund = input.transport === 'public' ? Math.max(capped, publicPaid) : capped;
  if (publicPaid > 0 && input.transport !== 'public') throw Error('Use the public-transport mode for its annual actual-cost comparison; mixed modes need separate review.');
  if (commuteRefund > commuteBeforeRefund + .005) throw Error('Commuting benefits exceed this supported commuting amount. Review payroll treatment.');
  if (publicPaid > 0 && !office) throw Error('Record actual office visits before claiming public-transport costs in this worksheet.');
  if (home && !yes(input.homeConditions)) result.issues.push('Confirm qualifying home-working days and no duplicate home-office/second-household accommodation claim. This one-classification ledger excludes split-day exceptions.');
  if (!yes(input.recordsVerified)) result.issues.push('Confirm actual, evidenced work use and reconciliation with all other expense records. Forecasts and duplicate costs are not claims.');
  let equipment = 0, phone = 0, training = 0, initialEducation = 0;
  const costDetails = [];
  for (const row of costs) {
    const date = dateOf(row.date, year, 'cost/payment date', row.kind === 'equipment');
    const paid = n(row.paid, 'gross work-cost amount'), share = n(row.share, 'documented work-use percentage', 100), refunded = n(row.refunded, 'employer reimbursement');
    const workCost = paid * share / 100;
    if (refunded > workCost + .005) throw Error('A reimbursement exceeds the recorded professional share.');
    const net = Math.max(0, workCost - refunded);
    if (!yes(row.evidence)) result.issues.push('Document the purpose, invoice, payment and work-use basis for every cost item.');
    let candidate = 0, category = row.kind;
    if (row.kind === 'equipment') {
      const vat = n(row.vat, 'purchase VAT percentage', 100), fullNetCost = paid / (1 + vat / 100);
      if (!['standard', 'digital'].includes(row.method)) throw Error('Choose the equipment method.');
      if (row.method === 'digital' || fullNetCost <= 800 + 1e-8) candidate = date.getUTCFullYear() === year ? net : 0;
      else {
        const life = integer(row.life, 'verified useful life in years', 50, 1);
        if (!yes(row.lifeVerified)) result.issues.push('Verify the equipment useful life and existing depreciation schedule; do not use a default life as tax advice.');
        const start = date.getUTCFullYear() * 12 + date.getUTCMonth(), end = start + life * 12;
        const months = Math.max(0, Math.min((year + 1) * 12, end) - Math.max(year * 12, start));
        candidate = net / (life * 12) * months;
      }
      if (date.getUTCFullYear() !== year && refunded) result.issues.push('Prior-year assets with later reimbursements require a reviewed depreciation adjustment.');
      equipment += candidate;
    } else if (row.kind === 'phone') { candidate = net; phone += candidate; }
    else if (row.kind === 'training') {
      if (row.course === 'initial') { candidate = net; initialEducation += candidate; category = 'Initial education — special expenses'; }
      else if (['subsequent', 'employment'].includes(row.course)) { candidate = net; training += candidate; }
      else if (row.course === 'general-language') { result.issues.push('General German-language learning is not automatically a professional expense. No deduction has been calculated for that item.'); }
      else throw Error('Choose the education classification.');
    } else throw Error('Choose a supported work-cost category.');
    costDetails.push({ date: row.date, category, netCost: round(net), candidate: round(candidate) });
  }
  result.issues = [...new Set(result.issues)];
  const commute = round(commuteBeforeRefund - commuteRefund), homeAmount = Math.min(home, 210) * 6, business = round(travelGross - travelRefunds);
  const employmentTotal = round(commute + homeAmount + business + equipment + phone + training + otherEmployment);
  return { ...result, supported: result.issues.length === 0, office, home, travel, commute, commuteBeforeRefund: round(commuteBeforeRefund), homeAmount, business, travelGross: round(travelGross), travelRefunds: round(travelRefunds), equipment: round(equipment), phone: round(phone), training: round(training), initialEducation: round(Math.min(6000, initialEducation)), employmentTotal, extraAboveAllowance: round(Math.max(0, employmentTotal - 1230)), costDetails };
}

export function parentSupport(input) {
  const year = yearOf(input.year), result = base('parents', year);
  const recipients = list(input.recipients, 'recipient records', 2);
  if (![1, 2].includes(recipients.length)) throw Error('Use one parent, or two married parents sharing the same household and support period.');
  const people = integer(input.people, 'people sharing the supported household', 30, recipients.length);
  const factor = input.country === 'india' ? .25 : input.country === 'germany' ? 1 : n(input.factor, 'verified country factor', 1);
  if (![.25, .5, .75, 1].includes(factor)) throw Error('Choose a verified BMF country-group factor.');
  if (input.country === 'other' && !yes(input.countryVerified)) result.issues.push('Verify the country group for the selected year.');
  if (!['india', 'germany', 'other'].includes(input.country)) throw Error('Choose the residence country.');
  const start = integer(input.start, 'first support month', 12, 1), end = integer(input.end, 'last support month', 12, start), months = end - start + 1;
  const payments = list(input.payments, 'payment records', 120), seen = new Set();
  let paid = 0;
  if (!payments.length) throw Error('Add at least one dated support payment.');
  for (const row of payments) {
    const date = dateOf(row.date, year, 'support payment date'), amount = n(row.amount, 'support payment excluding fees');
    const ref = String(row.ref || '').trim().toLowerCase();
    if (!ref || ref.length > 100) throw Error('Give every payment a short private reference.');
    if (seen.has(ref)) throw Error('Duplicate support-payment reference.');
    seen.add(ref);
    if (date.getUTCMonth() + 1 < start || date.getUTCMonth() + 1 > end) throw Error('Payment dates must fall inside the stated support period.');
    if (!yes(row.bank)) result.issues.push('Money support in 2025/2026 needs a verified transfer to a supported recipient account. Cash or uncertain delivery is outside this calculation.');
    paid += amount;
  }
  const firstMonth = Math.min(...payments.filter(p => Number(p.amount) > 0).map(p => Number(p.date.slice(5, 7))));
  if (firstMonth !== start) throw Error('The first support month must match the first positive payment month; payments cannot be backdated to earlier months.');
  if (!yes(input.periodVerified)) result.issues.push('Confirm need throughout the selected months, shared-household allocation, payment timing and no carry-over of payments into another tax year.');
  if (!yes(input.eligibility)) result.issues.push('Verify legal maintenance entitlement, actual need, employment efforts/exemption, priority claims and documentary evidence.');
  if (!yes(input.incomeVerified)) result.issues.push('Verify German-law income/receipts for the support period, including support from donors not subject to unlimited German income tax, and the statutory currency conversion.');
  if (recipients.length === 2 && !yes(input.marriedParents)) result.issues.push('The combined-income calculation is only for married parents sharing one household and support period. Run separate worksheets for other situations.');
  let income = 0, grants = 0;
  for (const person of recipients) {
    income += n(person.income, 'recipient income/receipts after reviewed allowable costs for the support period');
    grants += n(person.grants, 'education/public training grants for the support period');
    if (n(person.assets, 'recipient chargeable assets') > 15500) result.issues.push('A recipient exceeds the usual €15,500 chargeable-assets threshold. Review asset exemptions and need; this worksheet does not decide entitlement.');
  }
  const otherDonors = n(input.otherDonors, 'support from other unlimited-German-tax donors to this same household/period');
  const annualBase = year === 2026 ? 12348 : 12096;
  const allowance = Math.ceil(624 * factor * months / 12) * recipients.length;
  const ceiling = Math.ceil(annualBase * factor * months / 12) * recipients.length;
  const incomeReduction = Math.max(0, income - allowance) + grants;
  const afterIncome = Math.max(0, ceiling - incomeReduction);
  const donorRatio = paid + otherDonors ? paid / (paid + otherDonors) : 0;
  const allocatedPaid = paid * recipients.length / people;
  const beforeAffordability = Math.min(allocatedPaid, afterIncome * donorRatio);
  const donorNet = n(input.donorNet, 'verified disposable annual income for the Opfergrenze');
  const familyReduction = n(input.familyReduction, 'Opfergrenze family reduction in percentage points', 25);
  const percent = Math.max(0, Math.min(50, Math.floor(donorNet / 500)) - familyReduction);
  const affordability = round(donorNet * percent / 100);
  if (!yes(input.donorVerified)) result.issues.push('Verify disposable-income and family-percentage calculations, other supported people and whether the standard Opfergrenze applies. Shared benefit households and special cases require separate review.');
  const affordabilityUsed = n(input.affordabilityUsed, 'Opfergrenze amount already used by other maintenance claims');
  if (affordabilityUsed > affordability + .005) throw Error('Other maintenance claims exceed the calculated donor affordability limit.');
  result.issues = [...new Set(result.issues)];
  return { ...result, supported: result.issues.length === 0, paid: round(paid), people, recipientCount: recipients.length, months, factor, ceiling, income: round(income), allowance, incomeReduction: round(incomeReduction), allocatedPaid: round(allocatedPaid), donorRatio, beforeAffordability: round(beforeAffordability), affordability, affordabilityPercent: percent, candidate: round(Math.min(beforeAffordability, Math.max(0, affordability - affordabilityUsed))) };
}

export function householdServices(input) {
  const year = yearOf(input.year), result = base('household', year);
  const rows = list(input.items, 'household invoice records', 200), seen = new Set();
  if (!rows.length) throw Error('Add an invoice or service-charge certificate item.');
  if (!yes(input.household)) result.issues.push('Confirm an eligible EU/EEA household and the supported service classification; no new-build, mini-job employment or care-facility assessment is performed here.');
  if (!yes(input.allocation)) result.issues.push('Reconcile your own cost share, all household members, all residences and already-used annual household limits.');
  const limitShare = n(input.limitShare, 'agreed share of annual household limits', 100) / 100;
  const priorService = n(input.priorService, 'household-service credit already using your allocated limit');
  const priorTrade = n(input.priorTrade, 'craft-work credit already using your allocated limit');
  if (priorService > 4000 * limitShare || priorTrade > 1200 * limitShare) throw Error('Previously used credits exceed your allocated annual limits.');
  let paid = 0, materialTotal = 0, service = 0, trade = 0, excluded = 0;
  const lines = [];
  for (const row of rows) {
    dateOf(row.date, year, 'household payment date');
    const reference = String(row.ref || '').trim().toLowerCase();
    if (!reference || reference.length > 100) throw Error('Use a short private invoice/certificate-item reference.');
    if (seen.has(reference)) throw Error('Duplicate invoice/item reference. Combine duplicate entries or give distinct statement line references.');
    seen.add(reference);
    if (!['service', 'trade', 'excluded'].includes(row.kind)) throw Error('Choose the household-service category.');
    const total = n(row.total, 'your invoice cost share'), labour = n(row.labour, 'your eligible labour/travel/machine cost share'), materials = n(row.materials, 'your materials share'), refunded = n(row.refunded, 'reimbursed eligible labour'), elsewhere = n(row.elsewhere, 'labour costs already claimed elsewhere');
    if (labour + materials > total + .005) throw Error('Labour plus materials exceeds the invoice cost share.');
    if (refunded + elsewhere > labour + .005) throw Error('Reimbursements and costs used elsewhere exceed labour costs.');
    paid += total; materialTotal += materials;
    let eligible = Math.max(0, labour - refunded - elsewhere), reason = '';
    if (row.kind === 'excluded') reason = 'Excluded category';
    else if (!yes(row.bank) || !yes(row.invoice)) reason = 'Invoice/certificate and payment-to-provider bank evidence required';
    else if (!yes(row.eligible)) reason = 'Service eligibility not confirmed';
    else if (row.kind === 'trade' && row.subsidy !== 'no') reason = 'Subsidised or uncertain craft-work measure needs separate review';
    if (reason) { excluded += eligible; eligible = 0; }
    if (row.kind === 'service') service += eligible;
    if (row.kind === 'trade') trade += eligible;
    lines.push({ ref: String(row.ref), category: row.kind, eligible: round(eligible), reason });
  }
  const serviceCredit = Math.min(service * .2, Math.max(0, 4000 * limitShare - priorService));
  const tradeCredit = Math.min(trade * .2, Math.max(0, 1200 * limitShare - priorTrade));
  const potentialCredit = round(serviceCredit + tradeCredit);
  const availableTax = input.availableTax === '' || input.availableTax == null ? null : n(input.availableTax, 'remaining assessed income tax after other reductions');
  result.issues = [...new Set(result.issues)];
  return { ...result, supported: result.issues.length === 0, paid: round(paid), materialTotal: round(materialTotal), excluded: round(excluded), service: round(service), trade: round(trade), serviceCredit: round(serviceCredit), tradeCredit: round(tradeCredit), potentialCredit, appliedCredit: availableTax === null ? null : round(Math.min(potentialCredit, availableTax)), lines };
}

export const workbenchLabels = { work: 'Work expenses', parents: 'Parent support', household: 'Household services' };
export function workbenchSummary(result) {
  if (!result || !Object.keys(workbenchLabels).includes(result.kind)) return 'No supported worksheet result.';
  if (!result.supported) return 'Review needed — no claim-ready amount. ' + (Array.isArray(result.issues) ? result.issues.join(' ') : 'Recalculate the worksheet.');
  const fields = result.kind === 'work' ? ['employmentTotal', 'extraAboveAllowance', 'initialEducation'] : result.kind === 'parents' ? ['candidate', 'months', 'factor', 'affordability'] : ['potentialCredit'];
  if (fields.some(key => typeof result[key] !== 'number' || !Number.isFinite(result[key])) || result.kind === 'household' && result.appliedCredit !== null && (typeof result.appliedCredit !== 'number' || !Number.isFinite(result.appliedCredit))) return 'Saved worksheet result is incomplete. Recalculate before using any amount.';
  if (result.kind === 'work') return 'Employment-expense candidate EUR ' + result.employmentTotal.toFixed(2) + '; additional amount above the EUR 1,230 employee allowance ' + result.extraAboveAllowance.toFixed(2) + '; initial-education special-expense candidate ' + result.initialEducation.toFixed(2) + '. Not a refund; reconcile other records.';
  if (result.kind === 'parents') return 'Maintenance income-deduction candidate EUR ' + result.candidate.toFixed(2) + '; ' + result.months + ' support month' + (result.months === 1 ? '' : 's') + '; country factor ' + result.factor + '; donor affordability ceiling EUR ' + result.affordability.toFixed(2) + '. Not a refund or eligibility decision.';
  return 'Potential DIRECT tax credit EUR ' + result.potentialCredit.toFixed(2) + '; applied against entered remaining assessed tax: ' + (result.appliedCredit === null ? 'not assessed' : 'EUR ' + result.appliedCredit.toFixed(2)) + '. Not an income deduction or refund; excluded/unverified items are listed separately.';
}
