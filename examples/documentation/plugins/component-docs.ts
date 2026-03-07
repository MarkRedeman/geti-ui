import { RspressPlugin } from '@rspress/core';
import path from 'node:path';
import fs from 'node:fs';

interface ComponentPage {
  routePath: string;
  filepath: string;
  componentName: string;
  category: string;
}

const COMPONENT_ROOT = path.resolve(
  __dirname,
  '../../../packages/ui/src/components'
);

const CATEGORY_LABELS: Record<string, string> = {
  ui: 'Primitive Actions',
  form: 'Form Controls',
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
  'form/pickers',
  'data',
  'feedback',
  'navigation',
  'overlays',
  'layouts',
];

function discoverComponentReadmes(): ComponentPage[] {
  const pages: ComponentPage[] = [];

  for (const category of CATEGORY_ORDER) {
    const categoryDir = path.join(COMPONENT_ROOT, category);
    if (!fs.existsSync(categoryDir)) continue;

    const entries = fs.readdirSync(categoryDir, { withFileTypes: true });
    for (const entry of entries) {
      if (!entry.isDirectory()) continue;
      // Skip sub-categories (handled separately in CATEGORY_ORDER)
      if (category === 'form' && entry.name === 'pickers') continue;

      const readmePath = path.join(categoryDir, entry.name, 'readme.md');
      if (fs.existsSync(readmePath)) {
        pages.push({
          routePath: `/components/${category}/${entry.name}`,
          filepath: readmePath,
          componentName: entry.name,
          category,
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

export function buildSidebar(pages: ComponentPage[]): SidebarGroup[] {
  const groups = new Map<string, { text: string; link: string }[]>();

  for (const category of CATEGORY_ORDER) {
    groups.set(category, []);
  }

  for (const page of pages) {
    const items = groups.get(page.category);
    if (items) {
      items.push({
        text: page.componentName,
        link: page.routePath,
      });
    }
  }

  const sidebar: SidebarGroup[] = [];
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
  const pages = discoverComponentReadmes();
  const sidebar = buildSidebar(pages);

  return {
    name: 'component-docs',
    addPages() {
      return pages.map((page) => ({
        routePath: page.routePath,
        filepath: page.filepath,
      }));
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
