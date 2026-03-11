/**
 * Core type definitions for the Geti UI MCP server.
 */

/** A `## ` section within a markdown page. */
export type SectionInfo = {
    name: string;
    startLine: number; // 0-based, inclusive
    endLine: number; // 0-based, exclusive
};

/** A documentation page discovered from llms.txt or resolved by name. */
export type PageInfo = {
    /** Unique key derived from relative path, e.g. "components/ui/Button" */
    key: string;
    /** Display name from llms.txt or the `# ` heading */
    name: string;
    /** First paragraph after the name heading */
    description?: string;
    /** Relative path to the .md file, e.g. "components/ui/Button.md" */
    filePath: string;
    /** Parsed `## ` sections (populated lazily) */
    sections: SectionInfo[];
};

/** Describes where documentation content is read from. */
export type ContentSource = { type: 'bundled' } | { type: 'local'; dir: string } | { type: 'remote'; baseUrl: string };

/** A single prop extracted from component documentation. */
export type PropInfo = {
    name: string;
    description: string;
    type?: string;
    defaultValue?: string;
};

/** A search match within a page. */
export type SearchMatch = {
    lineNumber: number;
    lineContent: string;
};

/** Result from a full-text search across documentation. */
export type SearchResult = {
    pageName: string;
    pagePath: string;
    matches: SearchMatch[];
};
