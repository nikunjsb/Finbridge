import test from 'node:test';
import assert from 'node:assert/strict';
import { workspaceSummary,workspaceEffect,overlapWarnings,spendingLabel,workspaceReport,workspaceCSV,summaryPDF,ensureExpenseIds,reviewFromForm } from '../expense-workspace-core.js';
import { commitExpense,workspaceRecords,validatePackManifest } from '../expense-workspace.js';
import { makeZip,readOwnZip,crc32,evidenceType,safeEvidenceName,MAX_FILE } from '../tax-evidence.js';
import { recordsForYear,taxRecordsCSV,adviserText } from '../tax-rules.js';
const fd=o=>{const f=new FormData();for(const [k,v] of Object.entries(o))f.set(k,String(v));return f;};
const work=(id,amount,extra={})=>({id,year:2026,category:'Work equipment',actual:amount,estimated:amount,review:{confirmed:true,amount},...extra});
const profile={scope:'single-employee',confirmed:true,income:50000,otherWork:0};
test('yearly spending separates planned purchases, allowances and unassessed support',()=>{
  const records=[work('monitor',120),work('future',600,{status:'planned'}),{id:'home',year:2026,category:'Home office',actual:0,estimated:480},{id:'support',year:2026,category:'Support to family',actual:5400,estimated:null},work('old',100,{year:2025})];
  const s=workspaceSummary(records,2026);assert.equal(s.spending,5520);assert.equal(s.plannedSpending,600);assert.equal(s.pending,2);assert.equal(s.selected.length,4);
  assert.match(spendingLabel(records[2]),/no purchase required/);
  assert.match(spendingLabel({category:'Commuting + home office',actual:0}),/not recorded/);
  assert.match(spendingLabel(records[1]),/planned/);
});
test('commuting plus separate home-office summaries trigger an overlap gate',()=>{
  const records=[work('commute',1544,{category:'Commuting + home office',actual:0,basis:{homeDays:'80'}}),work('home',480,{category:'Home office',actual:0,basis:{homeDays:'80'}})];
  assert.match(overlapWarnings(records).join(),/duplicate home-office/);assert.equal(workspaceEffect(records,2026,profile).supported,false);
  records[1].review.confirmed=false;assert.equal(workspaceEffect(records,2026,profile).supported,true);
});
test('annual caps are not bypassed by splitting home-office records into paid and planned',()=>{
  const records=[work('a',1000,{category:'Home office',basis:{homeDays:170}}),work('b',500,{category:'Home office',basis:{homeDays:90},status:'planned'})];
  assert.equal(workspaceEffect(records,2026,profile).supported,false);
});
test('one-employee allowance and existing work costs are counted once',()=>{
  // Independently observed official tax: 50,000 -> 10,548; 49,230 -> 10,278.
  const r=workspaceEffect([work('a',2000)],2026,profile);assert.equal(r.paidSaving,270);assert.equal(r.afterPaid,10278);assert.equal(r.extraDeduction,770);
  assert.equal(workspaceEffect([work('b',120)],2026,profile).paidSaving,0);
  assert.equal(workspaceEffect([work('b',120)],2026,{...profile,otherWork:2000}).paidSaving,41);
});
test('planned purchase is a separate, affordable scenario with a removal comparison',()=>{
  // Python Decimal using the statutory formula: taxable 49,110 -> tax 10,237.
  const r=workspaceEffect([work('paid',2000),work('plan',120,{status:'planned'})],2026,profile);
  assert.equal(r.paidSaving,270);assert.equal(r.plannedSaving,41);assert.equal(r.plannedNetCost,79);assert.equal(r.perRecord.plan,41);assert.equal(r.afterPlanned,10237);
});
test('ineligible scopes and missing baseline never turn into zero-saving verdicts',()=>{
  for(const [year,p] of [[2025,profile],[2026,{...profile,confirmed:false}],[2026,{...profile,scope:'joint'}],[2026,{...profile,income:''}],[2026,{...profile,income:-1}]])assert.equal(workspaceEffect([work('a',2000)],year,p).supported,false);
  assert.equal(workspaceEffect([work('a',2000)],2026,{...profile,income:12348}).paidSaving,0);
});
test('support, insurance and unreviewed amounts never inflate ordinary work savings',()=>{
  const r=workspaceEffect([work('a',2000),work('support',5400,{category:'Support to family'}),work('insurance',5000,{category:'Insurance'}),work('unchecked',4000,{review:{confirmed:false,amount:4000}})],2026,profile);
  assert.equal(r.paidSaving,270);assert.equal(r.excluded,3);
});
test('editing replaces the original record and keeps its attachment identity',()=>{
  const state={expenses:[work('a',120,{basis:{amount:'120',workShare:'100'},note:'Original'})]};
  commitExpense(state,work('ignored',200),fd({ewEditId:'a',ewStatus:'recorded',eligibleAmount:200,eligibleConfirmed:'on'}));
  assert.equal(state.expenses.length,1);assert.equal(state.expenses[0].id,'a');assert.equal(state.expenses[0].actual,200);assert.equal(state.expenses[0].note,'Original');
  assert.throws(()=>commitExpense(state,work('x',100),fd({ewEditId:'missing'})));
});
test('new planning records and unconfirmed review do not become paid claims',()=>{
  const state={expenses:[]};commitExpense(state,work('ignored',600),fd({ewStatus:'planned',eligibleAmount:600}));assert.equal(state.expenses[0].status,'planned');assert.equal(state.expenses[0].review.confirmed,false);
  assert.throws(()=>commitExpense(state,work('ignored',120),fd({eligibleAmount:121,eligibleConfirmed:'on'})));
  assert.throws(()=>reviewFromForm(fd({eligibleAmount:'',eligibleConfirmed:'on'})));
});
test('legacy identity migration retains records and is stable across reloads',()=>{
  const records=[{id:'same'},{id:'same'},{}];let n=0;assert.equal(ensureExpenseIds(records,()=>`new-${++n}`),true);assert.deepEqual(records.map(r=>r.id),['same','new-1','new-2']);assert.equal(ensureExpenseIds(records,()=>{throw Error('unexpected');}),false);
});
test('existing adviser exports exclude plans from paid claims and label them separately',()=>{
  const records=[work('a',120),work('plan',999,{status:'planned'})];assert.equal(recordsForYear(records,2026).selected.length,1);assert.doesNotMatch(taxRecordsCSV(records,2026),/999/);assert.match(adviserText({expenses:records},2026),/PLANNED PURCHASES — NOT PAID CLAIMS/);
});
test('HTML and spreadsheet exports handle untrusted text without executable output',()=>{
  const r=work('a',120,{item:'<img src=x onerror=alert(1)>',note:'  =HYPERLINK("x")'});const html=workspaceRecords({expenses:[r]});assert.doesNotMatch(html,/<img/);assert.match(html,/&lt;img/);assert.match(workspaceCSV([r],2026),/"'  =HYPERLINK/);
});
test('report includes status, selected-year evidence, assumptions and unsupported categories',()=>{
  const records=[work('a',2000),work('plan',120,{status:'planned'}),work('old',777,{year:2025})];const report=workspaceReport(records,2026,profile,[{recordId:'a',name:'invoice.pdf',size:123}]);assert.match(report,/invoice.pdf/);assert.match(report,/PLANNED/);assert.match(report,/not a return|No return submitted/);assert.doesNotMatch(report,/777/);assert.match(report,/Family support, insurance/);
});
test('PDF summary has valid object offsets and paginates long packs',()=>{
  const bytes=summaryPDF('AtlasEveryday\n'+('A line (with parentheses) and EUR 120\n'.repeat(130)));const text=new TextDecoder().decode(bytes);assert.match(text,/^%PDF-1.4/);assert.match(text,/\/Count 3/);const start=Number(/startxref\n(\d+)/.exec(text)[1]);assert.equal(text.slice(start,start+4),'xref');assert.match(text,/\\\(with parentheses\\\)/);
});
test('ZIP preserves original bytes and CRC matches the published reference vector',()=>{
  const bytes=new TextEncoder().encode('123456789');assert.equal(crc32(bytes),0xcbf43926);const zip=makeZip([{name:'preparation.txt',bytes:'hello'},{name:'evidence/a/file.pdf',bytes}]);const out=readOwnZip(zip);assert.equal(new TextDecoder().decode(out.get('preparation.txt')),'hello');assert.deepEqual(out.get('evidence/a/file.pdf'),bytes);
});
test('corrupt, compressed, repeated and unsafe ZIP entries are rejected',()=>{
  const zip=makeZip([{name:'a.txt',bytes:'hello'}]);const corrupt=zip.slice();corrupt[35]^=1;assert.throws(()=>readOwnZip(corrupt));const compressed=zip.slice();compressed[8]=8;assert.throws(()=>readOwnZip(compressed));for(const name of ['../x','/absolute','a\\x'])assert.throws(()=>readOwnZip(makeZip([{name,bytes:'x'}])));assert.throws(()=>readOwnZip(makeZip([{name:'a',bytes:'x'},{name:'a',bytes:'y'}])));
});
test('receipt type, signature and size must agree; names cannot become ZIP paths',()=>{
  assert.equal(evidenceType(new TextEncoder().encode('%PDF-1.4'),'test.pdf'),'application/pdf');assert.equal(evidenceType(new Uint8Array([255,216,255,0]),'test.jpg'),'image/jpeg');assert.throws(()=>evidenceType(new TextEncoder().encode('<html>'),'x.pdf'));assert.throws(()=>evidenceType(new TextEncoder().encode('%PDF-1.4'),'x.html'));assert.throws(()=>evidenceType(new Uint8Array(MAX_FILE+1),'x.pdf'));assert.equal(safeEvidenceName('../../invoice.pdf'),'_.._invoice.pdf');
});
test('pack import validates linkage, duplicate IDs and receipt metadata before writing',()=>{
  const bytes=new TextEncoder().encode('%PDF-1.4');const path='evidence/a/file-invoice.pdf';const manifest={format:'atlaseveryday-tax-pack',version:1,records:[work('a',120)],files:[{id:'file',recordId:'a',name:'invoice.pdf',path,type:'application/pdf',size:bytes.length}]};const entries=new Map([[path,bytes]]);assert.equal(validatePackManifest(manifest,entries),manifest);assert.throws(()=>validatePackManifest({...manifest,records:[work('a',1),work('a',2)]},entries));assert.throws(()=>validatePackManifest({...manifest,files:[{...manifest.files[0],recordId:'missing'}]},entries));assert.throws(()=>validatePackManifest({...manifest,files:[{...manifest.files[0],size:99}]},entries));
});
