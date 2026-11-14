import test from 'node:test';
import assert from 'node:assert/strict';
import { buildCompanionPlan, companionResultsHTML, companionPage, companionPlanText, companionExamples, situationPaths } from '../tax-companion.js';
import { taxPlanningPage } from '../tax-planning.js';

test('unknown facts remain unresolved rather than creating eligibility or a refund',()=>{
  const p=buildCompanionPlan();
  assert.equal(p.input.employment,'unknown');assert.equal(p.budget,null);assert.equal(p.horizon,null);
  assert.ok(p.questions.length>=4);assert.match(p.household,/Unresolved/);
  assert.match(companionResultsHTML(),/No refund calculated or return submitted/);
});
test('student, parent and cross-border circumstances coexist without class assignment',()=>{
  const p=buildCompanionPlan({situations:['student','singleparent','abroad'],education:'later'});
  assert.equal(p.situations.length,3);assert.equal(p.input.taxclass,'unknown');
  assert.ok(p.review.some(x=>/Cross-border/.test(x)));assert.ok(p.questions.some(x=>/class II is not automatic/.test(x)));
});
test('first education cannot be presented as a general loss carryforward',()=>{
  const p=buildCompanionPlan({...companionExamples.student,education:'first'});
  assert.match(p.education,/€6,000/);assert.match(p.education,/does not create a loss carryforward/);
  assert.match(companionResultsHTML({...companionExamples.student,education:'first'}),/Anlage Sonderausgaben/);
});
test('further education requires an overall qualifying loss, not just study spending',()=>{
  const p=buildCompanionPlan(companionExamples.student);
  assert.match(p.education,/overall qualifying loss/);assert.match(p.education,/professional connection/);
  assert.match(companionResultsHTML(companionExamples.student),/Fortbildungskosten/);
});
test('flat-rate minijob and no-withholding cases do not imply a wage-tax refund',()=>{
  assert.match(buildCompanionPlan({...companionExamples.student,employment:'mini'}).wage,/flat-rate tax is not claimed back/);
  assert.match(buildCompanionPlan({...companionExamples.student,withheld:'no'}).wage,/no wage-tax refund/);
});
test('unknown student qualification stops assignment of a filing category',()=>{
  const html=companionResultsHTML({situations:['student']});
  assert.match(html,/Category unresolved/);assert.doesNotMatch(html,/Education costs<\/td><td>Anlage N/);
});
test('commuting alone cannot establish a second-household claim',()=>{
  for(const key of ['firstworkplace','overnight','mainhome','contributes']){
    assert.match(buildCompanionPlan({...companionExamples.commuter,[key]:'no'}).household,/Not established/);
    assert.match(buildCompanionPlan({...companionExamples.commuter,[key]:'unknown'}).household,/Unresolved/);
  }
});
test('positive second-household answers remain conditional and avoid duplicate fuel claims',()=>{
  assert.match(buildCompanionPlan(companionExamples.commuter).household,/not an eligibility approval/);
  const html=companionResultsHTML(companionExamples.commuter);
  assert.match(html,/Do not add fuel again/);assert.match(html,/generally one actual home journey per week/);
  assert.match(html,/extension remains pending/);
});
test('year changes are retained and contradictory none selection is rejected',()=>{
  assert.deepEqual(buildCompanionPlan({changes:['marriage','baby','job']}).changes,['marriage','baby','job']);
  assert.throws(()=>buildCompanionPlan({changes:['none','baby']}),/either/);
});
test('complex income and unsupported profiles flag individual review',()=>{
  for(const id of ['selfemployed','widowed','retired','abroad']) assert.ok(buildCompanionPlan({situations:[id]}).review.length);
  assert.ok(buildCompanionPlan({employment:'self'}).review.length);
});
test('annual budget and horizon validate boundaries and never generate a tax ranking',()=>{
  assert.equal(buildCompanionPlan({budget:'0',horizon:'1'}).budget,0);
  for(const budget of [-1,'bad',Infinity,null,1000001]) assert.throws(()=>buildCompanionPlan({budget}));
  for(const horizon of [0,61,1.5,'bad']) assert.throws(()=>buildCompanionPlan({horizon}));
  const p=buildCompanionPlan({budget:'6000',horizon:'20'});assert.equal(p.budget,6000);assert.equal(p.horizon,20);
  assert.match(companionResultsHTML({budget:'6000',horizon:'20'}),/no investment allocation or tax saving is calculated/);
});
test('2026 is preparation only and does not claim verified final form mappings',()=>{
  const html=companionResultsHTML({...companionExamples.student,year:'2026'});
  assert.match(html,/still in progress/);assert.match(html,/2026 final forms must be rechecked/);
});
test('export includes selected year, known answers, unresolved facts and source URLs',()=>{
  const text=companionPlanText({...companionExamples.commuter,year:'2026',budget:'6000',horizon:'20'});
  assert.match(text,/self-filing preparation \/ 2026/);assert.match(text,/6000 EUR/);assert.match(text,/20 years/);
  assert.match(text,/Financially|financially/);assert.match(text,/https:\/\/www.elster.de/);
  assert.match(text,/no return submitted/);assert.match(text,/No tax ranking/);
});
test('untrusted identifiers are discarded and cannot inject HTML into output',()=>{
  const html=companionResultsHTML({situations:['<img src=x onerror=alert(1)>'],year:'<script>',education:'<script>',changes:['<svg>']});
  assert.doesNotMatch(html,/<script|<svg|onerror/);assert.match(html,/Not sure \/ general checklist/);
});
test('all thirteen situations expose coverage, and form controls are labelled',()=>{
  const html=companionPage();assert.equal(situationPaths.length,13);
  for(const [id,label] of situationPaths){assert.ok(html.includes('value="'+id+'"'));assert.ok(html.includes(label));}
  assert.match(html,/<legend>/);assert.match(html,/aria-live="polite"/);assert.match(html,/Download my preparation plan/);
});
test('new preparation route integrates alongside existing worksheets',()=>{
  const render={title:()=>''};
  assert.match(taxPlanningPage('prepare',{},render),/id="taxCompanion"/);
  assert.match(taxPlanningPage('work',{},render),/id="taxWorkbench"/);
  assert.match(taxPlanningPage('finder',{},render),/#taxplan\/prepare/);
});
