import { workExpenses, parentSupport, householdServices, workbenchSummary, workbenchSources, workbenchLabels } from './tax-workbench-rules.js?v=c391eb9cc29c';

const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const euro = value => new Intl.NumberFormat('en-IE', {style:'currency',currency:'EUR'}).format(value);
const choices = [['','Not confirmed'],['yes','Yes'],['no','No']];
const attr = (name, row) => row ? 'data-field="' + name + '"' : 'name="' + name + '"';
const select = (name, label, options, value = '', row = false) => '<label class="field">' + esc(label) + '<select ' + attr(name,row) + '>' + options.map(([id,text])=>'<option value="'+esc(id)+'"'+(String(value)===id?' selected':'')+'>'+esc(text)+'</option>').join('') + '</select></label>';
const num = (name, label, value = '', max = 1e7, row = false, step = '.01') => '<label class="field">' + esc(label) + '<input ' + attr(name,row) + ' type="number" min="0" max="'+max+'" step="'+step+'" value="'+esc(value)+'"></label>';
const text = (name, label, value = '', row = false, type = 'text') => '<label class="field">' + esc(label) + '<input ' + attr(name,row) + ' type="'+type+'" maxlength="100" value="'+esc(value)+'"></label>';
const confirm = (name, label, value, row = false) => select(name,label,choices,value,row);
const source = (key, label) => '<a class="biglink" href="'+esc(workbenchSources[key])+'" target="_blank" rel="noopener noreferrer">'+esc(label)+' ↗</a>';
const group = (name, content) => '<fieldset class="tw-group"><legend>'+esc(name)+'</legend><div class="formgrid">'+content+'</div></fieldset>';
const years = value => select('year','German tax year',[['2026','2026'],['2025','2025']],value || 2026);
const val = (o,k,fallback='') => o?.[k] ?? fallback;
const safeRows = (value, max) => Array.isArray(value) ? value.filter(x=>x && typeof x==='object' && !Array.isArray(x)).slice(0,max) : [];
const remove = label => '<button type="button" class="button secondary tw-remove" data-tw-remove aria-label="Remove '+esc(label)+'">Remove</button>';

function attendanceRow(row = {}) {
  return '<fieldset class="tw-record" data-tw-row="days"><legend>Workday</legend><div class="formgrid">' +
    text('date','Date',val(row,'date'),true,'date') + select('kind','Day classification',[
      ['office','First workplace'],['home','Qualifying home-working day'],['off','Leave / non-working day'],['travel-none','Domestic business travel — no meal allowance'],['travel-8','Domestic business travel — over 8 hours, no overnight'],['travel-full','Domestic business travel — full 24 hours away'],['travel-arrival','Domestic business travel — arrival/departure with overnight stay']
    ],val(row,'kind','office'),true) + '</div><div data-tw-travel class="formgrid">' +
    num('paid','Other eligible travel/hotel costs (€)',val(row,'paid',0),1e7,true) + num('km','Actual business kilometres — own car only',val(row,'km',0),5000,true) + num('refunded','Tax-free employer reimbursements for this day (€)',val(row,'refunded',0),1e7,true) +
    select('breakfast','Employer-provided breakfast?',[['no','No'],['yes','Yes']],val(row,'breakfast','no'),true) + select('lunch','Employer-provided lunch?',[['no','No'],['yes','Yes']],val(row,'lunch','no'),true) + select('dinner','Employer-provided dinner?',[['no','No'],['yes','Yes']],val(row,'dinner','no'),true) +
    '<p class="muted tw-wide">Use transport/hotel costs excluding meals, commuting and actual own-car running costs. The worksheet adds €0.30 per business km and the supported domestic meal allowance. Do not enter those amounts again as spending. Provided meals are treated as free; your own meal contributions, foreign trips and long-term accommodation limits require separate review.</p></div>' + remove('workday') + '</fieldset>';
}
function costRow(row = {}) {
  return '<fieldset class="tw-record" data-tw-row="costs"><legend>Work cost</legend><div class="formgrid">' +
    select('kind','Cost category',[['equipment','Work equipment'],['phone','Phone / internet'],['training','Education / training']],val(row,'kind','equipment'),true) + text('date','Purchase date (equipment) / payment date (other)',val(row,'date'),true,'date') +
    num('paid','Full gross purchase price / bills paid (€)',val(row,'paid'),1e7,true) + num('share','Documented professional use (%)',val(row,'share',100),100,true) + num('refunded','Employer reimbursement of professional costs (€)',val(row,'refunded',0),1e7,true) +
    confirm('evidence','Purpose, work share and invoice/payment evidence verified?',val(row,'evidence'),true) + '</div><div class="formgrid" data-tw-equipment>' +
    num('vat','VAT included in the full purchase price (%)',val(row,'vat',19),100,true) + select('method','Equipment treatment',[['standard','Ordinary equipment — €800 net threshold / straight line'],['digital','Verified qualifying computer hardware/software — one-year life']],val(row,'method','standard'),true) +
    num('life','Useful life from a verified depreciation schedule (years)',val(row,'life'),50,true,'1') + confirm('lifeVerified','Useful life, prior claims and stable work-share schedule verified?',val(row,'lifeVerified'),true) +
    '<p class="muted tw-wide">The €800 test uses the full asset price excluding VAT, before the work-use share. Above it, ordinary equipment is depreciated by purchase month. Qualifying computer hardware/software can use a one-year life and the accepted full purchase-year amount. Used assets, later changes and special depreciation need review.</p></div><div class="formgrid" data-tw-training>' +
    select('course','Course classification',[['','Choose a classification'],['subsequent','Subsequent degree / evidenced professional training'],['employment','Education within employment'],['initial','Initial education outside employment'],['general-language','General German-language course / unclear work purpose']],val(row,'course'),true) +
    '<p class="muted tw-wide">Initial education is kept separate as a special-expense candidate, capped at €6,000 across this worksheet. General language learning needs individual review. Phone/internet requires an evidenced work share; no automatic flat allowance is assumed.</p></div>' + remove('work cost') + '</fieldset>';
}
function recipientRow(row = {}) {
  return '<fieldset class="tw-record" data-tw-row="recipients"><legend>Parent</legend><div class="formgrid">' +
    num('income','Income + other receipts for the support period, after reviewed allowable costs (€)',val(row,'income'),1e7,true) +
    num('assets','Chargeable assets at market value (€)',val(row,'assets'),1e7,true) + num('grants','Public education/training grants for this period (€)',val(row,'grants',0),1e7,true) +
    '</div><p class="muted">Income includes pensions, interest, rent and relevant outside support under German rules. Do not enter gross pension as net income without reviewing applicable costs. The €180 costs allowance concerns qualifying receipts, not every income type, and is not reduced by the country factor; other expense allowances and period allocation need review. The usual €15,500 asset threshold is also not country-reduced; only a qualifying reasonable home and other recognised exemptions can be excluded.</p>' + remove('parent') + '</fieldset>';
}
function paymentRow(row = {}) {
  return '<fieldset class="tw-record" data-tw-row="payments"><legend>Support payment</legend><div class="formgrid">' +
    text('ref','Private payment reference (no account number)',val(row,'ref'),true) + text('date','Payment date',val(row,'date'),true,'date') + num('amount','Your maintenance payment excluding transfer fees (€)',val(row,'amount'),1e7,true) +
    confirm('bank','Transfer to a supported recipient account and receipt verified?',val(row,'bank'),true) + '</div>' + remove('support payment') + '</fieldset>';
}
function invoiceRow(row = {}) {
  return '<fieldset class="tw-record" data-tw-row="items"><legend>Household invoice / statement item</legend><div class="formgrid">' +
    text('ref','Private invoice / statement-line reference',val(row,'ref'),true) + text('date','Payment date / verified statement allocation date',val(row,'date'),true,'date') +
    select('kind','Classification',[['service','Household service — e.g. cleaning, gardening, caretaker'],['trade','Craft work — e.g. repair or renovation of existing home'],['excluded','Excluded — e.g. administration, utilities, materials-only']],val(row,'kind','service'),true) +
    num('total','Your total paid cost share (€)',val(row,'total'),1e7,true) + num('labour','Your eligible labour + travel/machine costs incl. VAT (€)',val(row,'labour'),1e7,true) + num('materials','Your materials share (€)',val(row,'materials',0),1e7,true) +
    num('refunded','Eligible labour reimbursed (€)',val(row,'refunded',0),1e7,true) + num('elsewhere','Eligible labour already used as another deduction/credit (€)',val(row,'elsewhere',0),1e7,true) +
    confirm('invoice','Invoice or eligible landlord/manager certificate verified?',val(row,'invoice'),true) + confirm('bank','Provider bank payment evidenced, directly or by manager?',val(row,'bank'),true) + confirm('eligible','Eligible service at the household confirmed?',val(row,'eligible'),true) +
    select('subsidy','Public subsidy / subsidised loan for craft-work measure?',[['','Not confirmed'],['no','No'],['yes','Yes']],val(row,'subsidy'),true) +
    '</div><p class="muted">Use your supported share from the invoice or Nebenkosten certificate. Materials, administration and consumption costs do not become labour costs. For service charges, verify the permitted payment/statement-year treatment with the manager; do not claim both years. Childcare eligible under §10 is excluded here, even if not claimed there.</p>' + remove('invoice item') + '</fieldset>';
}
const builders = {days:attendanceRow,costs:costRow,recipients:recipientRow,payments:paymentRow,items:invoiceRow};
const limits = {days:366,costs:128,recipients:2,payments:120,items:200};
const collection = (name, rows, label) => '<div data-tw-list="'+name+'">'+safeRows(rows,limits[name]).map(builders[name]).join('')+'</div><button type="button" class="button secondary" data-tw-add="'+name+'">'+esc(label)+'</button>';

function workForm(input) {
  return group('Year and annual commuting basis',years(input.year) + num('distance','One-way distance to first workplace (whole km)',val(input,'distance',0),1000,false,'1') + select('transport','Commuting transport',[['car','Own / provided car'],['public','Public transport only'],['other','Other single transport — €4,500 cap']],val(input,'transport','car')) + num('publicPaid','Annual actual public-transport cost, if applicable (€)',val(input,'publicPaid',0)) + num('commuteRefund','Verified tax-free/flat-taxed commuting benefits reducing this deduction (€)',val(input,'commuteRefund',0)) + num('otherEmployment','Other verified employment expenses, excluding every item below (€)',val(input,'otherEmployment',0))) +
    '<h3>Dated workdays</h3><p>One classification per date prevents overlapping office, home and travel claims. Split-day exceptions, mixed commuting modes, foreign travel and special disability rules need a separate calculation.</p>' + collection('days',input.days,'Add a workday') +
    group('Day eligibility',confirm('homeConditions','All home days meet the €6/day conditions; no first-workplace visit or duplicate room/accommodation claim?',input.homeConditions) + confirm('travelConditions','All meal days meet domestic duration/overnight and three-month rules; breaks and provided meals reviewed?',input.travelConditions)) +
    '<h3>Equipment, phone and training</h3><p>Keep each invoice separate. A prior-year ordinary asset needs its original cost, stable work use and reviewed straight-line schedule. Changes, disposals and special depreciation are outside this worksheet.</p>' + collection('costs',input.costs,'Add a work cost') +
    group('Before calculating',confirm('recordsVerified','Actual records, professional purpose, reimbursements and all other claims reconciled?',input.recordsVerified)) +
    '<p class="tw-source">'+source('employment','Employment expenses and domestic travel')+' · '+source('home','Home-working allowance')+' · '+source('equipment','Low-value asset threshold')+' · '+source('depreciation','Depreciation')+' · '+source('digital','Computer one-year guidance')+' · '+source('education','Initial education')+'</p>';
}
function parentsForm(input) {
  const months = Array.from({length:12},(_,i)=>[String(i+1),String(i+1)]);
  return '<p>Screen one parent, or two married parents sharing a household and support period. Prepare one Unterhaltserklärung for each parent; Anlage Unterhalt is the tax-return annex. This worksheet does not replace either form.</p>' +
    group('Year, country and period',years(input.year) + select('country','Recipients’ residence',[['india','India — one-quarter BMF group'],['germany','Germany — full amount'],['other','Other country — verified BMF group']],val(input,'country','india')) + select('factor','Factor for another country',[['1','Full'],['0.75','Three-quarters'],['0.5','Half'],['0.25','Quarter']],val(input,'factor','0.25')) + confirm('countryVerified','For another country: classification and year verified?',input.countryVerified) + select('start','First support month (1–12)',months,val(input,'start','1')) + select('end','Last support month (1–12)',months,val(input,'end','12')) + num('people','All people sharing the supported household pot',val(input,'people',1),30,false,'1') + num('otherDonors','Other unlimited-German-tax donors’ support to this household/period (€)',val(input,'otherDonors',0))) +
    '<h3>Each recipient</h3><p>All amounts are EUR under the applicable German conversion rules. For foreign income/receipts, review the end-September ECB reference rate from the preceding year (§33a). Do not use an arbitrary current transfer rate. Include non-German-tax donor support in recipient receipts, not in the donor-sharing field above.</p>' + collection('recipients',input.recipients,'Add a parent (maximum two)') +
    group('Recipient and period checks',confirm('marriedParents','If two parents: married, same household and same support period?',input.marriedParents) + confirm('eligibility','Legal entitlement, actual need, employment efforts/exemption and supporting declarations verified?',input.eligibility) + confirm('incomeVerified','Income, receipts, assets, grants, allowable costs and currency conversion reviewed for these months?',input.incomeVerified) + confirm('periodVerified','Need throughout these months and shared-pot/payment allocation verified; no cross-year advance claimed?',input.periodVerified)) +
    '<h3>Your dated payments</h3><p>The first positive payment sets the earliest support month. Keep transfer/receipt evidence privately. A late-year payment does not support earlier months or create a deduction in the next year.</p>' + collection('payments',input.payments,'Add a support payment') +
    group('Your affordability limit — Opfergrenze',num('donorNet','Verified disposable annual income for Opfergrenze (€), not gross salary or payslip net',val(input,'donorNet')) + num('familyReduction','Verified family reduction (percentage points, 0–25)',val(input,'familyReduction',0),25) + num('affordabilityUsed','Affordability limit already used by other maintenance claims (€)',val(input,'affordabilityUsed',0)) + confirm('donorVerified','Disposable-income calculation, family adjustment and standard Opfergrenze applicability verified?',input.donorVerified)) +
    '<p class="muted">Standard ceiling: 1% per full €500 of disposable income, at most 50%, less the verified family reduction (at most 25 percentage points). Review 5 points per relevant spouse/child, partial-year child adjustments, all supported people and prior claims. Business income, special shared-benefit households, basic health/care contribution additions and changing household circumstances need separate review.</p><p class="tw-source">'+source('maintenance','EStG §33a')+' · '+source('foreignSupport','BMF foreign-support examples and payment rules')+' · '+source('countries','Country groups from 2025')+' · '+source('assets','Recipient assets and need')+' · '+source('supportGeneral','Opfergrenze and disposable income')+'</p>';
}
function householdForm(input) {
  return '<p>Separate labour from materials on invoices and Nebenkosten certificates. This estimates a <b>direct reduction of assessed income tax</b>, not a deduction from income. The household limits apply across people, residences and all eligible invoices.</p>' +
    group('Year and shared annual limits',years(input.year) + num('limitShare','Your agreed share of annual household limits (%)',val(input,'limitShare',100),100) + num('priorService','Household-service tax credit already using your share (€)',val(input,'priorService',0)) + num('priorTrade','Craft-work tax credit already using your share (€)',val(input,'priorTrade',0)) + num('availableTax','Remaining assessed income tax after other reductions (€), optional',val(input,'availableTax')) + confirm('household','Qualifying EU/EEA household and supported services confirmed?',input.household) + confirm('allocation','Your cost share, household-wide limits, other residences and claims reconciled?',input.allocation)) +
    '<h3>Your invoices and statement items</h3><p>Use distinct private references for different statement lines. Do not repeat the same cost in the expense workspace, childcare, an extraordinary-expense claim or another energy/craft-work credit. Enter the labour portion used elsewhere below. No mini-job-employment credit is calculated.</p>' + collection('items',input.items,'Add an invoice / statement item') +
    '<div class="note">Household services: 20% of eligible labour, at most €4,000 per household/year. Craft work: 20%, at most €1,200. Cash, unverified evidence, materials and excluded items contribute no credit. Subsidised craft-work measures require separate review. The result also needs sufficient assessed tax; unused credit is not carried forward or paid out by this tool.</div><p class="tw-source">'+source('household','EStG §35a: conditions and separate limits')+'</p>';
}
const forms = {work:workForm,parents:parentsForm,household:householdForm};
const actions = () => '<div class="tw-actions"><button class="button" type="submit">Calculate preparation result</button><button class="button secondary" type="button" id="twSave" disabled>Save worksheet locally</button><button class="button secondary" type="button" id="twDownload" disabled>Download worksheet TXT</button><button class="button secondary" type="button" id="twLoad">Load saved year (replaces unsaved inputs)</button></div>';

export function workbenchPage(kind, state = {}) {
  if (!forms[kind]) return '';
  const saved = state.taxWorkbenches?.[kind]?.['2026'];
  const input = saved?.input && typeof saved.input==='object' ? saved.input : {};
  return '<section id="taxWorkbench" data-workbench="'+kind+'" aria-labelledby="twHeading"><div class="sectionhead"><h2 id="twHeading">'+workbenchLabels[kind]+'</h2><span class="pill">2025 / 2026 · Reviewed 14 Nov 2026</span></div>' +
    '<p class="muted">Entries stay in this browser. One saved worksheet per type/year; saving replaces that year’s worksheet. Saved worksheets are included in your local JSON backup and adviser TXT/print pack. Use Load saved year after selecting a year. No documents or financial inputs are sent to an AI or feedback service.</p>' +
    (saved ? '<p class="note">Saved inputs loaded. Recalculate after reviewing them; the previous result is not automatically treated as current.</p>' : '') +
    '<form id="twForm">'+forms[kind](input)+actions()+'</form>' +
    '<p id="twStatus" role="status" aria-live="polite"></p><div id="twResult" class="result" role="region" aria-label="Worksheet result" aria-live="polite" tabindex="-1">Add your records and run the check. A worksheet candidate is not an approved claim or a refund.</div><p><a class="biglink" href="#taxplan/export">Open adviser pack →</a> · <a class="biglink" href="#tax">Review expense workspace →</a></p><div class="note"><b>Avoid double counting.</b> Saving a worksheet does not add an expense. Its candidate can overlap with existing workspace records. Reconcile them before filing; do not sum the worksheet and those records.</div></section>';
}
function resultHTML(result) {
  const intro = '<h3>'+(result.supported?'Preparation result':'Review needed')+'</h3><p>'+esc(workbenchSummary(result))+'</p>';
  if (!result.supported) return '<h3>Review needed</h3><p>No claim-ready amount is displayed. Correct or review these conditions, then recalculate.</p><ul>'+result.issues.map(x=>'<li>'+esc(x)+'</li>').join('')+'</ul>';
  const stats = pairs => '<dl class="tw-stats">'+pairs.map(([label,value])=>'<div><dt>'+esc(label)+'</dt><dd>'+esc(value)+'</dd></div>').join('')+'</dl>';
  if (result.kind === 'work') return intro + stats([
    ['Dated days',result.office+' office · '+result.home+' home · '+result.travel+' travel'],['Commuting after reducing benefits',euro(result.commute)],['Home-working allowance',euro(result.homeAmount)],['Business travel after reimbursements',euro(result.business)],['Equipment depreciation / immediate amount',euro(result.equipment)],['Phone / internet professional share',euro(result.phone)],['Employment-related training',euro(result.training)],['Total employment-expense candidate',euro(result.employmentTotal)],['Above the €1,230 employee allowance',euro(result.extraAboveAllowance)],['Initial education — separate special-expense candidate',euro(result.initialEducation)]
  ]) + '<p>One employee’s annual allowance is used. Other employment expenses entered above are included once. Initial education is separate; neither category guarantees a tax effect or loss carryforward. Use a verified additional deduction in the existing 2026 tax-effect tool only after reconciliation.</p>';
  if (result.kind === 'parents') return intro + stats([
    ['Paid maintenance, excluding fees',euro(result.paid)],['Support months',result.months],['Country factor',result.factor],['Recipients / all household members',result.recipientCount+' / '+result.people],['Your payment allocated to these parents',euro(result.allocatedPaid)],['Country/month-adjusted combined ceiling',euro(result.ceiling)],['Adjusted income/receipts allowance',euro(result.allowance)],['Income / grant reduction',euro(result.incomeReduction)],['Your share among German-tax donors',(100*result.donorRatio).toFixed(2)+'%'],['Candidate before donor affordability',euro(result.beforeAffordability)],['Donor affordability ceiling',euro(result.affordability)+' ('+result.affordabilityPercent+'%)'],['Preliminary maintenance income deduction',euro(result.candidate)]
  ]) + '<p>Two married parents’ income and allowances are combined. Other household members reduce the payment allocation. This is not a tax refund, an accepted Unterhaltserklärung or a complete assessment. Basic health/care additions and special cases are outside this calculation.</p>';
  return intro + stats([
    ['Your total paid cost share',euro(result.paid)],['Materials — excluded from labour credit',euro(result.materialTotal)],['Unverified / excluded net labour',euro(result.excluded)],['Eligible household-service labour',euro(result.service)],['Eligible craft-work labour',euro(result.trade)],['Potential service credit after remaining limit',euro(result.serviceCredit)],['Potential craft-work credit after remaining limit',euro(result.tradeCredit)],['Combined potential direct credit',euro(result.potentialCredit)],['Against entered remaining assessed tax',result.appliedCredit===null?'Not assessed — tax liability not entered':euro(result.appliedCredit)]
  ]) + '<ul>'+result.lines.map(row=>'<li>'+esc(row.ref)+': '+euro(row.eligible)+' eligible labour'+(row.reason?' — '+esc(row.reason):'')+'</li>').join('')+'</ul><p>No unused amount is treated as refundable or carried forward. Wage-tax withholding is not the assessed-tax limit requested above.</p>';
}
function readRows(form, name) {
  return [...form.querySelectorAll('[data-tw-row="'+name+'"]')].map(row=>Object.fromEntries([...row.querySelectorAll('[data-field]')].map(field=>[field.dataset.field,field.value])));
}
export function worksheetText(snapshot) {
  return 'ATLASEVERYDAY — '+workbenchLabels[snapshot.result.kind].toUpperCase()+' WORKSHEET\nGerman tax year: '+snapshot.result.year+'\n'+workbenchSummary(snapshot.result)+'\n\nINPUTS (self-reported; keep supporting evidence privately)\n'+JSON.stringify(snapshot.input,null,2)+'\n\nCALCULATION / REVIEW\n'+JSON.stringify(snapshot.result,null,2)+'\n\nSaving this worksheet does not add an expense. Reconcile existing records; do not sum overlapping amounts.\n';
}
function download(text, name) {
  const url=URL.createObjectURL(new Blob([text],{type:'text/plain;charset=utf-8'})), a=document.createElement('a');
  a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
export function mountWorkbench({state,save}) {
  const root=document.getElementById('taxWorkbench'); if(!root)return;
  const form=root.querySelector('#twForm'), kind=root.dataset.workbench, out=root.querySelector('#twResult'), status=root.querySelector('#twStatus');
  const calculate={work:workExpenses,parents:parentSupport,household:householdServices}[kind];
  let snapshot=null;
  const invalidate=()=>{snapshot=null;root.querySelector('#twSave').disabled=true;root.querySelector('#twDownload').disabled=true;status.textContent='Inputs changed. Recalculate to update the result.';out.textContent='Inputs changed — the previous result is no longer current. Recalculate the worksheet.';};
  const visibility=()=>{
    for(const row of form.querySelectorAll('[data-tw-row="days"]')) row.querySelector('[data-tw-travel]').hidden=!row.querySelector('[data-field="kind"]').value.startsWith('travel');
    for(const row of form.querySelectorAll('[data-tw-row="costs"]')) {
      const type=row.querySelector('[data-field="kind"]').value;
      row.querySelector('[data-tw-equipment]').hidden=type!=='equipment';row.querySelector('[data-tw-training]').hidden=type!=='training';
    }
  };
  visibility();
  form.addEventListener('input',invalidate);
  form.addEventListener('change',()=>{invalidate();visibility();});
  form.addEventListener('submit',event=>{
    event.preventDefault();event.stopPropagation();snapshot=null;
    root.querySelector('#twSave').disabled=true;root.querySelector('#twDownload').disabled=true;
    try {
      const input=Object.fromEntries(new FormData(form));
      const names=kind==='work'?['days','costs']:kind==='parents'?['recipients','payments']:['items'];
      for(const name of names)input[name]=readRows(form,name);
      const result=calculate(input);snapshot={input,result};out.innerHTML=resultHTML(result);
      root.querySelector('#twSave').disabled=false;root.querySelector('#twDownload').disabled=false;
      status.textContent=result.supported?'Preparation result updated. Nothing has been saved yet.':'Review conditions listed below. You may save this review worksheet for your adviser.';
    }catch(error){out.textContent=error.message;status.textContent='Check the inputs and recalculate.';}
    out.focus();
  });
  root.addEventListener('click',event=>{
    const button=event.target.closest('button');if(!button)return;
    if(button.hasAttribute('data-tw-remove')) {button.closest('[data-tw-row]').remove();invalidate();return;}
    const name=button.dataset.twAdd;
    if(name&&builders[name]) {
      const target=form.querySelector('[data-tw-list="'+name+'"]');
      if(target.children.length>=limits[name]){status.textContent='This worksheet has reached its record limit.';return;}
      target.insertAdjacentHTML('beforeend',builders[name]());visibility();invalidate();target.lastElementChild.querySelector('input,select')?.focus();return;
    }
    if(button.id==='twSave'&&snapshot) {
      if(!state.taxWorkbenches||typeof state.taxWorkbenches!=='object'||Array.isArray(state.taxWorkbenches))state.taxWorkbenches={};
      if(!state.taxWorkbenches[kind]||typeof state.taxWorkbenches[kind]!=='object'||Array.isArray(state.taxWorkbenches[kind]))state.taxWorkbenches[kind]={};
      state.taxWorkbenches[kind][String(snapshot.result.year)]=JSON.parse(JSON.stringify(snapshot));save();status.textContent='Worksheet saved for '+snapshot.result.year+' on this device. Included in local backup and adviser TXT/print pack; no expense was added.';
    }
    if(button.id==='twDownload'&&snapshot)download(worksheetText(snapshot),'atlaseveryday-'+kind+'-'+snapshot.result.year+'.txt');
    if(button.id==='twLoad') {
      const selected=form.elements.namedItem('year').value, saved=state.taxWorkbenches?.[kind]?.[selected];
      if(!saved?.input){status.textContent='No saved '+selected+' worksheet of this type. Your inputs were kept.';return;}
      form.innerHTML=forms[kind](saved.input)+actions();visibility();invalidate();status.textContent='Saved '+selected+' inputs loaded. Review and recalculate before using any result.';form.elements.namedItem('year').focus();
    }
  });
}
