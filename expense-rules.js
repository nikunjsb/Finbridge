import {nonnegative} from './tax-rules.js?v=69742cf391ec';
const money=v=>new Intl.NumberFormat('de-DE',{style:'currency',currency:'EUR',maximumFractionDigits:0}).format(Number(v)||0);
const expenseNumbers=(fd,key)=>{const value=fd.get(key);return value===null||value===''?0:nonnegative(value,key);};
export function calculateExpenseCore(fd){
const category=String(fd.get('category')||'Other'), year=Number(fd.get('year')||2026);
if(![2024,2025,2026].includes(year))throw Error('Choose a supported tax year.');
const selectedItem=String(fd.get('expenseItem')||'').trim();
const item=selectedItem==='Something else'?String(fd.get('customItem')||'').trim():selectedItem;
if(selectedItem==='Something else'&&!item)throw Error('Please describe the expense selected as Something else.');
if(category==='Commuting'){
 const distance=Math.floor(expenseNumbers(fd,'distance')),officeDays=Math.floor(expenseNumbers(fd,'officeDays')),homeDays=Math.floor(expenseNumbers(fd,'homeDays'));
 const maxDays=year===2024?366:365;
 if(distance>1000||officeDays>maxDays||homeDays>maxDays||officeDays+homeDays>maxDays)throw Error('Check distance and attendance days. Office days and home-office days must not overlap in this simplified calculator.');
 const mode=String(fd.get('transportMode')||'car');
 const publicCost=expenseNumbers(fd,'publicCost'),taxiCost=expenseNumbers(fd,'taxiCost'),otherCost=expenseNumbers(fd,'otherCost'),reimbursement=expenseNumbers(fd,'reimbursement');
 const perDay=year>=2026?distance*.38:Math.min(20,distance)*.30+Math.max(0,distance-20)*.38;
 const raw=perDay*officeDays;
 const distanceAllowance=mode==='car'?raw:Math.min(raw,4500);
 const publicAlternative=mode==='public'?Math.max(distanceAllowance,publicCost):distanceAllowance;
 const homeAllowance=Math.min(homeDays,210)*6;
 const actual=publicCost+taxiCost+otherCost;
 const estimated=publicAlternative+homeAllowance;
 const warning=mode==='other'?'Mixed or other transport: the €4,500 cap and route-specific treatment may differ. This figure is a screening estimate only.':mode==='public'?'Public transport actual costs are compared with the distance allowance, not added to it. Taxi costs are tracked as spending, not included as public-transport costs in this comparison.':'Your actual commuting spending is not added to the flat-rate allowance. Mixed travel and carpool rules may require another calculation.';
 return {category:'Commuting + home office',actual,estimated,year,note:String(fd.get('note')||''),details:'One-way '+distance+' km; '+officeDays+' office days; '+homeDays+' home-office days; mode: '+mode,breakdown:'Distance allowance: '+money(distanceAllowance)+'; home-office allowance: '+money(homeAllowance)+'; public transport paid: '+money(publicCost)+'; cab: '+money(taxiCost)+'; other: '+money(otherCost),warning:warning+' Employer reimbursements ('+money(reimbursement)+') have NOT been deducted automatically; check treatment.'};
}
if(category==='Home office'){
 const days=Math.floor(expenseNumbers(fd,'homeDays'));if(days>(year===2024?366:365))throw Error('Home-office days cannot exceed 366.');
 return {category,actual:0,estimated:Math.min(days,210)*6,year,note:String(fd.get('note')||''),details:days+' qualifying home-office days',breakdown:'€6 per eligible day, maximum 210 days',warning:'Check eligibility and avoid double counting any days recorded under commuting.'};
}
if(category==='Work equipment'){
 const actual=expenseNumbers(fd,'amount'),share=expenseNumbers(fd,'workShare');if(share>100)throw Error('Work-related use must be between 0% and 100%.');
 return {category,item,actual,estimated:actual*share/100,year,note:String(fd.get('note')||''),details:'Work use '+share+'%',breakdown:'Purchase price × work-use share',warning:'This is only a proportional candidate before depreciation, tax-year rules and reimbursements.'};
}
const quantity=expenseNumbers(fd,'quantity'),unit=expenseNumbers(fd,'amount');if(quantity>100000)throw Error('Please check the quantity entered.');return {category,item,actual:quantity*unit,estimated:null,year,note:String(fd.get('note')||''),details:quantity+' × '+money(unit),breakdown:quantity+' × '+money(unit)+' = '+money(quantity*unit),warning:'The spending total is calculated, but has not been assessed as a deductible tax expense.'};
}
