// Editorial navigation over the existing guides and tools. No additional tracking or services.
const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));

export const portalTopics = [
  {
    id: 'moving', label: 'Moving to Germany', short: 'Moving', icon: 'suitcase', tone: 'sage',
    description: 'From planning the move to finding your feet in the first few months.',
    intro: 'Start with your reason for moving, then work through documents, housing and the practical steps of settling in.',
    start: ['immigration', 'Check your residence pathway', 'Explore permits, professional recognition, permanent residence and citizenship in the existing guide.'],
    steps: [
      ['immigration', 'Before you arrive', 'Review your residence pathway and the documents relevant to your situation.'],
      ['guide/housing', 'Plan your home and budget', 'Understand rental terms, deposits and utilities before making commitments.'],
      ['journey/newcomer', 'Settle in step by step', 'Use the arrival checklist for registration, banking, insurance and everyday services.']
    ],
    guides: ['newcomer', 'housing', 'moving', 'arrival-tax', 'scams'],
    tools: [['journey/newcomer', 'Arrival checklist', 'Keep track of the steps that apply to you.', 'checklist'], ['budget', 'Budget planner', 'Plan income, rent and everyday spending.', 'wallet'], ['healthcare', 'Healthcare professional pathway', 'Explore recognition guidance by profession and state.', 'heart']],
    sources: [['Make it in Germany: arrival and registration', 'https://www.make-it-in-germany.com/en/arriving-living/getting-started/housing-registration']],
    keywords: 'arrival newcomer moving relocation registration anmeldung visa housing first 90 days'
  },
  {
    id: 'living', label: 'Living in Germany', short: 'Living', icon: 'home', tone: 'sand',
    description: 'Housing, healthcare, local services and the language of everyday life.',
    intro: 'Find practical explanations for running a household, understanding German paperwork and finding the right services.',
    start: ['everyday', 'Get the everyday essentials in order', 'Bring housing, contracts, registration, transport and local guidance into one practical starting point.'],
    steps: [
      ['everyday', 'Organize your household', 'Start with address changes, contracts, transport and recurring costs.'],
      ['healthaccess', 'Find your way around healthcare', 'Learn about doctors, specialist appointments and urgent care.'],
      ['language', 'Understand the paperwork', 'Look up German terms and explanations of common administrative phrases.']
    ],
    guides: ['housing', 'household', 'credit', 'scams', 'products'],
    tools: [['healthcompare', 'Health insurance comparison', 'Compare the available insurer information and contribution scenarios.', 'heart'], ['language', 'Language Bridge', 'Explain terms and common phrases in German letters.', 'language'], ['location', 'Local guidance', 'Choose your country and German federal state.', 'globe']],
    sources: [['Federal Ministry of Health', 'https://www.bundesgesundheitsministerium.de/'], ['Verbraucherzentrale: consumer information', 'https://www.verbraucherzentrale.de/']],
    keywords: 'living germany everyday housing rent doctor healthcare insurance transport language letters contracts'
  },
  {
    id: 'money', label: 'Work & money', short: 'Work & money', icon: 'wallet', tone: 'blue',
    description: 'Make sense of your payslip, tax preparation, spending and savings.',
    intro: 'Understand the paperwork first, use a relevant calculator, then keep the evidence you need for payroll or a tax adviser.',
    start: ['moneycheck', 'Find your next three money actions', 'Use the existing sixteen-point self-check to decide what deserves attention next.'],
    steps: [
      ['guide/salary', 'Understand your payslip', 'Read the main deductions and distinguish gross pay from the bank payout.'],
      ['taxplan/finder', 'Prepare for your tax return', 'Find topics to review and collect the supporting records.'],
      ['budget', 'Plan your monthly spending', 'Bring regular costs, transactions and savings goals together.']
    ],
    guides: ['salary', 'commute', 'homeoffice', 'equipment', 'training', 'insurance-tax', 'etf', 'capitaltax'],
    tools: [['salary', 'Take-home salary', 'Estimate a regular monthly German employee payslip.', 'wallet'], ['taxclasses', 'Tax classes & salary', 'Compare the supported withholding scenarios.', 'family'], ['taxplan/finder', 'Tax preparation planner', 'Review opportunities, evidence and adviser exports.', 'receipt'], ['invest', 'Investment scenarios', 'Explore illustrative growth, fees and risks.', 'chart']],
    sources: [['ELSTER', 'https://www.elster.de/'], ['Federal Ministry of Finance', 'https://www.bundesfinanzministerium.de/'], ['BaFin', 'https://www.bafin.de/']],
    keywords: 'salary work money pay payroll tax deductions commuting budget saving investing brutto netto steuerklasse'
  },
  {
    id: 'family', label: 'Study & family', short: 'Study & family', icon: 'family', tone: 'rose',
    description: 'Student starting points, household decisions and family tax preparation.',
    intro: 'Start with the parts of your situation that matter: studying, moving with family, household income and the records needed for review.',
    start: ['journey/newcomer', 'Choose your arrival situation', 'The arrival checklist includes student and family paths as well as employee steps.'],
    steps: [
      ['journey/newcomer', 'Choose the right arrival path', 'Select student or family steps in the existing newcomer checklist.'],
      ['taxplan/cases', 'Review study and family tax topics', 'Explore education, childcare, assessment and part-year preparation.'],
      ['healthcompare', 'Review your insurance questions', 'Compare the supported information and confirm individual cover with the insurer.']
    ],
    guides: ['training', 'familytax', 'benefits', 'insurance-tax', 'arrival-tax'],
    tools: [['taxplan/cases', 'Study & family tax paths', 'Prepare education, childcare and household records.', 'family'], ['taxclasses', 'Household salary comparison', 'Explore the supported tax-class and income scenarios.', 'wallet'], ['taxplan/checks', 'Insurance & donation checks', 'Review certificates, evidence and possible duplicates.', 'shield']],
    sources: [['DAAD: studying in Germany', 'https://www.daad.de/en/'], ['Familienportal: official family information', 'https://familienportal.de/']],
    keywords: 'student study university education master degree spouse married family children childcare benefits'
  },
  {
    id: 'crossborder', label: 'Germany ↔ India', short: 'Germany ↔ India', icon: 'globe', tone: 'sage',
    description: 'Accounts, transfers, family support and planning a return to India.',
    intro: 'Keep banking status, tax residence and individual transactions separate while preparing the questions and documents that matter.',
    start: ['cross', 'Understand the cross-border picture', 'Start with accounts, income, family transfers and the decisions you need to review.'],
    steps: [
      ['guide/accounts', 'Review your bank accounts', 'Understand the differences between NRE, NRO and FCNR(B), and the questions to ask your bank.'],
      ['taxplan/cross', 'Prepare residence and transfer questions', 'Use the supported residency screening and two-quote transfer comparison.'],
      ['journey/return', 'Plan your return', 'Work through contracts, banking, tax records, insurance and pension questions.']
    ],
    guides: ['accounts', 'remittance', 'incoming', 'support', 'gift', 'residency', 'pension', 'property'],
    tools: [['taxplan/cross', 'Residence & transfer planning', 'Screen residence questions and compare transfer quotes.', 'globe'], ['parentsguide', 'Parent-support preparation', 'Organize the eligibility questions and supporting evidence.', 'family'], ['journey/return', 'Return-to-India checklist', 'Track the departure and arrival steps that apply to you.', 'plane']],
    sources: [['Reserve Bank of India', 'https://www.rbi.org.in/'], ['Indian Income Tax Department', 'https://www.incometax.gov.in/'], ['German Pension Insurance', 'https://www.deutsche-rentenversicherung.de/']],
    keywords: 'india germany cross border nre nro fcnr fema nr rnor ror residency transfer remittance parents pension return'
  },
  {
    id: 'tools', label: 'Calculators & checklists', short: 'Tools', icon: 'chart', tone: 'blue',
    description: 'Practical tools that turn a guide into your next useful step.',
    intro: 'Choose a tool for the question in front of you. Read its scope and assumptions before using an estimate or saving entries on your device.',
    start: ['moneycheck', 'Start with a quick self-check', 'Find your next three money and paperwork actions before opening a more detailed tool.'],
    steps: [
      ['salary', 'Understand your income', 'Estimate a regular payslip or compare supported tax-class scenarios.'],
      ['taxplan/finder', 'Prepare your records', 'Find tax topics, review evidence and build an adviser preparation pack.'],
      ['settings', 'Manage your saved entries', 'Review privacy controls and export a local backup when needed.']
    ],
    guides: ['salary', 'commute', 'moving', 'residency'],
    tools: [['salary', 'Monthly take-home pay', 'Regular 2026 employee payslip estimates.', 'wallet'], ['taxclasses', 'Tax classes & salary', 'Supported household withholding comparisons.', 'family'], ['tax', 'Tax expense workspace', 'Commuting, home office and work-expense candidates.', 'receipt'], ['doublehousehold', 'Double-household costs', 'A bounded worksheet for eligible cost components.', 'home'], ['budget', 'Budget & goals', 'Monthly planning and local transaction records.', 'wallet'], ['taxplan/export', 'Adviser preparation pack', 'Year-filtered text, CSV and print exports.', 'folder']],
    sources: [['German Income Tax Act', 'https://www.gesetze-im-internet.de/estg/'], ['Federal Ministry of Finance', 'https://www.bundesfinanzministerium.de/']],
    keywords: 'calculators checklists tools salary tax planner budget commute double household adviser export'
  }
];

const topicHref = topic => '#topic/' + topic.id;
const arrow = '<svg class="atlas-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M5 19 19 5M5 5h14v14"/></svg>';
const heading = (title, link = '', label = 'Explore all →') => '<div class="atlas-section-heading"><h2>' + esc(title) + '</h2>' + (link ? '<a href="' + esc(link) + '" class="biglink">' + esc(label) + '</a>' : '') + '</div>';
const linkCard = ([route, title, description, icon = 'book'], icons) => '<a href="#' + esc(route) + '" class="atlas-link-card"><span class="atlas-small-icon">' + icons(icon) + '</span><div><h3>' + esc(title) + '</h3><p>' + esc(description) + '</p></div>' + arrow + '</a>';

export function portalTopicCards(icons) {
  return '<div class="atlas-topic-grid">' + portalTopics.map(topic => '<a class="atlas-topic-card atlas-tone-' + topic.tone + '" href="' + topicHref(topic) + '"><span class="atlas-topic-icon">' + icons(topic.icon) + '</span><h3>' + esc(topic.label) + '</h3><p>' + esc(topic.description) + '</p><span class="atlas-text-link">Explore topic ' + arrow + '</span></a>').join('') + '</div>';
}

function guideCards(ids, articles, icons) {
  return '<div class="atlas-guide-grid">' + ids.map(id => articles.find(article => article.id === id)).filter(Boolean).map(article => {
    const topic = portalTopics.find(item => item.guides.includes(article.id)) || portalTopics[2];
    return '<a class="atlas-guide-card" href="#guide/' + esc(article.id) + '"><div class="atlas-guide-art atlas-tone-' + topic.tone + '" aria-hidden="true">' + icons(topic.icon) + '<span>' + esc(article.cat) + '</span></div><div class="atlas-guide-copy"><h3>' + esc(article.name) + '</h3><p>' + esc(article.summary) + '</p><span class="atlas-text-link">Read the guide ' + arrow + '</span></div></a>';
  }).join('') + '</div>';
}

const neighbourhood = '<svg class="atlas-neighbourhood" viewBox="0 0 360 190" fill="none" aria-hidden="true" focusable="false"><circle cx="276" cy="48" r="29" fill="#d6bfa2"/><path d="M22 166h318" stroke="#426457" stroke-width="2"/><path d="M48 166V81l46-35 46 35v85" fill="#f8f4eb" stroke="#426457" stroke-width="2"/><path d="M39 85l55-42 55 42M70 104h17v22H70zm32 0h17v22h-17zM86 166v-27h21v27" stroke="#426457" stroke-width="2"/><path d="M152 166V65h76v101" fill="#acc1ae" stroke="#426457" stroke-width="2"/><path d="M168 82h14v18h-14zm29 0h14v18h-14zm-29 34h14v18h-14zm29 0h14v18h-14zM181 166v-20h18v20" stroke="#426457" stroke-width="2"/><path d="M255 166V97l36-26 35 26v69" fill="#e3d7be" stroke="#426457" stroke-width="2"/><path d="m248 101 43-32 43 32M269 118h15v20h-15zm27 0h15v20h-15zM283 166v-15h17v15" stroke="#426457" stroke-width="2"/><path d="M30 166v-34m-12-4c0-18 25-18 25 0 0 17-25 17-25 0Z" fill="#8fa58d" stroke="#426457" stroke-width="2"/><path d="M74 27h29M192 31h20" stroke="#f8f4eb" stroke-width="5" stroke-linecap="round"/></svg>';

export function portalHome({ articles, news, reviewed, icons }) {
  const updates = news.slice(0, 3);
  const stages = [
    ['topic/moving', '01', 'Planning the move', 'Permits, documents and your first practical decisions.'],
    ['journey/newcomer', '02', 'Just arrived', 'A checklist for your first weeks and months.'],
    ['topic/living', '03', 'Living here', 'Your home, healthcare and everyday paperwork.'],
    ['journey/return', '04', 'Leaving or returning', 'Close one chapter and prepare the next.']
  ];
  return '<div class="atlas-portal"><nav class="atlas-topic-nav" aria-label="Browse topics">' + portalTopics.map(topic => '<a href="' + topicHref(topic) + '">' + esc(topic.short) + '</a>').join('') + '</nav>' +
    '<div class="atlas-home-intro"><div class="eyebrow">ATLASEVERYDAY / GERMANY · DEUTSCHLAND</div><h1>Your everyday guide to Germany.</h1><p>Practical help with moving, living and managing money — with extra guidance for Germany–India decisions.</p><form id="fbOverviewQuestionForm" class="fb-question-search atlas-home-search" role="search"><label class="sr" for="fbOverviewQuestion">Ask AtlasEveryday</label><input id="fbOverviewQuestion" name="question" maxlength="200" required placeholder="What would you like help with? Try salary, PR or moving…" autocomplete="off"><button class="button" type="submit" aria-label="Find matching guidance">' + icons('search') + '</button></form><div id="fbOverviewQuestionResult" class="atlas-search-result" role="status"></div><small>Search guides and tools on your device. Contextual AI is available inside selected guides.</small></div>' +
    '<div class="atlas-front-grid"><a class="atlas-feature" href="#journey/newcomer"><div class="atlas-feature-art">' + neighbourhood + '</div><div class="atlas-feature-copy"><span class="eyebrow">THE STARTER GUIDE</span><h2>A new country.<br>A clearer next step.</h2><p>Housing, registration, banking and the everyday essentials. Put your first months in Germany into a practical plan.</p><span class="atlas-text-link">Start your arrival checklist ' + arrow + '</span></div></a><section class="atlas-news-panel" aria-labelledby="atlasLatestHeading"><div class="atlas-news-heading"><h2 id="atlasLatestHeading">Latest updates</h2><a href="#news" class="biglink">All news →</a></div><p class="atlas-news-review">Reviewed ' + esc(reviewed) + ' · Official sources</p>' + updates.map(item => '<article class="atlas-news-item"><div class="atlas-news-meta">' + esc(item.category) + ' <span>· ' + esc(item.status) + '</span></div><h3><a href="#news/' + esc(item.id) + '">' + esc(item.title) + '</a></h3><p>' + esc(item.effective) + '</p></article>').join('') + '<small class="atlas-editorial-note">Reviewed announcements and rule changes. Check the effective date and official source.</small></section></div>' +
    '<section aria-labelledby="atlasJourneyHeading"><div class="atlas-section-heading"><div><span class="eyebrow">START WHERE YOU ARE</span><h2 id="atlasJourneyHeading">Your life in Germany, step by step.</h2></div><a href="#journeys" class="biglink">All checklists →</a></div><div class="atlas-stage-grid">' + stages.map(([route, number, name, description]) => '<a class="atlas-stage-card" href="#' + route + '"><span class="atlas-stage-number">' + number + '</span><h3>' + esc(name) + '</h3><p>' + esc(description) + '</p>' + arrow + '</a>').join('') + '</div></section>' +
    '<section aria-label="Explore by topic">' + heading('Find your topic', '#discover', 'Search all guides →') + portalTopicCards(icons) + '</section>' +
    '<section class="atlas-tool-section" aria-label="Practical tools">' + heading('Turn a question into a useful next step.', '#topic/tools', 'All tools →') + '<div class="atlas-tool-grid">' + [
      ['salary', 'What could my take-home pay be?', 'Estimate a regular monthly German payslip.', 'wallet'],
      ['taxplan/finder', 'What should I prepare for tax?', 'Find topics to review and keep the right evidence.', 'receipt'],
      ['budget', 'Where is my money going?', 'Plan spending and track entries on this device.', 'chart'],
      ['taxplan/cross', 'How do I compare a transfer?', 'Review two quotes and your residence questions.', 'globe']
    ].map(item => linkCard(item, icons)).join('') + '</div></section>' +
    '<section aria-label="Recommended guides">' + heading('Worth a closer look', '#discover', 'All guides →') + '<p class="atlas-section-caption">A few editorial starting points from our guide library.</p>' + guideCards(['salary', 'housing', 'accounts'], articles, icons) + '</section>' +
    '<aside class="atlas-cross-callout"><span class="atlas-small-icon">' + icons('globe') + '</span><div><span class="eyebrow">TWO COUNTRIES, CONNECTED</span><h2>Life between Germany and India.</h2><p>Bank accounts, family support, transfers and your plans for the future — brought together in one place.</p></div><a class="button" href="#topic/crossborder">Explore Germany ↔ India ' + arrow + '</a></aside>' +
    '<div class="atlas-home-foot"><p>Educational guidance. Read each tool’s assumptions and verify current official rules.</p><a href="#feedback" class="biglink">Help us make the next guide better →</a></div></div>';
}

export function portalTopicPage(id, articles, icons) {
  const topic = portalTopics.find(item => item.id === id);
  if (!topic) return '<div class="atlas-portal"><a href="#discover" class="biglink">← Explore all topics</a><h1 class="h1">Choose a topic</h1><p class="lead">That topic could not be found. Choose one of the guides below.</p>' + portalTopicCards(icons) + '</div>';
  return '<div class="atlas-portal atlas-topic-page"><a href="#overview" class="biglink">← AtlasEveryday home</a><nav class="atlas-topic-nav" aria-label="Browse topics">' + portalTopics.map(item => '<a href="' + topicHref(item) + '"' + (item.id === id ? ' aria-current="page"' : '') + '>' + esc(item.short) + '</a>').join('') + '</nav>' +
    '<div class="atlas-topic-intro"><span class="atlas-topic-icon atlas-tone-' + topic.tone + '">' + icons(topic.icon) + '</span><div class="eyebrow">ATLASEVERYDAY / TOPIC GUIDE</div><h1>' + esc(topic.label) + '</h1><p>' + esc(topic.intro) + '</p></div>' +
    '<section class="atlas-topic-start atlas-tone-' + topic.tone + '"><div><span class="eyebrow">A GOOD PLACE TO START</span><h2>' + esc(topic.start[1]) + '</h2><p>' + esc(topic.start[2]) + '</p></div><a class="button" href="#' + esc(topic.start[0]) + '">Start here →</a></section>' +
    '<section aria-label="Suggested steps">' + heading('Find your next step') + '<ol class="atlas-next-steps">' + topic.steps.map(([route, name, description], i) => '<li><span class="atlas-step-count">' + (i + 1) + '</span><div><h3><a href="#' + esc(route) + '">' + esc(name) + ' ' + arrow + '</a></h3><p>' + esc(description) + '</p></div></li>').join('') + '</ol></section>' +
    '<section aria-label="Topic guides">' + heading('Understand the essentials', '#discover', 'Search the full library →') + guideCards(topic.guides, articles, icons) + '</section>' +
    '<section class="atlas-tool-section" aria-label="Related tools">' + heading('Put it into practice') + '<div class="atlas-tool-grid">' + topic.tools.map(item => linkCard(item, icons)).join('') + '</div></section>' +
    '<section class="atlas-official-sources" aria-labelledby="atlasSourcesHeading"><div><span class="eyebrow">CHECK AT THE SOURCE</span><h2 id="atlasSourcesHeading">Official starting points</h2><p>Check the current information for your situation and the relevant year. These links open the organizations’ own websites.</p></div><ul>' + topic.sources.map(([name, url]) => '<li><a href="' + esc(url) + '" target="_blank" rel="noopener noreferrer">' + esc(name) + ' ↗</a></li>').join('') + '</ul></section>' +
    '<div class="atlas-home-foot"><a href="#sources" class="biglink">Sources, review dates and limitations →</a><a href="#feedback" class="biglink">Suggest something missing →</a></div></div>';
}
