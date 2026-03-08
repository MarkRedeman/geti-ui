import { RspressPlugin } from '@rspress/core';
import path from 'node:path';
import fs from 'node:fs';

interface ComponentPage {
  routePath: string;
  filepath: string;
  componentName: string;
  category: string;
  title: string;
}

const COMPONENT_ROOT = path.resolve(
  __dirname,
  '../../packages/ui/src/components'
);

const CATEGORY_LABELS: Record<string, string> = {
  ui: 'UI',
  form: 'Form Controls',
  'form/date-controls': 'Date Controls',
  'form/color-controls': 'Color Controls',
  'form/pickers': 'Pickers',
  data: 'Data Display',
  feedback: 'Status & Feedback',
  layouts: 'Layout & Structure',
  navigation: 'Navigation',
  overlays: 'Overlays',
};

const CATEGORY_ORDER = [
  'ui',
  'form',
  'form/date-controls',
  'form/color-controls',
  'form/pickers',
  'data',
  'feedback',
  'navigation',
  'overlays',
  'layouts',
];

function resolveSidebarCategory(page: ComponentPage): string {
  return page.category;
}


function discoverComponentMdxFiles(): ComponentPage[] {
  const pages: ComponentPage[] = [];

  for (const category of CATEGORY_ORDER) {
    const categoryDir = path.join(COMPONENT_ROOT, category);
    if (!fs.existsSync(categoryDir)) continue;

    const entries = fs.readdirSync(categoryDir, { withFileTypes: true });
    for (const entry of entries) {
      if (!entry.isDirectory()) continue;
      // Skip sub-categories (handled separately in CATEGORY_ORDER)
      if (
        category === 'form' &&
        (entry.name === 'pickers' || entry.name === 'date-controls' || entry.name === 'color-controls')
      ) {
        continue;
      }

      const componentDir = path.join(categoryDir, entry.name);
      const mdxFiles = fs
        .readdirSync(componentDir)
        .filter((f) => f.endsWith('.mdx'));

      for (const mdxFile of mdxFiles) {
        const mdxPath = path.join(componentDir, mdxFile);
        const componentName = mdxFile.replace(/\.mdx$/, '');
        // Route: /components/{category}/{ComponentName}
        // For the folder name use entry.name (may differ from file stem, e.g. color-swatch)
        const routePath = `/components/${category}/${componentName}`;

        pages.push({
          routePath,
          filepath: mdxPath,
          componentName,
          category,
          title: componentName,
        });
      }
    }
  }

  return pages;
}

export interface SidebarGroup {
  text: string;
  items: { text: string; link: string }[];
  collapsed?: boolean;
}

const COMPONENT_GUIDES: SidebarGroup = {
  text: 'Guides',
  collapsed: false,
  items: [
    { text: 'Installation', link: '/components/installation' },
    { text: 'Theming', link: '/components/theming' },
  ],
};

export function buildSidebar(pages: ComponentPage[]): SidebarGroup[] {
  const groups = new Map<string, { text: string; link: string }[]>();

  for (const category of CATEGORY_ORDER) {
    groups.set(category, []);
  }

  for (const page of pages) {
    const items = groups.get(resolveSidebarCategory(page));
    if (items) {
      items.push({
        text: page.componentName,
        link: page.routePath,
      });
    }
  }

  const sidebar: SidebarGroup[] = [COMPONENT_GUIDES];
  for (const category of CATEGORY_ORDER) {
    const items = groups.get(category);
    if (items && items.length > 0) {
      // Sort items alphabetically within each category
      items.sort((a, b) => a.text.localeCompare(b.text));
      sidebar.push({
        text: CATEGORY_LABELS[category] || category,
        items,
        collapsed: false,
      });
    }
  }

  return sidebar;
}

export function componentDocsPlugin(): RspressPlugin {
  const sidebar = buildSidebar(discoverComponentMdxFiles());

  return {
    name: 'component-docs',
    addPages() {
      // Phase 4+: all component pages are authored in documentation/docs/components/**.
      // Keep this plugin for sidebar generation only.
      return [];
    },
    config(config) {
      config.themeConfig = config.themeConfig || {};
      config.themeConfig.sidebar = {
        ...config.themeConfig.sidebar,
        '/components/': sidebar,
      };
      return config;
    },
  };
}
