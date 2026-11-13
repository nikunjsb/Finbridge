// Presentation only: reuse the overview palette without changing content or saved data.
const tones = new Set(['sage', 'sand', 'blue', 'rose']);
const pageTones = {
  overview: 'sage', discover: 'sage', news: 'blue', immigration: 'sage', healthcare: 'rose',
  journeys: 'sage', salary: 'blue', moneycheck: 'blue', taxclasses: 'blue', budget: 'blue',
  tax: 'blue', taxplan: 'blue', taxguide: 'blue', doublehousehold: 'blue', invest: 'blue',
  everyday: 'sand', healthaccess: 'rose', healthcompare: 'rose', language: 'sand', term: 'sand',
  cross: 'sage', parentsguide: 'rose', gold: 'sand', residency: 'sage', location: 'sage',
  insights: 'sage', ask: 'sage', feedback: 'sage', sources: 'sage', privacy: 'sage', settings: 'sage'
};
const categoryTone = category => {
  const text = String(category || '').toLowerCase();
  if (/famil|child|education|student|health|insurance/.test(text)) return 'rose';
  if (/tax|work|bank|invest|salary|financ/.test(text)) return 'blue';
  if (/everyday|hous|property|transport|language|protect/.test(text)) return 'sand';
  return 'sage';
};

export function pageAccent(route, topics = [], articles = []) {
  const [page, id] = String(route || 'overview').replace(/^#\/?/, '').split('/');
  if (page === 'topic') return topics.find(topic => topic.id === id)?.tone || 'sage';
  if (page === 'guide') {
    const topic = topics.find(topic => topic.guides.includes(id));
    return topic?.tone || categoryTone(articles.find(article => article.id === id)?.cat);
  }
  if (page === 'journey') return /support|family|student/.test(id || '') ? 'rose' : /invest/.test(id || '') ? 'blue' : 'sage';
  if (page === 'taxplan') return id === 'cross' ? 'sage' : ['cases', 'checks', 'insurance', 'donations', 'childcare', 'student', 'partyear'].includes(id) ? 'rose' : 'blue';
  return pageTones[page] || 'sage';
}

export function applyPageAccents(root, page, id, topics, articles) {
  if (!root) return;
  const tone = pageAccent(page + (id ? '/' + id : ''), topics, articles);
  root.dataset.pageTone = tones.has(tone) ? tone : 'sage';
  root.classList.toggle('has-page-accents', !['overview', 'topic'].includes(page));
  if (!root.classList.contains('has-page-accents')) return;
  for (const card of root.querySelectorAll('.card')) {
    if (card.matches('[role="alert"],.error,.warning,.success,.inv-validation')) continue;
    let accent = tone;
    if (card.classList.contains('expat-news-card')) accent = categoryTone(card.querySelector('.tag')?.textContent);
    else {
      const link = card.matches('a[href^="#"]') ? card : card.querySelector('a.button[href^="#"],a.biglink[href^="#"]');
      if (link) accent = pageAccent(link.getAttribute('href'), topics, articles);
    }
    card.dataset.accent = tones.has(accent) ? accent : tone;
  }
  const expenseTones = { Commuting: 'blue', 'Home office': 'sand', 'Work equipment': 'blue', 'Professional education': 'rose', 'Business travel': 'blue', Insurance: 'rose', 'Support to family': 'rose', Other: 'sand' };
  for (const choice of root.querySelectorAll('[data-tax-category]')) choice.dataset.accent = expenseTones[choice.dataset.taxCategory] || tone;
  for (const step of root.querySelectorAll('.fb-step')) {
    const input = step.querySelector('input'), key = input?.dataset.newcomerTask || input?.dataset.returnTask || input?.dataset.journey || '';
    step.dataset.accent = /family|child|student|university|health|insurance/.test(key) ? 'rose' : /bank|tax|budget|pay|invest|pension|loan/.test(key) ? 'blue' : /hous|handover|utilities|internet|electric|transport|mail|sim/.test(key) ? 'sand' : tone;
  }
}
