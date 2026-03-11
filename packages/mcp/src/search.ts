import { buildPageIndex, readPageContent } from './page-manager.js';
import type { SearchMatch, SearchResult } from './types.js';

/** Cached page content for search, keyed by page key. */
let contentCache: Map<string, { name: string; path: string; lines: string[] }> | undefined;

/**
 * Load all page content into the search cache.
 * Called once on first search invocation.
 */
async function ensureContentLoaded(): Promise<
  Map<string, { name: string; path: string; lines: string[] }>
> {
  if (contentCache) return contentCache;

  contentCache = new Map();
  const pages = await buildPageIndex();

  // Load all pages in parallel
  const results = await Promise.allSettled(
    pages.map(async (page) => {
      const text = await readPageContent(page);
      return { key: page.key, name: page.name, path: page.filePath, lines: text.split(/\r?\n/) };
    }),
  );

  for (const result of results) {
    if (result.status === 'fulfilled') {
      contentCache.set(result.value.key, {
        name: result.value.name,
        path: result.value.path,
        lines: result.value.lines,
      });
    }
  }

  return contentCache;
}

/**
 * Perform a case-insensitive full-text search across all documentation pages.
 *
 * Returns pages with matching lines, ranked by number of matches (descending).
 * Each match includes the line number and the line content.
 *
 * @param query — Search string (case-insensitive substring match)
 * @param limit — Maximum number of pages to return (default: 10)
 */
export async function searchDocs(
  query: string,
  limit = 10,
): Promise<SearchResult[]> {
  if (!query.trim()) return [];

  const cache = await ensureContentLoaded();
  const needle = query.toLowerCase();
  const results: SearchResult[] = [];

  for (const [, page] of cache) {
    const matches: SearchMatch[] = [];

    for (let i = 0; i < page.lines.length; i++) {
      if (page.lines[i].toLowerCase().includes(needle)) {
        matches.push({
          lineNumber: i + 1,
          lineContent: page.lines[i].slice(0, 200), // Truncate long lines
        });
      }
    }

    if (matches.length > 0) {
      results.push({
        pageName: page.name,
        pagePath: page.path,
        matches: matches.slice(0, 5), // Cap matches per page to keep output manageable
      });
    }
  }

  // Sort by number of matches descending
  results.sort((a, b) => b.matches.length - a.matches.length);

  return results.slice(0, limit);
}
