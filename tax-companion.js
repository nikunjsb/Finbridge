// Preparation guidance only: no ELSTER credentials, transmission or refund model.
const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const list = items => '<ul>' + items.map(item => '<li>' + esc(item) + '</li>').join('') + '</ul>';
const a = (href, label) => '<a href="' + esc(href) + '">' + esc(label) + '</a>';
export const companionSources = [
  ['ELSTER: free filing and prefilled information','https://www.elster.de/elsterweb/infoseite/privatpersonen'],
  ['ELSTER: employer and insurer certificates','https://www.elster.de/eportal/infoseite/belegabruf_%28privatpersonen%29'],
  ['ELSTER: 2025 education and employment guidance','https://www.elster.de/eportal/helpGlobal?themaGlobal=help_est_ufa_10_2025'],
  ['Employment and double-household rules — EStG §9','https://www.gesetze-im-internet.de/estg/__9.html'],
  ['Education and special expenses — EStG §10','https://www.gesetze-im-internet.de/estg/__10.html'],
  ['Single-parent conditions — EStG §24b','https://www.gesetze-im-internet.de/estg/__24b.html'],
  ['Minijob tax treatment','https://www.minijob-zentrale.de/DE/meta/faq-bereich/steuer/27_was_ist_die_einheitliche_pauschsteuer/faq_27_was_ist_die_einheitliche_pauschsteuer']
];
// These are overlapping circumstances, not tax-class assignments.
export const situationPaths = [
  ['student','Student / apprentice / working student','Guided preparation','Check education classification, employment taxation and study evidence.','#taxplan/student'],
  ['employee','Single employee','Guided preparation','Gather salary certificates, work costs and personal contributions.','#taxplan/work'],
  ['married','Married / registered partners','Preparation checklist','Review both incomes and assessment eligibility; a spouse abroad needs a separate check.','#taxplan/cases'],
  ['children','Parent / couple with children','Preparation checklist','Gather child residence, benefits, childcare and parental-benefit records.','#taxplan/childcare'],
  ['singleparent','Single mother / single father','Preparation checklist','Check qualifying children, household membership and dates for single-parent relief.','#taxplan/singleparent'],
  ['separated','Separated / divorcing','Preparation checklist','Record separation dates, maintenance and child arrangements; do not assign a tax class from marital status alone.','#taxplan/singleparent'],
  ['unmarried','Unmarried couple','Preparation checklist','Keep individual returns and allocation of child-related claims separate.','#taxplan/cases'],
  ['widowed','Widowed','Specialist review','Review the date of bereavement, assessment and time-limited payroll treatment.','#taxplan/cases'],
  ['moving','Arriving in / leaving Germany','Preparation checklist','Build a residence and worldwide-income timeline for the calendar year.','#taxplan/partyear'],
  ['abroad','Spouse / children / relatives abroad','Specialist review','Review residence, support, income and treaty evidence.','#taxplan/cross'],
  ['jobchange','Multiple jobs / job change / unemployment','Preparation checklist','Gather every salary certificate and benefit statement for the year.','#salary'],
  ['selfemployed','Freelancer / self-employed','Specialist review','Business profit, VAT and business filing are outside these employee journeys.','#taxplan/export'],
  ['retired','Retired / receiving a pension','Specialist review','Collect pension and insurer statements; pension-income assessment is outside these employee journeys.','#taxplan/export']
];
export const yearChanges = [['marriage','Marriage / partnership'],['separation','Separation / divorce'],['baby','Child born / household changed'],['move','Moved home / country'],['job','Job / income changed'],['bereavement','Bereavement'],['none','No changes'],['unknown',"I'm not sure"]];
const yn = [['unknown',"I'm not sure"],['yes','Yes'],['no','No']];
const choices = {
  year:[['2025','2025 — filing preparation'],['2026','2026 — preparation for a future return']],
  employment:[['unknown',"I'm not sure"],['employee','Employee / working student'],['mini','Flat-rate-taxed minijob confirmed by employer'],['individualmini','Minijob taxed using my tax class'],['none','No employment income'],['self','Self-employed / mixed business income']],
  education:[['unknown',"I'm not sure / not classified"],['none','Not studying'],['first','First education, no prior qualification, outside a training employment contract'],['later','Further study after a completed degree / qualifying vocational training'],['service','Education is part of a training employment contract']],
  withheld:yn,
  residence:[['unknown',"I'm not sure"],['full','Germany throughout the year, no foreign income indicated'],['cross','Arrival / departure / foreign income or residence']],
  taxclass:[['unknown',"I'm not sure"],...['I','II','III','IV','IV with factor','V','VI'].map(x=>[x,x])],
  firstworkplace:yn, overnight:yn, mainhome:yn, contributes:yn, reimbursements:yn,
  liquidity:[['unknown',"I'm not sure"],['accessible','Keep money accessible'],['retirement','Some retirement lock-in acceptable']]
};
const labels = {year:'German tax year',employment:'How is your employment taxed?',education:'Education classification',withheld:'Income tax (Lohnsteuer) withheld on your salary certificate?',residence:'Residence and income during this tax year',taxclass:'Payroll tax class — if known',firstworkplace:'Is the distant workplace your first workplace (erste Tätigkeitsstätte)?',overnight:'Do you keep accommodation near that workplace?',mainhome:'Do you maintain your own main household elsewhere?',contributes:'Do you financially contribute to that main household?',reimbursements:'Has an employer reimbursed any related costs?',liquidity:'Access to future investment money'};
const select = key => '<label class="field">' + esc(labels[key]) + '<select name="' + key + '">' + choices[key].map(([value,label])=>'<option value="'+esc(value)+'">'+esc(label)+'</option>').join('') + '</select></label>';
const checkGroup = (name, legend, items) => '<fieldset class="companion-options"><legend>'+esc(legend)+'</legend><div class="companion-choices">'+items.map(([id,label])=>'<label class="check"><input type="checkbox" name="'+name+'" value="'+esc(id)+'"> '+esc(label)+'</label>').join('')+'</div></fieldset>';
const selected = (values, allowed) => [...new Set((Array.isArray(values) ? values : []).filter(x=>allowed.includes(x)))];
export function buildCompanionPlan(raw = {}) {
  const input = {};
  for (const key of Object.keys(choices)) input[key] = choices[key].some(([v])=>v===raw[key]) ? raw[key] : (key==='year'?'2025':'unknown');
  const situations=selected(raw.situations,situationPaths.map(x=>x[0]));
  const changes=selected(raw.changes,yearChanges.map(x=>x[0]));
  if(changes.includes('none') && changes.length>1) throw Error('Choose either “No changes” or the changes that apply.');
  const number = (key,min,max) => {
    if(raw[key]===undefined || raw[key]==='') return null;
    const value=Number(raw[key]);
    if(raw[key]===null || !Number.isFinite(value)||value<min||value>max||(key==='horizon'&&!Number.isInteger(value))) throw Error('Check '+(key==='budget'?'the annual investment budget':'the investment horizon')+'.');
    return value;
  };
  const budget=number('budget',0,1000000), horizon=number('horizon',1,60);
  const questions=[];
  if(!situations.length) questions.push('Choose any situations that fit, or use the general checklist until you know.');
  if(!changes.length || changes.includes('unknown')) questions.push('Confirm what changed during the year and keep the effective dates.');
  if(input.employment==='unknown') questions.push('Check your employment tax treatment with payroll; a 20-hour week does not settle this.');
  if(input.withheld==='unknown') questions.push('Find “Einbehaltene Lohnsteuer” on each annual salary certificate.');
  if(input.residence==='unknown') questions.push('Confirm German residence dates and whether any foreign income arose.');
  const review=[];
  if(input.residence==='cross'||situations.includes('abroad')||situations.includes('moving')) review.push('Cross-border assessment is not calculated here. Keep foreign income/tax and residence evidence for individual review.');
  if(input.employment==='self'||situations.includes('selfemployed')) review.push('Business-income assessment requires a separate workflow; do not use employee worksheets as a complete business return.');
  for(const id of ['widowed','retired']) if(situations.includes(id)) review.push(situationPaths.find(x=>x[0]===id)[3]);
  if(situations.includes('singleparent')) questions.push('Check child eligibility, other adults in the household and qualifying months; class II is not automatic.');
  if(situations.includes('separated')) questions.push('Confirm the date of permanent separation and the year-specific assessment position.');
  const student=situations.includes('student')||['first','later','service'].includes(input.education);
  let education='Not selected';
  if(student){
    if(input.education==='first') education='First education outside training employment: review special expenses, generally limited to €6,000 for the payment year. This category does not create a loss carryforward.';
    else if(['later','service'].includes(input.education)) education='Review study costs as employment expenses where the professional connection and classification qualify. A future loss carryforward needs an overall qualifying loss and loss determination; expenses alone do not establish one.';
    else {education='Education classification unresolved. Check previous completed qualifications and whether the course is part of training employment before choosing a category.';questions.push(education);}
  }
  const wage=input.employment==='mini'?'A confirmed flat-rate-taxed minijob is excluded from your personal income-tax assessment; its flat-rate tax is not claimed back through this return.':input.withheld==='no'?'No salary tax withheld is indicated. That alone creates no wage-tax refund; other tax payments, income and eligible loss treatment still need review.':'Reconcile annual gross salary and tax withheld against prefilled certificates. A refund depends on the full assessment, not weekly working hours.';
  const commuter=situations.includes('employee')||['employee','individualmini'].includes(input.employment)||raw.commuter===true;
  const householdKeys=['firstworkplace','overnight','mainhome','contributes'];
  const householdSelected=householdKeys.some(k=>input[k]!=='unknown');
  const household=householdKeys.some(k=>input[k]==='no')?'Not established by these answers. Review ordinary commuting or business-travel rules as appropriate; travelling between cities alone is insufficient.':householdKeys.every(k=>input[k]==='yes')?'Potentially relevant, subject to the professional reason, location and evidence. Use the second-household guide; this is not an eligibility approval.':'Unresolved: confirm first workplace, accommodation near work, an own main household and financial participation before claiming double-household costs.';
  if(commuter && householdSelected && householdKeys.some(k=>input[k]==='unknown')) questions.push('Complete the second-household eligibility questions if you have work accommodation away from home.');
  if(commuter && householdSelected && input.reimbursements==='unknown') questions.push('Check employer reimbursements before calculating net work costs.');
  return {input,situations,changes,budget,horizon,questions,review,student,commuter,education,wage,household,householdSelected};
}
const commonSteps = [
  ['Choose the year and collect records','Use every employer’s annual Lohnsteuerbescheinigung, insurer certificates and relevant benefit statements. Keep marriage, residence and household-change dates.'],
  ['Use your own Mein ELSTER account','Registration and certificate retrieval are handled directly by ELSTER. Retrieve prefilled employer/insurer data and check it against your documents; never add the same amounts twice.'],
  ['Prepare the relevant sections','Use the German section names below to navigate, then read the official help for your chosen year. This companion does not determine every required form or filing obligation.'],
  ['Review and submit yourself','Check reimbursements, duplicated days/costs and completeness. Use ELSTER’s validation and provisional calculation, review errors, submit in your own account and keep the submission record.'],
  ['Check the tax notice later','Compare the Steuerbescheid with the submitted figures and investigate differences. Keep evidence available; follow any Finanzamt request and applicable deadline.']
];
function mappings(plan){
  const rows=[['Salary and wage tax, if individually taxed employment applies','Anlage N — Lohnsteuerbescheinigung','Annual employer certificate; check imported gross pay and withheld tax.'],['Health, care and pension contributions','Anlage Vorsorgeaufwand','Annual insurer/payroll certificates; reconcile imported contributions and refunds.']];
  if(plan.student) rows.push(['Education costs',plan.input.education==='first'?'Anlage Sonderausgaben — Berufsausbildung': ['later','service'].includes(plan.input.education)?'Anlage N — Werbungskosten / Fortbildungskosten':'Category unresolved — classify education first','Course invoices, books, equipment work/study-use allocation, dated travel and grants/reimbursements.']);
  if(plan.commuter) rows.push(['Work journeys and work costs','Anlage N — Werbungskosten','Dated office/home/business-trip log, one-way distance where applicable and employer reimbursements.']);
  if(plan.commuter && plan.householdSelected) rows.push(['Qualifying second household','Anlage N-Doppelte Haushaltsführung','Main-home and cost-participation evidence, work accommodation invoices, workplace assignment and actual home-trip dates.']);
  if(plan.situations.some(x=>['children','singleparent'].includes(x))) rows.push(['Child-related entries','Anlage Kind','Child details, residence/household dates, benefit notices and childcare invoices/bank evidence.']);
  return rows;
}
function textPlan(plan){
  return ['AtlasEveryday — self-filing preparation / '+plan.input.year,'Preparation only; no return submitted, refund calculated or eligibility approved.','Selected situations: '+(plan.situations.map(id=>situationPaths.find(p=>p[0]===id)[1]).join('; ')||'Not sure'), 'Year changes: '+(plan.changes.map(id=>yearChanges.find(x=>x[0]===id)[1]).join('; ')||'Unanswered'),...Object.keys(choices).map(k=>labels[k]+': '+choices[k].find(([v])=>v===plan.input[k])[1]),'YOUR ROUTES',...plan.situations.map(id=>{const row=situationPaths.find(x=>x[0]===id);return row[1]+' — '+row[2]+': '+row[3];}),'NEXT STEPS',...commonSteps.map(([h,t])=>h+': '+t),'DOCUMENTS AND GERMAN SECTIONS',...mappings(plan).map(r=>r.join(' — ')),...(plan.student?['STUDENT PATH',plan.education,plan.wage]:[]),...(plan.commuter?['COMMUTING PATH',plan.household,'Do not add fuel again for a journey covered by the distance allowance. Reconcile reimbursements.']:[]),'QUESTIONS TO RESOLVE',...plan.questions,'INDIVIDUAL REVIEW',...plan.review,'FUTURE INVESTMENT COMPARISON — REQUIREMENTS ONLY','Annual contribution budget: '+(plan.budget===null?'Unanswered':plan.budget+' EUR'),'Horizon: '+(plan.horizon===null?'Unanswered':plan.horizon+' years'),'No tax ranking or automatic allocation is calculated in this release.','SOURCES / reviewed 14 November 2026',...companionSources.map(x=>x.join(': '))].join('\n\n');
}
export function companionPlanText(raw){return textPlan(buildCompanionPlan(raw));}
export function companionResultsHTML(raw){
  const p=buildCompanionPlan(raw);
  return '<h3>Your self-filing preparation plan — '+p.input.year+'</h3><p><b>No refund calculated or return submitted.</b> '+(p.input.year==='2026'?'2026 is still in progress: prepare records now and recheck the final filing forms when available.':'Use the 2025 official help and verify the final entries before filing.')+'</p><p><b>Your situations:</b> '+esc(p.situations.map(id=>situationPaths.find(x=>x[0]===id)[1]).join(' · ')||'Not sure / general checklist')+'</p><p><b>Changes:</b> '+esc(p.changes.map(id=>yearChanges.find(x=>x[0]===id)[1]).join(' · ')||'Not answered')+'. Keep the effective dates with your documents.</p>'+
    '<h4>Your selected routes and coverage</h4><ul>'+p.situations.map(id=>{const row=situationPaths.find(x=>x[0]===id);return '<li><b>'+esc(row[1])+' · '+esc(row[2])+'</b><p>'+esc(row[3])+' '+a(row[4],'Open relevant guidance')+'</p></li>';}).join('')+'</ul>'+
    (p.questions.length?'<div class="note"><h4>Resolve these questions first</h4>'+list(p.questions)+'</div>':'')+(p.review.length?'<div class="note"><h4>Individual review needed</h4>'+list(p.review)+'</div>':'')+
    '<ol>'+commonSteps.map(([h,t])=>'<li><b>'+esc(h)+'</b><p>'+esc(t)+'</p></li>').join('')+'</ol>'+
    '<h4>Documents and German section names</h4><p>Section-level navigation, not verified line numbers. Select the same tax year in ELSTER; 2026 final forms must be rechecked.</p><div class="companion-table"><table><thead><tr><th scope="col">What you prepare</th><th scope="col">German section to look for</th><th scope="col">Where to find it / evidence</th></tr></thead><tbody>'+mappings(p).map(row=>'<tr>'+row.map(v=>'<td>'+esc(v)+'</td>').join('')+'</tr>').join('')+'</tbody></table></div>'+
    (p.student?'<section class="card"><h4>Working-student journey</h4>'+list([p.education,p.wage,'A 20-hour working week does not decide income-tax treatment. Separate work and study travel, grants, reimbursements and private use; never count one cost twice.'])+'<p>'+a('#taxplan/work','Prepare classified costs in the work worksheet')+' · '+a('#taxplan/student','Review education guidance')+'</p></section>':'')+
    (p.commuter?'<section class="card"><h4>Commuting and overnight-accommodation journey</h4>'+list([p.householdSelected?p.household:'No second-household facts provided. Use the work-expense worksheet for ordinary work costs; answer the away-from-home questions only if relevant.','Keep ordinary commuting, business trips and family home journeys separate. For qualifying double-household relief, generally one actual home journey per week is considered; domestic accommodation has a €1,000 monthly ceiling.','Do not add fuel again for a journey already covered by the distance allowance. Net off employer reimbursements and avoid duplicate home/office days.','The detailed relocation, meals and furnishing extension remains pending. Do not treat the existing illustration as a complete second-household assessment.'])+'<p>'+a('#doublehousehold','Review main-home and second-household evidence')+' · '+a('#taxplan/work','Prepare work-expense records')+'</p></section>':'')+
    '<p>'+a('#taxplan/export','Existing expense and worksheet pack')+' · '+a('#taxclasses','Understand payroll tax classes')+' · '+a('#taxplan/household','Household-services checks')+'</p><h4>Your future comparison brief</h4><p>Annual contribution budget: '+(p.budget===null?'not answered':esc(p.budget)+' EUR')+' · horizon: '+(p.horizon===null?'not answered':esc(p.horizon)+' years')+' · access: '+esc(choices.liquidity.find(([v])=>v===p.input.liquidity)[1])+'. These are planning preferences; no investment allocation or tax saving is calculated.</p>';
}
export const companionExamples = {
  student:{year:'2025',situations:['student'],changes:['job'],employment:'employee',education:'later',withheld:'yes',residence:'full',taxclass:'I'},
  commuter:{year:'2025',situations:['employee'],changes:['none'],employment:'employee',education:'none',withheld:'yes',residence:'full',taxclass:'I',firstworkplace:'yes',overnight:'yes',mainhome:'yes',contributes:'yes',reimbursements:'no'}
};
export function companionPage(){
  return '<div id="taxCompanion"><h2>Find your situation · prepare your own return</h2><p>Answer in English, recognise the German form names and gather your records before filing yourself in free Mein ELSTER. Choose all situations that fit. Tax class is checked separately; having children does not automatically change a married couple’s class.</p><div class="note">This guide organises your preparation. It does not log in to ELSTER, upload documents, submit returns, approve claims or calculate a refund. Answers stay in this page until you leave or reset; download a copy if you want to keep them.</div><div class="row companion-actions"><button type="button" class="button secondary" data-companion-example="student">Try working-student example</button><button type="button" class="button secondary" data-companion-example="commuter">Try commuting example</button></div><p class="muted">Examples replace the answers below with fictional facts. Check every answer for your own circumstances.</p><form id="companionForm" class="card"><div class="formgrid">'+select('year')+select('taxclass')+'</div>'+checkGroup('situations','1. Which situations fit you? Select all that apply; leave blank if unsure.',situationPaths)+checkGroup('changes','2. What changed during the tax year?',yearChanges)+'<h3>3. Income, residence and study</h3><div class="formgrid">'+['employment','withheld','residence','education'].map(select).join('')+'</div><details class="card"><summary><b>4. Working away from your main home?</b></summary><p>Complete these if you keep accommodation near work; otherwise leave them unanswered. Two cities alone do not establish double-household relief.</p><div class="formgrid">'+['firstworkplace','overnight','mainhome','contributes','reimbursements'].map(select).join('')+'</div></details><h3>5. Future investment comparison — optional preferences</h3><p>Define what you would like to compare. This release prepares the brief; it does not optimise contributions or estimate investment tax relief.</p><div class="formgrid"><label class="field">Annual contribution budget (€)<input type="number" name="budget" min="0" max="1000000" step="0.01" placeholder="Optional"></label><label class="field">Investment horizon (years)<input type="number" name="horizon" min="1" max="60" step="1" placeholder="Optional"></label>'+select('liquidity')+'</div><div class="row companion-actions"><button class="button" type="submit">Build my preparation plan</button><button class="button secondary" type="reset">Clear answers</button></div></form><div id="companionResult" class="result" role="region" aria-label="Your self-filing preparation plan" aria-live="polite" tabindex="-1">Choose your circumstances or try an example to build a plan.</div><button type="button" class="button secondary" id="companionDownload" hidden>Download my preparation plan (TXT)</button><p id="companionStatus" aria-live="polite"></p><details class="card"><summary><b>All situations and current coverage</b></summary><p>Guided preparation is available for working students and commuting employees. Other routes connect to existing checklists or flag individual review; they are not complete return assessments.</p>'+situationPaths.map(([,label,status,body,href])=>'<h4>'+esc(label)+' · '+esc(status)+'</h4><p>'+esc(body)+' '+a(href,'Open relevant guidance')+'</p>').join('')+'</details><details class="card"><summary><b>What the future investment comparison will show</b></summary>'+list(['Baseline: verified tax year, household assessment, taxable income after existing deductions, reimbursements and allowances; salary and tax class alone are insufficient.','Affordability: household spending, debt, emergency reserves, existing contributions, horizon, liquidity and risk preferences.','Compare ordinary ETFs, eligible employer/private retirement routes, rental property and physical gold using their distinct tax treatment.','Show incremental tax saving, subsidy, out-of-pocket cost, capital needed, fees, lock-in, later taxes and projected after-tax wealth under stated scenarios.','A highest-estimated-tax-saving search must respect eligibility, contribution limits and the budget. Compare equal net personal cost, accounting for payroll effects and employer contributions.','Refund estimates also require withholding and the rest of the assessment. A tax saving or tax deferral is not a guaranteed refund or investment return.'])+'<p>'+a('#invest','Use the existing before-tax investment planner')+'</p></details><details class="card"><summary><b>Official sources · reviewed 14 November 2026</b></summary><ul>'+companionSources.map(([label,url])=>'<li><a href="'+esc(url)+'" target="_blank" rel="noopener noreferrer">'+esc(label)+' ↗</a></li>').join('')+'</ul><p>The education/form help linked here is for 2025; final 2026 field mappings are not verified. Follow official year-specific help before filing.</p></details><p>'+a('#feedback','Something unclear or missing? Give feedback')+'</p></div>';
}
export function mountCompanion(){
  const root=document.getElementById('taxCompanion');
  if(!root) return;
  const form=root.querySelector('#companionForm'), result=root.querySelector('#companionResult'), download=root.querySelector('#companionDownload'), status=root.querySelector('#companionStatus');
  let current=null;
  const read = () => {const f=new FormData(form); return {...Object.fromEntries(f),situations:f.getAll('situations'),changes:f.getAll('changes')};};
  const invalidate = () => {current=null; download.hidden=true;result.textContent='Answers changed. Build your preparation plan again to update the guidance.';status.textContent='';};
  form.addEventListener('input',invalidate);
  form.addEventListener('change',invalidate);
  form.addEventListener('reset',()=>{current=null;download.hidden=true;result.textContent='Answers cleared. Build a new plan when ready.';status.textContent='';});
  form.addEventListener('submit',event=>{event.preventDefault();event.stopPropagation();try{const raw=read();result.innerHTML=companionResultsHTML(raw);current=companionPlanText(raw);download.hidden=false;status.textContent='Preparation plan generated. Nothing has been saved or submitted.';}catch(error){current=null;download.hidden=true;result.textContent=error.message;}result.focus();});
  root.addEventListener('click',event=>{
    const button=event.target.closest('[data-companion-example]');
    if(button){form.reset();const example=companionExamples[button.dataset.companionExample];if(!example)return;for(const [key,value] of Object.entries(example)){if(Array.isArray(value)) form.querySelectorAll('[name="'+key+'"]').forEach(el=>{el.checked=value.includes(el.value);});else form.elements.namedItem(key).value=value;}form.querySelector('details').open=button.dataset.companionExample==='commuter';form.requestSubmit();status.textContent='Fictional '+(button.dataset.companionExample==='student'?'working-student':'commuting')+' example loaded. Replace its answers before using this for yourself.';}
    if(event.target===download && current){const url=URL.createObjectURL(new Blob([current],{type:'text/plain;charset=utf-8'}));const anchor=document.createElement('a');anchor.href=url;anchor.download='AtlasEveryday-self-filing-'+form.elements.year.value+'.txt';anchor.click();setTimeout(()=>URL.revokeObjectURL(url),1000);status.textContent='Preparation plan downloaded to your device.';}
  });
}
