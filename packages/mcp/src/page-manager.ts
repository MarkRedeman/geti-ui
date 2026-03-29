import { extractNameAndDescription, parseSectionsFromMarkdown } from './parser.js';
import { readContent } from './content-reader.js';
import type { PageInfo } from './types.js';

/** Cached page index, keyed by page key (e.g. "components/ui/Button"). */
const pageCache = new Map<string, PageInfo>();

/** Whether the page index has been loaded. */
let indexLoaded = false;

/**
 * Build the page index from `llms.txt`.
 *
 * Parses each `- [Name](path.md): Description` entry and caches a PageInfo stub.
 * Idempotent - returns cached results on subsequent calls.
 */
export async function buildPageIndex(): Promise<PageInfo[]> {
    if (indexLoaded) {
        return Array.from(pageCache.values());
    }

    const txt = await readContent('llms.txt');
    const re = /^\s*-\s*\[([^\]]+)\]\(([^)]+)\)(?:\s*:\s*(.*))?\s*$/;

    for (const line of txt.split(/\r?\n/)) {
        const m = line.match(re);
        if (!m) continue;

        const display = (m[1] || '').trim();
        const href = (m[2] || '').trim();
        const description = (m[3] || '').trim() || undefined;

        if (!href || !/\.md$/i.test(href)) continue;

        const key = href.replace(/\.md$/i, '').replace(/\\/g, '/').replace(/^\//, '');
        const name = display || key.split('/').pop() || key;
        const filePath = href.replace(/^\//, '');

        const info: PageInfo = { key, name, description, filePath, sections: [] };
        pageCache.set(info.key, info);
    }

    indexLoaded = true;
    return Array.from(pageCache.values());
}

/**
 * Resolve a user-provided page name to a cached PageInfo.
 *
 * Resolution order:
 * 1. Exact match on key (e.g. "components/ui/Button")
 * 2. Path suffix match (e.g. "ui/Button" matches "components/ui/Button")
 * 3. Name-only match (e.g. "Button" matches page with name "Button")
 * 4. Case-insensitive name match
 *
 * Throws if no match is found.
 */
export async function resolvePageRef(pageName: string): Promise<PageInfo> {
    await buildPageIndex();

    // 1. Exact key match
    const exact = pageCache.get(pageName);
    if (exact) return exact;

    // Normalize input
    const normalized = pageName.replace(/\\/g, '/').replace(/\.md$/i, '');

    // 2. Exact key match on normalized
    const normalizedExact = pageCache.get(normalized);
    if (normalizedExact) return normalizedExact;

    // 3. Path suffix match - find a key that ends with the input
    for (const [key, info] of pageCache) {
        if (key.endsWith(`/${normalized}`)) {
            return info;
        }
    }

    // 4. Name match (display name)
    for (const info of pageCache.values()) {
        if (info.name === pageName) {
            return info;
        }
    }

    // 5. Case-insensitive name match
    const lower = pageName.toLowerCase();
    for (const info of pageCache.values()) {
        if (info.name.toLowerCase() === lower) {
            return info;
        }
    }

    // 6. Case-insensitive key suffix match
    for (const [key, info] of pageCache) {
        if (key.toLowerCase().endsWith(`/${lower}`)) {
            return info;
        }
    }

    throw new Error(`Page "${pageName}" not found. Use list_geti_ui_pages to see available pages.`);
}

/**
 * Lazily load and parse a page's content to populate `sections` and `description`.
 */
export async function ensureParsedPage(info: PageInfo): Promise<PageInfo> {
    if (info.sections.length > 0 && info.description !== undefined) {
        return info;
    }

    const text = await readContent(info.filePath);
    const lines = text.split(/\r?\n/);
    const { name, description } = extractNameAndDescription(lines);
    const sections = parseSectionsFromMarkdown(lines);

    const updated: PageInfo = {
        ...info,
        name: name || info.name,
        description,
        sections,
    };

    pageCache.set(updated.key, updated);
    return updated;
}

/**
 * Read the full text content of a page.
 */
export async function readPageContent(info: PageInfo): Promise<string> {
    return readContent(info.filePath);
}
