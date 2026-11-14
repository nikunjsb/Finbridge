import test from 'node:test';
import assert from 'node:assert/strict';
import { workExpenses, parentSupport, householdServices, workbenchSummary } from '../tax-workbench-rules.js';
import { adviserText } from '../tax-rules.js';
import { worksheetText } from '../tax-workbenches.js';

const work = {year:2026,distance:30,transport:'car',publicPaid:0,commuteRefund:0,otherEmployment:0,days:[],costs:[],homeConditions:'yes',travelConditions:'yes',recordsVerified:'yes'};
const asset = {kind:'equipment',date:'2026-10-01',paid:1200,share:100,refunded:0,evidence:'yes',vat:0,method:'standard',life:3,lifeVerified:'yes'};
const parent = {year:2026,country:'india',people:1,start:1,end:12,recipients:[{income:0,assets:0,grants:0}],payments:[{ref:'p1',date:'2026-01-10',amount:6000,bank:'yes'}],otherDonors:0,donorNet:50000,familyReduction:0,affordabilityUsed:0,donorVerified:'yes',periodVerified:'yes',incomeVerified:'yes',eligibility:'yes',marriedParents:'yes'};
const invoice = {ref:'i1',date:'2026-05-10',kind:'service',total:1200,labour:1000,materials:200,refunded:0,elsewhere:0,bank:'yes',invoice:'yes',eligible:'yes',subsidy:'no'};
const household = {year:2026,items:[invoice],limitShare:100,priorService:0,priorTrade:0,availableTax:'',household:'yes',allocation:'yes'};
const dated = (date,kind='office',extra={})=>({date,kind,...extra});
const payment = (date,amount)=>({ref:date,date,amount,bank:'yes'});

test('2025/2026 commute reference: 30 km x 10 dated days, not return distance',()=>{
  const days=Array.from({length:10},(_,i)=>dated('2026-01-'+String(i+1).padStart(2,'0')));
  assert.equal(workExpenses({...work,days}).commute,114);
  assert.equal(workExpenses({...work,year:2025,days:days.map(x=>({...x,date:x.date.replace('2026','2025')}))}).commute,98);
});
test('one date cannot count as both office and home/travel; leap/date/year checks',()=>{
  assert.throws(()=>workExpenses({...work,days:[dated('2026-01-01'),dated('2026-01-01','home')]}),/overlap/);
  for(const date of ['2026-02-29','2025-12-31','2026-13-01','nonsense'])assert.throws(()=>workExpenses({...work,days:[dated(date)]}));
});
test('annual non-car commuting cap and actual public-transport comparison are alternatives',()=>{
  const days=Array.from({length:100},(_,i)=>dated(new Date(Date.UTC(2026,0,i+1)).toISOString().slice(0,10)));
  assert.equal(workExpenses({...work,distance:200,days,transport:'other'}).commute,4500);
  assert.equal(workExpenses({...work,distance:200,days,transport:'public',publicPaid:5100,commuteRefund:100}).commute,5000);
  assert.equal(workExpenses({...work,distance:200,days}).commute,7600);
});
test('commuting benefit guards prevent negative or duplicate transport amounts',()=>{
  assert.throws(()=>workExpenses({...work,commuteRefund:1}));
  assert.throws(()=>workExpenses({...work,publicPaid:100}));
  assert.throws(()=>workExpenses({...work,transport:'public',publicPaid:100}));
});
test('home days capped at 210; eligibility uncertainty suppresses claim-ready status',()=>{
  const days=Array.from({length:220},(_,i)=>dated(new Date(Date.UTC(2026,0,i+1)).toISOString().slice(0,10),'home'));
  assert.equal(workExpenses({...work,days}).homeAmount,1260);
  assert.equal(workExpenses({...work,days,homeConditions:''}).supported,false);
});
test('domestic trip reference: 100 km x .30 + €20 cost + €14 meal - €5.60 breakfast - €10 reimbursement',()=>{
  const result=workExpenses({...work,days:[dated('2026-01-10','travel-8',{paid:20,km:100,refunded:10,breakfast:'yes'})]});
  assert.equal(result.business,48.4);
  assert.equal(result.travel,1);
});
test('provided meals cannot make the allowance negative or reduce transport spending',()=>{
  assert.equal(workExpenses({...work,days:[dated('2026-01-10','travel-arrival',{paid:50,km:0,refunded:0,breakfast:'yes',lunch:'yes',dinner:'yes'})]}).business,50);
});
test('full domestic day gives €28 and missing three-month verification needs review',()=>{
  const days=[dated('2026-01-10','travel-full',{paid:0,km:0,refunded:0})];
  assert.equal(workExpenses({...work,days}).business,28);
  assert.equal(workExpenses({...work,days,travelConditions:''}).supported,false);
});
test('business reimbursement cannot exceed supported travel costs',()=>{
  assert.throws(()=>workExpenses({...work,days:[dated('2026-01-10','travel-none',{paid:10,km:0,refunded:11})]}));
});
test('October €1200 equipment, three-year life: independent 3/36 depreciation = €100',()=>{
  assert.equal(workExpenses({...work,costs:[asset]}).equipment,100);
});
test('prior-year depreciation continues at full annual amount; end-of-life is capped',()=>{
  assert.equal(workExpenses({...work,costs:[{...asset,date:'2025-10-01'}]}).equipment,400);
  assert.equal(workExpenses({...work,costs:[{...asset,date:'2023-10-01'}]}).equipment,300);
  assert.equal(workExpenses({...work,costs:[{...asset,date:'2022-10-01'}]}).equipment,0);
});
test('€800 net asset threshold uses full purchase, not work-use share',()=>{
  assert.equal(workExpenses({...work,costs:[{...asset,paid:952,vat:19,share:50}]}).equipment,476);
  assert.equal(workExpenses({...work,costs:[{...asset,paid:1190,vat:19,share:50}]}).equipment,49.58);
});
test('one-year digital method allows full purchase-year work share after reimbursement',()=>{
  assert.equal(workExpenses({...work,costs:[{...asset,method:'digital',share:50,refunded:100}]}).equipment,500);
  assert.equal(workExpenses({...work,costs:[{...asset,method:'digital',date:'2025-10-01'}]}).equipment,0);
});
test('professional reimbursement reduces the depreciation basis; later reimbursement needs review',()=>{
  assert.equal(workExpenses({...work,costs:[{...asset,refunded:120}]}).equipment,90);
  assert.equal(workExpenses({...work,costs:[{...asset,date:'2025-10-01',refunded:120}]}).supported,false);
  assert.throws(()=>workExpenses({...work,costs:[{...asset,share:10,refunded:121}]}));
});
test('unverified life/evidence prevents an apparently approved amount',()=>{
  assert.equal(workExpenses({...work,costs:[{...asset,lifeVerified:''}]}).supported,false);
  assert.equal(workExpenses({...work,costs:[{...asset,evidence:''}]}).supported,false);
  assert.equal(workExpenses({...work,recordsVerified:''}).supported,false);
});
test('phone bills use evidenced professional share and subtract employer reimbursement',()=>{
  assert.equal(workExpenses({...work,costs:[{...asset,kind:'phone',paid:600,share:40,refunded:60}]}).phone,180);
});
test('initial education separate from employment costs; €6000 annual cap',()=>{
  const result=workExpenses({...work,costs:[{...asset,kind:'training',course:'initial',paid:7000},{...asset,kind:'training',course:'subsequent',paid:1500}],otherEmployment:200});
  assert.equal(result.initialEducation,6000);assert.equal(result.employmentTotal,1700);assert.equal(result.extraAboveAllowance,470);
});
test('general German-learning does not get an automatic deduction',()=>{
  const result=workExpenses({...work,costs:[{...asset,kind:'training',course:'general-language'}]});
  assert.equal(result.supported,false);assert.equal(result.training,0);
});
test('dates, numeric fields, array bounds and unsupported years are rejected',()=>{
  for(const change of [{year:2027},{distance:-1},{days:'bad'},{days:Array(367).fill(dated('2026-01-01'))},{costs:[{...asset,paid:Infinity}]},{costs:[{...asset,date:'2027-01-01'}]}]) assert.throws(()=>workExpenses({...work,...change}));
});

test('2026 India one-parent limit: €12348 / 4 = €3087; income exemption €156',()=>{
  const result=parentSupport(parent);assert.equal(result.candidate,3087);assert.equal(result.allowance,156);assert.equal(result.supported,true);
});
test('2025 India uses historical €12096 / 4 = €3024',()=>{
  assert.equal(parentSupport({...parent,year:2025,payments:[payment('2025-01-01',6000)]}).candidate,3024);
});
test('BMF October 2025 foreign-support example 9: July €7000, group 1 => €6048',()=>{
  const result=parentSupport({...parent,year:2025,country:'germany',start:7,payments:[payment('2025-07-01',7000)]});
  assert.equal(result.candidate,6048);assert.equal(result.months,6);
});
test('BMF example 6: December advance cannot become a next-year deduction',()=>{
  const result=parentSupport({...parent,year:2025,country:'germany',start:12,payments:[payment('2025-12-01',3000)]});
  assert.equal(result.candidate,1008);assert.equal(result.months,1);
  assert.throws(()=>parentSupport({...parent,payments:[payment('2026-12-01',3000)]}),/first support month/);
});
test('BMF example 5: June–December ceiling €7056, actual €5600 is the tighter limit',()=>{
  const result=parentSupport({...parent,year:2025,country:'germany',start:6,payments:Array.from({length:7},(_,i)=>payment('2025-'+String(i+6).padStart(2,'0')+'-01',800))});
  assert.equal(result.ceiling,7056);assert.equal(result.candidate,5600);
});
test('BMF example 8: three-quarter group, February/November payments => €3200',()=>{
  const result=parentSupport({...parent,year:2025,country:'other',factor:.75,countryVerified:'yes',start:2,payments:[payment('2025-02-01',1200),payment('2025-11-01',2000)]});
  assert.equal(result.ceiling,8316);assert.equal(result.candidate,3200);
});
test('married parents combine incomes and exemptions rather than lose the unused spouse exemption',()=>{
  const result=parentSupport({...parent,people:2,recipients:[{income:1000,assets:0,grants:0},{income:0,assets:0,grants:0}]});
  assert.equal(result.ceiling,6174);assert.equal(result.allowance,312);assert.equal(result.incomeReduction,688);assert.equal(result.candidate,5486);
});
test('BMF example 12: separately reviewed period income 750+868, exemption 702, reduction 916',()=>{
  const result=parentSupport({...parent,year:2025,country:'other',factor:.75,countryVerified:'yes',start:4,people:2,recipients:[{income:750,assets:0,grants:0},{income:868,assets:0,grants:0}],payments:[payment('2025-04-03',750),payment('2025-09-06',750)]});
  assert.equal(result.ceiling,13608);assert.equal(result.allowance,702);assert.equal(result.incomeReduction,916);assert.equal(result.candidate,1500);
});
test('all supported household members receive an equal allocation, including non-eligible people',()=>{
  const result=parentSupport({...parent,people:3});assert.equal(result.allocatedPaid,2000);assert.equal(result.candidate,2000);
});
test('other unlimited-German-tax donors share the limit proportionally',()=>{
  const result=parentSupport({...parent,payments:[payment('2026-01-01',3000)],otherDonors:1000});
  assert.equal(result.donorRatio,.75);assert.equal(result.candidate,2315.25);
});
test('non-German-tax donor support is recipient income, not a German donor-share allocation',()=>{
  assert.equal(parentSupport({...parent,recipients:[{income:1000,assets:0,grants:0}]}).candidate,2243);
});
test('BMF example 13: standard Opfergrenze €16450 x (32-10)% = €3619',()=>{
  const result=parentSupport({...parent,country:'germany',people:2,recipients:[{income:0,assets:0,grants:0},{income:0,assets:0,grants:0}],payments:[payment('2026-01-01',4200)],donorNet:16450,familyReduction:10});
  assert.equal(result.affordabilityPercent,22);assert.equal(result.affordability,3619);assert.equal(result.candidate,3619);
});
test('assets threshold is not quartered for India; income/need/payment gaps require review',()=>{
  assert.equal(parentSupport({...parent,recipients:[{income:0,assets:15500,grants:0}]}).supported,true);
  assert.equal(parentSupport({...parent,recipients:[{income:0,assets:15501,grants:0}]}).supported,false);
  for(const change of [{eligibility:''},{incomeVerified:''},{periodVerified:''},{donorVerified:''},{payments:[{...parent.payments[0],bank:'no'}]}])assert.equal(parentSupport({...parent,...change}).supported,false);
});
test('high recipient income or no donor affordability gives zero, not negative deduction',()=>{
  assert.equal(parentSupport({...parent,recipients:[{income:10000,assets:0,grants:0}]}).candidate,0);
  assert.equal(parentSupport({...parent,donorNet:1000,familyReduction:25}).candidate,0);
});
test('education grants reduce the ceiling separately; other claims consume donor affordability',()=>{
  assert.equal(parentSupport({...parent,recipients:[{income:0,assets:0,grants:200}]}).candidate,2887);
  assert.equal(parentSupport({...parent,donorNet:10000,affordabilityUsed:1500}).candidate,500);
});
test('partial months round statutory limits up to whole euro and use period income',()=>{
  const result=parentSupport({...parent,start:7,payments:[payment('2026-07-01',6000)]});
  assert.equal(result.ceiling,1544);assert.equal(result.allowance,78);
});
test('support duplicate references, missing/invalid data, backwards period and mixed-year transfers rejected',()=>{
  for(const change of [{payments:[parent.payments[0],parent.payments[0]]},{payments:[]},{recipients:[{income:'',assets:0,grants:0}]},{start:7,end:6},{payments:[payment('2025-01-01',1)]},{people:0},{affordabilityUsed:30000}])assert.throws(()=>parentSupport({...parent,...change}));
});

test('household invoice: €1200 paid, €1000 labour + €200 material => €200 direct credit',()=>{
  const result=householdServices(household);assert.equal(result.potentialCredit,200);assert.equal(result.materialTotal,200);assert.equal(result.appliedCredit,null);
});
test('services and craft work have independent €4000/€1200 annual caps',()=>{
  const result=householdServices({...household,items:[{...invoice,total:30000,labour:30000,materials:0},{...invoice,ref:'i2',kind:'trade',total:8000,labour:8000,materials:0}]});
  assert.equal(result.serviceCredit,4000);assert.equal(result.tradeCredit,1200);assert.equal(result.potentialCredit,5200);
});
test('net labour excludes reimbursements and the portion already claimed elsewhere',()=>{
  assert.equal(householdServices({...household,items:[{...invoice,refunded:100,elsewhere:300}]}).potentialCredit,120);
});
test('shared household limits and previously used credits cannot be claimed again',()=>{
  const result=householdServices({...household,limitShare:50,priorService:1900,items:[{...invoice,total:10000,labour:10000,materials:0}]});
  assert.equal(result.potentialCredit,100);
});
test('cash, missing evidence, excluded categories and subsidised/uncertain craft work get no credit',()=>{
  for(const change of [{bank:'no'},{invoice:''},{eligible:''},{kind:'excluded'},{kind:'trade',subsidy:'yes'},{kind:'trade',subsidy:''}]){
    const result=householdServices({...household,items:[{...invoice,...change}]});assert.equal(result.potentialCredit,0);assert.ok(result.lines[0].reason);
  }
});
test('tax liability limits the applied credit; unused amount is not refundable',()=>{
  assert.equal(householdServices({...household,availableTax:70}).appliedCredit,70);
  assert.equal(householdServices({...household,availableTax:0}).appliedCredit,0);
});
test('unconfirmed household eligibility suppresses claim-ready status',()=>{
  assert.equal(householdServices({...household,household:''}).supported,false);
  assert.equal(householdServices({...household,allocation:''}).supported,false);
});
test('household duplicate references, inconsistent invoice totals and unsupported dates rejected',()=>{
  for(const change of [{items:[invoice,{...invoice,ref:' I1 '}]},{items:[{...invoice,total:999}]},{items:[{...invoice,refunded:1001}]},{items:[{...invoice,date:'2025-01-01'}]},{items:[]},{priorTrade:1201}])assert.throws(()=>householdServices({...household,...change}));
});
test('household model preserves historical 2025 scope without moving payment-year totals',()=>{
  assert.equal(householdServices({...household,year:2025,items:[{...invoice,date:'2025-05-10'}]}).potentialCredit,200);
});
test('saved worksheets reach the correct-year adviser pack without adding expense totals',()=>{
  const result=householdServices(household), snapshot={input:household,result};
  const state={expenses:[],taxWorkbenches:{household:{2026:snapshot}}};
  assert.match(adviserText(state,2026),/Potential DIRECT tax credit EUR 200.00/);
  assert.doesNotMatch(adviserText(state,2025),/Potential DIRECT tax credit EUR 200.00/);
  assert.equal(state.expenses.length,0);
  assert.match(worksheetText(snapshot),/not add an expense/);
});
test('review status is explicit in summary/export instead of a claim amount',()=>{
  const result=parentSupport({...parent,incomeVerified:''});
  assert.match(workbenchSummary(result),/Review needed/);assert.doesNotMatch(workbenchSummary(result),/candidate EUR/);
});
test('malformed saved results remain readable as review records instead of breaking the adviser pack',()=>{
  assert.match(workbenchSummary({kind:'work',supported:true}),/Recalculate/);
  assert.match(workbenchSummary({kind:'__proto__',supported:true}),/No supported/);
  assert.doesNotThrow(()=>adviserText({taxWorkbenches:{work:{2026:{input:{},result:{kind:'work',year:2026,supported:true}}}}},2026));
});
test('saved 2025 and 2026 worksheets coexist and export only their selected year',()=>{
  const input25={...household,year:2025,items:[{...invoice,date:'2025-05-10',labour:500,materials:200}]};
  const state={taxWorkbenches:{household:{2025:{input:input25,result:householdServices(input25)},2026:{input:household,result:householdServices(household)}}}};
  assert.match(adviserText(state,2025),/Potential DIRECT tax credit EUR 100.00/);
  assert.doesNotMatch(adviserText(state,2025),/Potential DIRECT tax credit EUR 200.00/);
  assert.match(adviserText(state,2026),/Potential DIRECT tax credit EUR 200.00/);
});
