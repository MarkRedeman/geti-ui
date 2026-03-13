import fs from 'node:fs';
import path from 'node:path';

const REPO_ROOT = path.resolve(new URL('.', import.meta.url).pathname, '..', '..');
const DOCS_ROOT = path.join(REPO_ROOT, 'documentation/docs');
const SIDEBARS_PATH = path.join(REPO_ROOT, 'documentation/sidebars.json');

const INCLUDE_SECTIONS = ['components', 'charts', 'blocks', 'smart-tools'];

const sidebars = JSON.parse(fs.readFileSync(SIDEBARS_PATH, 'utf-8'));

function walkMdxFiles(dir, out = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name.startsWith('.')) continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkMdxFiles(fullPath, out);
      continue;
    }

    if (entry.isFile() && entry.name.endsWith('.mdx')) {
      out.push(fullPath);
    }
  }
  return out;
}

function filePathToRoute(filePath) {
  const rel = path.relative(DOCS_ROOT, filePath).replace(/\\/g, '/');
  const noExt = rel.replace(/\.mdx$/, '');

  if (noExt.endsWith('/index')) {
    const route = `/${noExt.slice(0, -('/index'.length))}`;
    return route === '' ? '/' : route;
  }

  if (noExt === 'index') {
    return '/';
  }

  return `/${noExt}`;
}

function collectSidebarLinks(node, out = []) {
  if (!node) return out;

  if (Array.isArray(node)) {
    for (const item of node) collectSidebarLinks(item, out);
    return out;
  }

  if (typeof node === 'object') {
    if (typeof node.link === 'string') out.push(node.link);
    if (Array.isArray(node.items)) collectSidebarLinks(node.items, out);
  }

  return out;
}

function normalizeRoute(route) {
  if (!route) return '/';
  if (route.length > 1 && route.endsWith('/')) return route.slice(0, -1);
  return route;
}

const docsRoutes = new Set();
for (const section of INCLUDE_SECTIONS) {
  const sectionDir = path.join(DOCS_ROOT, section);
  if (!fs.existsSync(sectionDir)) continue;

  const files = walkMdxFiles(sectionDir);
  for (const file of files) {
    const rel = path.relative(sectionDir, file).replace(/\\/g, '/');
    if (rel === '_template.mdx') continue;
    docsRoutes.add(normalizeRoute(filePathToRoute(file)));
  }
}

const sidebarSections = {
  components: sidebars.componentsSidebar,
  charts: sidebars.chartsSidebar,
  blocks: sidebars.blocksSidebar,
  'smart-tools': sidebars.smartToolsSidebar,
};

const sidebarLinks = new Set();
const sidebarLinkCounts = new Map();
for (const section of INCLUDE_SECTIONS) {
  const links = collectSidebarLinks(sidebarSections[section]);
  for (const link of links) {
    if (link.startsWith(`/${section}`)) {
      const normalized = normalizeRoute(link);
      sidebarLinks.add(normalized);
      sidebarLinkCounts.set(normalized, (sidebarLinkCounts.get(normalized) ?? 0) + 1);
    }
  }
}

const missingFromSidebar = [...docsRoutes].filter((route) => !sidebarLinks.has(route)).sort();
const missingDocsPage = [...sidebarLinks].filter((route) => !docsRoutes.has(route)).sort();
const duplicateSidebarLinks = [...sidebarLinkCounts.entries()]
  .filter(([, count]) => count > 1)
  .map(([route]) => route)
  .sort();

if (missingFromSidebar.length > 0 || missingDocsPage.length > 0 || duplicateSidebarLinks.length > 0) {
  if (missingFromSidebar.length > 0) {
    console.error('❌ Docs pages missing from sidebar:');
    for (const route of missingFromSidebar) console.error(`  - ${route}`);
  }

  if (missingDocsPage.length > 0) {
    console.error('❌ Sidebar links without docs page:');
    for (const route of missingDocsPage) console.error(`  - ${route}`);
  }

  if (duplicateSidebarLinks.length > 0) {
    console.error('❌ Duplicate links in sidebar:');
    for (const route of duplicateSidebarLinks) console.error(`  - ${route}`);
  }

  process.exit(1);
}

console.log(
  `✅ Sidebar coverage check passed (${docsRoutes.size} docs routes == ${sidebarLinks.size} sidebar links).`
);
