import fs from 'node:fs';
import path from 'node:path';

const REPO_ROOT = path.resolve(new URL('.', import.meta.url).pathname, '..', '..');
const COMPONENTS_ROOT = path.join(REPO_ROOT, 'packages/ui/src/components');
const DOCS_ROOT = path.join(REPO_ROOT, 'documentation/docs/components');

const CATEGORY_ORDER = [
  'ui',
  'form',
  'form/pickers',
  'form/date-controls',
  'form/color-controls',
  'data',
  'feedback',
  'navigation',
  'layouts',
  'overlays',
];

function listComponentEntries(category) {
  const categoryPath = path.join(COMPONENTS_ROOT, category);
  if (!fs.existsSync(categoryPath)) return [];

  return fs
    .readdirSync(categoryPath, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .filter((entry) => {
      if (category === 'form') {
        return !['pickers', 'date-controls', 'color-controls'].includes(entry.name);
      }
      return true;
    })
    .map((entry) => entry.name);
}

function getComponentNamesFromMdx(category, componentDirName) {
  const dir = path.join(COMPONENTS_ROOT, category, componentDirName);
  const files = fs.readdirSync(dir);
  return files
    .filter((file) => file.endsWith('.mdx') && !file.includes('KitchenSink'))
    .map((file) => file.replace(/\.mdx$/, ''));
}

const missing = [];
const found = [];

for (const category of CATEGORY_ORDER) {
  const entries = listComponentEntries(category);
  for (const componentDirName of entries) {
    const componentNames = getComponentNamesFromMdx(category, componentDirName);
    for (const componentName of componentNames) {
      const expectedPath = path.join(DOCS_ROOT, category, `${componentName}.mdx`);
      const route = `/components/${category}/${componentName}`;

      if (fs.existsSync(expectedPath)) {
        found.push(route);
      } else {
        missing.push(route);
      }
    }
  }
}

if (missing.length > 0) {
  console.error('❌ Missing authored docs pages:');
  for (const route of missing) {
    console.error(`  - ${route}`);
  }
  console.error(`\nFound ${found.length} docs pages, missing ${missing.length}.`);
  process.exit(1);
}

console.log(`✅ Docs coverage check passed (${found.length} / ${found.length}).`);
