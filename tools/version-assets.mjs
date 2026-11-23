import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { resolve, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

// Dependency-first hashes change the importing asset whenever a local dependency changes.
// Run before a release; --check verifies without writing. External URLs are untouched.
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const hash = text => createHash('sha256').update(text).digest('hex').slice(0, 12);
const pending = new Map(), seen = new Set();
function versionModule(name) {
  const path = resolve(root, name);
  if (!path.startsWith(root + '/')) throw Error('Asset outside repository');
  if (pending.has(path)) return hash(pending.get(path));
  if (seen.has(path)) throw Error('Circular module dependency: ' + name);
  seen.add(path);
  const text = readFileSync(path, 'utf8').replace(/(from\s*['"]|import\s*\(\s*['"])(\.\/[^'"?]+\.js)(?:\?v=[^'"]*)?(['"])/g, (match, prefix, child, quote) => {
    const childPath = resolve(dirname(path), child);
    const version = versionModule(childPath.slice(root.length + 1));
    return prefix + child + '?v=' + version + quote;
  });
  pending.set(path, text); seen.delete(path); return hash(text);
}
const appVersion = versionModule('app.js');
const cssVersion = hash(readFileSync(resolve(root, 'styles.css'), 'utf8'));
const buildVersion = hash(appVersion + ':' + cssVersion);
const indexPath = resolve(root, 'index.html');
let index = readFileSync(indexPath, 'utf8');
if (!index.includes('<code id="fbBuildVersion">' + buildVersion + '</code>')) {
  const date = new Intl.DateTimeFormat('en-GB', { day:'numeric', month:'short', year:'numeric', timeZone:'Europe/Berlin' }).format(new Date());
  index = index.replace(/Website build: [^·]+ · version/, 'Website build: ' + date + ' · version');
}
index = index.replace(/(src="\.\/app\.js)\?v=[^"]+/, '$1?v=' + appVersion).replace(/(href="\.\/styles\.css)\?v=[^"]+/, '$1?v=' + cssVersion).replace(/(<code id="fbBuildVersion">)[^<]*(<\/code>)/, '$1' + buildVersion + '$2');
pending.set(indexPath, index);
// Build the calculator entry from the shared shell so navigation and asset versions stay in sync.
const salaryPath = resolve(root, 'tools/german-net-salary-calculator/index.html');
const salaryTitle = 'German Net Salary Calculator | AtlasEveryday';
const salaryDescription = 'Estimate monthly take-home pay in Germany using gross salary, tax class, federal state and insurance contributions.';
const salaryIndex = index
  .replace('<head>', '<head><base href="../../"/><link rel="canonical" href="https://atlas-everyday.com/tools/german-net-salary-calculator/"/>')
  .replace(/<title>.*?<\/title>/, '<title>' + salaryTitle + '</title>')
  .replace(/(<meta name="description" content=")[^"]*/, '$1' + salaryDescription)
  .replace('<body>', '<body data-page="salary">')
  .replace('id="content" tabindex="-1"></div>', 'id="content" tabindex="-1"><h1>German net salary calculator</h1><p>' + salaryDescription + '</p><noscript>Enable JavaScript to calculate your estimate.</noscript></div>');
pending.set(salaryPath, salaryIndex);
const changed = [...pending].filter(([path, text]) => !existsSync(path) || readFileSync(path, 'utf8') !== text);
if (process.argv.includes('--check')) {
  if (changed.length) { process.stderr.write('Stale asset versions: ' + changed.map(([path]) => basename(path)).join(', ') + '\n'); process.exitCode = 1; }
  else process.stdout.write('Asset versions match all local module contents.\n');
} else {
  for (const [path, text] of changed) {
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, text);
  }
  process.stdout.write('Versioned ' + changed.length + ' assets; website build ' + buildVersion + '.\n');
}
