const years = ['2025', '2024', '2023'];
const help = 'https://www.elster.de/eportal/helpGlobal?themaGlobal=help_est_ufa_';
const portal = 'https://www.elster.de/eportal/start';

const personal = year => [`Start the ${year} return`, 'Hauptvordruck', `Open the ${year} income tax return in Mein ELSTER. Have your tax ID, address, bank details and any tax office correspondence ready. If you are filing for a past year, check the deadline for your circumstances before submitting.`, '10'];
const salary = ['Check your German employment income', 'Anlage N · Arbeitslohn', 'Compare each employer’s annual Lohnsteuerbescheinigung against the entries in ELSTER. Check imported amounts and add missing data where required. Keep the certificates and avoid entering the same amount twice.', '12'];
const expenses = ['Review work expenses', 'Anlage N · Werbungskosten', 'Gather commuting records, home-working dates, work purchases and reimbursements. For a job-related move, gather invoices, proof of payment and employer reimbursements, and review the conditions before claiming any amount.', '12'];
const insurance = ['Check insurance and pension contributions', 'Anlage Vorsorgeaufwand', 'Compare imported contributions with your employer and insurer records. Check where each contribution belongs and avoid counting amounts already entered.', '10'];
const submit = ['Review, submit and check the notice', 'Steuerbescheid', 'Use ELSTER’s checks and review any errors before sending the return in your own account. Keep the transmission record. When your assessment arrives, compare it with your submitted return and note the deadline stated in the notice.', '10'];
const move = ['Prepare your residence timeline', 'Anlage WA-ESt', 'Write down when you moved, when your German home became available and any periods you kept a home abroad. Gather registration and housing records. Check whether you were subject to unlimited German tax liability for only part of the year before using the corresponding section.', '10'];
const foreign = ['Review your foreign income before filing', 'Anlage WA-ESt · Anlage N-AUS · Anlage AUS', 'List the dates, countries, types of income, work locations and foreign tax paid. Keep payslips and tax statements. Income before and after moving can be treated differently. Check the applicable form and treaty treatment before entering amounts or relying on a refund estimate.', '10'];

export function elsterSteps(route, foreignIncome, year = years[0]) {
  if (!years.includes(year) || !['full', 'newcomer'].includes(route) || !['yes', 'no', 'unsure'].includes(foreignIncome)) return [];
  return [personal(year), ...(route === 'newcomer' ? [move] : []), salary,
    ...(foreignIncome === 'no' ? [] : [foreign]), expenses, insurance, submit]
    .map(([title, german, guidance, section]) => [title, german, guidance, `${help}${section}_${year}`]);
}

export function elsterWalkthroughHTML() {
  return `<section class="card" id="elsterWalkthrough" aria-labelledby="elsterWalkthroughHeading">
    <h3 id="elsterWalkthroughHeading">File alongside ELSTER</h3>
    <p>Follow the English instructions here and enter your own information in a separate <a href="${portal}" target="_blank" rel="noopener noreferrer">Mein ELSTER tab</a>. Choose the same tax year here and in Mein ELSTER to open the matching official help.</p>
    <form class="formgrid">
      <label class="field">Tax year
        <select name="year">
          ${years.map(year => `<option value="${year}">${year}</option>`).join('')}
        </select>
      </label>
      <label class="field">Which employee path fits you?
        <select name="route" required>
          <option value="">Choose a path</option>
          <option value="full">Lived in Germany throughout the selected year</option>
          <option value="newcomer">Moved to Germany during the selected year</option>
        </select>
      </label>
      <label class="field">Any foreign income or work abroad during the year, including before moving?
        <select name="foreignIncome" required>
          <option value="">Choose an answer</option>
          <option value="no">No</option>
          <option value="yes">Yes</option>
          <option value="unsure">I’m unsure</option>
        </select>
      </label>
      <div><button type="submit" class="button">Start walkthrough</button></div>
    </form>
    <div data-elster-step></div>
  </section>`;
}

export function mountElsterWalkthrough(root) {
  const section = root.querySelector('#elsterWalkthrough');
  const form = section.querySelector('form');
  const output = section.querySelector('[data-elster-step]');
  let steps = [];
  let index = 0;

  function render() {
    const [title, german, guidance, source] = steps[index];
    const year = form.elements.year.value;
    output.innerHTML = `<h4 tabindex="-1">Step ${index + 1} of ${steps.length} · ${title}</h4>
      <div class="formgrid">
        <div><strong>AtlasEveryday guidance</strong><p>${guidance}</p></div>
        <div><strong>Look for in ELSTER</strong><p lang="de">${german}</p><a href="${source}" target="_blank" rel="noopener noreferrer">Open official ELSTER guidance for ${year}</a></div>
      </div>
      <div class="row">
        <button type="button" class="button secondary" data-elster-direction="-1" ${index === 0 ? 'disabled' : ''}>Back</button>
        <button type="button" class="button" data-elster-direction="1" ${index === steps.length - 1 ? 'disabled' : ''}>Next</button>
      </div>`;
    output.querySelector('h4').focus();
  }

  form.addEventListener('change', () => {
    steps = [];
    output.replaceChildren();
  });
  form.addEventListener('submit', event => {
    event.preventDefault();
    event.stopPropagation();
    steps = elsterSteps(form.elements.route.value, form.elements.foreignIncome.value, form.elements.year.value);
    index = 0;
    if (steps.length) render();
  });
  output.addEventListener('click', event => {
    const button = event.target.closest('[data-elster-direction]');
    if (!button || button.disabled) return;
    index += Number(button.dataset.elsterDirection);
    render();
  });
}
