import { buildPageIndex } from './page-manager.js';

/**
 * List all chart components, optionally filtered by type (composition or primitive).
 *
 * Charts are pages under `charts/` in the page index.
 */
export async function listCharts(
  type?: 'composition' | 'primitive',
): Promise<Array<{ name: string; type: string; description: string }>> {
  const pages = await buildPageIndex();

  const chartPages = pages.filter((p) => p.key.startsWith('charts/'));

  const results: Array<{ name: string; type: string; description: string }> = [];

  for (const page of chartPages) {
    // Derive type from path: charts/compositions/Foo → "composition", charts/primitives/Bar → "primitive"
    const parts = page.key.split('/');
    let chartType = 'unknown';
    if (parts.length >= 2) {
      const segment = parts[1];
      if (segment === 'compositions') {
        chartType = 'composition';
      } else if (segment === 'primitives') {
        chartType = 'primitive';
      } else {
        chartType = segment;
      }
    }

    if (type && chartType !== type) continue;

    results.push({
      name: page.name,
      type: chartType,
      description: page.description || '',
    });
  }

  return results.sort((a, b) => a.name.localeCompare(b.name));
}
