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
    blocksSidebar?: Array<{
        link?: string;
        items?: Array<{ link?: string }>;
    }>;
    chartsSidebar?: Array<{
        link?: string;
        items?: Array<{ link?: string }>;
    }>;
    smartToolsSidebar?: Array<{
        link?: string;
        items?: Array<{ link?: string }>;
    }>;
};

function collectLinks(
    items: Array<{ link?: string; items?: Array<{ link?: string }> }>,
    allowedPrefixes: string[]
): string[] {
    const links: string[] = [];

    for (const item of items) {
        if (item.link && allowedPrefixes.some((prefix) => item.link?.startsWith(prefix))) {
            links.push(item.link);
        }

        if (item.items) {
            links.push(...collectLinks(item.items, allowedPrefixes));
        }
    }

    return links;
}

const docsRoutes = [
    ...new Set([
        ...collectLinks(sidebars.componentsSidebar, ['/components/']),
        ...collectLinks(sidebars.blocksSidebar ?? [], ['/blocks/']),
        ...collectLinks(sidebars.chartsSidebar ?? [], ['/charts/']),
        ...collectLinks(sidebars.smartToolsSidebar ?? [], ['/smart-tools/']),
    ]),
].sort();

test.describe('documentation routes smoke', () => {
    for (const route of docsRoutes) {
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

            await expect.soft(page.locator('h1').first()).toBeVisible();

            expect(consoleErrors, `Console errors on ${route}`).toEqual([]);
        });
    }
});
