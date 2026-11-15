// Bounded 2026 employee preparation model. Values are candidates, never filing decisions.
export const relocationSources = {
  law:'https://www.gesetze-im-internet.de/estg/__9.html',
  household:'https://esth.bundesfinanzministerium.de/lsth/2026/A-Einkommensteuergesetz/II-Einkommen-2-24b/4-Ueberschuss-d-Einnahmen-ueber-die-Werbungsk-8-9a/Paragraf-9/inhalt.html',
  travel:'https://lsth.bundesfinanzministerium.de/lsth/2026/B-Anhaenge/Anhang-14/anhang-14.html',
  meals:'https://esth.bundesfinanzministerium.de/lsth/2026/B-Anhaenge/Anhang-25/III/inhalt.html',
  moving:'https://esth.bundesfinanzministerium.de/lsth/2026/A-Einkommensteuergesetz/II-Einkommen-2-24b/4-Ueberschuss-d-Einnahmen-ueber-die-Werbungsk-8-9a/Paragraf-9/r-9-9.html',
  furniture:'https://www.bundesfinanzhof.de/de/entscheidung/entscheidungen-online/detail/STRE201910106/',
  assets:'https://www.gesetze-im-internet.de/estg/__6.html',
  depreciation:'https://www.gesetze-im-internet.de/estg/__7.html',
  forms:'https://www.elster.de/eportal/helpGlobal?themaGlobal=help_est_ufa_10_2025'
};
const cents = n => Math.round((n + Number.EPSILON) * 100) / 100;
const object = v => v !== null && typeof v === 'object' && !Array.isArray(v) && (Object.getPrototypeOf(v) === Object.prototype || Object.getPrototypeOf(v) === null);
function number(v, label, max=1000000) {
  if (!['number','string'].includes(typeof v) || (typeof v==='string'&&!/^\d+(?:\.\d+)?$/.test(v)) || String(v).trim()==='' || !Number.isFinite(Number(v)) || Number(v)<0 || Number(v)>max) throw Error('Check '+label+'. Use a finite, non-negative amount.');
  return Number(v);
}
function choice(v, values, label) { if(typeof v!=='string'||!values.includes(v)) throw Error('Check '+label+'.'); return v; }
function date(v,label) {
  if(typeof v!=='string'||!/^20\d\d-\d\d-\d\d$/.test(v)||!Number.isFinite(Date.parse(v+'T00:00:00Z'))||new Date(v+'T00:00:00Z').toISOString().slice(0,10)!==v) throw Error('Enter a real '+label+'.');
  return v;
}
function reference(v) { if(v===undefined)return '';if(typeof v!=='string'||v.length>180||/[\u0000-\u001f\u007f]/.test(v))throw Error('Use an evidence reference up to 180 characters.');return v.trim(); }
const yn = (v,label) => choice(v??'', ['','yes','no'],label);
const arrays = {housing:12,trips:60,meals:120,furniture:60,moves:60};
export function validateRelocationInput(raw) {
  if(!object(raw)||!['number','string'].includes(typeof raw.year)||String(raw.year)!=='2026')throw Error('This worksheet calculates German tax year 2026 only.');
  const x={year:2026};
  for(const k of ['own','centre','participation','job','near','germany','duplicates','moveJob','germanIncome','mealWindow'])x[k]=yn(raw[k],k);
  x.mainCountry=choice(raw.mainCountry??'de',['de','in','other'],'main household country');
  x.start=date(raw.start,'arrangement start date');x.end=date(raw.end,'arrangement end date');
  if(x.start>x.end||x.start>'2026-12-31'||x.end<'2026-01-01'||x.end>'2026-12-31')throw Error('The arrangement must intersect 2026 and end by 31 December 2026. Split later years into separate records.');
  x.mealStart=raw.mealStart?date(raw.mealStart,'meal-clock start date'):x.start;
  if(x.mealStart>x.start)throw Error('The meal clock cannot begin after this arrangement starts. Earlier work at the same location can use up the period. Restarts need separate review.');
  for(const [kind,max] of Object.entries(arrays)) {
    const rows=raw[kind]??[];if(!Array.isArray(rows)||rows.length>max)throw Error('Too many or invalid '+kind+' rows.');
    x[kind]=rows.map((r,i)=>{
      if(!object(r))throw Error('Invalid '+kind+' row.');
      const out={};const label=kind+' row '+(i+1);
      if(kind==='housing') {
        if(typeof r.month!=='string'||!/^2026-(0[1-9]|1[0-2])$/.test(r.month))throw Error('Use a 2026 housing month.');out.month=r.month;
      }else {out.date=date(r.date,label+' date');if(!out.date.startsWith('2026-'))throw Error('All expense/travel dates must be in 2026.');}
      if(kind!=='meals') {out.paid=number(r.paid,label+' spending');out.refunded=number(r.refunded,label+' reimbursements');out.ref=reference(r.ref);if(out.refunded>out.paid&&kind!=='trips')throw Error('Reimbursement exceeds spending in '+label+'. Review employer-paid costs separately.');}
      if(kind==='trips') {
        out.until=date(r.until,label+' return/end date');if(out.until<out.date||!out.until.startsWith('2026-'))throw Error('Check the trip end date; cross-year trips need separate review.');
        out.purpose=choice(r.purpose,['home','first','last'],label+' purpose');out.mode=choice(r.mode,['car','rail','air','company'],label+' transport');
        out.km=number(r.km,label+' full one-way land kilometres',20000);if(!Number.isInteger(out.km))throw Error('Enter full land kilometres.');
      }
      if(kind==='meals') {
        out.kind=choice(r.kind,['full','arrival','over8','none'],label+' meal day');out.refunded=number(r.refunded,label+' meal reimbursement');
        for(const meal of ['breakfast','lunch','dinner']) {out[meal]=choice(r[meal]??'no',['yes','no'],label+' '+meal);out[meal+'Own']=number(r[meal+'Own']??0,label+' own meal payment',1000);}
      }
      if(kind==='furniture') {out.vat=choice(String(r.vat),['19','7','0'],label+' invoice VAT');out.years=number(r.years,label+' useful life',30);if(!Number.isInteger(out.years))throw Error('Use whole useful-life years (0 for an immediate item).');out.necessary=yn(r.necessary,label+' necessity / independent use');}
      if(kind==='moves') {out.kind=choice(r.kind,['removal','travel','rental-broker','other','deposit','purchase','furnishing','flat'],label+' move cost');out.double=yn(r.double,label+' double-household connection');out.direction=choice(r.direction,['domestic','inbound','outbound'],label+' move direction');}
      return out;
    });
  }
  return x;
}
function isoWeek(s) {const d=new Date(s+'T00:00:00Z');d.setUTCDate(d.getUTCDate()+4-(d.getUTCDay()||7));const first=new Date(Date.UTC(d.getUTCFullYear(),0,1));return d.getUTCFullYear()+'-'+Math.ceil((((d-first)/86400000)+1)/7);}
export function mealWindowEnd(start) {date(start,'meal clock');const d=new Date(start+'T00:00:00Z'),month=d.getUTCMonth()+3;let end=new Date(Date.UTC(d.getUTCFullYear(),month,d.getUTCDate()));if(end.getUTCMonth()!==month%12)end=new Date(Date.UTC(d.getUTCFullYear(),month+1,1));return end.toISOString().slice(0,10);}
export function relocationCalculation(raw, context={}) {
  const x=validateRelocationInput(raw),issues=[],lines=[],groups={housing:0,trips:0,meals:0,furniture:0,moves:0};
  const gated=['own','centre','participation','job','near','germany'].filter(k=>x[k]!=='yes');
  const eligible=gated.length===0, unique=x.duplicates==='yes';
  if(!eligible)issues.push('Double-household conditions are not all confirmed: '+gated.join(', ')+'. Related costs are excluded from the candidate.');
  if(!unique)issues.push('Review duplicates against commuting, business travel, work equipment and all other worksheets before combining amounts.');
  if(x.mainCountry!=='de')issues.push('A main household abroad does not itself disqualify you. Retain household, financial participation and centre-of-life evidence; cross-border tax status needs review.');
  const inPeriod=d=>d>=x.start&&d<=x.end;
  const seenRefs=new Set(), weeks=new Set(), housingMonths=new Set(), mealDates=new Set();
  let first=0,last=0;const intervals=[];
  const add=(kind,row,description,gross,candidate,reason='')=>{lines.push({kind,date:row.month||row.date,reference:row.ref||'',description,spending:kind==='trips'&&row.mode==='car'?null:row.paid??null,gross:cents(gross),reimbursement:row.refunded,candidate:cents(candidate),reason});groups[kind]+=candidate;};
  for(const kind of Object.keys(arrays))for(const r of x[kind])if(r.ref){const key=r.ref.toLowerCase();if(seenRefs.has(key))throw Error('Repeated evidence reference: split a shared bill with distinct item references, or remove the duplicate.');seenRefs.add(key);}
  for(const r of x.housing) {
    if(housingMonths.has(r.month))throw Error('Combine accommodation bills into one row per month.');housingMonths.add(r.month);
    if(r.month<x.start.slice(0,7)||r.month>x.end.slice(0,7))throw Error('Housing month is outside the arrangement.');
    add('housing',r,'German second-accommodation costs',Math.min(r.paid,1000),eligible?Math.max(0,Math.min(r.paid,1000)-r.refunded):0,eligible?'Monthly cap before tax-free employer reimbursement.':'Eligibility not confirmed.');
  }
  if(x.housing.some(r=>r.paid>1000))issues.push('This conservative calculation caps each recorded month separately. Review unused €1,000 limits across eligible months in the same year with an adviser; no carry-forward between years is calculated.');
  for(const r of x.trips) {
    if(!inPeriod(r.date)||!inPeriod(r.until))throw Error('Trip is outside the arrangement dates.');
    if(intervals.some(([a,b])=>r.date<=b&&r.until>=a))throw Error('Travel dates overlap. Record one complete home trip, including its return, once.');intervals.push([r.date,r.until]);
    if(r.purpose==='home') {const week=isoWeek(r.date);if(weeks.has(week))throw Error('More than one home trip starts in the same ISO week. Review the weekly limit.');weeks.add(week);}
    if(r.purpose==='first'&&++first>1||r.purpose==='last'&&++last>1)throw Error('Use at most one first and one final journey in this arrangement.');
    if(r.purpose!=='home'&&r.until!==r.date)throw Error('Enter the first/final one-way journey date once. Multi-day journeys need separate review.');
    if(r.purpose==='first'&&r.date!==x.start||r.purpose==='last'&&r.date!==x.end)throw Error('First/final journey must match the arrangement start/end date.');
    if(r.mode==='company'){add('trips',r,r.purpose+' journey — employer vehicle',0,0,'Excluded: employer-provided vehicle requires separate review.');continue;}
    if(r.mode==='car'&&r.paid!==0)throw Error('For own-car journeys enter zero ticket spending; the model uses the kilometre basis, not fuel bills.');
    if(r.mode==='rail'&&r.purpose==='home'&&r.km===0&&r.paid>0)throw Error('Weekly rail home trips use one-way distance, not the ticket price.');
    if(r.purpose!=='home'&&r.mode!=='car'&&r.km!==0)throw Error('First/final air or rail journeys use actual tickets only here. Record any separately assessed feeder travel outside this model.');
    const gross=r.purpose==='home' ? r.km*.38+(r.mode==='air'?r.paid:0) : r.mode==='car'?r.km*.30:r.paid;
    add('trips',r,r.purpose+' journey / '+r.mode,gross,eligible?Math.max(0,gross-r.refunded):0,'Home trip: full one-way land km × €0.38; airfare at actual cost. First/final own-car trip: actual one-way km × €0.30.');
    if(r.refunded>gross)issues.push('A travel reimbursement exceeds this model’s gross candidate; candidate floored at zero. Review the payroll allocation.');
  }
  const mealEnd=mealWindowEnd(x.mealStart);
  for(const r of x.meals) {
    if(mealDates.has(r.date))throw Error('Only one meal entry per date.');mealDates.add(r.date);
    if(!inPeriod(r.date))throw Error('Meal date is outside the arrangement.');
    const allowance=r.kind==='full'?28:['arrival','over8'].includes(r.kind)?14:0;
    const reduction=['breakfast','lunch','dinner'].reduce((s,m)=>s+(r[m]==='yes'?Math.max(0,(m==='breakfast'?5.6:11.2)-r[m+'Own']):0),0);
    const gross=Math.max(0,allowance-reduction),within=r.date>=x.mealStart&&r.date<mealEnd;
    const reason=!within?'Outside the initial three-calendar-month window.':x.mealWindow!=='yes'?'Meal-clock/absence eligibility not confirmed.':'Domestic daily allowance after provided-meal reduction; no duplicate business-travel meal claim.';
    add('meals',r,r.kind+' domestic meal day',within?gross:0,eligible&&within&&x.mealWindow==='yes'?Math.max(0,gross-r.refunded):0,reason);
  }
  if(x.meals.length)issues.push('Meal clock: '+x.mealStart+' through '+new Date(Date.parse(mealEnd+'T00:00:00Z')-86400000).toISOString().slice(0,10)+'. Prior work at the same location counts. Four-week interruptions, restart cases and foreign meal rates need separate review.');
  for(const r of x.furniture) {
    if(!inPeriod(r.date))throw Error('Furniture purchase is outside the arrangement.');
    const net=r.paid/(1+Number(r.vat)/100),personal=r.paid-r.refunded,immediate=cents(net)<=800;
    if(!immediate&&r.years<=0)throw Error('Enter the independently checked useful life for a depreciated furniture item.');
    const months=(Number(x.end.slice(5,7))-Number(r.date.slice(5,7))+1);
    const gross=immediate?r.paid:Math.min(r.paid,r.paid/r.years*months/12),candidate=immediate?personal:Math.min(personal,personal/r.years*months/12);
    add('furniture',r,immediate?'Independently usable furnishing / immediate':'Furnishing / straight-line depreciation',gross,eligible&&r.necessary==='yes'?candidate:0,'Invoice VAT determines the €800 net test. Reimbursement reduces the cost basis; depreciation uses acquisition month through arrangement end. Necessity must be checked.');
  }
  if(x.furniture.reduce((s,r)=>s+r.paid,0)>5000)issues.push('Furniture exceeds €5,000 gross in these records: retain an individual necessity/proportionality review. €5,000 is not a separate tax-free allowance or an automatic deduction cap.');
  for(const r of x.moves) {
    const supported=['removal','travel','rental-broker'].includes(r.kind),allowed=supported&&x.moveJob==='yes'&&x.germanIncome==='yes'&&r.double!==''&&(r.double==='no'||eligible)&&r.direction!=='outbound';
    add('moves',r,r.kind+' / '+r.direction+' move',r.paid,allowed?r.paid-r.refunded:0,allowed?'Documented actual job-move cost after reimbursement; classification/BUKG or AUV limits still need review.':'Excluded pending review: job/tax connection, double-household eligibility, cost type or outbound move.');
  }
  if(x.moves.length)issues.push('Moving-cost actuals are a preparation subtotal before detailed BUKG/AUV limits. No moving flat rate is generated. Deposits, property purchase, new-home furniture, private moves and outbound treaty cases are excluded.');
  for(const r of lines)if(r.spending>0&&!r.reference)issues.push('Add a private evidence reference for '+r.kind+' on '+r.date+'.');
  const overlaps=[];
  const existing=Array.isArray(context.expenses)?context.expenses.slice(0,10000):[];
  const refs=new Set(existing.filter(r=>r&&String(r.year)==='2026'&&r.status!=='planned'&&typeof r.receiptRef==='string').map(r=>r.receiptRef.trim().toLowerCase()).filter(Boolean));
  if(lines.some(r=>r.reference&&refs.has(r.reference.toLowerCase())))overlaps.push('An evidence reference also exists in your paid 2026 expense records. These may be the same cost: do not add both.');
  const savedDays=context.taxWorkbenches?.work?.['2026']?.input?.days;
  const travelDates=new Set((Array.isArray(savedDays)?savedDays.slice(0,366):[]).filter(r=>r&&['travel-8','travel-full','travel-arrival'].includes(r.kind)&&typeof r.date==='string').map(r=>r.date));
  if(x.meals.some(r=>travelDates.has(r.date)))overlaps.push('A meal date also appears as a meal-allowance business-travel day in your saved 2026 work worksheet. Only one applicable allowance may be claimed per day; reconcile both worksheets.');
  issues.push(...overlaps);
  const candidate=cents(Object.values(groups).reduce((a,b)=>a+b,0));
  for(const k of Object.keys(groups))groups[k]=cents(groups[k]);
  return {year:2026,eligible,combineReady:eligible&&unique&&overlaps.length===0,groups,candidate,spending:cents(lines.reduce((s,r)=>s+(r.spending||0),0)),reimbursements:cents(lines.reduce((s,r)=>s+r.reimbursement,0)),issues:[...new Set(issues)],lines};
}
export function relocationReport(input,context={}) {
  const x=validateRelocationInput(input),r=relocationCalculation(x,context);
  return ['ATLASEVERYDAY — RELOCATION & DOUBLE HOUSEHOLD / 2026','Preparation candidates, not approved claims or a refund. Reviewed 16 November 2026.',`Arrangement: ${x.start} to ${x.end}; main household: ${x.mainCountry}`,`Recorded spending: EUR ${r.spending.toFixed(2)}; recorded tax-free reimbursements: EUR ${r.reimbursements.toFixed(2)}`,`Conditional candidate subtotal: EUR ${r.candidate.toFixed(2)}. ${r.combineReady?'Conditions self-confirmed; final review still required.':'Do not combine until eligibility/duplicates are reviewed.'}`,'',...Object.entries(r.groups).map(([k,v])=>`${k}: EUR ${v.toFixed(2)}`),'','RECORDS',...r.lines.map(a=>`${a.date} — ${a.description}\n  Spending: ${a.spending===null?'allowance; no spending figure':a.spending.toFixed(2)}; basis before reimbursement: ${a.gross.toFixed(2)}; reimbursement: ${a.reimbursement.toFixed(2)}; candidate: ${a.candidate.toFixed(2)}\n  Evidence: ${a.reference||'missing'}\n  Review: ${a.reason}`),'','NEXT CHECKS',...r.issues,'Keep tickets, payment records, housing contracts, household contributions, employer certificates, item invoices and meal logs.','Filing: Anlage N-Doppelte Haushaltsführung; standalone job relocation usually Anlage N. Check the selected-year ELSTER form. Do not enter the same cost twice.','','OFFICIAL REFERENCES',...Object.entries(relocationSources).map(([k,v])=>k+': '+v),'','REFERENCE INPUTS',JSON.stringify(x)].join('\n');
}
