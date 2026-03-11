import { buildPageIndex, ensureParsedPage, readPageContent } from './page-manager.js';
import { extractComponentProps } from './parser.js';
import type { PageInfo, PropInfo } from './types.js';

/**
 * List all UI components, optionally filtered by category.
 *
 * Components are pages under `components/` in the page index.
 * Categories are derived from the path structure (e.g. "ui", "form", "data").
 */
export async function listComponents(
  category?: string,
): Promise<Array<{ name: string; category: string; description: string }>> {
  const pages = await buildPageIndex();

  const componentPages = pages.filter((p) => p.key.startsWith('components/'));

  const results: Array<{ name: string; category: string; description: string }> = [];

  for (const page of componentPages) {
    // Extract category from path: components/{category}/Name → category
    const parts = page.key.split('/');
    // Category is everything between "components/" and the last segment
    const cat = parts.slice(1, -1).join('/');

    if (category && cat !== category && !cat.startsWith(`${category}/`)) {
      continue;
    }

    results.push({
      name: page.name,
      category: cat,
      description: page.description || '',
    });
  }

  return results.sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Extract structured prop information from a component documentation page.
 *
 * Returns props grouped by category (Content, Value, Events, Accessibility, etc.)
 * as parsed from the `## Props (deep dive)` section.
 */
export async function getComponentProps(
  componentName: string,
  resolvePageRef: (name: string) => Promise<PageInfo>,
): Promise<Record<string, PropInfo[]>> {
  const ref = await resolvePageRef(componentName);
  const text = await readPageContent(ref);
  const lines = text.split(/\r?\n/);
  const props = extractComponentProps(lines);

  // If no bullet-style props found, the page may not have a "Props (deep dive)" section
  const hasProps = Object.values(props).some((arr) => arr.length > 0);
  if (!hasProps) {
    // Try to get at least a description
    const parsed = await ensureParsedPage(ref);
    return {
      _info: [
        {
          name: parsed.name,
          description:
            parsed.description ||
            'No structured props found. Use get_geti_ui_page with section_name "Props" to get raw content.',
        },
      ],
    };
  }

  return props;
}
