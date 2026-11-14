import test from 'node:test';
import assert from 'node:assert/strict';
import { adviserText } from '../tax-rules.js';
import { friendlyExpenseRecord,friendlyExpenseSection } from '../expense-records-report.js';
import { workspaceReport } from '../expense-workspace-core.js';
const records=[{id:'home',year:2026,category:'Home office',actual:0,estimated:480,basis:{homeDays:'80'}},{id:'monitor',year:2026,category:'Work equipment',item:'Monitor or screen',actual:120,estimated:120,basis:{amount:'120',workShare:'100'}},{id:'support',year:2026,category:'Support to family',item:'Financial support to parent',actual:5400,estimated:null,basis:{amount:'450',quantity:'12'}}];
test('adviser expense section separates spending, allowances and unassessed support',()=>{
 const report=friendlyExpenseSection(records,2026).join('\n');assert.match(report,/€5,520.00 across 3 record/);assert.match(report,/no separate purchase amount/);assert.doesNotMatch(report,/actual spending EUR: 0/);assert.match(report,/Qualifying home-office days: 80/);assert.match(report,/recipient eligibility and limits/);assert.match(report,/Anlage Unterhalt/);assert.match(report,/Work-related use \(%\): 100/);
});
test('raw expense and worksheet inputs appear only in the reference appendix',()=>{
 const text=adviserText({expenses:records,taxWorkbenches:{work:{2026:{input:{distance:20},result:{kind:'work',year:2026,supported:true}}}}},2026),[main,appendix]=text.split('REFERENCE APPENDIX — ORIGINAL CALCULATION INPUTS');assert.doesNotMatch(main,/"homeDays"|"distance":20/);assert.match(appendix,/"homeDays":"80"/);assert.match(appendix,/"distance":20/);assert.match(main,/Evidence to gather:/);assert.match(main,/German form section:/);
});
test('annual summaries request work logs rather than unnecessary purchase invoices',()=>{
 const home=friendlyExpenseRecord(records[0],0).join('\n'),monitor=friendlyExpenseRecord(records[1],1).join('\n');assert.match(home,/Annual summary; keep the dated work log/);assert.match(home,/A purchase invoice is not normally/);assert.match(monitor,/Not recorded — check the invoice or bank statement/);assert.match(monitor,/No reference entered.*does not establish whether evidence is missing/);
});
test('ZIP PDF/TXT use the same readable records and retain attachment names and plans',()=>{
 const report=workspaceReport([...records,{...records[1],id:'plan',status:'planned'}],2026,{},[{recordId:'monitor',name:'invoice.pdf',size:120}]);assert.match(report,/Included evidence files: invoice.pdf/);assert.match(report,/PLANNED — NOT PAID/);assert.match(report,/Number of payments \/ items: 12/);assert.doesNotMatch(report,/"homeDays"/);
});
