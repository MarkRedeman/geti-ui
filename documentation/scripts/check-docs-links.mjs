import fs from 'node:fs';
import path from 'node:path';

const REPO_ROOT = path.resolve(new URL('.', import.meta.url).pathname, '..', '..');
const DOCS_ROOT = path.join(REPO_ROOT, 'documentation/docs');
const ALLOWLIST_PATH = path.join(REPO_ROOT, 'documentation/link-check-allowlist.json');

const allowlist = fs.existsSync(ALLOWLIST_PATH)
  ? new Set(JSON.parse(fs.readFileSync(ALLOWLIST_PATH, 'utf-8')))
  : new Set();

function walk(dir, out = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name.startsWith('.')) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full, out);
      continue;
    }

    if (entry.isFile() && entry.name.endsWith('.mdx')) {
      out.push(full);
    }
  }
  return out;
}

function collectLinks(content) {
  const links = [];
  const regex = /\[[^\]]+\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g;
  let m;
  while ((m = regex.exec(content)) !== null) {
    links.push(m[1]);
  }
  return links;
}

function resolveDocTarget(fromFile, href) {
  if (href.startsWith('#')) return null;
  if (!href.startsWith('/')) {
    const fromDir = path.dirname(fromFile);
    const joined = path.resolve(fromDir, href);
    return [joined, `${joined}.mdx`, path.join(joined, 'index.mdx')];
  }

  const clean = href.replace(/#.*$/, '').replace(/\?.*$/, '');
  const abs = path.join(DOCS_ROOT, clean);
  return [abs, `${abs}.mdx`, path.join(abs, 'index.mdx')];
}

const files = walk(DOCS_ROOT);
const missingInternal = [];
const externalLinks = new Set();

for (const file of files) {
  const content = fs.readFileSync(file, 'utf-8');
  const links = collectLinks(content);

  for (const href of links) {
    if (href.startsWith('http://') || href.startsWith('https://')) {
      if (!allowlist.has(href)) externalLinks.add(href);
      continue;
    }

    const targets = resolveDocTarget(file, href);
    if (!targets) continue;

    const exists = targets.some((candidate) => fs.existsSync(candidate));
    if (!exists) {
      missingInternal.push({
        file: path.relative(REPO_ROOT, file),
        href,
      });
    }
  }
}

if (missingInternal.length > 0) {
  console.error('❌ Internal docs links pointing to missing pages/files:');
  for (const item of missingInternal) {
    console.error(`  - ${item.file}: ${item.href}`);
  }
  process.exit(1);
}

console.log(`✅ Internal docs links check passed (${files.length} files scanned).`);

if (externalLinks.size > 0) {
  console.warn('⚠ External links found (not validated online in CI):');
  for (const url of [...externalLinks].sort()) {
    console.warn(`  - ${url}`);
  }
}
