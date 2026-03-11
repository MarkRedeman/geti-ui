import type { PropInfo, SectionInfo } from './types.js';

/**
 * Extract all `## ` headings as section boundaries from markdown lines.
 * Ignores headings inside fenced code blocks.
 */
export function parseSectionsFromMarkdown(lines: string[]): SectionInfo[] {
    const sections: SectionInfo[] = [];
    let inCode = false;

    for (let idx = 0; idx < lines.length; idx++) {
        const line = lines[idx];
        if (/^```/.test(line.trim())) {
            inCode = !inCode;
        }
        if (inCode) continue;
        if (line.startsWith('## ')) {
            const name = line.replace(/^##\s+/, '').trim();
            sections.push({ name, startLine: idx, endLine: lines.length });
        }
    }

    // Set each section's endLine to the next section's startLine
    for (let s = 0; s < sections.length - 1; s++) {
        sections[s].endLine = sections[s + 1].startLine;
    }

    return sections;
}

/**
 * Extract the page name (first `# ` heading) and description (first paragraph
 * after the name) from markdown lines.
 */
export function extractNameAndDescription(lines: string[]): { name: string; description?: string } {
    let name = '';
    let i = 0;

    // Find the first `# ` heading
    for (; i < lines.length; i++) {
        const line = lines[i];
        if (line.startsWith('# ')) {
            name = line.replace(/^#\s+/, '').trim();
            i++;
            break;
        }
    }

    // Collect the first non-empty paragraph after the heading
    const descLines: string[] = [];
    let inCode = false;

    for (; i < lines.length; i++) {
        const line = lines[i];
        if (/^```/.test(line.trim())) {
            inCode = !inCode;
            continue;
        }
        if (inCode) continue;

        if (line.trim() === '') {
            if (descLines.length > 0) break;
            continue;
        }

        // Skip sub-headings and HTML tags
        if (/^#{1,6}\s/.test(line) || /^</.test(line.trim())) continue;

        descLines.push(line);
    }

    const description = descLines.length > 0 ? descLines.join('\n').trim() : undefined;
    return { name, description };
}

/**
 * Extract component props from the `## Props (deep dive)` section.
 *
 * Component docs use bullet lists under `### Category` sub-headings:
 *   * `propName`: description text.
 *
 * Returns props grouped by category name.
 */
export function extractComponentProps(lines: string[]): Record<string, PropInfo[]> {
    const result: Record<string, PropInfo[]> = {};

    // Find the "Props" section
    let inPropsSection = false;
    let currentCategory = '';
    let inCode = false;

    for (const line of lines) {
        if (/^```/.test(line.trim())) {
            inCode = !inCode;
        }
        if (inCode) continue;

        // Detect start of props section
        if (/^## Props/.test(line)) {
            inPropsSection = true;
            continue;
        }

        // Detect end of props section (next ## heading)
        if (inPropsSection && /^## /.test(line) && !/^## Props/.test(line)) {
            break;
        }

        if (!inPropsSection) continue;

        // Detect category sub-heading
        if (line.startsWith('### ')) {
            currentCategory = line.replace(/^###\s+/, '').trim();
            if (!result[currentCategory]) {
                result[currentCategory] = [];
            }
            continue;
        }

        // Parse prop bullet: * `propName`: description
        const propMatch = line.match(/^\s*\*\s+`([^`]+)`\s*:\s*(.+)/);
        if (propMatch && currentCategory) {
            result[currentCategory].push({
                name: propMatch[1],
                description: propMatch[2].trim(),
            });
        }
    }

    return result;
}

/**
 * Extract props from a formal markdown table with columns:
 *   Prop | Type | Default | Description
 *
 * Used by chart documentation pages.
 */
export function extractPropsTable(lines: string[]): PropInfo[] {
    const props: PropInfo[] = [];
    let inTable = false;
    let headerParsed = false;

    for (const line of lines) {
        const trimmed = line.trim();

        // Detect table start: a line with pipes that contains "Prop"
        if (!inTable && /\|/.test(trimmed) && /Prop/i.test(trimmed)) {
            inTable = true;
            continue;
        }

        if (!inTable) continue;

        // Skip the separator row (| --- | --- | ...)
        if (/^\|[\s-:|]+\|$/.test(trimmed)) {
            headerParsed = true;
            continue;
        }

        // Stop at non-table content
        if (!trimmed.startsWith('|')) {
            break;
        }

        if (!headerParsed) continue;

        // Parse table row
        const cells = trimmed
            .split('|')
            .map((c) => c.trim())
            .filter(Boolean);

        if (cells.length >= 2) {
            const name = cells[0].replace(/`/g, '').trim();
            const type = cells.length >= 2 ? cells[1].replace(/`/g, '').trim() : undefined;
            const defaultValue =
                cells.length >= 3 ? cells[2].replace(/`/g, '').replace(/-/g, '').trim() || undefined : undefined;
            const description = cells.length >= 4 ? cells[3].trim() : '';

            if (name) {
                props.push({ name, description, type, defaultValue });
            }
        }
    }

    return props;
}
