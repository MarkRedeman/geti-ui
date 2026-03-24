import { buildPageIndex } from './page-manager.js';

/**
 * List all block docs pages, optionally filtered by category.
 *
 * Blocks are pages under `blocks/` in the page index.
 * Categories are derived from the path structure (e.g. "media", "tabs", "annotation").
 */
export async function listBlocks(
    category?: string
): Promise<Array<{ name: string; category: string; description: string }>> {
    const pages = await buildPageIndex();

    const blockPages = pages.filter((p) => p.key.startsWith('blocks/'));

    const results: Array<{ name: string; category: string; description: string }> = [];

    for (const page of blockPages) {
        // Extract category from path: blocks/{category}/Name → category
        const parts = page.key.split('/');
        // Category is everything between "blocks/" and the last segment
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
