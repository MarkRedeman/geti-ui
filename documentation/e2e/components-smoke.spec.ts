import { test, expect } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const coveragePath = path.resolve(__dirname, '../docs/components/_coverage.json');
const coverage = JSON.parse(fs.readFileSync(coveragePath, 'utf-8')) as {
  components: Array<{ route: string }>;
};

test.describe('component routes smoke', () => {
  for (const component of coverage.components) {
    test(`${component.route} renders`, async ({ page }) => {
      const consoleErrors: string[] = [];
      page.on('console', (msg) => {
        if (msg.type() === 'error') {
          const text = msg.text();
          if (!text.toLowerCase().includes('favicon')) {
            consoleErrors.push(text);
          }
        }
      });

      const response = await page.goto(component.route);
      expect(response?.status(), `HTTP status for ${component.route}`).toBe(200);

      await expect(page.locator('h1')).toBeVisible();

      expect(consoleErrors, `Console errors on ${component.route}`).toEqual([]);
    });
  }
});
