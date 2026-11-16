import { tariff2026 } from './tax-rules.js?v=f05ad518f34c';
// Full-year scenarios, not a filing assessment. No future tax law or bank quote is inferred.
export const propertySources={
 tariff:'https://www.gesetze-im-internet.de/estg/__32a.html',
 depreciation:'https://www.gesetze-im-internet.de/estg/__7.html',
 rent:'https://www.gesetze-im-internet.de/estg/__21.html',
 allocation:'https://www.bundesfinanzministerium.de/Content/DE/Downloads/Steuern/Berechnung-Aufteilung-Grundstueckskaufpreis.html',
 principal:'https://www.bundesfinanzhof.de/de/entscheidung/entscheidungen-online/detail/STRE202310209/',
 repairs:'https://www.bundesfinanzministerium.de/Content/DE/Downloads/BMF_Schreiben/Steuerarten/Einkommensteuer/2026-01-26-instandsetzung-modernisierung-gebaeude.pdf?__blob=publicationFile',
 reserve:'https://www.elster.de/eportal/helpGlobal?themaGlobal=help_fein_2025',
 rates:'https://www.bundesbank.de/resource/blob/615022/f83a780ee70764cd5dd7398d28c5454c/472B63F073F071307366337C94F8C870/s510atgv-data.pdf'
};
export const propertyDefaults={version:1,year:2026,use:'rental',price:200000,purchaseCosts:20000,initialWorks:0,equity:40000,buffer:10000,availableCash:60000,monthlyBudget:500,rate:4,loanYears:30,fixedYears:10,refinanceRate:4,horizon:15,rent:1000,vacancy:5,annualCosts:3000,deductibleCosts:2000,rentGrowth:0,costGrowth:2,valueGrowth:0,sellingPercent:3,buildingShare:80,buildYear:1990,income:60000,assessment:'single',taxConfirmed:'',stressVacancy:20,stressRentCut:10,stressRateRise:2,stressRepair:5000,stressValueGrowth:-2,apr:'',offerName:'',quotedOn:''};
const round=n=>Math.round((n+Number.EPSILON)*100)/100;
const numeric={price:[1,10000000],purchaseCosts:[0,2000000],initialWorks:[0,2000000],equity:[0,14000000],buffer:[0,10000000],availableCash:[0,20000000],monthlyBudget:[0,1000000],rate:[0,20],loanYears:[1,40],fixedYears:[1,40],refinanceRate:[0,20],horizon:[1,40],rent:[0,50000],vacancy:[0,100],annualCosts:[0,1000000],deductibleCosts:[0,1000000],rentGrowth:[-10,5],costGrowth:[0,10],valueGrowth:[-10,10],sellingPercent:[0,20],buildingShare:[.01,100],stressVacancy:[0,100],stressRentCut:[0,100],stressRateRise:[0,10],stressRepair:[0,2000000],stressValueGrowth:[-20,10]};
function num(v,label,min,max){if(!['number','string'].includes(typeof v)||(typeof v==='string'&&!/^-?\d+(?:\.\d+)?$/.test(v))||!Number.isFinite(Number(v))||Number(v)<min||Number(v)>max)throw Error('Check '+label+' ('+min+' to '+max+').');return Number(v);}
const pick=(v,values,label)=>{if(!values.includes(v))throw Error('Check '+label+'.');return v;};
export function validatePropertyInput(raw){
 if(!raw||typeof raw!=='object'||Array.isArray(raw)||raw.version!==1||!['number','string'].includes(typeof raw.year)||String(raw.year)!=='2026')throw Error('Unsupported property worksheet version or tax reference year.');
 const x={version:1,year:2026};
 for(const [k,[min,max]] of Object.entries(numeric))x[k]=num(raw[k],k,min,max);
 for(const k of ['loanYears','fixedYears','horizon'])if(!Number.isInteger(x[k]))throw Error('Use whole years for '+k+'.');
 x.use=pick(raw.use,['rental','own','mixed'],'property use');x.assessment=pick(raw.assessment,['single','joint'],'assessment');x.taxConfirmed=pick(raw.taxConfirmed,['','yes','no'],'tax review');
 x.apr=raw.apr===''||raw.apr===null?null:num(raw.apr,'effective annual rate for reference',0,30);
 x.income=raw.income===''||raw.income===null?null:num(raw.income,'baseline taxable income',0,5000000);
 x.buildYear=raw.buildYear===''||raw.buildYear===null?null:num(raw.buildYear,'completion year',1700,2026);if(x.buildYear!==null&&!Number.isInteger(x.buildYear))throw Error('Enter a whole building completion year.');
 if(x.equity>x.price+x.purchaseCosts+x.initialWorks)throw Error('Own funds applied cannot exceed the purchase and upfront costs. Keep surplus savings in the buffer.');
 if(x.fixedYears>x.loanYears)throw Error('The fixed-interest period cannot exceed the repayment term in this model.');
 if(x.deductibleCosts>x.annualCosts)throw Error('The deductible portion cannot exceed annual cash costs. Do not add interest or depreciation here.');
 if(x.stressVacancy<x.vacancy)throw Error('Downside vacancy must be at least the expected vacancy.');
 if(x.stressValueGrowth>x.valueGrowth)throw Error('Downside property growth must not exceed expected growth.');
 if(x.refinanceRate+x.stressRateRise>20)throw Error('The stressed refinancing rate exceeds this model’s 20% limit.');
 for(const k of ['offerName','quotedOn']){if(typeof raw[k]!=='string'||raw[k].length>(k==='offerName'?100:10)||/[\u0000-\u001f\u007f]/.test(raw[k]))throw Error('Check the quote label/date.');x[k]=raw[k].trim();}
 if(x.quotedOn&&(!/^20\d\d-\d\d-\d\d$/.test(x.quotedOn)||!Number.isFinite(Date.parse(x.quotedOn+'T00:00:00Z'))||new Date(x.quotedOn+'T00:00:00Z').toISOString().slice(0,10)!==x.quotedOn))throw Error('Enter a real quote date.');
 if(x.offerName&&!x.quotedOn)throw Error('Add the date of the bank quote, or clear its label for an anonymous scenario.');
 return x;
}
export function mortgagePayment(principal,annualRate,months){
 const p=num(principal,'loan',0,14000000),r=num(annualRate,'interest',0,20)/1200,n=num(months,'repayment months',1,480);if(!Number.isInteger(n))throw Error('Use whole repayment months.');
 if(!p)return 0;return r===0?p/n:p*r/-Math.expm1(-n*Math.log1p(r));
}
export function mortgageSchedule(principal,rate,years,fixedYears,refinanceRate,horizon){
 const p=num(principal,'loan',0,14000000);num(years,'repayment years',1,40);num(fixedYears,'fixed years',1,40);num(horizon,'horizon',1,40);num(refinanceRate,'refinancing rate',0,20);
 if(![years,fixedYears,horizon].every(Number.isInteger)||fixedYears>years)throw Error('Check the loan periods.');
 let balance=round(p),payment=round(mortgagePayment(p,rate,years*12)),refinancePayment=null;const initialPayment=payment,rows=[];
 for(let month=1;month<=horizon*12;month++){
  if(month===fixedYears*12+1&&month<=years*12&&balance>0){payment=round(mortgagePayment(balance,refinanceRate,years*12-month+1));refinancePayment=payment;}
  const currentRate=month<=fixedYears*12?rate:refinanceRate;
  const interest=balance>0?round(balance*currentRate/1200):0;
  const paid=balance>0?round(month===years*12?balance+interest:Math.min(payment,balance+interest)):0;
  const repaid=round(paid-interest);balance=round(Math.max(0,balance-repaid));
  rows.push({month,interest,principal:repaid,payment:paid,balance});
 }
 return {initialPayment,refinancePayment,rows};
}
export function propertyCalculation(raw){
 const x=validatePropertyInput(raw),loan=round(x.price+x.purchaseCosts+x.initialWorks-x.equity),upfront=round(x.equity+x.buffer),buildingBasis=round((x.price+x.purchaseCosts)*x.buildingShare/100);
 const depreciationRate=x.buildYear===null?null:x.buildYear>=2023?.03:x.buildYear>=1925?.02:.025;
 const reasons=[];
 if(x.use!=='rental')reasons.push(x.use==='own'?'Owner-occupied home: this rental-tax model does not assess private-home relief.':'Mixed use: actual loan/cost allocation needs separate review; no proportional tax shortcut is applied.');
 if(x.taxConfirmed!=='yes')reasons.push('Confirm the ordinary German rental-tax conditions and the verified deductible-cost/building allocation before enabling the tax illustration.');
 if(x.income===null)reasons.push('Enter taxable income excluding this property, not gross salary.');
 if(x.buildYear===null)reasons.push('Confirm the building’s completion year.');
 if(x.initialWorks>0)reasons.push('Upfront renovation is included in financing/cash needs, but its immediate-versus-capital tax classification requires separate review. Tax illustration unavailable.');
 const taxSupported=reasons.length===0;
 const scenario=stress=>{
  const mortgage=mortgageSchedule(loan,x.rate,x.loanYears,x.fixedYears,x.refinanceRate+(stress?x.stressRateRise:0),x.horizon);
  let cumulativeCash=0,cumulativeAfter=0,remainingBasis=buildingBasis;const years=[];
  for(let y=1;y<=x.horizon;y++){
   const months=mortgage.rows.slice((y-1)*12,y*12),interest=round(months.reduce((s,r)=>s+r.interest,0)),principal=round(months.reduce((s,r)=>s+r.principal,0)),debtPaid=round(interest+principal);
   const potentialRent=x.use==='own'?0:x.rent*12*(1+x.rentGrowth/100)**(y-1)*(stress?1-x.stressRentCut/100:1);
   const rent=round(potentialRent*(1-(stress?x.stressVacancy:x.vacancy)/100));
   const ordinaryCosts=round(x.annualCosts*(1+x.costGrowth/100)**(y-1)),repair=stress&&y===1?x.stressRepair:0,costs=round(ordinaryCosts+repair);
   const deductible=round(x.deductibleCosts*(1+x.costGrowth/100)**(y-1));
   const depreciation=!taxSupported||depreciationRate===null?null:round(Math.min(remainingBasis,buildingBasis*depreciationRate));if(depreciation!==null)remainingBasis=round(Math.max(0,remainingBasis-depreciation));
   const rentalResult=taxSupported?round(rent-interest-deductible-depreciation):null;
   let taxBefore=null,taxAfter=null,taxDelta=null;
   if(taxSupported){const adjusted=Math.max(0,x.income+rentalResult);if(adjusted>10000000)throw Error('Projected taxable income exceeds the model limit. Reduce the scenario range.');taxBefore=tariff2026(x.income,x.assessment==='joint');taxAfter=tariff2026(adjusted,x.assessment==='joint');taxDelta=taxAfter-taxBefore;}
   const cashBefore=round(rent-costs-debtPaid),cashAfter=taxDelta===null?null:round(cashBefore-taxDelta);
   cumulativeCash=round(cumulativeCash+cashBefore);if(cashAfter!==null)cumulativeAfter=round(cumulativeAfter+cashAfter);
   const value=round(x.price*(1+(stress?x.stressValueGrowth:x.valueGrowth)/100)**y),balance=months.at(-1).balance;
   years.push({year:y,rent,costs,deductible,repair,interest,principal,debtPaid,depreciation,rentalResult,taxBefore,taxAfter,taxDelta,cashBefore,cashAfter,cumulativeCash,cumulativeAfter:taxSupported?cumulativeAfter:null,value,balance,equity:round(value-balance),unusedLoss:taxSupported?round(Math.max(0,-(x.income+rentalResult))):null});
  }
  const final=years.at(-1),saleCosts=round(final.value*x.sellingPercent/100),netEquity=round(final.equity-saleCosts),cumulative=taxSupported?cumulativeAfter:cumulativeCash;
  return {label:stress?'Difficult case':'Expected case',mortgage:{initialPayment:mortgage.initialPayment,refinancePayment:mortgage.refinancePayment},years,final,netEquity,saleCosts,scenarioGain:round(netEquity-x.equity+cumulative),worstAnnualFunding:round(Math.max(0,...years.map(r=>-(r.cashAfter??r.cashBefore)))),totalPrincipal:round(loan-final.balance)};
 };
 const expected=scenario(false),difficult=scenario(true),warnings=[...reasons];
 if(x.apr!==null&&x.apr<x.rate)warnings.push('The entered effective annual rate is below the nominal borrowing rate. Recheck the quote and whether the two figures describe the same loan.');
 if(upfront>x.availableCash)warnings.push('Upfront cash including the buffer exceeds your entered savings by EUR '+round(upfront-x.availableCash).toFixed(2)+'. This is not a bank affordability decision.');
 for(const r of [expected,difficult])if(r.worstAnnualFunding/12>x.monthlyBudget)warnings.push(r.label+': the largest yearly funding requirement exceeds your entered monthly budget. Yearly averages can hide bill/payment timing.');
 if(loan>x.price)warnings.push('The loan exceeds the property price: some purchase/upfront costs are financed. This may affect bank terms and increases leverage.');
 if(difficult.final.equity<0)warnings.push('Difficult case: projected property value is below the remaining debt. A sale may require additional cash.');
 if(x.horizon<=x.fixedYears)warnings.push('The selected horizon does not reach refinancing. The difficult case still stresses rent, vacancy, repairs and value; extend the horizon to inspect refinancing risk.');
 if(expected.years.some(r=>r.unusedLoss>0)||difficult.years.some(r=>r.unusedLoss>0))warnings.push('A rental loss exceeds the baseline taxable income in at least one year. No carry-back/forward benefit is calculated.');
 warnings.push('Each year is a full 12-month planning scenario. 2026 tax rules and baseline taxable income are frozen, including future scenario years. Actual purchase-year timing, future laws, Soli, church tax, sale taxes, grants and other deductions are excluded.');
 warnings.push('Unexpected downside repairs are a cash expense only here; no unverified immediate tax deduction is assumed. Sale proceeds are before disposal tax, early repayment penalties and unmodelled charges. The cash buffer is held aside, not counted as invested profit.');
 return {input:x,loan,upfront,buildingBasis,depreciationRate,taxSupported,taxReasons:reasons,expected,difficult,warnings,grossRentalYield:x.use==='rental'?round(x.rent*12/x.price*100):null};
}
export function propertyReport(raw){const r=propertyCalculation(raw);return ['ATLASEVERYDAY — PROPERTY PURCHASE PLANNING','Illustration reviewed 16 November 2026. Scenarios, not a bank offer, tax refund or purchase recommendation.',`Use: ${r.input.use}. Quote: ${r.input.offerName||'anonymous scenario'} / ${r.input.quotedOn||'undated assumption'}`,`Upfront cash including ring-fenced buffer: EUR ${r.upfront.toFixed(2)}; loan: EUR ${r.loan.toFixed(2)}`,`Tax illustration: ${r.taxSupported?'2026 tariff held constant in every full-year scenario':'unavailable — review conditions'}`,...[r.expected,r.difficult].flatMap(s=>['',s.label,`Initial monthly payment EUR ${s.mortgage.initialPayment.toFixed(2)}; refinancing payment ${s.mortgage.refinancePayment===null?'outside horizon / loan repaid':s.mortgage.refinancePayment.toFixed(2)}`,`Year 1 cash before tax EUR ${s.years[0].cashBefore.toFixed(2)}; after tax ${s.years[0].cashAfter===null?'not assessed':s.years[0].cashAfter.toFixed(2)}`,`Year ${r.input.horizon} debt EUR ${s.final.balance.toFixed(2)}; equity before sale costs/tax EUR ${s.final.equity.toFixed(2)}`,`Scenario gain after assumed sale costs, before disposal tax/inflation: EUR ${s.scenarioGain.toFixed(2)}. This includes ${r.taxSupported?'the frozen tariff illustration':'pre-tax cash flow only'}.`]),'','CHECKS / LIMITS',...r.warnings,'','REFERENCE INPUTS',JSON.stringify(r.input),'','OFFICIAL REFERENCES',...Object.entries(propertySources).map(([k,v])=>k+': '+v)].join('\n');}
export function propertyCSV(raw){const r=propertyCalculation(raw),rows=[['Scenario','Year (full-year illustration)','Rent EUR','Cash owner costs EUR','Interest EUR','Principal repaid EUR','Annual building depreciation EUR','Taxable rental result EUR','2026 tariff tax change EUR (positive = more tax)','Cash before tax EUR','Cash after tax EUR','Debt EUR','Property equity EUR (before sale costs/tax)']];for(const s of [r.expected,r.difficult])for(const y of s.years)rows.push([s.label,y.year,y.rent,y.costs,y.interest,y.principal,y.depreciation,y.rentalResult,y.taxDelta,y.cashBefore,y.cashAfter,y.balance,y.equity]);return '\uFEFF'+rows.map(row=>row.map(v=>'"'+String(v??'Not assessed').replace(/"/g,'""')+'"').join(',')).join('\r\n');}
