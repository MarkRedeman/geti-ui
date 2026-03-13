import { test, expect } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const sidebarsPath = path.resolve(__dirname, '../sidebars.json');
const sidebars = JSON.parse(fs.readFileSync(sidebarsPath, 'utf-8')) as {
  componentsSidebar: Array<{
    link?: string;
    items?: Array<{ link?: string }>;
  }>;
};

function collectLinks(items: Array<{ link?: string; items?: Array<{ link?: string }> }>): string[] {
  const links: string[] = [];

  for (const item of items) {
    if (item.link && item.link.startsWith('/components/')) {
      links.push(item.link);
    }

    if (item.items) {
      links.push(...collectLinks(item.items));
    }
  }

  return links;
}

const componentRoutes = [...new Set(collectLinks(sidebars.componentsSidebar))].sort();

test.describe('component routes smoke', () => {
  for (const route of componentRoutes) {
    test(`${route} renders`, async ({ page }) => {
      const consoleErrors: string[] = [];
      page.on('console', (msg) => {
        if (msg.type() === 'error') {
          const text = msg.text();
          if (!text.toLowerCase().includes('favicon')) {
            consoleErrors.push(text);
          }
        }
      });

      const response = await page.goto(route);
      expect(response?.status(), `HTTP status for ${route}`).toBe(200);

      await expect(page.locator('h1')).toBeVisible();

      expect(consoleErrors, `Console errors on ${route}`).toEqual([]);
    });
  }
});
