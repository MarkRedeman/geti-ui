import type { RspressPlugin } from '@rspress/core';
import { mkdir, writeFile, readFile } from 'node:fs/promises';
import { join, isAbsolute } from 'node:path';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface LlmsPage {
    /** Display name from llms.txt, e.g. "Button" */
    name: string;
    /** Relative path to the .md file, e.g. "components/ui/Button.md" */
    path: string;
    /** Optional one-line description */
    description?: string;
}

interface SkillDefinition {
    id: string;
    name: string;
    description: string;
    instructions: string;
    /**
     * Path prefixes that determine which llms.txt pages belong to this skill.
     * A page is included if its path starts with any of these prefixes.
     */
    pathPrefixes: string[];
}

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

const BASE_URL = 'https://docs.geti-ui.markredeman.nl';

const SKILLS: SkillDefinition[] = [
    {
        id: 'geti-ui',
        name: 'Geti UI',
        description:
            'Build accessible UIs with @geti-ui/ui - the component design system for Intel Geti products. ' +
            'Provides 80+ React components built on Adobe React Spectrum, organized into categories: ' +
            'UI, Form Controls, Date Controls, Color Controls, Pickers, Data Display, ' +
            'Status & Feedback, Navigation, Overlays, and Layout & Structure.',
        instructions: `# Geti UI - Component Library

Use \`@geti-ui/ui\` when building React UIs for Intel Geti products or any project that adopts the Geti design system.

## Installation

\`\`\`bash
npm install @geti-ui/ui
\`\`\`

## Setup

Wrap your application with \`ThemeProvider\` and import the stylesheet:

\`\`\`tsx
import { ThemeProvider } from '@geti-ui/ui';
import '@geti-ui/ui/styles.css';

function App() {
  return (
    <ThemeProvider>
      {/* your app */}
    </ThemeProvider>
  );
}
\`\`\`

## Import patterns

- Components: \`import { Button, TextField, Tabs } from '@geti-ui/ui';\`
- Icons: \`import { AddIcon, DeleteIcon } from '@geti-ui/ui/icons';\`
- Assets: \`import { SomeDomain } from '@geti-ui/ui/assets/domains';\`

All exports are tree-shakeable named exports. Never use internal source paths.

## Component categories

| Category | Examples |
|----------|---------|
| UI | Button, ActionButton, ToggleButton, Avatar, Divider, Image |
| Form Controls | TextField, NumberField, Checkbox, RadioGroup, Switch, Slider |
| Date Controls | DatePicker, DateField, Calendar, DateRangePicker, TimeField |
| Color Controls | ColorArea, ColorSlider, ColorWheel, ColorSwatch, ColorField |
| Pickers | ComboBox, Picker |
| Data Display | TableView, ListView, CardView, ListBox, TreeView, TagGroup |
| Status & Feedback | Badge, Toast, ProgressBar, Loading, Skeleton, InlineAlert |
| Navigation | Menu, ActionMenu, Tabs, Breadcrumbs, Link |
| Overlays | Dialog, AlertDialog, Popover, Tooltip, ContextualHelp |
| Layout & Structure | Flex, Grid, Card, Accordion, Well, Disclosure |

## Key conventions

- Components are thin wrappers around Adobe React Spectrum - they pass all upstream props through.
- The library is dark-mode-first. Always render under \`ThemeProvider\`.
- Prefer semantic ARIA queries in tests - never query by class name or test ID.
- Extend upstream prop types rather than redefining them.

## Documentation

The \`resources\` listed with this skill contain detailed documentation for every component, including props, usage examples, and accessibility notes. Use them as your primary reference when building UIs.`,
        pathPrefixes: ['components/', 'assets/'],
    },
    {
        id: 'geti-ui-charts',
        name: 'Geti UI Charts',
        description:
            'Data visualization components from @geti-ui/charts - chart primitives, compositions, ' +
            'and machine learning-specific charts built on Recharts.',
        instructions: `# Geti UI Charts - Data Visualization

Use \`@geti-ui/charts\` for data visualization in Geti products.

## Installation

\`\`\`bash
npm install @geti-ui/charts
\`\`\`

## Architecture

The library has two layers:

- **Primitives** - low-level chart building blocks (Line, Area, Bar, Scatter, Pie, Donut, Radar, RadialBar, Meter, Treemap, Sparkline, Legend). Use these when you need full control over chart composition.
- **Compositions** - pre-configured, ready-to-use chart components that combine primitives with sensible defaults. Available for all primitive types plus 18 machine learning-specific charts.

## Import pattern

\`\`\`tsx
import { LineChart, BarChart } from '@geti-ui/charts';
import { TrainingMetricsChart, ConfusionMatrixChart } from '@geti-ui/charts';
\`\`\`

## Theming

Charts integrate with the Geti UI theme system. They must be rendered inside a \`ThemeProvider\` from \`@geti-ui/ui\`. Dataset colors and styling are controlled via theme tokens.

## Machine Learning charts

The library includes specialized charts for ML workflows:

- Training metrics, Run comparison, Confusion matrix
- Precision-recall curve, ROC curve, Class AP
- IoU distribution, Distribution ridge, Error breakdown
- Confidence histogram, Class distribution
- Image brightness/aspect ratio distribution
- Reliability diagram, Confidence vs IoU
- Embedding distance distribution
- Latency percentile, Throughput vs latency
- BBox size distribution

## Documentation

The \`resources\` listed with this skill contain detailed documentation for every chart component, including props, data format, theming, and usage examples.`,
        pathPrefixes: ['charts/'],
    },
    {
        id: 'geti-ui-smart-tools',
        name: 'Geti UI Smart Tools',
        description:
            'Browser-based computer vision annotation tools from @geti-ui/smart-tools - ' +
            'OpenCV.js and ONNX runtime powered interactive segmentation and annotation.',
        instructions: `# Geti UI Smart Tools - Computer Vision Annotation

Use \`@geti-ui/smart-tools\` for browser-based computer vision annotation tools in Geti products.

## Installation

\`\`\`bash
npm install @geti-ui/smart-tools
\`\`\`

## Prerequisites

These tools require browser APIs and WebAssembly runtimes:

- **OpenCV.js** - for image processing tools (GrabCut, Intelligent Scissors, Watershed, SSIM)
- **ONNX Runtime Web** - for ML-based tools (RITM, Segment Anything)

## Available tools

### OpenCV-based
- **GrabCut** - interactive foreground extraction
- **Intelligent Scissors** - magnetic lasso-style boundary tracing
- **Watershed** - marker-based image segmentation
- **SSIM** - structural similarity comparison
- **Inference Image** - inference result overlay

### ONNX-based
- **RITM** - interactive segmentation with click-based refinement
- **Segment Anything** - SAM-based zero-shot segmentation

## Key patterns

- Tools are initialized asynchronously (WebAssembly loading).
- Each tool exposes a consistent API for canvas-based interaction.
- Tools operate on image data and return segmentation masks or annotations.

## Documentation

The \`resources\` listed with this skill contain detailed documentation for each tool, including initialization, usage, and API reference.`,
        pathPrefixes: ['smart-tools/'],
    },
    {
        id: 'geti-ui-blocks',
        name: 'Geti UI Blocks',
        description:
            'Reusable application-level building blocks from @geti-ui/blocks - ' +
            'opinionated, composable UI sections for logs, projects, models, media, annotations, and tabs.',
        instructions: `# Geti UI Blocks - Application Building Blocks

Use \`@geti-ui/blocks\` for reusable application-level UI sections in Geti products. Blocks are higher-level than primitives - they are pre-composed from \`@geti-ui/ui\` components and encode opinionated Geti application patterns.

## Installation

\`\`\`bash
npm install @geti-ui/blocks @geti-ui/ui
\`\`\`

## Setup

Blocks require both the UI and blocks stylesheets. Load them in your app entry:

\`\`\`tsx
import '@geti-ui/ui/styles.css';
import '@geti-ui/blocks/styles.css';
\`\`\`

Blocks must also be rendered inside a \`ThemeProvider\` from \`@geti-ui/ui\`:

\`\`\`tsx
import { ThemeProvider } from '@geti-ui/ui';
import '@geti-ui/ui/styles.css';
import '@geti-ui/blocks/styles.css';

function App() {
  return (
    <ThemeProvider>
      {/* your app using blocks */}
    </ThemeProvider>
  );
}
\`\`\`

## Import pattern

\`\`\`tsx
import { LogsContent, OverflowableTabs } from '@geti-ui/blocks';
\`\`\`

All exports are named exports. Never use internal source paths.

## Available blocks

| Category | Blocks |
|----------|--------|
| Logs | LogsBlock - scrollable log output with severity filtering |
| Projects | Project list, project menu, sorting, and pagination patterns |
| Models | Model list, model cards, status badges |
| Media | Media filter (faceted search), media grid (responsive selection grid) |
| Annotation | Annotation toolbar, zoom controls, prediction panel |
| Tabs | OverflowableTabs - scrollable/overflow-aware tab navigation |

## Key conventions

- Blocks are built on \`@geti-ui/ui\` primitives - do not mix raw Adobe Spectrum components inside blocks.
- Each block accepts a strongly-typed props interface; extend it rather than re-implementing the pattern from scratch.
- The library is dark-mode-first. Always render under \`ThemeProvider\`.
- Use blocks when a pattern is too opinionated (application-specific data shapes, layout decisions) for a primitive component.

## Documentation

The \`resources\` listed with this skill contain detailed documentation for every block, including props, usage examples, and integration notes.`,
        pathPrefixes: ['blocks/'],
    },
    {
        id: 'geti-ui-examples',
        name: 'Geti UI Examples',
        description:
            'Composition patterns and kitchensink examples showing how to combine ' +
            'Geti UI components into real application interfaces.',
        instructions: `# Geti UI Examples - Composition Patterns

These examples demonstrate how to combine \`@geti-ui/ui\` and \`@geti-ui/charts\` components into real application interfaces. Use them as templates and reference patterns.

## Kitchensinks

Full demonstrations of all components within a category, useful for visual testing and exploration:

- **Full Kitchensink** - every component in one page
- **Category kitchensinks** - UI, Form, Date Controls, Color Controls, Data Display, Overlays, Feedback, Navigation, Layouts

## Composed examples

Real-world UI patterns showing how components work together:

- **Job Management Panel** - status tracking, actions, data tables
- **Model List** - card layouts, filtering, bulk actions
- **Annotation Components** - canvas tools, property panels
- **Media Filter** - faceted search, tag-based filtering
- **Media Grid** - responsive grid, selection, thumbnails
- **Toolbar** - action groups, toggle modes, overflow
- **Project List** - list/card views, sorting, pagination
- **Project Menu** - navigation menus, context actions
- **Advanced Parameters** - complex form layouts, nested controls

## How to use these examples

- Read the example source to understand component composition patterns.
- Copy and adapt patterns for your own application.
- Each example shows realistic data structures and event handling.

## Documentation

The \`resources\` listed with this skill contain the full source and rendered examples.`,
        pathPrefixes: ['examples/', 'examples.md'],
    },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Parse an llms.txt file into a list of page entries.
 *
 * Matches lines of the form:
 *   - [Display Name](path/to/file.md): Optional description
 *
 * Uses the same regex as the MCP server's page-manager.ts for consistency.
 */
function parseLlmsTxt(content: string): LlmsPage[] {
    const re = /^\s*-\s*\[([^\]]+)\]\(([^)]+)\)(?:\s*:\s*(.*))?\s*$/;
    const pages: LlmsPage[] = [];

    for (const line of content.split(/\r?\n/)) {
        const m = line.match(re);
        if (!m) continue;

        const name = (m[1] || '').trim();
        const href = (m[2] || '').trim();
        const description = (m[3] || '').trim() || undefined;

        if (!href || !/\.md$/i.test(href)) continue;

        pages.push({
            name,
            path: href.replace(/^\//, ''),
            description,
        });
    }

    return pages;
}

/**
 * Resolve the build output directory from the Rspress config.
 * Follows the same pattern used by @rspress/plugin-sitemap.
 */
function resolveOutDir(config: Record<string, unknown>): string {
    const builderConfig = config.builderConfig as { output?: { distPath?: string | { root?: string } } } | undefined;

    const distPathRaw = builderConfig?.output?.distPath;
    const distPathRoot = typeof distPathRaw === 'string' ? distPathRaw : distPathRaw?.root;

    const configPath = (config.outDir as string | undefined) || distPathRoot;
    const fallback = configPath || 'doc_build';

    return isAbsolute(fallback) ? fallback : `./${fallback}`;
}

// ---------------------------------------------------------------------------
// Plugin
// ---------------------------------------------------------------------------

/**
 * Rspress plugin that generates a `.well-known/skills/` discovery endpoint
 * in the documentation build output.
 *
 * This enables AI agents to discover and install Geti UI skills via:
 *
 *   npx skills add https://docs.geti-ui.markredeman.nl
 *
 * The plugin runs in the `afterBuild` hook, after `@rspress/plugin-llms` has
 * already generated `llms.txt` and individual `.md` files in the output directory.
 */
export function pluginSkills(): RspressPlugin {
    return {
        name: 'skills-endpoint',

        async afterBuild(config, isProd) {
            if (!isProd) return;

            // 1. Resolve output directory
            const outDir = resolveOutDir(config as Record<string, unknown>);

            // Ensure GitHub Pages serves dot-directories such as `.well-known/`
            // by disabling Jekyll processing for the published artifact.
            await writeFile(join(outDir, '.nojekyll'), '');

            // 2. Read llms.txt from the build output (generated by @rspress/plugin-llms)
            const llmsTxtPath = join(outDir, 'llms.txt');
            let llmsTxt: string;
            try {
                llmsTxt = await readFile(llmsTxtPath, 'utf-8');
            } catch {
                console.warn(
                    '[skills-endpoint] llms.txt not found at %s - skipping skills endpoint generation. ' +
                        'Make sure @rspress/plugin-llms is configured and runs before this plugin.',
                    llmsTxtPath
                );
                return;
            }

            const pages = parseLlmsTxt(llmsTxt);
            if (pages.length === 0) {
                console.warn('[skills-endpoint] llms.txt contains no page entries - skipping.');
                return;
            }

            // 3. Create .well-known/ directories used by skills discovery clients.
            // `npx skills` prefers `agent-skills` and falls back to `skills`.
            const skillsDir = join(outDir, '.well-known', 'skills');
            const agentSkillsDir = join(outDir, '.well-known', 'agent-skills');
            await Promise.all([mkdir(skillsDir, { recursive: true }), mkdir(agentSkillsDir, { recursive: true })]);

            // 4. Generate discovery index.json in both locations using the
            // schema expected by `npx skills`.
            const index = {
                skills: SKILLS.map((s) => ({
                    name: s.id,
                    description: s.description,
                    files: ['SKILL.md'],
                })),
            };
            await Promise.all([
                writeFile(join(skillsDir, 'index.json'), JSON.stringify(index, null, 2)),
                writeFile(join(agentSkillsDir, 'index.json'), JSON.stringify(index, null, 2)),
            ]);

            // 5. Generate each skill markdown descriptor
            let totalResources = 0;
            for (const skill of SKILLS) {
                const resources = pages
                    .filter((p) => skill.pathPrefixes.some((prefix) => p.path.startsWith(prefix)))
                    .map((p) => `${BASE_URL}/${p.path}`);

                const resourcesSection =
                    resources.length === 0
                        ? ''
                        : `\n\n## Resources\n\n${resources.map((resource) => `- ${resource}`).join('\n')}`;

                const skillMarkdown = `---
name: ${JSON.stringify(skill.id)}
description: ${JSON.stringify(skill.description)}
---

${skill.instructions}${resourcesSection}
`;

                const skillDirs = [join(skillsDir, skill.id), join(agentSkillsDir, skill.id)];
                await Promise.all(skillDirs.map((dir) => mkdir(dir, { recursive: true })));
                await Promise.all(skillDirs.map((dir) => writeFile(join(dir, 'SKILL.md'), skillMarkdown)));

                totalResources += resources.length;
            }

            console.log(
                '[skills-endpoint] Generated %d skills with %d total resources → %s, %s',
                SKILLS.length,
                totalResources,
                skillsDir,
                agentSkillsDir
            );
        },
    };
}
