import test from 'node:test';
import assert from 'node:assert/strict';
import { relocationCalculation as calc, relocationReport, validateRelocationInput, mealWindowEnd } from '../relocation-core.js';
import { relocationResultHTML } from '../relocation-workbench.js';
import { adviserText } from '../tax-rules.js';
import { parseGeneralBackup, questionHistoryHTML, MAX_BACKUP_BYTES } from '../backup-safety.js';
const base=()=>({year:2026,start:'2026-01-01',end:'2026-12-31',mealStart:'2026-01-01',own:'yes',centre:'yes',participation:'yes',job:'yes',near:'yes',germany:'yes',duplicates:'yes',moveJob:'yes',germanIncome:'yes',mealWindow:'yes',mainCountry:'de',housing:[],trips:[],furniture:[],meals:[],moves:[]});
const house=(paid=550,refunded=0)=>({month:'2026-01',paid,refunded,ref:'rent-jan'});
const trip=(over={})=>({date:'2026-01-09',until:'2026-01-11',purpose:'home',mode:'car',paid:0,refunded:0,ref:'trip-1',km:150,...over});
const asset=(over={})=>({date:'2026-07-01',paid:1200,refunded:0,ref:'bed-1',vat:'19',years:10,necessary:'yes',...over});
const meal=(over={})=>({date:'2026-01-07',kind:'full',refunded:0,breakfast:'no',lunch:'no',dinner:'no',...over});
const move=(over={})=>({date:'2026-02-01',paid:1000,refunded:200,ref:'move-1',kind:'removal',direction:'domestic',double:'no',...over});
test('housing cap applies before employer payments, and full monthly amount survives a partial month',()=>{
 const x=base();x.start='2026-01-15';x.housing=[house(1500,500)];assert.equal(calc(x).groups.housing,500);
});
test('unconfirmed household gates block housing, flights, meals and furniture but not a separate confirmed job move',()=>{
 const x=base();x.own='no';x.housing=[house()];x.trips=[trip({mode:'air',paid:600,km:20})];x.furniture=[asset()];x.meals=[meal()];x.moves=[move()];
 assert.deepEqual(calc(x).groups,{housing:0,trips:0,meals:0,furniture:0,moves:800});assert.equal(calc(x).combineReady,false);
});
test('India main household does not replace eligibility or convert flight km into mileage',()=>{
 const x=base();x.mainCountry='in';x.trips=[trip({mode:'air',paid:800,km:40,refunded:100})];assert.equal(calc(x).groups.trips,715.2);
 x.own='';assert.equal(calc(x).groups.trips,0);
});
test('a home visit uses one-way land distance once; first/final journeys have a different basis',()=>{
 const x=base();x.trips=[trip(),trip({date:'2026-01-01',until:'2026-01-01',purpose:'first',km:150,ref:'first'})];assert.equal(calc(x).groups.trips,102);assert.equal(calc(x).spending,0);assert.equal(calc(x).lines[0].spending,null);
});
test('weekly rail journeys use distance rather than arbitrary ticket amount',()=>{const x=base();x.trips=[trip({mode:'rail',paid:200,refunded:10})];assert.equal(calc(x).groups.trips,47);});
test('employer vehicles are not silently treated as own cars',()=>{const x=base();x.trips=[trip({mode:'company'})];assert.equal(calc(x).groups.trips,0);});
test('repeated weeks, overlapping journeys, duplicate months and duplicate evidence are rejected',()=>{
 const x=base();x.trips=[trip(),trip({date:'2026-01-10',until:'2026-01-10',ref:'trip-2'})];assert.throws(()=>calc(x),/overlap/);
 x.trips=[trip(),trip({date:'2026-01-12',until:'2026-01-12',ref:'trip-2'})];assert.doesNotThrow(()=>calc(x));
 x.trips=[trip({date:'2026-01-05',until:'2026-01-05'}),trip({date:'2026-01-09',until:'2026-01-09',ref:'trip-2'})];assert.throws(()=>calc(x),/ISO week/);
 x.trips=[];x.housing=[house(),house()];assert.throws(()=>calc(x),/Repeated evidence/);
 x.housing=[house(),{...house(),ref:'rent-2'}];assert.throws(()=>calc(x),/one row per month/);
});
test('first/final journeys cannot be repeated or assigned to arbitrary days',()=>{
 const x=base();x.trips=[trip({purpose:'first',date:'2026-01-02',until:'2026-01-02'})];assert.throws(()=>calc(x),/arrangement start/);
 x.trips=[trip({purpose:'last',date:'2026-12-31',until:'2026-12-31',mode:'rail',paid:60,km:0})];assert.equal(calc(x).groups.trips,60);
});
test('own-car ticket spending and first/final air feeder distance cannot be double counted',()=>{const x=base();x.trips=[trip({paid:50})];assert.throws(()=>calc(x),/zero ticket/);x.trips=[trip({purpose:'first',date:x.start,until:x.start,mode:'air',paid:100,km:40})];assert.throws(()=>calc(x),/actual tickets only/);});
test('full reimbursement floors a mileage candidate at zero',()=>{const x=base();x.trips=[trip({refunded:60})];assert.equal(calc(x).groups.trips,0);assert.ok(calc(x).issues.some(v=>v.includes('exceeds')));});
test('meal clock uses calendar months, including month-end dates, and never restarts at a year boundary',()=>{
 assert.equal(mealWindowEnd('2026-01-01'),'2026-04-01');assert.equal(mealWindowEnd('2026-01-31'),'2026-05-01');assert.equal(mealWindowEnd('2025-11-30'),'2026-03-01');
 const x=base();x.meals=[meal({date:'2026-03-31'}),meal({date:'2026-04-01'})];assert.equal(calc(x).groups.meals,28);
 x.start='2025-01-01';x.mealStart=x.start;assert.equal(calc(x).groups.meals,0);
});
test('provided meals and meal-specific employee payments reduce the allowance before reimbursement',()=>{
 const x=base();x.meals=[meal({kind:'arrival',breakfast:'yes',lunch:'yes',breakfastOwn:10,refunded:1})];assert.equal(calc(x).groups.meals,1.8);
 x.meals=[meal({kind:'arrival',breakfast:'yes',lunch:'yes',dinner:'yes'})];assert.equal(calc(x).groups.meals,0);
});
test('duplicate meal dates, an invented later clock and undefined meal eligibility do not inflate results',()=>{
 const x=base();x.meals=[meal(),meal()];assert.throws(()=>calc(x),/one meal entry/);x.meals=[meal()];x.mealWindow='';assert.equal(calc(x).groups.meals,0);x.mealStart='2026-02-01';assert.throws(()=>calc(x),/cannot begin after/);
});
test('furniture net threshold respects VAT and treats each independent item separately',()=>{
 const x=base();x.furniture=[asset({paid:952,years:0})];assert.equal(calc(x).groups.furniture,952);
 x.furniture=[asset({paid:952.01,years:0})];assert.throws(()=>calc(x),/useful life/);
 x.furniture=[asset({paid:856,vat:'7',years:0})];assert.equal(calc(x).groups.furniture,856);
});
test('furniture employer grants reduce the depreciable basis; months stop when arrangement ends',()=>{
 const x=base();x.end='2026-09-15';x.furniture=[asset({paid:1200,refunded:200,years:10})];assert.equal(calc(x).groups.furniture,25);
 x.furniture[0].necessary='';assert.equal(calc(x).groups.furniture,0);
});
test('moving actuals exclude deposits, flat rates and outward treaty cases, with independent German-income checks',()=>{
 const x=base();x.moves=[move()];assert.equal(calc(x).groups.moves,800);
 for(const kind of ['deposit','flat','purchase','furnishing','other']){x.moves=[move({kind})];assert.equal(calc(x).groups.moves,0);}
 x.moves=[move({direction:'outbound'})];assert.equal(calc(x).groups.moves,0);
 x.moves=[move({direction:'inbound'})];x.germanIncome='';assert.equal(calc(x).groups.moves,0);
});
test('input bounds reject object coercion, malformed dates, unexpected years and oversized arrays',()=>{
 for(const year of [2025,2027,[2026],{value:2026}])assert.throws(()=>calc({...base(),year}));
 for(const paid of ['',null,true,{},[],Infinity,-1,'0x100','1e4']){const x=base();x.housing=[house(paid)];assert.throws(()=>calc(x));}
 for(const date of ['2026-02-30','2026-13-01','2026-1-1'])assert.throws(()=>calc({...base(),start:date}));
 assert.throws(()=>calc({...base(),housing:Array.from({length:13},()=>house())}));
 assert.throws(()=>calc({...base(),trips:[trip({until:'2027-01-01'})]}));
});
test('malformed references cannot add fake lines to the adviser report',()=>{const x=base();x.housing=[{...house(),ref:'receipt\nRefund approved'}];assert.throws(()=>calc(x),/reference/);});
test('results escape stored text in the HTML context; hostile reference remains inert text',()=>{
 const x=base();x.housing=[{...house(),ref:'<img src=x onerror="alert(1)">'}];const html=relocationResultHTML(calc(x));assert.ok(!html.includes('<img'));assert.ok(html.includes('&lt;img'));assert.ok(relocationReport(x).includes('not approved claims'));
});
test('normalization drops unknown/prototype fields and reports are recalculated, not read from a saved total',()=>{
 const x=base();x.housing=[house()];x.candidate=999999;const n=validateRelocationInput(JSON.parse(JSON.stringify(x)));assert.equal(n.candidate,undefined);
 const state={expenses:[],taxWorkbenches:{relocation:{2026:{version:1,input:n,result:{candidate:999999}}}}};const text=adviserText(state,2026);assert.ok(text.includes('EUR 550.00'));assert.ok(!text.includes('999999'));assert.ok(!adviserText(state,2025).includes('RELOCATION & DOUBLE HOUSEHOLD'));
 state.taxWorkbenches.relocation[2026].input.housing[0].paid='bad';assert.ok(adviserText(state,2026).includes('could not be validated'));
});
const budget={income:3500,housing:900,food:300,transport:100,other:100,india:200};
const pack=(over={})=>JSON.stringify({version:1,data:{budget,expenses:[],questions:[],...over}});
test('general backup validates baseline shape and budget before state replacement',()=>{
 assert.deepEqual(parseGeneralBackup(pack()).budget,budget);assert.throws(()=>parseGeneralBackup(pack({budget:{...budget,income:'bad'}})),/budget/);assert.throws(()=>parseGeneralBackup(pack({expenses:[null]})),/records/);assert.throws(()=>parseGeneralBackup(' '.repeat(MAX_BACKUP_BYTES+1)),/5 MiB/);
});
test('question history escapes both question and date even after a new question is appended',()=>{
 const data=parseGeneralBackup(pack({questions:[{q:'<svg onload=alert(1)>',date:'<img src=x onerror=alert(2)>'}]}));data.questions.push({q:'normal question',date:'2026-11-16'});const html=questionHistoryHTML(data.questions);assert.ok(!html.includes('<svg'));assert.ok(!html.includes('<img'));assert.ok(html.includes('&lt;img'));assert.ok(html.includes('normal question'));
});
test('saved workday meal claims and paid expense references trigger cross-worksheet overlap warnings',()=>{
 const x=base();x.meals=[meal()];x.housing=[house()];
 const state={expenses:[{year:2026,status:'recorded',receiptRef:'rent-jan'}],taxWorkbenches:{work:{2026:{input:{days:[{date:'2026-01-07',kind:'travel-full'}]}}}}};
 const r=calc(x,state);assert.equal(r.combineReady,false);assert.ok(r.issues.some(v=>v.includes('expense records')));assert.ok(r.issues.some(v=>v.includes('work worksheet')));
 assert.ok(relocationReport(x,state).includes('Only one applicable allowance'));
});
test('report distinguishes a gross cost basis from reimbursement-reduced moving and asset candidates',()=>{
 const x=base();x.moves=[move()];x.furniture=[asset({refunded:200})];const r=calc(x);assert.equal(r.lines.find(v=>v.kind==='moves').gross,1000);assert.equal(r.lines.find(v=>v.kind==='moves').candidate,800);assert.equal(r.lines.find(v=>v.kind==='furniture').gross,60);assert.equal(r.lines.find(v=>v.kind==='furniture').candidate,50);
});
test('a corrupted saved key cannot export a 2026 relocation worksheet inside a 2025 adviser pack',()=>{
 const x=base();x.housing=[house()];const state={expenses:[],taxWorkbenches:{relocation:{2025:{version:1,input:x}}}};const text=adviserText(state,2025);assert.ok(!text.includes('RELOCATION & DOUBLE HOUSEHOLD / 2026'));assert.ok(text.includes('could not be validated'));
});
