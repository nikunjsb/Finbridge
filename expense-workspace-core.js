import { tariff2026 } from './tax-rules.js?v=2d1e89d92ef2';

export const workCategories = ['Commuting + home office','Commuting','Home office','Work equipment','Professional education','Business travel'];
export const expenseYear = r => Number(r.year);
export const isPlanned = r => r.status === 'planned';
export const isWork = r => workCategories.includes(r.category);
export const esc = s => String(s ?? '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const eur = n => new Intl.NumberFormat('en-IE',{style:'currency',currency:'EUR'}).format(Number(n)||0);
const finite = v => ['number','string'].includes(typeof v) && String(v).trim() !== '' && Number.isFinite(Number(v)) && Number(v)>=0 && Number(v)<=100000000;
const num = v => finite(v) ? Number(v) : 0;
const cents = n => Math.round(n*100)/100;
export function ensureExpenseIds(records, uuid) {
  const seen=new Set();let changed=false;
  for(const r of records){if(!r || typeof r!=='object')continue;
    if(typeof r.id!=='string'||!/^[a-zA-Z0-9-]{1,80}$/.test(r.id)||seen.has(r.id)){r.id=uuid();changed=true;}seen.add(r.id);
  }return changed;
}
export function spendingLabel(r) {
  if(isPlanned(r))return eur(r.actual ?? r.amount)+' planned';
  if(r.category==='Home office')return 'Daily allowance · no purchase required';
  if(['Commuting','Commuting + home office'].includes(r.category)&&num(r.actual)===0)return 'Actual travel costs not recorded';
  return eur(r.actual ?? r.amount)+' recorded spending';
}
export function overlapWarnings(records) {
  const warnings=[];
  const paid=records.filter(r=>!isPlanned(r));
  const commuting=paid.filter(r=>['Commuting','Commuting + home office'].includes(r.category));
  const home=paid.filter(r=>r.category==='Home office');
  const days=r=>num(r.basis?.homeDays) || Number(/(\d+) home-office days/.exec(r.details||'')?.[1]||/^(\d+) qualifying/.exec(r.details||'')?.[1]||0);
  if(commuting.some(r=>days(r)>0)&&home.length)warnings.push('Possible duplicate home-office days: a commuting record already includes home days and a separate home-office record exists. Edit or exclude the overlapping record.');
  if(commuting.length>1)warnings.push('Multiple annual commuting records: check that journeys, days, caps and reimbursements are not duplicated. Consolidate into one annual record for this estimate.');
  if(home.length>1)warnings.push('Multiple home-office summaries: consolidate into one annual record so days and the yearly cap are applied once.');
  if(paid.reduce((n,r)=>n+days(r),0)>210)warnings.push('Home-office days exceed the 210-day annual allowance ceiling across these records. Consolidate and review the total.');
  const signatures=new Set();
  for(const r of paid){const key=JSON.stringify([r.category,r.item,r.year,r.paymentDate,r.actual,r.estimated,r.basis||r.details]);if(signatures.has(key))warnings.push('Possible repeated record: '+(r.item||r.category)+'. Review both entries; duplicates are not removed automatically.');signatures.add(key);}
  return [...new Set(warnings)];
}
export function workspaceSummary(records, year) {
  const selected=records.filter(r=>expenseYear(r)===Number(year));
  const paid=selected.filter(r=>!isPlanned(r)),planned=selected.filter(isPlanned);
  return {selected,paid,planned,spending:cents(paid.reduce((n,r)=>n+num(r.actual??r.amount),0)),plannedSpending:cents(planned.reduce((n,r)=>n+num(r.actual??r.amount),0)),pending:paid.filter(r=>!isWork(r)||r.review?.confirmed!==true).length,warnings:overlapWarnings(paid),unassigned:records.filter(r=>!finite(r.year)).length};
}
export function reviewFromForm(fd) {
  const value=fd.get('eligibleAmount');
  const confirmed=fd.get('eligibleConfirmed')==='on';
  if(confirmed&&!finite(value))throw Error('Enter a valid current-year eligible amount, or leave the review unconfirmed.');
  return {confirmed,amount:finite(value)?cents(Number(value)):null};
}
// This is a one-employee, ordinary 2026 income-tax tariff comparison, not a return.
export function workspaceEffect(records,year,profile={}) {
  const summary=workspaceSummary(records,year);
  if(Number(year)!==2026)return {supported:false,reason:'Tax-effect calculations currently support 2026 only. Other years can still be edited, documented and exported.'};
  if(profile.scope!=='single-employee'||profile.confirmed!==true)return {supported:false,reason:'Confirm the supported one-employee scenario and the baseline before calculating. Joint, foreign/progression income, part-year, business and special assessments need the wider planner or individual review.'};
  if(!finite(profile.income)||!finite(profile.otherWork))return {supported:false,reason:'Enter annual taxable income (not gross salary or monthly take-home pay) and eligible work costs not listed here.'};
  const selected=summary.selected.filter(r=>isWork(r)&&r.review?.confirmed===true);
  if(selected.some(r=>!finite(r.review.amount)))return {supported:false,reason:'A reviewed amount is invalid; edit the affected record.'};
  const selectedPaid=selected.filter(r=>!isPlanned(r));
  const warnings=overlapWarnings(selected.map(r=>({...r,status:'recorded'})));
  if(warnings.length)return {supported:false,reason:warnings.join(' ')};
  const income=Number(profile.income),other=Number(profile.otherWork);
  const paid=cents(selectedPaid.reduce((s,r)=>s+Number(r.review.amount),0));
  const planned=selected.filter(isPlanned),planAmount=cents(planned.reduce((s,r)=>s+Number(r.review.amount),0));
  const deduction=total=>Math.min(Math.floor(income),Math.max(0,total-1230));
  const tax=total=>tariff2026(Math.max(0,income-deduction(total)));
  const baseline=tariff2026(income),beforeRecords=tax(other),afterPaid=tax(other+paid),afterPlanned=tax(other+paid+planAmount);
  const perRecord=Object.fromEntries(selected.map(r=>[r.id,isPlanned(r)?tax(other+paid+planAmount-Number(r.review.amount))-afterPlanned:tax(other+paid-Number(r.review.amount))-afterPaid]));
  return {supported:true,income,other,paid,planAmount,baseline,beforeRecords,afterPaid,afterPlanned,paidSaving:beforeRecords-afterPaid,plannedSaving:afterPaid-afterPlanned,totalWork:other+paid,extraDeduction:deduction(other+paid),perRecord,reviewed:selected.length,excluded:summary.selected.length-selected.length,plannedNetCost:cents(summary.plannedSpending-(afterPaid-afterPlanned))};
}
export const routeFor = r => r.category==='Support to family'?['Anlage Unterhalt','#taxplan/parents']:r.category==='Insurance'?['Anlage Vorsorgeaufwand — classification review','#taxplan/checks']:isWork(r)?['Anlage N — check current-year category','#taxplan/work']:['Classify before filing','#taxplan/finder'];
export function workspaceReport(records,year,profile={},receipts=[]) {
  const s=workspaceSummary(records,year),effect=workspaceEffect(records,year,profile);
  const lines=['AtlasEveryday - tax preparation pack - '+year,'Preparation only. No return submitted or refund calculated.','Recorded spending: '+eur(s.spending),'Planned spending (not paid claims): '+eur(s.plannedSpending),'Unreviewed or separately assessed records: '+s.pending,...s.warnings,''];
  for(const r of s.selected){lines.push((isPlanned(r)?'PLANNED':'RECORDED')+' | '+(r.item||r.category),'ID: '+r.id+' | '+r.category+' | Year: '+r.year,spendingLabel(r),'Preliminary candidate: '+(finite(r.estimated)?eur(r.estimated):'not assessed'),'User-reviewed current-year amount: '+(r.review?.confirmed&&finite(r.review.amount)?eur(r.review.amount):'not confirmed'),r.details||'', 'Payment date: '+(r.paymentDate||'not recorded'),'Receipt reference: '+(r.receiptRef||'not recorded'),'Notes: '+(r.note||''),'German section: '+routeFor(r)[0],...receipts.filter(f=>f.recordId===r.id).map(f=>'Evidence: '+f.name+' ('+f.size+' bytes)'), '');}
  lines.push('2026 ORDINARY INCOME-TAX ILLUSTRATION');
  if(effect.supported)lines.push('Baseline taxable income (not gross salary): '+eur(effect.income),'Baseline already includes the standard employee allowance; reviewed listed costs must not already be deducted.','Work costs outside these records: '+eur(effect.other),'Tax before listed records: '+eur(effect.beforeRecords),'Tax after reviewed paid work records: '+eur(effect.afterPaid),'Additional income-tax reduction from listed paid work records: '+eur(effect.paidSaving),'Additional illustration if reviewed plans are paid and qualify in this year: '+eur(effect.plannedSaving),'Per-record removal comparisons are marginal; do not add them together.');
  else lines.push(effect.reason);
  lines.push('Family support, insurance and other unmodelled categories are excluded from this numerical effect. Check them separately.','No solidarity surcharge, church tax, credits, progression, loss determination, withheld-tax reconciliation or complete refund calculation.','Source rules reviewed 14 November 2026:','Employee allowance: https://www.gesetze-im-internet.de/estg/__9a.html','2026 tariff: https://www.gesetze-im-internet.de/estg/__32a.html','ELSTER form guidance: https://www.elster.de/eportal/helpGlobal?themaGlobal=help_est_ufa_10_2025');
  return lines.filter(x=>x!==undefined).join('\n');
}
const csvCell=v=>'"'+String(v??'').replace(/^\s*[=+\-@\t\r]/,"'$&").replace(/"/g,'""')+'"';
export function workspaceCSV(records,year){return [['ID','Year','Status','Category','Item','Recorded or planned spending EUR','Candidate EUR','User reviewed EUR','Review confirmed','Payment date','Receipt reference','Notes','German section'],...records.filter(r=>expenseYear(r)===Number(year)).map(r=>[r.id,r.year,isPlanned(r)?'planned':'recorded',r.category,r.item,r.actual??r.amount,r.estimated,r.review?.amount,r.review?.confirmed===true,r.paymentDate,r.receiptRef,r.note,routeFor(r)[0]])].map(row=>row.map(csvCell).join(',')).join('\r\n');}

// Portable, text-only PDF; CSV/TXT preserve full Unicode and originals are unchanged.
export function summaryPDF(text){
  const ascii=String(text).replace(/€/g,' EUR ').replace(/[–—]/g,'-').normalize('NFKD').replace(/[^\x20-\x7e\n]/g,'?');
  const lines=ascii.split('\n').flatMap(line=>line.match(/.{1,90}(?:\s|$)|.{1,90}/g)||['']);
  const chunks=[];for(let i=0;i<lines.length;i+=50)chunks.push(lines.slice(i,i+50));
  const objects=['','<< /Type /Catalog /Pages 2 0 R >>','','<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>'];
  const pages=[];
  for(const lines of chunks){const p=objects.length;pages.push(p+' 0 R');const content='BT /F1 10 Tf 14 TL 40 800 Td\n'+lines.map((l,i)=>(i?'T* ':'')+'('+l.replace(/([\\()])/g,'\\$1')+') Tj').join('\n')+'\nET';objects.push('<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 3 0 R >> >> /Contents '+(p+1)+' 0 R >>','<< /Length '+content.length+' >>\nstream\n'+content+'\nendstream');}
  objects[2]='<< /Type /Pages /Count '+pages.length+' /Kids ['+pages.join(' ')+'] >>';let out='%PDF-1.4\n';const offsets=[0];for(let i=1;i<objects.length;i++){offsets[i]=out.length;out+=i+' 0 obj\n'+objects[i]+'\nendobj\n';}const start=out.length;out+='xref\n0 '+objects.length+'\n0000000000 65535 f \n'+offsets.slice(1).map(n=>String(n).padStart(10,'0')+' 00000 n \n').join('')+'trailer\n<< /Size '+objects.length+' /Root 1 0 R >>\nstartxref\n'+start+'\n%%EOF';return new TextEncoder().encode(out);
}
