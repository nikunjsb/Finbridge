// Currency-neutral, before-tax illustrations. Annual growth rates are effective annual rates.
export const investmentDefaults = Object.freeze({
  name: 'My investment plan', currency: 'EUR', initial: 2000, monthly: 300, years: 15,
  rate: 5, spread: 3, annual: 0, step: 0, annualFee: .25, purchaseFee: 0,
  inflation: 2, timing: 'end', goal: 100000, goalMode: 'future', fxEnabled: false, fxRate: null
});
export const investmentLimits = Object.freeze({ amount: 1e12, initial: 1e9, monthly: 1e7, annual: 1e8 });

function numeric(value, name, minimum, maximum, integer = false) {
  if (!['number', 'string'].includes(typeof value) || String(value).trim() === '') throw Error('Enter ' + name + '.');
  const number = Number(value);
  if (!Number.isFinite(number) || number < minimum || number > maximum || (integer && !Number.isInteger(number))) {
    throw Error(name + ' must be ' + (integer ? 'a whole number ' : '') + 'between ' + minimum.toLocaleString('en-GB') + ' and ' + maximum.toLocaleString('en-GB') + '.');
  }
  return number;
}

export function normalizeInvestment(input = {}) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) throw Error('Choose valid planner inputs.');
  const get = key => input[key] === undefined ? investmentDefaults[key] : input[key];
  const currency = get('currency'), timing = get('timing'), goalMode = get('goalMode'), fxEnabled = get('fxEnabled');
  if (!['EUR', 'INR'].includes(currency)) throw Error('Choose EUR or INR as the plan currency.');
  if (!['begin', 'end'].includes(timing)) throw Error('Choose the beginning or end of the month.');
  if (!['future', 'today'].includes(goalMode)) throw Error('Choose future money or today’s purchasing power for the goal.');
  if (typeof fxEnabled !== 'boolean') throw Error('Choose whether to show a currency illustration.');
  const name = typeof get('name') === 'string' ? get('name').replace(/[\u0000-\u001f\u007f]/g, ' ').trim().slice(0, 60) : '';
  return {
    name: name || investmentDefaults.name, currency, timing, goalMode, fxEnabled,
    initial: numeric(get('initial'), 'Initial amount', 0, investmentLimits.initial),
    monthly: numeric(get('monthly'), 'Starting monthly contribution', 0, investmentLimits.monthly),
    annual: numeric(get('annual'), 'Extra year-end contribution', 0, investmentLimits.annual),
    years: numeric(get('years'), 'Duration in years', 1, 60, true),
    rate: numeric(get('rate'), 'Annual growth assumption', -95, 50),
    spread: numeric(get('spread'), 'Return variation in percentage points', 0, 30),
    step: numeric(get('step'), 'Annual change in monthly contributions', -20, 50),
    annualFee: numeric(get('annualFee'), 'Annual ongoing fee', 0, 10),
    purchaseFee: numeric(get('purchaseFee'), 'Charge on each contribution', 0, 20),
    inflation: numeric(get('inflation'), 'Annual inflation assumption', -5, 30),
    goal: numeric(get('goal'), 'Goal amount', 0, investmentLimits.amount),
    fxRate: fxEnabled ? numeric(get('fxRate'), 'Manual INR per EUR rate', .0001, 1e6) : null
  };
}

function supported(value) {
  if (!Number.isFinite(value) || Math.abs(value) > investmentLimits.amount) {
    throw Error('These assumptions exceed the supported amount limit of 1 trillion currency units. Reduce the amounts, duration or growth assumptions.');
  }
  return value;
}

function project(a, rate) {
  const growth = Math.exp(Math.log1p(rate / 100) / 12);
  const monthlyFee = -Math.expm1(Math.log1p(-a.annualFee / 100) / 12);
  const purchase = a.purchaseFee / 100;
  let balance = a.initial * (1 - purchase), beforeFees = a.initial;
  let contributed = a.initial, feesPaid = a.initial * purchase;
  const rows = [];
  const row = year => ({
    year, contributed: supported(contributed), balance: supported(balance), beforeFees: supported(beforeFees),
    netGain: supported(balance - contributed), feesPaid: supported(feesPaid), costDrag: supported(beforeFees - balance),
    realValue: supported(balance / Math.pow(1 + a.inflation / 100, year))
  });
  rows.push(row(0));
  const deposit = amount => {
    supported(amount);
    contributed += amount;
    const charge = amount * purchase;
    feesPaid += charge;
    balance += amount - charge;
    beforeFees += amount;
  };
  for (let month = 1; month <= a.years * 12; month++) {
    const monthly = a.monthly * Math.pow(1 + a.step / 100, Math.floor((month - 1) / 12));
    if (a.timing === 'begin') deposit(monthly);
    balance *= growth;
    beforeFees *= growth;
    const charge = balance * monthlyFee;
    balance -= charge;
    feesPaid += charge;
    if (a.timing === 'end') deposit(monthly);
    if (month % 12 === 0) {
      deposit(a.annual);
      rows.push(row(month / 12));
    }
    supported(balance); supported(beforeFees); supported(contributed); supported(feesPaid);
  }
  return { rate, rows, ...rows.at(-1), netAnnualRate: ((1 + rate / 100) * (1 - a.annualFee / 100) - 1) * 100 };
}

export function projectInvestment(input) {
  const a = normalizeInvestment(input);
  return project(a, a.rate);
}

export function investmentPlan(input) {
  const a = normalizeInvestment(input);
  if (a.rate - a.spread < -95 || a.rate + a.spread > 50) throw Error('Keep all three growth assumptions between -95% and 50%; reduce the return variation if needed.');
  const central = project(a, a.rate), lower = project(a, a.rate - a.spread), higher = project(a, a.rate + a.spread);
  let goal = null;
  if (a.goal > 0) {
    const futureTarget = supported(a.goal * (a.goalMode === 'today' ? Math.pow(1 + a.inflation / 100, a.years) : 1));
    const withoutMonthly = project({ ...a, monthly: 0 }, a.rate).balance;
    const monthlyCoefficient = project({ ...a, initial: 0, monthly: 1, annual: 0 }, a.rate).balance;
    const required = Math.max(0, (futureTarget - withoutMonthly) / monthlyCoefficient);
    if (!Number.isFinite(required)) throw Error('This goal cannot be calculated with the selected assumptions.');
    const requiredMonthly = Math.ceil(required * 100) / 100;
    goal = {
      futureTarget, requiredMonthly, monthlyCoefficient,
      shortfall: Math.max(0, futureTarget - central.balance), surplus: Math.max(0, central.balance - futureTarget),
      additionalMonthly: Math.max(0, requiredMonthly - a.monthly),
      withinContributionLimit: requiredMonthly <= investmentLimits.monthly
    };
  }
  const fx = a.fxEnabled ? {
    currency: a.currency === 'EUR' ? 'INR' : 'EUR',
    value: supported(a.currency === 'EUR' ? central.balance * a.fxRate : central.balance / a.fxRate)
  } : null;
  return { assumptions: a, central, lower, higher, goal, fx };
}

export function investmentCSV(plan) {
  const a = plan.assumptions;
  const cell = value => {
    let text = typeof value === 'number' ? String(value) : String(value ?? '');
    if (typeof value !== 'number' && /^[\s\u0000-\u001f]*[=+@-]/.test(text)) text = "'" + text;
    return '"' + text.replace(/"/g, '""') + '"';
  };
  const cents = value => Number(value.toFixed(2));
  const headings = ['Plan', 'Currency', 'Duration years', 'Initial amount', 'Starting monthly contribution', 'Extra year-end contribution', 'Annual contribution change percent', 'Monthly deposit timing', 'Effective annual growth percent', 'Return variation percentage points', 'Annual ongoing fee percent', 'Charge per contribution percent', 'Annual inflation percent', 'Goal input', 'Goal money basis', 'Goal at horizon', 'Manual goal-date INR per EUR', 'Year', 'Total cash contributed', 'Balance after modelled fees before tax', 'Purchasing power in today money', 'Actual modelled fees paid', 'Balance without modelled fees', 'Fee impact including missed growth', 'Lower assumption balance', 'Higher assumption balance', 'Nominal final balance in other currency'];
  const rows = plan.central.rows.map((r, i) => [a.name, a.currency, a.years, a.initial, a.monthly, a.annual, a.step, a.timing, a.rate, a.spread, a.annualFee, a.purchaseFee, a.inflation, a.goal, a.goalMode, plan.goal ? cents(plan.goal.futureTarget) : '', a.fxRate ?? '', r.year, cents(r.contributed), cents(r.balance), cents(r.realValue), cents(r.feesPaid), cents(r.beforeFees), cents(r.costDrag), cents(plan.lower.rows[i].balance), cents(plan.higher.rows[i].balance), plan.fx && r.year === a.years ? cents(plan.fx.value) : '']);
  return '\uFEFF' + [headings, ...rows].map(row => row.map(cell).join(',')).join('\r\n');
}
