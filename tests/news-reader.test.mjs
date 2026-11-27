import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { renderNews, relatedNews } from '../news-reader.js';

const app = readFileSync(new URL('../app.js', import.meta.url), 'utf8');
const data = JSON.parse(app.match(/const expatNews=(\[[\s\S]*?\n\]);/)[1]);
const edition = '27 November 2026';

test('archived editions remain reachable and point to their current story', () => {
  const latest = renderNews(data, edition);
  const archive = renderNews(data, edition, 'archive');
  for (const entry of data.filter(item => item.supersededBy)) {
    const url = 'href="#news/' + entry.id + '"';
    assert.ok(!latest.includes(url));
    assert.ok(archive.includes(url));
    assert.ok(!relatedNews(data, entry.route).includes(url));
    assert.ok(renderNews(data, edition, entry.supersededBy).includes(url));
    assert.ok(renderNews(data, edition, entry.id).includes('href="#news/' + entry.supersededBy + '"'));
  }
});

test('stories retain unique routes, dated provenance and the bottom editorial notice', () => {
  assert.equal(new Set(data.map(item => item.id)).size,data.length);
  for (const item of data.filter(item => !item.supersededBy)) {
    assert.ok(item.published && item.published <= item.verified);
    const html = renderNews(data, edition, item.id);
    assert.ok(html.includes('Last verified'));
    assert.ok(html.includes(item.title));
    assert.ok(html.indexOf('Sources and translation') < html.indexOf('Editorial status'));
    assert.ok(html.endsWith('</footer>'));
  }
});
