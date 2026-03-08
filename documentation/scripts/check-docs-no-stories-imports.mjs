import fs from 'node:fs';
import path from 'node:path';

const REPO_ROOT = path.resolve(new URL('.', import.meta.url).pathname, '..', '..');
const DOCS_DIR = path.join(REPO_ROOT, 'documentation');
const ALLOWLIST = new Set([
  // Temporary exception during migration: examples gallery still uses KitchenSink stories.
  // Remove this entry once /examples is fully authored without Storybook imports.
  path.join(DOCS_DIR, 'docs/examples.mdx'),
]);

function walk(dir, out = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name === 'node_modules' || entry.name === 'doc_build' || entry.name === 'old_doc_build') {
      continue;
    }

    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath, out);
      continue;
    }

    if (entry.isFile() && /\.(mdx|tsx|ts|jsx|js)$/.test(entry.name)) {
      out.push(fullPath);
    }
  }
  return out;
}

const files = walk(DOCS_DIR);
const violations = [];

for (const file of files) {
  if (ALLOWLIST.has(file)) continue;
  const content = fs.readFileSync(file, 'utf-8');

  if (/from\s+['"][^'"]*\.stories(?:\.[jt]sx?)?['"]/m.test(content)) {
    violations.push(file);
  }
}

if (violations.length > 0) {
  console.error('❌ Storybook stories imports found in documentation sources:');
  for (const file of violations) {
    console.error(`  - ${path.relative(REPO_ROOT, file)}`);
  }
  process.exit(1);
}

console.log('✅ No .stories imports found in documentation sources.');
