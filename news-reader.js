// Keep article URLs stable so a link in a guide opens the same story as the overview.
const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
})[c]);
const articleLink = item => '#news/' + encodeURIComponent(item.id);

const drawings = {
  paper: '<path d="M46 19h67v45q0 8-7 8H48q-6 0-6-6V32h4" fill="#e5d5b8"/><g class="news-art-detail"><path d="M33 11h69v54q0 7 5 7H40q-7 0-7-8z" fill="#fffaf0"/><path d="M42 21h49M42 27h31" stroke-width="3"/><path d="M42 37h19v14H42z" fill="#a8c5bd"/><path d="M68 38h23m-23 7h18m-18 7h23M42 60h49"/></g>',
  licence: '<rect x="51" y="7" width="39" height="67" rx="7" fill="#455f62"/><rect x="55" y="14" width="31" height="51" rx="2" fill="#dbeae1"/><path d="M67 69h7" stroke="#faf6ec"/><g class="news-art-detail"><rect x="24" y="33" width="54" height="33" rx="4" fill="#fff9e9"/><circle cx="36" cy="43" r="4" fill="#d5ac82"/><path d="M30 55q6-12 12 0z" fill="#97b4a5"/><path d="M49 43h20m-20 7h15m-15 7h19"/></g>',
  meter: '<path d="M25 56h-7V41h-5m84 1h18" fill="none"/><g fill="#e7d9bc"><rect x="24" y="29" width="12" height="38" rx="5"/><rect x="38" y="29" width="12" height="38" rx="5"/><rect x="52" y="29" width="12" height="38" rx="5"/><rect x="66" y="29" width="12" height="38" rx="5"/><rect x="80" y="29" width="12" height="38" rx="5"/></g><rect x="60" y="35" width="17" height="24" rx="3" fill="#fffdf4"/><path d="M64 41h9m-9 4h6"/><g class="news-art-detail" fill="none"><path d="M77 22q7-1 10 5m-11-12q14-2 18 10"/></g>',
  software: '<rect x="25" y="16" width="76" height="48" rx="4" fill="#b7cbbc"/><path d="M30 22h66v35H30z" fill="#fff9e9"/><path d="M18 65h90l-7 5H25z" fill="#d8c9aa"/><g class="news-art-detail" fill="none"><path d="m48 31-8 8 8 8m31-16 8 8-8 8m-12-17-7 19" stroke-width="3"/></g>'
};
export function newsArt(kind = 'paper') {
  const drawing = Object.hasOwn(drawings, kind) ? drawings[kind] : drawings.paper;
  return '<svg class="news-art" viewBox="0 0 128 82" fill="none" aria-hidden="true" focusable="false"><g stroke="#385451" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">' + drawing + '</g></svg>';
}

function meta(item) {
  return '<div class="expat-news-meta"><span class="tag">' + escape(item.category) + '</span><span class="expat-news-status">' +
    escape(item.status) + '</span><span class="muted">' + escape(item.effective) + '</span></div>';
}

function editorialNote(reviewed) {
  return '<footer class="news-editorial"><strong>Editorial note</strong><p>Latest additions on ' + escape(reviewed) +
    '. AtlasEveryday selects updates for residents and writes English summaries of the linked sources. We check announcements manually. Before acting, confirm the effective date and the wording in the original.</p></footer>';
}

function card(item) {
  return '<article class="card expat-news-card">' + meta(item) + '<h2><a href="' + articleLink(item) + '">' +
    escape(item.title) + '</a></h2><p>' + escape(item.summary) + '</p></article>';
}

function sourceLink(url, label, language) {
  return '<li><a class="biglink" href="' + escape(url) + '"' + (language ? ' hreflang="' + escape(language) + '"' : '') + '>' +
    escape(label) + '</a></li>';
}

function article(item, reviewed) {
  const lang = item.sourceLanguage;
  const languageLabel = lang === 'de' ? ' (German)' : lang === 'en' ? ' (English)' : '';
  const translation = lang === 'de' ? 'AtlasEveryday translated and summarised the German material in English. Check the original wording for conditions and exceptions.' :
    lang === 'en' ? 'AtlasEveryday summarised the official English-language guidance. You can read it directly below.' :
    'AtlasEveryday prepared this English summary from the linked material. Check the original wording for details.';
  let sources = sourceLink(item.url, (item.sourceName || 'Official source') + languageLabel, lang);
  for (const link of item.moreSources || []) sources += sourceLink(link.url, link.label, link.lang);
  if (item.report) sources += sourceLink(item.report, item.reportLabel || 'Additional reporting', item.reportLanguage);
  return '<a class="biglink news-back" href="#news">← All updates</a><article class="news-story">' +
    '<header class="news-masthead"><div>' + meta(item) + '<h1 class="h1">' + escape(item.title) + '</h1></div>' + newsArt(item.art) + '</header>' +
    '<div class="news-prose"><p class="news-intro">' + escape(item.summary) + '</p>' +
    (item.detail ? '<p>' + escape(item.detail) + '</p>' : '') + '<section><h2>Who this affects</h2><p>' + escape(item.who) +
    '</p></section><section><h2>What to do</h2><p>' + escape(item.action) + '</p><a class="biglink" href="' + escape(item.route) +
    '">Open the related guide →</a></section><section class="news-sources"><h2>Sources and translation</h2><p>' + translation +
    '</p><ul>' + sources + '</ul></section></div></article>' + editorialNote(reviewed);
}

export function renderNews(items, reviewed, id) {
  const item = items.find(entry => entry.id === id);
  if (item) return article(item, reviewed);
  const missing = id ? '<p role="status">This article could not be found. Choose a headline below.</p>' : '';
  return '<header class="news-masthead"><div><h1 class="h1">Germany Expat Updates</h1>' +
    '<p class="lead">Rule changes and announcements for people living in Germany, explained in English.</p></div>' + newsArt() + '</header>' +
    missing + '<div class="grid news-grid">' + items.map(card).join('') + '</div>' +
    '<section class="news-suggest"><h2>What we monitor</h2><p>Residence and citizenship, work and tax, housing, transport, family life and changes that affect people with ties to Germany and India.</p><a class="biglink" href="#feedback">Suggest a news topic →</a></section>' + editorialNote(reviewed);
}

export function relatedNews(items, route) {
  const matches = items.filter(item => item.route === route).slice(0, 2);
  if (!matches.length) return '';
  return '<aside class="news-related" aria-label="Related news"><div>' + newsArt(matches[0].art) +
    '</div><div><h2>Related updates</h2><ul>' + matches.map(item => '<li><a href="' + articleLink(item) + '">' +
      escape(item.title) + '</a></li>').join('') + '</ul></div></aside>';
}
