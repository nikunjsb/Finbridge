import { investmentDefaults, normalizeInvestment, investmentPlan, investmentCSV } from './investment-core.js?v=b069d49dfc06';

const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
const money = (value, currency) => new Intl.NumberFormat(currency === 'INR' ? 'en-IN' : 'en-IE', { style: 'currency', currency, maximumFractionDigits: 2 }).format(value);
const pct = value => new Intl.NumberFormat('en-GB', { maximumFractionDigits: 2 }).format(value) + '%';
let owner, draft, savedWarning = '';

function savedData(state) {
  const data = state?.investmentPlanner;
  return data && typeof data === 'object' && !Array.isArray(data) && data.version === 1 ? data : {};
}
function session(state) {
  if (owner !== state) {
    owner = state; savedWarning = '';
    try { draft = normalizeInvestment(savedData(state).inputs || investmentDefaults); }
    catch { draft = { ...investmentDefaults }; savedWarning = 'Saved planner inputs could not be used. Example inputs are shown; your saved backup has not been changed.'; }
  }
  return draft;
}
const unit = '<span data-inv-unit>EUR</span>';
const numberField = (label, name, value, minimum, maximum, step = '0.01', extra = '') => '<label class="field"><span>' + label + '</span><input form="investmentForm" name="' + name + '" type="number" min="' + minimum + '" max="' + maximum + '" step="' + step + '" value="' + esc(value) + '" required ' + extra + '></label>';
const options = (values, selected) => values.map(([value, label]) => '<option value="' + value + '"' + (value === selected ? ' selected' : '') + '>' + esc(label) + '</option>').join('');

function chart(plan) {
  const a = plan.assumptions, width = 680, height = 270, left = 72, right = 18, top = 18, bottom = 39;
  const maximum = Math.max(1, ...plan.higher.rows.map(row => row.balance), plan.central.contributed) * 1.08;
  const x = year => left + (width - left - right) * year / a.years;
  const y = value => height - bottom - (height - top - bottom) * value / maximum;
  const path = (rows, key) => rows.map((row, i) => (i ? 'L' : 'M') + x(row.year).toFixed(2) + ' ' + y(row[key]).toFixed(2)).join(' ');
  const ticks = [...new Set([0, Math.round(a.years / 2), a.years])];
  const compact = value => new Intl.NumberFormat('en-GB', { notation: 'compact', maximumFractionDigits: 1 }).format(value);
  const lines = [0, 1, 2, 3, 4].map(i => {
    const value = maximum * i / 4, position = y(value);
    return '<line x1="' + left + '" x2="' + (width - right) + '" y1="' + position + '" y2="' + position + '" class="inv-chart-grid"/><text x="' + (left - 10) + '" y="' + (position + 4) + '" text-anchor="end">' + esc(compact(value)) + '</text>';
  }).join('');
  return '<figure class="inv-chart"><figcaption>How the assumptions develop <span>Nominal ' + a.currency + ' · after modelled fees, before tax</span></figcaption><svg viewBox="0 0 ' + width + ' ' + height + '" role="img" aria-labelledby="invChartTitle invChartDescription"><title id="invChartTitle">Investment illustrations over ' + a.years + ' years</title><desc id="invChartDescription">The lower, central and higher annual growth assumptions are ' + pct(plan.lower.rate) + ', ' + pct(a.rate) + ' and ' + pct(plan.higher.rate) + '. Central final value ' + esc(money(plan.central.balance, a.currency)) + '. Total cash contributed ' + esc(money(plan.central.contributed, a.currency)) + '. The yearly table below provides the figures.</desc>' + lines + ticks.map(year => '<text x="' + x(year) + '" y="' + (height - 13) + '" text-anchor="middle">Year ' + year + '</text>').join('') +
    '<path d="' + path(plan.higher.rows, 'balance') + '" class="inv-line inv-line-high"/><path d="' + path(plan.lower.rows, 'balance') + '" class="inv-line inv-line-low"/><path d="' + path(plan.central.rows, 'contributed') + '" class="inv-line inv-line-cash"/><path d="' + path(plan.central.rows, 'balance') + '" class="inv-line inv-line-central"/></svg><div class="inv-chart-legend"><span><i class="inv-key-central"></i>Central assumption</span><span><i class="inv-key-low"></i>Lower assumption</span><span><i class="inv-key-high"></i>Higher assumption</span><span><i class="inv-key-cash"></i>Cash contributed</span></div></figure>';
}

function resultHTML(plan) {
  const a = plan.assumptions, c = plan.central;
  return '<div class="inv-result-head"><span class="eyebrow">YOUR ILLUSTRATION / ' + a.years + ' YEARS</span><span class="pill">' + a.currency + ' · Before tax</span></div><div class="inv-stat-grid"><div class="inv-main-stat"><span>Central value after modelled fees</span><strong>' + esc(money(c.balance, a.currency)) + '</strong></div><div><span>Total cash contributed</span><strong>' + esc(money(c.contributed, a.currency)) + '</strong></div><div><span>Value in today’s purchasing power</span><strong>' + esc(money(c.realValue, a.currency)) + '</strong></div><div><span>Gain / loss after modelled fees</span><strong>' + esc(money(c.netGain, a.currency)) + '</strong></div></div>' +
    chart(plan) + '<div class="inv-assumption-cards">' + [['Lower assumption', plan.lower], ['Central assumption', c], ['Higher assumption', plan.higher]].map(([label, p]) => '<div><span>' + label + ' · ' + pct(p.rate) + '</span><strong>' + esc(money(p.balance, a.currency)) + '</strong><small>Today’s value: ' + esc(money(p.realValue, a.currency)) + '</small></div>').join('') + '</div><p class="inv-caption">These are three constant-growth assumptions, not forecasts, probabilities or loss limits. Actual market outcomes can fall outside this range.</p>' +
    '<details class="inv-cost-details"><summary>See what costs change</summary><div class="inv-cost-grid"><div><span>Actual modelled fees paid</span><strong>' + esc(money(c.feesPaid, a.currency)) + '</strong></div><div><span>Value with these fees removed</span><strong>' + esc(money(c.beforeFees, a.currency)) + '</strong></div><div><span>Fee impact, including missed growth</span><strong>' + esc(money(c.costDrag, a.currency)) + '</strong></div></div><p>The fee impact includes the growth that money paid in fees could have earned or lost. It differs from the sum of the fees themselves. Net annual growth after the ongoing fee is ' + pct(c.netAnnualRate) + ' in the central illustration, before charges on new contributions and tax.</p></details>' +
    '<details class="inv-year-details"><summary>Year-by-year breakdown</summary><div class="inv-table-wrap" role="region" aria-label="Yearly investment figures" tabindex="0"><table><thead><tr><th scope="col">Year</th><th scope="col">Cash contributed</th><th scope="col">After fees, before tax</th><th scope="col">Today’s purchasing power</th><th scope="col">Fees paid</th></tr></thead><tbody>' + c.rows.map(r => '<tr><th scope="row">' + r.year + '</th><td>' + esc(money(r.contributed, a.currency)) + '</td><td>' + esc(money(r.balance, a.currency)) + '</td><td>' + esc(money(r.realValue, a.currency)) + '</td><td>' + esc(money(r.feesPaid, a.currency)) + '</td></tr>').join('') + '</tbody></table></div></details>';
}

function goalHTML(plan) {
  const a = plan.assumptions, g = plan.goal;
  if (!g) return '<p class="muted">Enter a target above zero to calculate the starting monthly contribution for that goal.</p>';
  return '<div class="inv-goal-stats"><div><span>Goal at the end of year ' + a.years + '</span><strong>' + esc(money(g.futureTarget, a.currency)) + '</strong><small>' + (a.goalMode === 'today' ? 'Your goal increased by the selected inflation assumption.' : 'Goal entered in future nominal money.') + '</small></div><div><span>Calculated starting monthly contribution</span><strong>' + esc(money(g.requiredMonthly, a.currency)) + '</strong><small>Under the central growth, fees, annual top-ups and contribution-increase assumptions.</small></div><div><span>' + (g.shortfall > .005 ? 'Illustrative shortfall with current inputs' : 'Illustrative surplus with current inputs') + '</span><strong>' + esc(money(g.shortfall > .005 ? g.shortfall : g.surplus, a.currency)) + '</strong><small>' + (g.additionalMonthly > .005 ? 'Difference from the current monthly amount: ' + esc(money(g.additionalMonthly, a.currency)) + '.' : 'The central illustration reaches this goal with the current inputs.') + '</small></div></div>' + (!g.withinContributionLimit ? '<p class="inv-validation">The calculated monthly amount exceeds this planner’s supported contribution range. Revisit the goal and assumptions.</p>' : '') + '<p class="inv-caption">This is a mathematical savings requirement before tax, not a recommendation or a promise that the goal will be reached.</p>';
}

function fxHTML(plan) {
  if (!plan.fx) return '<p class="inv-caption">Optional: show the central final value in the other currency using your own goal-date exchange-rate assumption.</p>';
  const a = plan.assumptions;
  return '<div class="inv-fx-result"><span>Nominal ' + plan.fx.currency + ' at your goal-date rate</span><strong>' + esc(money(plan.fx.value, plan.fx.currency)) + '</strong><p>Uses ' + esc(String(a.fxRate)) + ' INR per EUR. This is a conversion of the final balance, not a cross-border investment return. It excludes transfer costs, tax, monthly currency conversions and destination-country inflation.</p></div>';
}

const learning = [
  ['Cash & term deposits', 'Tagesgeld, Festgeld and bank deposits are different ways of holding savings. Compare access, rate conditions, provider risk and the applicable deposit-protection scheme.', 'Does the withdrawal date match when I need the money? What protection and account eligibility apply?', 'products'],
  ['ETFs & mutual funds', 'A fund pools investments. Diversification depends on what it actually holds; a narrow sector fund and a broad market fund can have very different risks.', 'What is inside the fund? Compare ongoing costs, trading charges, fund documents and currency exposure.', 'etf'],
  ['Individual shares', 'A single-company holding concentrates company-specific risk. Prices and dividends can change, and capital can be lost.', 'Can I understand the company and bear the loss without relying on this money for near-term needs?', 'fees'],
  ['Bonds & bond funds', 'Review the issuer, credit risk, maturity and interest-rate exposure. A bond fund is different from holding one bond to its maturity date.', 'How could a rate change, default or early sale affect the money available to me?', 'products'],
  ['Gold', 'Gold has price, dealing-spread and storage considerations. Jewellery, physical investment gold and financial products linked to gold are different purchases.', 'What are the total buying, holding and selling costs, and what cross-border rules apply?', 'gold'],
  ['Property', 'Property decisions involve more than a growth percentage: cash flow, maintenance, financing, transaction costs and time needed to sell all matter.', 'Have I allowed for vacancies, repairs, debt costs and both countries’ reporting questions?', 'property'],
  ['Pensions & insurance-based savings', 'Review access restrictions, benefits, charges, guarantees and cancellation terms in the actual contract. These arrangements are not interchangeable with a liquid fund account.', 'What happens if I stop contributions, move country, or need the money earlier?', 'retirement'],
  ['Indian accounts, funds & long-term schemes', 'Banking residence, product eligibility and tax residence need separate checks. Review NRE/NRO/FCNR accounts, mutual-fund documents and scheme-specific rules before contributing.', 'Does the provider accept my residence status? What needs to be reported or updated after a move?', 'epf']
];

export function investmentPage(state, { title }) {
  const d = session(state);
  return title('SAVING & INVESTING','Build a plan you can understand.','Explore contributions, goals, costs and purchasing power. Compare assumptions and learn what to check before choosing an investment.') +
    '<div id="investmentWorkspace" class="inv-workspace"><nav class="inv-section-nav" aria-label="Investment planner sections"><button type="button" data-inv-jump="plan">Plan & growth</button><button type="button" data-inv-jump="goals">Goals & currency</button><button type="button" data-inv-jump="compare">Saved comparisons</button><button type="button" data-inv-jump="learn">Investment types</button></nav><div class="inv-intro-note"><b>Example assumptions, not market quotes.</b> This planner uses constant growth and before-tax amounts. Entries stay in this page until you choose Save inputs or Add to comparison. Saved plans are kept on this device and included in your local backup.</div>' +
    (savedWarning ? '<p class="inv-validation">' + esc(savedWarning) + '</p>' : '') + '<section id="inv-plan" tabindex="-1" aria-labelledby="invPlanHeading"><div class="sectionhead"><h2 id="invPlanHeading">1. Set your assumptions</h2><span class="pill">EUR or INR</span></div><form id="investmentForm" class="card inv-input-card"><div class="formgrid"><label class="field">Plan currency<select name="currency">' + options([['EUR','EUR — euro'],['INR','INR — Indian rupee']], d.currency) + '</select></label>' +
    numberField('Duration (whole years)', 'years', d.years, 1, 60, '1') + numberField('Initial investment (' + unit + ')', 'initial', d.initial, 0, 1e9) + numberField('Starting monthly contribution (' + unit + ')', 'monthly', d.monthly, 0, 1e7) + numberField('Annual growth before fees (%)', 'rate', d.rate, -95, 50, '0.1') + numberField('Return variation (± percentage points)', 'spread', d.spread, 0, 30, '0.1') + '</div><p class="inv-caption">Growth is an effective annual assumption. The lower and higher cases use this growth rate minus/plus the variation. Changing the currency changes the units; it does not convert the amounts you entered.</p><details class="inv-advanced"><summary>Contributions, fees & inflation</summary><div class="formgrid">' +
    numberField('Extra contribution at each year-end (' + unit + ')', 'annual', d.annual, 0, 1e8) + numberField('Annual change in monthly contributions (%)', 'step', d.step, -20, 50, '0.1') + numberField('Annual ongoing fee (% of balance)', 'annualFee', d.annualFee, 0, 10, '0.01') + numberField('Charge on every contribution (%)', 'purchaseFee', d.purchaseFee, 0, 20, '0.01') + numberField('Annual inflation assumption (%)', 'inflation', d.inflation, -5, 30, '0.1') + '<label class="field">Monthly contribution timing<select name="timing">' + options([['end','End of each month'],['begin','Beginning of each month']], d.timing) + '</select></label></div><p class="inv-caption">The monthly amount changes from the start of year two; year-end top-ups stay constant. Only the two fee types entered here are modelled.</p></details><div class="inv-actions"><button class="button" type="submit">Update illustration</button><button class="button secondary" type="button" data-inv-action="save">Save inputs on this device</button><button class="quiet" type="button" data-inv-action="reset">Restore example inputs</button></div></form><p id="invCalcStatus" class="inv-status" role="status" aria-live="polite"></p><p id="invErrors" class="inv-validation" role="alert" hidden></p><div id="investmentResult" class="card inv-output"></div><div class="inv-actions inv-export-actions"><button class="button secondary" type="button" data-inv-action="export">Download yearly CSV</button><a class="biglink" href="#settings">Privacy & backup →</a></div></section>' +
    '<section id="inv-goals" tabindex="-1" aria-labelledby="invGoalHeading"><div class="sectionhead"><h2 id="invGoalHeading">2. Work back from a goal</h2></div><div class="card"><div class="formgrid">' + numberField('Goal amount (' + unit + '; zero = no goal)', 'goal', d.goal, 0, 1e12) + '<label class="field">How is the goal expressed?<select form="investmentForm" name="goalMode">' + options([['future','Future nominal money'],['today','Today’s purchasing power']], d.goalMode) + '</select></label></div><div id="invGoalResult"></div><div class="divider"></div><label class="inv-check"><input form="investmentForm" name="fxEnabled" type="checkbox"' + (d.fxEnabled ? ' checked' : '') + '> Show an optional EUR/INR illustration</label><div id="invFxFields" class="inv-fx-fields"' + (d.fxEnabled ? '' : ' hidden') + '>' + numberField('Your goal-date rate: INR per 1 EUR', 'fxRate', d.fxRate ?? '', .0001, 1e6, '0.0001', d.fxEnabled ? '' : 'disabled') + '<p class="inv-caption">Enter your own scenario rate. No live exchange-rate feed is connected.</p></div><div id="invFxResult"></div><button type="submit" form="investmentForm" class="button secondary">Update goal & currency illustration</button></div></section>' +
    '<section id="inv-compare" tabindex="-1" aria-labelledby="invCompareHeading"><div class="sectionhead"><h2 id="invCompareHeading">3. Keep up to three comparisons</h2></div><div class="card"><p class="muted">Try a different contribution, duration or cost assumption, then save it as a separate plan. Compare plans with the same currency and horizon when judging their amounts.</p><div class="inv-comparison-save"><label class="field">Plan name<input form="investmentForm" name="name" maxlength="60" value="' + esc(d.name) + '" placeholder="For example: lower fees"></label><button type="button" class="button" data-inv-action="add">Add current inputs to comparison</button></div><p id="invSavedStatus" class="inv-status" role="status"></p><div id="invSavedPlans" class="inv-saved-grid"></div></div></section>' +
    '<section id="inv-learn" tabindex="-1" aria-labelledby="invLearnHeading"><div class="sectionhead"><h2 id="invLearnHeading">4. Understand the investment</h2></div><div class="card inv-readiness"><h3>Before choosing a product</h3><ul><li>Separate emergency cash and money needed soon from long-term goals.</li><li>Check expensive debt, liquidity needs and how much loss you could bear.</li><li>Understand the investment, its costs and how concentrated the holdings are.</li><li>Review residency, account eligibility and tax/reporting questions for each country.</li></ul><div class="inv-actions"><a class="biglink" href="#budget">Review my budget →</a><a class="biglink" href="#moneycheck">Money & paperwork self-check →</a></div></div><div class="inv-learning-grid">' + learning.map(([name, text, question, guide]) => '<details class="card inv-learning-card"><summary>' + esc(name) + '</summary><p>' + esc(text) + '</p><p><b>Questions to ask:</b> ' + esc(question) + '</p><a class="biglink" href="#' + (guide === 'gold' ? 'gold' : 'guide/' + guide) + '">Related guide →</a></details>').join('') + '</div><div class="card inv-cross-note"><h3>Planning between Germany and India?</h3><p>Keep your investment’s return, currency movement, provider eligibility and tax treatment as separate questions. The growth chart does not calculate German or Indian taxes, pension benefits, property cash flows or currency conversion on each contribution.</p><div class="inv-actions"><a class="biglink" href="#topic/crossborder">Germany–India topic guide →</a><a class="biglink" href="#guide/accounts">Banking residence and accounts →</a></div></div></section>' +
    '<details class="card inv-method"><summary>How the model works and where to verify</summary><p>The entered growth rate is effective per year, converted into twelve equal monthly growth factors. The ongoing fee is converted into an equivalent monthly balance charge. These factors are applied every month; a charge on contributions is deducted from the initial amount and each deposit. A beginning-of-month deposit participates in that month’s growth and ongoing fee; an end-of-month deposit does not. Extra annual contributions arrive at year-end.</p><p>The yearly contribution change affects only the monthly deposits, starting in year two. Purchasing power divides the future value by compounded inflation in the plan currency. A goal expressed in today’s money is increased by that same inflation assumption. The monthly requirement is solved under the central assumptions and rounded up to cents. The final-currency illustration uses your manual quote only at the horizon.</p><p>Taxes, trading spreads, fixed charges, withdrawals, changing market paths, pension rules and property financing are outside this model. Choosing an investment type below does not assign a growth rate to it. Numerical assumptions are examples you can change.</p><h3>Concept and method references</h3><p class="inv-caption">Reviewed 13 November 2026. These sources explain the concepts; they do not endorse the planner or its assumptions.</p><ul><li><a href="https://www.investor.gov/financial-tools-calculators/calculators/compound-interest-calculator" target="_blank" rel="noopener noreferrer">Investor.gov: compound-interest calculator ↗</a></li><li><a href="https://www.investor.gov/introduction-investing/general-resources/news-alerts/alerts-bulletins/investor-bulletins/updated" target="_blank" rel="noopener noreferrer">Investor.gov: how investment fees affect a portfolio ↗</a></li><li><a href="https://www.investor.gov/introduction-investing/investing-basics/what-risk" target="_blank" rel="noopener noreferrer">Investor.gov: risk, inflation and currency exposure ↗</a></li><li><a href="https://www.bafin.de/DE/Verbraucher/GeldanlageWertpapiere/Grundregeln_der_Geldanlage/Grundregeln_der_Geldanlage_node.html" target="_blank" rel="noopener noreferrer">BaFin: principles of investing (German) ↗</a></li><li><a href="https://investor.sebi.gov.in/understanding_mf.html" target="_blank" rel="noopener noreferrer">SEBI Investor: understanding mutual funds ↗</a></li></ul></details></div>';
}

export function mountInvestmentPlanner({ state, save }) {
  const root = document.getElementById('investmentWorkspace'), form = document.getElementById('investmentForm');
  if (!root || !form) return;
  let currentPlan;
  const status = (message, saved = false) => { root.querySelector(saved ? '#invSavedStatus' : '#invCalcStatus').textContent = message; };
  const read = () => {
    const data = new FormData(form), raw = {};
    for (const key of Object.keys(investmentDefaults)) raw[key] = key === 'fxEnabled' ? form.elements.fxEnabled.checked : data.get(key);
    return raw;
  };
  const update = (announce = false) => {
    const enabled = form.elements.fxEnabled.checked;
    form.elements.fxRate.disabled = !enabled;
    root.querySelector('#invFxFields').hidden = !enabled;
    const raw = read(); draft = raw;
    root.querySelectorAll('[data-inv-unit]').forEach(element => { element.textContent = raw.currency === 'INR' ? 'INR' : 'EUR'; });
    const error = root.querySelector('#invErrors');
    try {
      currentPlan = investmentPlan(raw);
      root.querySelector('#investmentResult').innerHTML = resultHTML(currentPlan);
      root.querySelector('#invGoalResult').innerHTML = goalHTML(currentPlan);
      root.querySelector('#invFxResult').innerHTML = fxHTML(currentPlan);
      error.hidden = true; error.textContent = '';
      root.querySelectorAll('[data-inv-action=save],[data-inv-action=add],[data-inv-action=export]').forEach(button => { button.disabled = false; });
      if (announce) status('Illustration updated. Central final value ' + money(currentPlan.central.balance, currentPlan.assumptions.currency) + ', after modelled fees and before tax.');
      return currentPlan;
    } catch (failure) {
      currentPlan = null;
      error.textContent = failure.message; error.hidden = false;
      root.querySelector('#investmentResult').innerHTML = '<p class="muted">A valid illustration will appear here.</p>';
      root.querySelector('#invGoalResult').textContent = 'Complete the planner inputs to calculate the goal.';
      root.querySelector('#invFxResult').textContent = '';
      root.querySelectorAll('[data-inv-action=save],[data-inv-action=add],[data-inv-action=export]').forEach(button => { button.disabled = true; });
      status(''); return null;
    }
  };
  const scenarios = () => Array.isArray(savedData(state).scenarios) ? savedData(state).scenarios.slice(0, 3) : [];
  const renderSaved = () => {
    const items = scenarios();
    root.querySelector('#invSavedPlans').innerHTML = items.length ? items.map((raw, index) => {
      try {
        const plan = investmentPlan(raw), a = plan.assumptions;
        return '<article class="inv-saved-card"><h3>' + esc(a.name) + '</h3><span class="inv-caption">' + a.currency + ' · ' + a.years + ' years · ' + pct(a.rate) + ' assumed growth</span><strong>' + esc(money(plan.central.balance, a.currency)) + '</strong><p>Starting monthly: ' + esc(money(a.monthly, a.currency)) + '<br>Ongoing fee: ' + pct(a.annualFee) + '<br>Today’s purchasing power: ' + esc(money(plan.central.realValue, a.currency)) + '</p><div class="inv-actions"><button type="button" class="button secondary" data-inv-action="load" data-inv-index="' + index + '">Load ' + esc(a.name) + '</button><button type="button" class="quiet" data-inv-action="remove" data-inv-index="' + index + '" aria-label="Remove ' + esc(a.name) + '">Remove</button></div></article>';
      } catch { return '<article class="inv-saved-card"><h3>Saved comparison ' + (index + 1) + '</h3><p>These imported inputs are outside the supported format. Export a backup if needed, then remove or recreate this comparison.</p><button type="button" class="quiet" data-inv-action="remove" data-inv-index="' + index + '">Remove invalid comparison</button></article>'; }
    }).join('') : '<p class="muted inv-empty">No saved comparisons yet. Change an assumption and add a named plan.</p>';
  };
  const setInputs = values => {
    for (const key of Object.keys(investmentDefaults)) {
      const field = form.elements[key];
      if (key === 'fxEnabled') field.checked = values[key];
      else field.value = values[key] ?? '';
    }
    draft = { ...values }; update();
  };
  const write = value => {
    const previous = state.investmentPlanner;
    state.investmentPlanner = value;
    try { save(); }
    catch (error) {
      if (previous === undefined) delete state.investmentPlanner; else state.investmentPlanner = previous;
      throw error;
    }
  };
  form.addEventListener('submit', event => { event.preventDefault(); update(true); });
  root.addEventListener('input', event => { if (event.target.form === form) update(); });
  root.addEventListener('change', event => { if (event.target.form === form) update(true); });
  root.addEventListener('click', event => {
    const jump = event.target.closest('[data-inv-jump]');
    if (jump) { const section = root.querySelector('#inv-' + jump.dataset.invJump); section?.focus({ preventScroll: true }); section?.scrollIntoView({ block: 'start' }); return; }
    const button = event.target.closest('[data-inv-action]');
    if (!button) return;
    const action = button.dataset.invAction, index = Number(button.dataset.invIndex);
    try {
      if (action === 'reset') { setInputs(investmentDefaults); status('Example inputs restored on this page. Saved inputs and comparisons were not removed.'); return; }
      if (action === 'load') { const item = scenarios()[index]; if (!item) return; setInputs(normalizeInvestment(item)); status('Saved comparison loaded into the page.'); return; }
      if (action === 'remove') { const items = scenarios(); if (!Number.isInteger(index) || index < 0 || index >= items.length) return; items.splice(index, 1); write({ ...savedData(state), version: 1, scenarios: items }); renderSaved(); status('Comparison removed from this device.', true); return; }
      const plan = update(true); if (!plan) return;
      if (action === 'save') { write({ version: 1, inputs: plan.assumptions, scenarios: scenarios() }); status('Inputs saved on this device. They are included in Privacy & backup exports.'); }
      if (action === 'add') {
        const items = scenarios(); if (items.length >= 3) { status('Three comparisons are already saved. Remove one before adding another.', true); return; }
        items.push(plan.assumptions); write({ ...savedData(state), version: 1, scenarios: items }); renderSaved(); status('Comparison saved on this device.', true);
      }
      if (action === 'export') {
        const blob = new Blob([investmentCSV(plan)], { type: 'text/csv;charset=utf-8' }), url = URL.createObjectURL(blob), link = document.createElement('a');
        link.href = url; link.download = 'atlaseveryday-investment-plan.csv'; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
        status('Yearly CSV prepared from the current inputs.');
      }
    } catch { status('This action could not be completed. Browser storage may be unavailable or full; export a CSV or backup if needed.', action === 'add' || action === 'remove'); }
  });
  update(); renderSaved();
}
