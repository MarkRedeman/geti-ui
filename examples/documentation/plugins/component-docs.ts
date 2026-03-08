import { RspressPlugin } from '@rspress/core';
import path from 'node:path';
import fs from 'node:fs';

interface ComponentPage {
  routePath: string;
  filepath: string;
  componentName: string;
  category: string;
  title: string;
  storiesPath?: string;  // absolute path to .stories.tsx file, or undefined
  componentPath?: string; // absolute path to component .tsx file
}

const COMPONENT_ROOT = path.resolve(
  __dirname,
  '../../../packages/ui/src/components'
);

const STORIES_GALLERY_PATH = path.resolve(__dirname, '../theme/StoriesGallery');

const CATEGORY_LABELS: Record<string, string> = {
  ui: 'Primitive Actions',
  form: 'Form Controls',
  'form/pickers': 'Pickers',
  data: 'Data Display',
  feedback: 'Status & Feedback',
  layouts: 'Layout & Structure',
  navigation: 'Navigation',
  overlays: 'Overlays',
};

const CATEGORY_ORDER = [
  'ui',
  'form',
  'form/pickers',
  'data',
  'feedback',
  'navigation',
  'overlays',
  'layouts',
];

/**
 * Derive a display title from an MDX file.
 * Priority: first `# Heading` → `<Title>text</Title>` → filename stem.
 */
function extractTitle(content: string, fallback: string): string {
  // Match first # heading
  const headingMatch = content.match(/^#\s+(.+)$/m);
  if (headingMatch) return headingMatch[1].trim();

  // Match <Title>text</Title>
  const titleTagMatch = content.match(/<Title>\s*([^<]+?)\s*<\/Title>/);
  if (titleTagMatch) return titleTagMatch[1].trim();

  return fallback;
}

/**
 * Escape unescaped `{` and `}` characters that appear outside of code blocks
 * (fenced ``` blocks and inline `backtick` spans) to prevent Rspress's MDX
 * parser from treating them as JSX/JS expressions.
 *
 * This handles cases like TypeScript template literal types in prose text, e.g.:
 *   `CSSProperties & Record<\`--${string}\`, string>`
 * where escaped backticks inside an inline code span cause the span to end
 * prematurely, leaving `{string}` in text context.
 */
function escapeCurlyBracesOutsideCode(content: string): string {
  const lines = content.split('\n');
  let inFencedBlock = false;
  const result: string[] = [];

  for (const line of lines) {
    // Toggle fenced code block state
    if (/^```/.test(line)) {
      inFencedBlock = !inFencedBlock;
      result.push(line);
      continue;
    }

    if (inFencedBlock) {
      result.push(line);
      continue;
    }

    // In regular text lines, escape { and } that are outside inline code spans
    // Strategy: split on inline code spans, escape in text segments only
    const escaped = escapeInTextSegments(line);
    result.push(escaped);
  }

  return result.join('\n');
}

/**
 * Given a single line of Markdown text (not inside a fenced code block),
 * escape `{` and `}` in the text portions while leaving backtick-delimited
 * inline code spans untouched.
 */
function escapeInTextSegments(line: string): string {
  // Split on inline code spans: `...`
  // We use a simple state machine to handle backtick spans
  let result = '';
  let i = 0;

  while (i < line.length) {
    if (line[i] === '`') {
      // Consume inline code span
      result += line[i];
      i++;
      while (i < line.length && line[i] !== '`') {
        result += line[i];
        i++;
      }
      if (i < line.length) {
        result += line[i]; // closing backtick
        i++;
      }
    } else if (line[i] === '{') {
      result += '\\{';
      i++;
    } else if (line[i] === '}') {
      result += '\\}';
      i++;
    } else {
      result += line[i];
      i++;
    }
  }

  return result;
}

/**
 * Transform Storybook-flavoured MDX into plain Rspress-compatible MDX.
 *
 * Removes:
 *   - `import { Meta, ... } from '@storybook/addon-docs/blocks'`
 *   - `import * as DocStories from '...'`
 *   - Self-closing Storybook JSX tags: <Meta .../>, <Stories/>, <Primary/>,
 *     <Controls/>, <Description/>, <Source/>
 *   - Paired Storybook tags with no useful text content: <Title/>, <Title>...</Title>
 *
 * Converts:
 *   - `<Subtitle>text</Subtitle>` → `> text` (blockquote)
 *   - Multi-line `<Subtitle>…</Subtitle>` → collapsed into a single blockquote line
 */
function transformContent(raw: string, componentName: string): string {
  let content = raw;

  // Remove storybook import lines
  content = content.replace(
    /^import\s+\{[^}]*\}\s+from\s+['"]@storybook\/addon-docs\/blocks['"].*\n?/gm,
    ''
  );
  content = content.replace(
    /^import\s+\*\s+as\s+\w+\s+from\s+['"][^'"]+\.stories['"].*\n?/gm,
    ''
  );

  // Remove self-closing Storybook JSX tags (possibly with props/whitespace)
  // Handles: <Meta of={DocStories} />, <Stories />, <Primary />, <Controls of={...} />, etc.
  content = content.replace(
    /<(Meta|Stories|Primary|Controls|Description|Source)(\s[^>]*)?\s*\/>/g,
    ''
  );

  // Remove paired <Title>...</Title> (Storybook re-renders the story title — not useful)
  // Also handles self-closing <Title />
  content = content.replace(/<Title\s*\/>/g, '');
  content = content.replace(/<Title>[\s\S]*?<\/Title>/g, '');

  // Convert <Subtitle>text</Subtitle> to a blockquote paragraph
  // Handle both single-line and multi-line variants
  content = content.replace(/<Subtitle>([\s\S]*?)<\/Subtitle>/g, (_match, inner) => {
    const text = inner.replace(/\s+/g, ' ').trim();
    return `> ${text}`;
  });

  // Convert Storybook-internal links to plain text (these would be dead links in Rspress)
  // Matches: [label](?path=/docs/...) and [label](/docs/...) patterns
  content = content.replace(
    /\[([^\]]+)\]\((?:\?path=)?\/docs\/[^)]+\)/g,
    '$1'
  );

  // Escape unescaped { } characters that appear outside code blocks to prevent
  // MDX from treating them as JSX expressions (e.g. ${string} in inline text)
  content = escapeCurlyBracesOutsideCode(content);

  // Add frontmatter with the title
  const title = extractTitle(content, componentName);
  const frontmatter = `---\ntitle: ${title}\n---\n\n`;

  // Remove any leading blank lines before adding frontmatter
  content = content.replace(/^\s+/, '');

  return frontmatter + content;
}

/**
 * Find the stories file for a specific component.
 *
 * We intentionally require an exact filename match (`{Component}.stories.tsx`).
 * This avoids attaching a sibling component's stories when multiple components
 * live in the same directory (e.g. Avatar + AvatarGroup), which can cause
 * runtime crashes due to args/component mismatch.
 */
function findStoriesFile(componentDir: string, componentName: string): string | null {
  const exactStoriesFile = path.join(componentDir, `${componentName}.stories.tsx`);
  return fs.existsSync(exactStoriesFile) ? exactStoriesFile : null;
}

/**
 * Find the component .tsx file inside a component directory.
 * Returns the absolute path if found, or null if not.
 * Looks for {ComponentName}.tsx (matching the componentName from the MDX filename).
 */
function findComponentFile(componentDir: string, componentName: string): string | null {
  const componentFile = path.join(componentDir, `${componentName}.tsx`);
  return fs.existsSync(componentFile) ? componentFile : null;
}

/**
 * Escape backticks and `${` sequences so the string can be safely embedded
 * inside a JS/MDX template literal (backtick string).
 */
function escapeTemplateLiteral(s: string): string {
  return s.replace(/`/g, '\\`').replace(/\$\{/g, '\\${');
}

function getPackageComponentImportName(componentName: string): string | null {
  // Toast docs are backed by ToastContainer in @geti/ui
  if (componentName === 'Toast') return 'ToastContainer';
  return componentName;
}

function discoverComponentMdxFiles(): ComponentPage[] {
  const pages: ComponentPage[] = [];

  for (const category of CATEGORY_ORDER) {
    const categoryDir = path.join(COMPONENT_ROOT, category);
    if (!fs.existsSync(categoryDir)) continue;

    const entries = fs.readdirSync(categoryDir, { withFileTypes: true });
    for (const entry of entries) {
      if (!entry.isDirectory()) continue;
      // Skip sub-categories (handled separately in CATEGORY_ORDER)
      if (category === 'form' && entry.name === 'pickers') continue;

      const componentDir = path.join(categoryDir, entry.name);
      const mdxFiles = fs
        .readdirSync(componentDir)
        .filter((f) => f.endsWith('.mdx'));

      for (const mdxFile of mdxFiles) {
        const mdxPath = path.join(componentDir, mdxFile);
        const componentName = mdxFile.replace(/\.mdx$/, '');
        // Route: /components/{category}/{ComponentName}
        // For the folder name use entry.name (may differ from file stem, e.g. color-swatch)
        const routePath = `/components/${category}/${componentName}`;

        pages.push({
          routePath,
          filepath: mdxPath,
          componentName,
          category,
          title: componentName,
          storiesPath: findStoriesFile(componentDir, componentName) ?? undefined,
          componentPath: findComponentFile(componentDir, componentName) ?? undefined,
        });
      }
    }
  }

  return pages;
}

export interface SidebarGroup {
  text: string;
  items: { text: string; link: string }[];
  collapsed?: boolean;
}

export function buildSidebar(pages: ComponentPage[]): SidebarGroup[] {
  const groups = new Map<string, { text: string; link: string }[]>();

  for (const category of CATEGORY_ORDER) {
    groups.set(category, []);
  }

  for (const page of pages) {
    const items = groups.get(page.category);
    if (items) {
      items.push({
        text: page.componentName,
        link: page.routePath,
      });
    }
  }

  const sidebar: SidebarGroup[] = [];
  for (const category of CATEGORY_ORDER) {
    const items = groups.get(category);
    if (items && items.length > 0) {
      // Sort items alphabetically within each category
      items.sort((a, b) => a.text.localeCompare(b.text));
      sidebar.push({
        text: CATEGORY_LABELS[category] || category,
        items,
        collapsed: false,
      });
    }
  }

  return sidebar;
}

/**
 * Insert stories imports and JSX into the MDX content so that the examples
 * appear right after the intro section (title, subtitle blockquote, import
 * code block, and any bullet-point links) but before the first `## ` heading
 * (typically "## Responsibility").
 *
 * MDX imports are placed immediately after the frontmatter block so they are
 * at the top-level scope. The JSX block is placed just before the first `##`.
 *
 * If no `## ` heading is found, the JSX is appended at the end.
 */
function insertStoriesAfterIntro(
  content: string,
  storiesImports: string,
  storiesJsx: string
): string {
  // 1. Insert imports right after frontmatter (--- ... ---)
  //    Frontmatter ends at the second `---` line.
  const frontmatterEnd = content.indexOf('\n---\n');
  if (frontmatterEnd !== -1) {
    const insertPos = frontmatterEnd + '\n---\n'.length;
    content =
      content.slice(0, insertPos) +
      '\n' + storiesImports + '\n' +
      content.slice(insertPos);
  } else {
    // No frontmatter — put imports at the top
    content = storiesImports + '\n' + content;
  }

  // 2. Insert JSX just before the first ## heading
  const firstH2Match = content.match(/^## /m);
  if (firstH2Match && firstH2Match.index !== undefined) {
    const insertPos = firstH2Match.index;
    content =
      content.slice(0, insertPos) +
      '\n' + storiesJsx + '\n' +
      content.slice(insertPos);
  } else {
    // No ## heading found — append at the end
    content += '\n\n' + storiesJsx;
  }

  return content;
}

export function componentDocsPlugin(): RspressPlugin {
  const pages = discoverComponentMdxFiles();
  const sidebar = buildSidebar(pages);

  return {
    name: 'component-docs',
    addPages() {
      return pages.map((page) => {
        const raw = fs.readFileSync(page.filepath, 'utf-8');
        let content = transformContent(raw, page.componentName);

        if (page.storiesPath) {
          const storiesImportPath = page.storiesPath.replace(/\.tsx$/, '');
          const rawStories = fs.readFileSync(page.storiesPath, 'utf-8');
          const escapedSource = escapeTemplateLiteral(rawStories);
          const packageComponentImportName = getPackageComponentImportName(page.componentName);

          // Build the stories block: imports + JSX
          const storiesImports =
            `import StoriesGallery from '${STORIES_GALLERY_PATH}';\n` +
            `import * as ComponentStories from '${storiesImportPath}';\n` +
            (packageComponentImportName
              ? `import { ${packageComponentImportName} } from '@geti/ui';\n`
              : '');

          const storiesJsx =
            (packageComponentImportName
              ? `<StoriesGallery module={ComponentStories} source={\`${escapedSource}\`} component={${packageComponentImportName}} />\n`
              : `<StoriesGallery module={ComponentStories} source={\`${escapedSource}\`} />\n`);

          // Insert stories right after the intro section (title + subtitle + import
          // code block + links) and before the first ## heading.
          // Imports go at the top (after frontmatter), JSX goes before first ## heading.
          content = insertStoriesAfterIntro(content, storiesImports, storiesJsx);
        }

        return {
          routePath: page.routePath,
          content,
        };
      });
    },
    config(config) {
      config.themeConfig = config.themeConfig || {};
      config.themeConfig.sidebar = {
        ...config.themeConfig.sidebar,
        '/components/': sidebar,
      };
      return config;
    },
  };
}
