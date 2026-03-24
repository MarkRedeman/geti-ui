import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { buildPageIndex, ensureParsedPage, readPageContent, resolvePageRef } from './page-manager.js';
import { parseSectionsFromMarkdown } from './parser.js';
import { searchDocs } from './search.js';
import { listComponents, getComponentProps } from './component-tools.js';
import { listCharts } from './chart-tools.js';
import { listBlocks } from './blocks-tools.js';
import { errorToString } from './utils.js';

/**
 * Create and start the Geti UI MCP server.
 *
 * Registers 8 tools:
 * - list_geti_ui_pages
 * - get_geti_ui_page_info
 * - get_geti_ui_page
 * - search_geti_ui_docs
 * - list_geti_ui_components
 * - get_geti_ui_component_props
 * - list_geti_ui_charts
 * - list_geti_ui_blocks
 */
export async function startServer(version: string): Promise<void> {
    const server = new McpServer({
        name: 'geti-ui-docs-server',
        version,
    });

    // Build the page index at startup
    try {
        await buildPageIndex();
    } catch (e) {
        console.warn(`Warning: failed to load docs index (${errorToString(e)}).`);
    }

    // --- Core documentation tools ---

    server.registerTool(
        'list_geti_ui_pages',
        {
            title: 'List Geti UI documentation pages',
            description:
                'Returns a list of all available documentation pages (components, charts, smart-tools, assets, examples).',
            inputSchema: {
                includeDescription: z.boolean().optional().describe('Include a one-line description for each page'),
            },
        },
        async ({ includeDescription }) => {
            const pages = await buildPageIndex();
            const items = pages
                .sort((a, b) => a.key.localeCompare(b.key))
                .map((p) =>
                    includeDescription
                        ? { name: p.name, path: p.key, description: p.description ?? '' }
                        : { name: p.name, path: p.key }
                );
            return {
                content: [{ type: 'text' as const, text: JSON.stringify(items, null, 2) }],
            };
        }
    );

    server.registerTool(
        'get_geti_ui_page_info',
        {
            title: 'Get page info',
            description: 'Returns page name, description, and list of ## section titles for a given page.',
            inputSchema: {
                page_name: z.string().describe('Page name or path (e.g. "Button", "components/ui/Button")'),
            },
        },
        async ({ page_name }) => {
            const ref = await resolvePageRef(page_name);
            const info = await ensureParsedPage(ref);
            const out = {
                name: info.name,
                description: info.description ?? '',
                sections: info.sections.map((s) => s.name),
            };
            return {
                content: [{ type: 'text' as const, text: JSON.stringify(out, null, 2) }],
            };
        }
    );

    server.registerTool(
        'get_geti_ui_page',
        {
            title: 'Get page markdown content',
            description:
                'Returns the full markdown content for a page, or a specific ## section if section_name is provided.',
            inputSchema: {
                page_name: z.string().describe('Page name or path (e.g. "Button", "components/ui/Button")'),
                section_name: z.string().optional().describe('Optional: specific ## section to return'),
            },
        },
        async ({ page_name, section_name }) => {
            const ref = await resolvePageRef(page_name);
            const text = await readPageContent(ref);

            if (!section_name) {
                return { content: [{ type: 'text' as const, text }] };
            }

            const lines = text.split(/\r?\n/);
            const sections = parseSectionsFromMarkdown(lines);

            // Try exact match, then case-insensitive match
            let section = sections.find((s) => s.name === section_name);
            if (!section) {
                section = sections.find((s) => s.name.toLowerCase() === section_name.toLowerCase());
            }
            if (!section) {
                const available = sections.map((s) => s.name).join(', ');
                throw new Error(`Section "${section_name}" not found in ${ref.key}. Available: ${available}`);
            }

            const snippet = lines.slice(section.startLine, section.endLine).join('\n');
            return { content: [{ type: 'text' as const, text: snippet }] };
        }
    );

    // --- Search tool ---

    server.registerTool(
        'search_geti_ui_docs',
        {
            title: 'Search Geti UI documentation',
            description:
                'Case-insensitive text search across all documentation pages. Returns matching pages with line numbers and snippets.',
            inputSchema: {
                query: z.string().describe('Search text'),
                limit: z.number().optional().describe('Maximum number of pages to return (default: 10)'),
            },
        },
        async ({ query, limit }) => {
            const results = await searchDocs(query, limit);
            return {
                content: [{ type: 'text' as const, text: JSON.stringify(results, null, 2) }],
            };
        }
    );

    // --- Component-specific tools ---

    server.registerTool(
        'list_geti_ui_components',
        {
            title: 'List Geti UI components',
            description:
                'Lists all UI components with name, category, and description. Optionally filter by category (e.g. "ui", "form", "data", "feedback", "layouts", "navigation", "overlays").',
            inputSchema: {
                category: z
                    .string()
                    .optional()
                    .describe('Filter by category (e.g. "ui", "form", "form/date-controls")'),
            },
        },
        async ({ category }) => {
            const components = await listComponents(category);
            return {
                content: [{ type: 'text' as const, text: JSON.stringify(components, null, 2) }],
            };
        }
    );

    server.registerTool(
        'get_geti_ui_component_props',
        {
            title: 'Get component props',
            description:
                'Extracts structured prop information from a component page. Returns props grouped by category (Content, Value, Events, Accessibility, Validation) with descriptions.',
            inputSchema: {
                component_name: z.string().describe('Component name (e.g. "Button", "TextField")'),
            },
        },
        async ({ component_name }) => {
            const props = await getComponentProps(component_name, resolvePageRef);
            return {
                content: [{ type: 'text' as const, text: JSON.stringify(props, null, 2) }],
            };
        }
    );

    // --- Chart-specific tool ---

    server.registerTool(
        'list_geti_ui_charts',
        {
            title: 'List Geti UI charts',
            description: 'Lists all chart components with name, type (composition or primitive), and description.',
            inputSchema: {
                type: z.enum(['composition', 'primitive']).optional().describe('Filter by chart type'),
            },
        },
        async ({ type }) => {
            const charts = await listCharts(type);
            return {
                content: [{ type: 'text' as const, text: JSON.stringify(charts, null, 2) }],
            };
        }
    );

    // --- Blocks-specific tool ---

    server.registerTool(
        'list_geti_ui_blocks',
        {
            title: 'List Geti UI blocks',
            description:
                'Lists all block documentation pages with name, category, and description. Optionally filter by category (e.g. "media", "tabs", "annotation", "models", "projects").',
            inputSchema: {
                category: z
                    .string()
                    .optional()
                    .describe('Filter by category (e.g. "media", "tabs", "annotation")'),
            },
        },
        async ({ category }) => {
            const blocks = await listBlocks(category);
            return {
                content: [{ type: 'text' as const, text: JSON.stringify(blocks, null, 2) }],
            };
        }
    );

    // --- Connect transport ---

    const transport = new StdioServerTransport();
    await server.connect(transport);
}
