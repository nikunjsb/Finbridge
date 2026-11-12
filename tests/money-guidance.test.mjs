import test from 'node:test';
import assert from 'node:assert/strict';
import {moneyCheckItems, moneyCheckSummary, moneyCheckPage, moneyEvidencePanel, moneyNextSteps} from '../money-guidance.js';

test('a new check offers three actions without treating unanswered items as checked', () => {
  const result = moneyCheckSummary();
  assert.equal(result.unanswered,16);
  assert.equal(result.done,0);
  assert.equal(new Set(moneyCheckItems.map(item=>item.id)).size,16);
  assert.deepEqual(result.next.map(item=>item.id),['payslip','identifiers','settings']);
});

test('explicit review requests take priority and completed or irrelevant items are excluded', () => {
  const result = moneyCheckSummary({payslip:'done',identifiers:'na',departure:'review',pension:'review'});
  assert.equal(result.done,1);
  assert.equal(result.na,1);
  assert.equal(result.review,2);
  assert.deepEqual(result.next.map(item=>item.id),['pension','departure','settings']);
});

test('all recorded statuses give an empty action queue without asserting financial readiness', () => {
  const answers = Object.fromEntries(moneyCheckItems.map((item,index)=>[item.id,index%2?'done':'na']));
  assert.equal(moneyCheckSummary(answers).next.length,0);
  assert.match(moneyNextSteps(answers),/does not establish tax eligibility/);
});

test('invalid imported answers remain unanswered and do not enter generated HTML', () => {
  for(const answers of [null,[],42,'invalid',{payslip:'<script>alert(1)</script>'}]){
    assert.equal(moneyCheckSummary(answers).unanswered,16);
    const html = moneyCheckPage(answers,{title:()=>''});
    assert.equal((html.match(/data-money-check=/g)||[]).length,16);
    assert.doesNotMatch(html,/<script>/);
  }
});

test('calculating the action queue leaves saved answers unchanged', () => {
  const answers = Object.freeze({payslip:'done',parents:'review'});
  moneyCheckSummary(answers);
  assert.deepEqual(answers,{payslip:'done',parents:'review'});
});

test('document packs keep departure and household progress separate', () => {
  const answers = {'household:mainhome':true,'departure:payroll':true,'household:journeys':'true'};
  const household = moneyEvidencePanel('household',answers);
  const departure = moneyEvidencePanel('departure',answers);
  assert.match(household,/1 of 6 evidence groups reviewed/);
  assert.match(departure,/1 of 5 evidence groups reviewed/);
  assert.equal((household.match(/ checked>/g)||[]).length,1);
  assert.equal((departure.match(/ checked>/g)||[]).length,1);
});
