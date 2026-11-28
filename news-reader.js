import { newsArt, illustratedPanel } from './illustrations.js?v=9dc779bf4eec';
// Keep article URLs stable so a link in a guide opens the same story as the overview.
const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
})[c]);
const articleLink = item => '#news/' + encodeURIComponent(item.id);


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
const categoryArt = {Employment:'jobs', Insurance:'recognition', Pensions:'salary', Tax:'expenses', Banking:'transfer'};
export const newsArtKind = item => item.art || (item.id === 'healthrecognition2026nov' ? 'recognition' : categoryArt[item.category]) ||
  (groupOf(item) === 'Approved or scheduled' ? 'calendar' : 'paper');

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
  return '<article class="card expat-news-card">' + (item.supersededBy ? '<strong>Superseded edition</strong>' : '') + '<div class="news-card-top">' + meta(item) + newsArt(newsArtKind(item)) + '</div>' +
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
    '<header class="news-masthead"><div>' + meta(item) + '<h1 class="h1">' + escape(item.title) + '</h1></div>' + illustratedPanel(newsArtKind(item)) + '</header>' + dates +
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
  return '<aside class="news-related" aria-label="Related news"><div>' + newsArt(newsArtKind(matches[0])) +
    '</div><div><h2>Related updates</h2><ul>' + matches.map(item => '<li><a href="' + articleLink(item) + '">' +
      escape(item.title) + '</a></li>').join('') + '</ul></div></aside>';
}
