import test from 'node:test';
import assert from 'node:assert/strict';
import { investmentDefaults, normalizeInvestment, projectInvestment, investmentPlan, investmentCSV } from '../investment-core.js';
import { investmentPage } from '../investment-planner.js';

const base = { ...investmentDefaults, initial: 0, monthly: 0, years: 1, rate: 0, spread: 0, annual: 0, step: 0, annualFee: 0, purchaseFee: 0, inflation: 0, goal: 0 };
const close = (actual, expected, tolerance = 1e-7) => assert.ok(Math.abs(actual - expected) <= tolerance, `${actual} != ${expected}`);

test('zero-growth cash contributions reconcile without manufactured investment gains', () => {
  const p = projectInvestment({ ...base, initial: 1200, monthly: 100 });
  assert.equal(p.balance, 2400); assert.equal(p.contributed, 2400); assert.equal(p.netGain, 0); assert.equal(p.feesPaid, 0);
  assert.equal(p.rows.length, 2); assert.equal(p.rows[0].balance, 1200);
});
test('effective annual growth reproduces the independent annual compound-interest example', () => {
  close(projectInvestment({ ...base, initial: 100, rate: 5, years: 10 }).balance, 100 * 1.05 ** 10);
  close(projectInvestment({ ...base, initial: 1000, rate: 12 }).balance, 1120);
});
test('monthly savings match a separately evaluated closed-form ordinary annuity', () => {
  const r = 1.065 ** (1 / 12) - 1, n = 84;
  const expected = 2500 * (1 + r) ** n + 425 * ((1 + r) ** n - 1) / r;
  close(projectInvestment({ ...base, initial: 2500, monthly: 425, years: 7, rate: 6.5 }).balance, expected);
});
test('beginning-of-month deposits match annuity-due timing rather than end timing', () => {
  const r = 1.08 ** (1 / 12) - 1;
  const end = projectInvestment({ ...base, monthly: 100, years: 5, rate: 8 });
  const begin = projectInvestment({ ...base, monthly: 100, years: 5, rate: 8, timing: 'begin' });
  close(begin.balance, end.balance * (1 + r)); assert.equal(begin.contributed, end.contributed);
});
test('constant annual top-ups form an independent annual ordinary annuity', () => {
  close(projectInvestment({ ...base, annual: 1000, rate: 5, years: 10 }).balance, 1000 * (1.05 ** 10 - 1) / .05);
});
test('monthly contribution increases begin in year two, not in the first month', () => {
  const p = projectInvestment({ ...base, monthly: 1000, step: 10, years: 2 });
  assert.equal(p.rows[1].contributed, 12000); close(p.balance, 25200); close(p.contributed, 25200);
});
test('a negative contribution change reduces future monthly deposits without creating withdrawals', () => {
  close(projectInvestment({ ...base, monthly: 1000, step: -20, years: 2 }).balance, 21600);
});
test('the annual monthly-deposit increase does not also increase fixed year-end top-ups', () => {
  close(projectInvestment({ ...base, initial: 500, monthly: 100, annual: 1000, step: 10, years: 2 }).balance, 5020);
});
test('equivalent monthly ongoing fees preserve a one-percent annual balance charge at zero growth', () => {
  const p = projectInvestment({ ...base, initial: 1000, annualFee: 1 });
  close(p.balance, 990); close(p.feesPaid, 10); close(p.costDrag, 10);
});
test('growth and ongoing cost factors compound multiplicatively, not by subtracting percentage points', () => {
  const p = projectInvestment({ ...base, initial: 1000, rate: 10, annualFee: 1 });
  close(p.balance, 1089); close(p.netAnnualRate, 8.9); close(p.beforeFees, 1100); close(p.costDrag, 11);
  assert.ok(p.costDrag > p.feesPaid);
});
test('contribution charges apply to the initial amount and every monthly and annual deposit', () => {
  const p = projectInvestment({ ...base, initial: 1000, monthly: 100, annual: 200, purchaseFee: 2 });
  close(p.contributed, 2400); close(p.balance, 2352); close(p.feesPaid, 48); close(p.costDrag, 48);
});
test('combined fee and growth results match an independent net-factor annuity', () => {
  const factor = (1.1 * .99) ** (1 / 12);
  const expected = 980 * factor ** 12 + 98 * (factor ** 12 - 1) / (factor - 1) + 196;
  close(projectInvestment({ ...base, initial: 1000, monthly: 100, annual: 200, rate: 10, annualFee: 1, purchaseFee: 2 }).balance, expected);
});
test('inflation uses compounded purchasing power rather than subtracting nominal amounts', () => {
  const p = projectInvestment({ ...base, initial: 1000, rate: 5, inflation: 5, years: 10 });
  close(p.realValue, 1000); assert.ok(p.balance > p.realValue);
});
test('negative growth can show a capital loss and does not get silently clamped to zero return', () => {
  const p = projectInvestment({ ...base, initial: 1000, rate: -12, years: 2 });
  close(p.balance, 774.4); close(p.netGain, -225.6); assert.equal(p.contributed, 1000);
});
test('the three scenarios keep their stated rates and include loss outcomes', () => {
  const p = investmentPlan({ ...base, initial: 1000, rate: 0, spread: 5 });
  close(p.lower.balance, 950); close(p.central.balance, 1000); close(p.higher.balance, 1050);
  assert.equal(p.lower.rate, -5); assert.equal(p.higher.rate, 5);
});
test('a zero-growth savings goal solves the starting monthly contribution independently', () => {
  const p = investmentPlan({ ...base, years: 2, goal: 2400 });
  close(p.goal.requiredMonthly, 100); close(p.goal.monthlyCoefficient, 24); close(p.goal.shortfall, 2400);
});
test('a purchasing-power goal inflates the target and rounds the required contribution upward', () => {
  const p = investmentPlan({ ...base, goal: 1000, goalMode: 'today', inflation: 10 });
  close(p.goal.futureTarget, 1100); assert.equal(p.goal.requiredMonthly, 91.67);
  const achieved = projectInvestment({ ...p.assumptions, monthly: p.goal.requiredMonthly });
  assert.ok(achieved.balance >= p.goal.futureTarget); assert.ok(achieved.balance - p.goal.futureTarget < .12);
});
test('goal solving includes initial capital, year-end top-ups and the annual monthly increase', () => {
  const p = investmentPlan({ ...base, initial: 1000, annual: 500, step: 10, years: 2, goal: 27200 });
  close(p.goal.requiredMonthly, 1000); close(p.goal.monthlyCoefficient, 25.2);
});
test('funded goals need no additional monthly payment and a zero target disables goal calculations', () => {
  const p = investmentPlan({ ...base, initial: 10000, goal: 1000 });
  assert.equal(p.goal.requiredMonthly, 0); assert.equal(p.goal.shortfall, 0); close(p.goal.surplus, 9000);
  assert.equal(investmentPlan(base).goal, null);
});
test('manual EUR-to-INR conversion multiplies once at the horizon', () => {
  const p = investmentPlan({ ...base, initial: 1000, fxEnabled: true, fxRate: 95 });
  close(p.fx.value, 95000); assert.equal(p.fx.currency, 'INR'); close(p.central.balance, 1000);
});
test('manual INR-to-EUR conversion divides by INR per EUR', () => {
  const p = investmentPlan({ ...base, currency: 'INR', initial: 95000, fxEnabled: true, fxRate: 95 });
  close(p.fx.value, 1000); assert.equal(p.fx.currency, 'EUR');
});
test('disabled currency illustration does not require or use a quote', () => {
  assert.equal(investmentPlan({ ...base, fxEnabled: false, fxRate: 'not a rate' }).fx, null);
  assert.throws(() => investmentPlan({ ...base, fxEnabled: true, fxRate: '' }));
});
test('invalid, non-finite and unsupported imported values are rejected at the model boundary', () => {
  const cases = [{ initial: -1 }, { monthly: NaN }, { initial: {} }, { monthly: true }, { goal: [] }, { years: 1.5 }, { years: 61 }, { annualFee: 101 }, { purchaseFee: -1 }, { inflation: -100 }, { rate: Infinity }, { currency: 'USD' }, { timing: 'sometimes' }, { goalMode: 'unknown' }, { fxEnabled: 'yes' }];
  for (const bad of cases) assert.throws(() => normalizeInvestment({ ...base, ...bad }), JSON.stringify(bad));
  assert.throws(() => investmentPlan({ ...base, rate: 49, spread: 3 }));
  assert.throws(() => projectInvestment({ ...base, initial: 1e9, rate: 50, years: 60 }));
});
test('calculation does not change caller inputs and yearly accounting reconciles', () => {
  const input = Object.freeze({ ...investmentDefaults, years: 8 });
  const before = JSON.stringify(input), p = investmentPlan(input);
  assert.equal(JSON.stringify(input), before);
  for (const row of p.central.rows) { close(row.balance - row.contributed, row.netGain); close(row.beforeFees - row.balance, row.costDrag); assert.ok(row.feesPaid >= 0); }
});

function parseCSV(text) {
  const lines = [], row = []; let value = '', quoted = false;
  text = text.replace(/^\uFEFF/, '');
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (c === '"') { if (quoted && text[i + 1] === '"') { value += '"'; i++; } else quoted = !quoted; }
    else if (c === ',' && !quoted) { row.push(value); value = ''; }
    else if (c === '\r' && text[i + 1] === '\n' && !quoted) { row.push(value); lines.push([...row]); row.length = 0; value = ''; i++; }
    else value += c;
  }
  row.push(value); lines.push(row); return lines;
}

test('CSV contains reproducible assumptions, complete year rows and final-only currency conversion', () => {
  const p = investmentPlan({ ...base, initial: 1000, monthly: 100, years: 2, fxEnabled: true, fxRate: 95 });
  const rows = parseCSV(investmentCSV(p)), header = rows[0];
  assert.equal(rows.length, 4); assert.ok(rows.every(row => row.length === header.length));
  assert.equal(rows[1][header.indexOf('Nominal final balance in other currency')], '');
  assert.equal(rows[3][header.indexOf('Nominal final balance in other currency')], '323000');
  assert.equal(rows[3][header.indexOf('Total cash contributed')], '3400');
});
test('CSV neutralizes spreadsheet formulas in names while retaining negative numeric assumptions', () => {
  for (const name of ['=HYPERLINK("x","y")', ' +SUM(1,2)', '@SUM(1,2)', '-cmd']) {
    const rows = parseCSV(investmentCSV(investmentPlan({ ...base, name, rate: -5 })));
    assert.ok(rows[1][0].startsWith("'"));
    assert.equal(rows[1][rows[0].indexOf('Effective annual growth percent')], '-5');
  }
});
test('planner fields escape imported text and unsupported saved inputs fall back without rewriting data', () => {
  const title = () => '', malicious = '<img src=x onerror=alert(1)>';
  const state = { investmentPlanner: { version: 1, inputs: { ...base, name: malicious } } };
  const html = investmentPage(state, { title });
  assert.ok(html.includes('&lt;img')); assert.ok(!html.includes(malicious));
  const invalid = { investmentPlanner: { version: 1, inputs: { ...base, years: 999 } } };
  const before = JSON.stringify(invalid);
  assert.ok(investmentPage(invalid, { title }).includes('Saved planner inputs could not be used'));
  assert.equal(JSON.stringify(invalid), before);
});
