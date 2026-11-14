// Plain-language presentation only. Does not calculate eligibility or a refund.
const text=v=>String(v??'').replace(/[\r\n\x00-\x1f]/g,' ').trim();
const amount=v=>new Intl.NumberFormat('en-IE',{style:'currency',currency:'EUR'}).format(Number(v));
const valid=v=>['string','number'].includes(typeof v)&&String(v).trim()!==''&&Number.isFinite(Number(v))&&Number(v)>=0;
const work=['Commuting','Commuting + home office','Home office','Work equipment','Professional education','Business travel'];
const guidance={
  'Home office':['Anlage N — home-office daily allowance','Keep a dated home-working log and check qualifying days. A purchase invoice is not normally the evidence for this daily allowance.','Check whether these days are already included in a commuting record.'],
  'Commuting':['Anlage N — journeys to the first workplace','Keep workplace attendance, one-way distance/route, transport evidence where relevant and employer reimbursement details.','Check the annual travel basis and any overlap with other commuting or home-office entries.'],
  'Commuting + home office':['Anlage N — journeys to the first workplace and home-office daily allowance','Keep dated office/home-working records, one-way distance, relevant transport evidence and employer reimbursements.','Home-office days included here must not be claimed again in another record.'],
  'Work equipment':['Anlage N — work equipment / Arbeitsmittel','Keep the invoice, purchase/payment date, work-use explanation and employer reimbursement details.','Confirm the work-related share and the deductible amount for this year, including any depreciation.'],
  'Professional education':['Classify education first: Anlage N or Anlage Sonderausgaben','Keep course/exam invoices, payment dates, course purpose, previous qualification and grants/reimbursements.','Distinguish initial education from professional or subsequent education before claiming.'],
  'Business travel':['Anlage N — employment-related travel costs','Keep trip dates/purpose, tickets, accommodation and employer reimbursement records.','Separate business trips from ordinary commuting and reconcile reimbursements.'],
  'Support to family':['Anlage Unterhalt — maintenance support, subject to eligibility','Keep bank transfer confirmations, recipient/relationship details, recipient income/assets, support months and required declarations.','Complete the parent-support review. Country, household and financial-need rules can reduce or eliminate a deduction.'],
  'Insurance':['Check classification: commonly Anlage Vorsorgeaufwand; work insurance may differ','Keep annual insurer/provider certificates, payment/refund details and prefilled tax entries.','Reconcile certificates and prefilled amounts before entering a contribution again.']
};
const inputLabels={homeDays:'Qualifying home-office days',officeDays:'Office travel days',distance:'One-way distance (km)',transportMode:'Transport',publicCost:'Actual public-transport spending',taxiCost:'Actual taxi spending',otherCost:'Other recorded travel spending',reimbursement:'Employer commuting reimbursements',amount:'Purchase price / amount per payment',quantity:'Number of payments / items',workShare:'Work-related use (%)'};
export function friendlyExpenseRecord(r,index,receipts=[]){
  const g=guidance[r.category]||['Classify the expense before choosing an ELSTER section','Keep the invoice/payment evidence and an explanation of the tax purpose.','Review this expense in the relevant preparation tool before claiming.'];
  const planned=r.status==='planned',home=r.category==='Home office',commute=['Commuting','Commuting + home office'].includes(r.category),spent=r.actual??r.amount;
  const spending=planned?(valid(spent)?amount(spent)+' planned — not yet a paid claim':'Planned cost not recorded'):home?'Daily allowance: no separate purchase amount is required':commute&&Number(spent)===0?'Actual travel spending not recorded — the allowance is calculated separately':valid(spent)?amount(spent)+' recorded':'Not recorded';
  const candidate=valid(r.estimated)?amount(r.estimated)+' potential deduction; not a refund':r.category==='Support to family'?'Not assessed — recipient eligibility and limits still need checking':'Not assessed — check the relevant tax category and conditions';
  const lines=['',String(index+1)+'. '+text(r.item||r.category).toUpperCase(),'   Category: '+text(r.category)+' | '+(planned?'PLANNED — NOT PAID':'RECORDED')+' | Tax year: '+text(r.year||'not assigned'),'   Spending: '+spending,'   Preliminary tax treatment: '+candidate];
  if(r.review?.confirmed===true&&work.includes(r.category)&&valid(r.review.amount))lines.push('   Work amount reviewed by the user: '+amount(r.review.amount)+' for this year, after reimbursements. This is not approval by the tax office.');
  else lines.push('   Review status: '+(work.includes(r.category)?'Work amount not confirmed for the tax comparison.':'Separate eligibility review required; not included in the work-tax comparison.'));
  const hasReadableInputs=r.basis&&Object.keys(inputLabels).some(k=>r.basis[k]!==undefined&&r.basis[k]!==null&&String(r.basis[k]).trim()!=='');
  if(r.details&&!hasReadableInputs)lines.push('   Recorded basis: '+text(r.details));
  if(r.basis&&typeof r.basis==='object')for(const [key,label] of Object.entries(inputLabels)){const value=r.basis[key];if(value!==undefined&&value!==null&&String(value).trim()!=='')lines.push('   '+label+': '+text(value));}
  lines.push('   '+(home||commute?'Period / dates: ':'Purchase / payment date: ')+(r.paymentDate?text(r.paymentDate):home||commute?'Annual summary; keep the dated work log separately.':'Not recorded — check the invoice or bank statement.'),'   Evidence to gather: '+g[1]);
  const attached=receipts.filter(f=>f.recordId===r.id);
  if(attached.length)lines.push('   Included evidence files: '+attached.map(f=>text(f.name)).join('; '));
  lines.push('   Written evidence reference: '+(r.receiptRef?text(r.receiptRef):'No reference entered. This alone does not establish whether evidence is missing.'),'   Next action: '+g[2],'   German form section: '+g[0]);
  if(r.note)lines.push('   Your note: '+text(r.note));
  if(r.warning)lines.push('   Calculation limitation: '+text(r.warning));
  return lines;
}
export function friendlyExpenseSection(records,year){
  const cash=records.reduce((s,r)=>s+(valid(r.actual??r.amount)?Number(r.actual??r.amount):0),0),unassessed=records.filter(r=>!valid(r.estimated)).length;
  const lines=['','EXPENSE RECORDS FOR '+year,'AT A GLANCE','Recorded spending: '+amount(cash)+' across '+records.length+' record(s).','Daily allowances are separate from cash spending; unrecorded costs are not inferred.','No preliminary deduction amount for '+unassessed+' record(s).','Refund estimate: not calculated here. A deduction is not a euro-for-euro refund.','Read each tax category separately; do not add support/insurance amounts to work expenses.'];
  if(!records.length)lines.push('No expense records for this tax year.');
  for(const [i,r] of records.entries())lines.push(...friendlyExpenseRecord(r,i));
  lines.push('','ATTACHMENTS','This text pack does not inspect the local receipt store or contain attachment bytes.','Use the tax workspace filing ZIP for any original files attached to the records.');
  return lines;
}
