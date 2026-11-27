// Keep article URLs stable so a link in a guide opens the same story as the overview.
const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
})[c]);
const articleLink = item => '#news/' + encodeURIComponent(item.id);

const drawings = {
  calendar: '<g fill="#fffaf0"><rect x="35" y="16" width="58" height="52" rx="5"/><path d="M35 31h58M48 11v10m30-10v10"/></g><g class="news-art-detail" fill="#b4c9b8"><rect x="45" y="39" width="10" height="9" rx="2"/><rect x="62" y="39" width="10" height="9" rx="2"/><path d="m63 56 5 5 10-13" fill="none"/></g>',
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
  return '<footer class="news-editorial"><strong>Editorial status</strong><p>These are curated updates. Latest additions: ' + escape(reviewed) +
    '. This page does not pull live headlines or automatically detect new laws. Check the effective date and original official source before acting. “Announced” does not mean a rule is already in effect.</p>' +
    '<p>AtlasEveryday writes independent English explanations. Where we translate German material, the original German legal text is authoritative. For a decision about your own situation, check the linked publication and its conditions.</p>' +
    '<p><a class="biglink" href="impressum.html">Responsible editor</a> · <a class="biglink" href="#feedback">Report a correction</a></p></footer>';
}

const dateFormatter = new Intl.DateTimeFormat('en-GB', {dateStyle:'long', timeZone:'UTC'});
function date(value) {
  if (!value) return '';
  return '<time datetime="' + escape(value) + '">' + dateFormatter.format(new Date(value + 'T00:00:00Z')) + '</time>';
}
const topicOf = item => item.topic || (item.category === 'Insurance' ? 'Healthcare & insurance' : item.category);
const statusGroups = {
  'Official statistics':'Statistics', 'Approved':'Approved or scheduled', 'Announced':'Approved or scheduled',
  'Launch planned':'Approved or scheduled', 'Scheduled':'Approved or scheduled', 'Upgrade deadline':'Approved or scheduled',
  'Law published':'Approved or scheduled', 'In force':'In force', 'In effect':'In force', 'In force in stages':'In force',
  'Under discussion':'Under discussion or in progress', 'In mediation':'Under discussion or in progress',
  'Bundestag approved — not yet in effect':'Under discussion or in progress', 'Bundestag approved — further steps pending':'Under discussion or in progress'
};
const groupOf = item => item.supersededBy ? 'Superseded' : statusGroups[item.status] || item.status;
const defaultArt = item => item.art || (groupOf(item) === 'Approved or scheduled' ? 'calendar' : 'paper');

export function guideFlow(kind) {
  const registration = kind === 'registration';
  const steps = registration ? ['Get the housing confirmation','Attend registration','Keep the registration certificate'] :
    ['Gross salary','Subtract wage tax and social contributions','Estimated take-home pay'];
  return '<figure class="guide-flow"><figcaption>' + (registration ? 'How address registration works' : 'How the salary estimate works') +
    '</figcaption><ol>' + steps.map(step => '<li>' + step + '</li>').join('') + '</ol></figure>';
}

function comparison(item) {
  if (item.metrics) return '<figure class="news-comparison"><figcaption>Changes in registered unemployment</figcaption><dl>' +
    item.metrics.map(([label,value])=>'<div><dt>'+escape(label)+'</dt><dd>'+escape(value)+'</dd></div>').join('')+'</dl></figure>';
  if (!item.comparison) return '';
  const {caption,values,unit} = item.comparison;
  const formatter = new Intl.NumberFormat('en-IE',{style:'currency',currency:unit,maximumFractionDigits:0});
  const maximum = Math.max(...values.map(([,value]) => value));
  return '<figure class="news-comparison"><figcaption>' + escape(caption) + '</figcaption><dl>' +
    values.map(([label,value])=>'<div><dt>'+escape(label)+'</dt><dd>'+escape(formatter.format(value))+
      '<span class="news-bar" aria-hidden="true" style="width:'+ (100*value/maximum) +'%"></span></dd></div>').join('')+'</dl></figure>';
}

function card(item) {
  return '<article class="card expat-news-card">' + (item.supersededBy ? '<strong>Superseded edition</strong>' : '') + meta(item) +
    '<h2><a href="' + articleLink(item) + '">' + escape(item.title) + '</a></h2><p>' + escape(item.summary) + '</p>' +
    '<small>' + (item.published ? 'Published ' + date(item.published) + ' · ' : '') + escape(item.sourceName || 'Official source') + '</small></article>';
}

function sourceLink(url, label, language) {
  return '<li><a class="biglink" href="' + escape(url) + '"' + (language ? ' hreflang="' + escape(language) + '"' : '') + '>' +
    escape(label) + '</a></li>';
}

function article(item, reviewed, items) {
  const lang = item.sourceLanguage;
  const languageLabel = lang === 'de' ? ' (German)' : lang === 'en' ? ' (English)' : '';
  const translation = lang === 'de' ? 'AtlasEveryday translated and summarised the German material in English. Check the original wording for conditions and exceptions.' :
    lang === 'en' ? 'AtlasEveryday summarised the official English-language guidance. You can read it directly below.' :
    'AtlasEveryday prepared this English summary from the linked material. Check the original wording for details.';
  let sources = sourceLink(item.url, (item.sourceName || 'Official source') + languageLabel, lang);
  for (const link of item.moreSources || []) sources += sourceLink(link.url, link.label, link.lang);
  if (item.report) sources += sourceLink(item.report, item.reportLabel || 'Additional reporting', item.reportLanguage);
  const newer = items.find(other => other.id === item.supersededBy);
  const history = items.filter(other => other.supersededBy === item.id);
  const changeNote = newer ? '<aside class="news-edition"><strong>Superseded edition</strong><p>Updated on ' + date(item.supersededOn) +
    '. <a class="biglink" href="' + articleLink(newer) + '">Read the current article →</a></p></aside>' : '';
  const editions = history.length ? '<section><h2>Update history</h2><ul>' + history.map(old => '<li>' + date(old.supersededOn) +
    ' · Replaced the earlier report. <a class="biglink" href="' + articleLink(old) + '">' + escape(old.title) + '</a></li>').join('') + '</ul></section>' : '';
  const stamps = [['First published on AtlasEveryday',item.published],['Source published',item.sourcePublished],['Last verified',item.verified]];
  const dates = '<dl class="news-dates">' + stamps.filter(([,value])=>value).map(([label,value])=>'<div><dt>'+label+'</dt><dd>'+date(value)+'</dd></div>').join('')+'</dl>';
  return (newer ? '<a class="biglink news-back" href="#news/archive">← News archive</a>' : '<a class="biglink news-back" href="#news">← All updates</a>') + '<article class="news-story">' + changeNote +
    '<header class="news-masthead"><div>' + meta(item) + '<h1 class="h1">' + escape(item.title) + '</h1></div>' + newsArt(defaultArt(item)) + '</header>' + dates +
    '<div class="news-prose"><p class="news-intro">' + escape(item.summary) + '</p>' +
    comparison(item) + (item.detail ? '<p>' + escape(item.detail) + '</p>' : '') + '<section><h2>Who this affects</h2><p>' + escape(item.who) +
    '</p></section><section><h2>What to do</h2><p>' + escape(item.action) + '</p><a class="biglink" href="' + escape(item.route) +
    '">Open the related guide →</a></section><section class="news-sources"><h2>Sources and translation</h2><p>' + translation +
    '</p><ul>' + sources + '</ul></section>' + editions + '</div></article>' + editorialNote(reviewed);
}

export function renderNews(items, reviewed, id) {
  const item = items.find(entry => entry.id === id);
  if (item) return article(item, reviewed, items);
  const archive = id === 'archive';
  const missing = id && !archive ? '<p role="status">This article could not be found. Choose a headline below.</p>' : '';
  const list = archive ? items.slice().sort((a,b)=>(b.published || '').localeCompare(a.published || '')) : items.filter(entry=>!entry.supersededBy);
  const select = (name,label,all,values) => '<label class="field">'+label+'<select name="'+name+'"><option value="">'+all+'</option>' +
    [...new Set(values)].sort().map(value=>'<option>'+escape(value)+'</option>').join('')+'</select></label>';
  return '<header class="news-masthead"><div><h1 class="h1">' + (archive ? 'News archive' : 'Germany Expat Updates') + '</h1><p class="lead">' +
    (archive ? 'Browse by publication date, including earlier editions of updated stories.' : 'Rule changes and announcements for people living in Germany, explained in English.') +
    '</p><a class="biglink" href="'+(archive?'#news':'#news/archive')+'">'+(archive?'← Latest updates':'Browse the archive →')+'</a></div>' + newsArt() + '</header>' + missing +
    '<form id="newsFilters" role="search" aria-label="Search news" data-view="'+(archive?'archive':'latest')+'"><label class="field">Search articles<input type="search" name="query" placeholder="Try pension or driving licence" maxlength="160"></label>' +
    select('topic','Topic','All topics',list.map(topicOf)) + select('status','Status','All statuses',list.map(groupOf)) +
    (archive ? select('month','Published in','All months',list.filter(i=>i.published).map(i=>i.published.slice(0,7))) : '') +
    '<button type="reset" class="button secondary">Clear filters</button></form><p id="newsCount" role="status"></p><div id="newsResults" class="grid news-grid">' +
    list.map(card).join('') + '</div>' +
    '<section class="news-suggest"><h2>What we monitor</h2><p>Residence and citizenship, work and tax, housing, transport, family life and changes that affect people with ties to Germany and India.</p><a class="biglink" href="#feedback">Suggest a news topic →</a></section>' + editorialNote(reviewed);
}

// Keep each list's filters when a reader opens an article and returns.
const viewFilters = new Map();
export function mountNewsFilters(items) {
  const form = document.getElementById('newsFilters');
  if (!form) return;
  const view = form.dataset.view;
  const choices = viewFilters.get(view) || {};
  for (const [name,value] of Object.entries(choices)) if (form.elements[name]) form.elements[name].value=value;
  const container = document.getElementById('newsResults');
  const rows = [...container.children];
  const byRoute = new Map(items.map(item => [articleLink(item),item]));
  const entries = rows.map(row => byRoute.get(row.querySelector('h2 a').getAttribute('href')));
  const count = document.getElementById('newsCount');
  const update = () => {
    const fields = Object.fromEntries(new FormData(form));
    viewFilters.set(view, fields);
    const words = fields.query.toLowerCase().trim().split(/\s+/).filter(Boolean);
    let visible = 0;
    entries.forEach((item,index) => {
      const context = [item.title,item.summary,item.detail,item.category,topicOf(item),item.action,item.who,item.sourceName,item.status,item.effective].join(' ').toLowerCase();
      const match = (!fields.topic || topicOf(item)===fields.topic) && (!fields.status || groupOf(item)===fields.status) &&
        (!fields.month || item.published?.startsWith(fields.month)) && words.every(w=>context.includes(w));
      rows[index].hidden = !match;
      if(match) visible++;
    });
    count.textContent = visible ? visible + (visible===1?' article':' articles') : 'No matching articles. Change a filter or try another word.';
  };
  form.oninput = update;
  form.onchange = update;
  form.onsubmit = event => {event.preventDefault();update();};
  form.onreset = () => queueMicrotask(update);
  update();
}

export function relatedNews(items, route) {
  const matches = items.filter(item => !item.supersededBy && item.route === route).slice(0, 2);
  if (!matches.length) return '';
  return '<aside class="news-related" aria-label="Related news"><div>' + newsArt(matches[0].art) +
    '</div><div><h2>Related updates</h2><ul>' + matches.map(item => '<li><a href="' + articleLink(item) + '">' +
      escape(item.title) + '</a></li>').join('') + '</ul></div></aside>';
}
