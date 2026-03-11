# MCP Server — Developer Guide

This document covers how to develop, test, and debug the `@geti-ai/mcp` server. For
end-user setup instructions (configuring Claude Code, VS Code, Cursor, etc.), see the
[user-facing docs](../../../documentation/docs/mcp.mdx) or the
[package README](../README.md).

---

## Prerequisites

- Node.js >= 18 (the monorepo root requires >= 24, but the MCP package targets >= 18 for
  external consumers)
- The documentation site must have been built at least once so that `documentation/doc_build/`
  exists. If it doesn't, run:

```bash
# From the repository root
npm run build        # Build the UI, charts, and smart-tools libraries
npm run docs:build   # Build the Rspress documentation site
```

---

## Project structure

```
packages/mcp/
├── scripts/
│   └── bundle-docs.mjs       # Copies doc_build/ → dist/data/ at build time
├── src/
│   ├── index.ts              # CLI entry point (#!/usr/bin/env node)
│   ├── server.ts             # MCP server factory — registers all 7 tools
│   ├── page-manager.ts       # llms.txt parsing, page index, fuzzy page resolution
│   ├── content-reader.ts     # Reads content from bundled / local / remote sources
│   ├── parser.ts             # Markdown parsing (sections, props, name extraction)
│   ├── parser.test.ts        # Parser unit tests
│   ├── search.ts             # Full-text search across all pages
│   ├── component-tools.ts    # list_geti_ui_components, get_geti_ui_component_props
│   ├── chart-tools.ts        # list_geti_ui_charts
│   ├── types.ts              # Shared type definitions
│   ├── utils.ts              # Error handling, path/env helpers
│   └── utils.test.ts         # Utils unit tests
├── dist/                     # Build output (gitignored)
│   ├── index.js              # Single bundled ESM entry
│   └── data/                 # Bundled documentation files
│       ├── llms.txt
│       ├── llms-full.txt
│       └── **/*.md
├── .prettierignore            # Excludes dist/ from formatting
├── package.json
├── rslint.jsonc               # Lint config
├── rslib.config.ts
├── rstest.config.ts           # Unit test config
├── tsconfig.json
└── README.md
```

---

## Building

```bash
# From the repository root — convenience script
npm run mcp:build

# Or from packages/mcp/ directly
npm run build
```

The build does two things in sequence:

1. **`rslib build`** — compiles `src/` into a single ESM bundle at `dist/index.js`
   (18 KB, with shebang banner for CLI usage)
2. **`node scripts/bundle-docs.mjs`** — copies `documentation/doc_build/{llms.txt,
   llms-full.txt, **/*.md}` into `dist/data/`

The order matters: rslib cleans `dist/` before building, so the doc bundling must
happen after.

If `documentation/doc_build/` does not exist and `CI=true` is set, the bundle-docs
script exits with code 1 (failing the build). In local development it prints a warning
and exits cleanly — the build succeeds, but the server will have no bundled data and
will only work with `DOCS_DIR` or `DOCS_BASE_URL`.

---

## Running the server locally

### Option 1: DOCS_DIR (recommended for development)

Point the server at the docs build output directly. This avoids needing to re-run
`mcp:build` every time you change documentation content:

```bash
# Build the server once
npm run mcp:build

# Run with live doc_build/ content
DOCS_DIR=./documentation/doc_build node packages/mcp/dist/index.js
```

### Option 2: Bundled data

After a full `mcp:build`, the server reads from `dist/data/` by default:

```bash
node packages/mcp/dist/index.js
```

### Option 3: Remote URL

Fetch documentation from a deployed site:

```bash
DOCS_BASE_URL=https://docs.geti-ui.markredeman.nl node packages/mcp/dist/index.js
```

### Help flag

```bash
node packages/mcp/dist/index.js --help
```

---

## Testing the MCP server

The MCP server communicates over stdio (JSON-RPC over stdin/stdout). You can test it
by piping JSON-RPC messages into the process.

### Quick smoke test

Verify the server starts and responds to the MCP `initialize` handshake:

```bash
echo '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2025-03-26","capabilities":{},"clientInfo":{"name":"test","version":"0.1"}}}' \
  | DOCS_DIR=./documentation/doc_build node packages/mcp/dist/index.js
```

Expected output (single JSON line):

```json
{"result":{"protocolVersion":"2025-03-26","capabilities":{"tools":{"listChanged":true}},"serverInfo":{"name":"geti-ui-docs-server","version":"0.0.1"}},"jsonrpc":"2.0","id":1}
```

### Calling a tool

MCP requires a full handshake before tool calls work: `initialize` request, then
`notifications/initialized`, then the tool call. Use a subshell with `sleep` to
sequence the messages:

```bash
(
  echo '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2025-03-26","capabilities":{},"clientInfo":{"name":"test","version":"0.1"}}}'
  sleep 0.2
  echo '{"jsonrpc":"2.0","method":"notifications/initialized"}'
  sleep 0.2
  echo '{"jsonrpc":"2.0","id":2,"method":"tools/call","params":{"name":"list_geti_ui_pages","arguments":{"includeDescription":false}}}'
  sleep 2
) | DOCS_DIR=./documentation/doc_build node packages/mcp/dist/index.js
```

This prints two JSON lines: the `initialize` response (id=1) and the tool result
(id=2). The tool result contains a `content` array with a single text entry holding
the JSON-encoded page list.

### Testing individual tools

Replace the `tools/call` params to exercise different tools:

**List components:**

```json
{"jsonrpc":"2.0","id":2,"method":"tools/call","params":{"name":"list_geti_ui_components","arguments":{}}}
```

**List components filtered by category:**

```json
{"jsonrpc":"2.0","id":2,"method":"tools/call","params":{"name":"list_geti_ui_components","arguments":{"category":"form"}}}
```

**Get component props:**

```json
{"jsonrpc":"2.0","id":2,"method":"tools/call","params":{"name":"get_geti_ui_component_props","arguments":{"component_name":"Button"}}}
```

**Get a page section:**

```json
{"jsonrpc":"2.0","id":2,"method":"tools/call","params":{"name":"get_geti_ui_page","arguments":{"page_name":"Button","section_name":"Props (deep dive)"}}}
```

**Search docs:**

```json
{"jsonrpc":"2.0","id":2,"method":"tools/call","params":{"name":"search_geti_ui_docs","arguments":{"query":"onPress","limit":5}}}
```

**List charts:**

```json
{"jsonrpc":"2.0","id":2,"method":"tools/call","params":{"name":"list_geti_ui_charts","arguments":{"type":"composition"}}}
```

**Get page info (sections list):**

```json
{"jsonrpc":"2.0","id":2,"method":"tools/call","params":{"name":"get_geti_ui_page_info","arguments":{"page_name":"Tooltip"}}}
```

### Testing with npx

Once the package is published, you can test the released version the same way:

```bash
(
  echo '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2025-03-26","capabilities":{},"clientInfo":{"name":"test","version":"0.1"}}}'
  sleep 0.2
  echo '{"jsonrpc":"2.0","method":"notifications/initialized"}'
  sleep 0.2
  echo '{"jsonrpc":"2.0","id":2,"method":"tools/call","params":{"name":"list_geti_ui_components","arguments":{}}}'
  sleep 2
) | npx @geti-ai/mcp@latest
```

This uses the bundled documentation shipped with the npm package — no local build
or `DOCS_DIR` needed.

### Testing with an MCP client

For interactive testing, connect a real MCP client. The fastest option is Claude Code:

```bash
# Register the local build as an MCP server
claude mcp add geti-ui-dev -- env DOCS_DIR=./documentation/doc_build node packages/mcp/dist/index.js

# Now ask Claude a question that triggers tool use:
# "What components are available in Geti UI?"
# "Show me the props for the Button component"
```

To remove the dev server later:

```bash
claude mcp remove geti-ui-dev
```

### Parsing the tool response

Tool responses are JSON-RPC results where `result.content[0].text` contains a
JSON-encoded string. To pretty-print a specific tool response:

```bash
(
  echo '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2025-03-26","capabilities":{},"clientInfo":{"name":"test","version":"0.1"}}}'
  sleep 0.2
  echo '{"jsonrpc":"2.0","method":"notifications/initialized"}'
  sleep 0.2
  echo '{"jsonrpc":"2.0","id":2,"method":"tools/call","params":{"name":"list_geti_ui_components","arguments":{"category":"ui"}}}'
  sleep 2
) | DOCS_DIR=./documentation/doc_build node packages/mcp/dist/index.js 2>/dev/null \
  | while IFS= read -r line; do
      echo "$line" | python3 -c "
import sys, json
d = json.load(sys.stdin)
if d.get('id') == 2:
    items = json.loads(d['result']['content'][0]['text'])
    print(json.dumps(items, indent=2))
" 2>/dev/null
    done
```

---

## Content resolution

The server resolves documentation content from one of three sources, checked in order:

| Priority | Env var          | Source                                          |
|----------|------------------|-------------------------------------------------|
| 1        | `DOCS_BASE_URL`  | HTTP fetch from a remote URL                    |
| 2        | `DOCS_DIR`       | Local filesystem directory                      |
| 3        | _(default)_      | Bundled files in `dist/data/` inside the package |

This is implemented in `src/content-reader.ts` with the source resolved once at startup
by `src/utils.ts:resolveContentSource()`.

---

## Page resolution

When an AI agent calls a tool with a `page_name` like `"Button"`, the server resolves
it through a multi-step fuzzy matching process (see `src/page-manager.ts:resolvePageRef()`):

1. **Exact key match** — `"components/ui/Button"`
2. **Normalized key match** — strips `.md` extension and backslashes
3. **Path suffix match** — `"ui/Button"` matches `"components/ui/Button"`
4. **Display name match** — `"Button"` matches the page whose display name is "Button"
5. **Case-insensitive name match** — `"button"` matches "Button"
6. **Case-insensitive key suffix match** — `"button"` matches `"components/ui/Button"`

If no match is found, the server throws an error suggesting `list_geti_ui_pages`.

---

## How documentation gets bundled

The flow from authoring to serving:

```
1. Author docs as .mdx files in documentation/docs/ or packages/ui/src/components/
                              ↓
2. npm run docs:build    (rspress build)
                              ↓
3. @rspress/plugin-llms generates:
   documentation/doc_build/llms.txt        (page index)
   documentation/doc_build/llms-full.txt   (concatenated content)
   documentation/doc_build/**/*.md         (170 individual pages)
                              ↓
4. npm run mcp:build     (rslib build + bundle-docs.mjs)
                              ↓
5. dist/index.js             (compiled server)
   dist/data/llms.txt        (bundled page index)
   dist/data/**/*.md         (bundled page content)
                              ↓
6. npm publish               (ships dist/ in the npm package)
```

---

## Architecture internals

### Module dependency graph

```
index.ts
  └── server.ts
        ├── page-manager.ts
        │     ├── content-reader.ts
        │     │     └── utils.ts (resolveContentSource, resolveDataDir, fetchText)
        │     └── parser.ts (extractNameAndDescription, parseSectionsFromMarkdown)
        ├── search.ts
        │     └── page-manager.ts (buildPageIndex, readPageContent)
        ├── component-tools.ts
        │     ├── page-manager.ts (buildPageIndex, ensureParsedPage, readPageContent)
        │     └── parser.ts (extractComponentProps)
        ├── chart-tools.ts
        │     └── page-manager.ts (buildPageIndex)
        └── parser.ts (parseSectionsFromMarkdown)
```

### Caching strategy

- **Page index** (`pageCache` in `page-manager.ts`) — built once from `llms.txt` on the
  first call to `buildPageIndex()`. All subsequent calls return the cached map.
- **Page sections** — lazily populated by `ensureParsedPage()`. Once a page's content is
  fetched and parsed, the `PageInfo` entry in the cache is updated with `sections` and
  `description`.
- **Search content** (`contentCache` in `search.ts`) — all page content is loaded in
  parallel on the first `searchDocs()` call and held in memory for subsequent searches.

There is no cache invalidation. The server is designed to be short-lived (started per
AI session) or restarted when documentation changes.

### Build configuration

The rslib config (`rslib.config.ts`) produces a single ESM bundle:

- **`format: 'esm'`** — the MCP SDK is ESM-only
- **`bundle: true`** — single file output for fast `npx` cold start
- **`target: 'node'`** — Node.js APIs only, no browser polyfills
- **`banner.js: '#!/usr/bin/env node'`** — shebang for direct CLI execution
- **`externals: [/^@modelcontextprotocol\//, /^node:/]`** — the MCP SDK is kept external
  (installed as a dependency); Node.js built-ins are always external

---

## Type checking

```bash
npm run type-check --workspace=@geti-ai/mcp
```

This runs `tsc --noEmit` against the source files. Test files (`**/*.test.ts`) are
excluded from type checking via `tsconfig.json`.

---

## Linting

```bash
npm run lint --workspace=@geti-ai/mcp       # Check
npm run lint:fix --workspace=@geti-ai/mcp    # Auto-fix
```

Uses rslint with the configuration in `rslint.jsonc`. Also included in the root
`npm run lint` aggregate command.

---

## Formatting

```bash
npm run format --workspace=@geti-ai/mcp        # Write formatted files
npm run format:check --workspace=@geti-ai/mcp   # Check only (CI)
```

Uses prettier with the repo's `.prettierrc.json` config. The `.prettierignore` file in
`packages/mcp/` excludes `dist/` to prevent formatting bundled documentation files.

---

## Unit tests

```bash
npm run test --workspace=@geti-ai/mcp        # Run once
npm run test:watch --workspace=@geti-ai/mcp   # Watch mode
```

Uses rstest (vitest-compatible). Tests are in `src/parser.test.ts` and
`src/utils.test.ts`. Also included in the root `npm run test` aggregate command.

---

## Adding a new tool

1. Create a new file in `src/` (e.g. `src/example-tools.ts`) with the tool's
   logic as an exported async function.

2. In `src/server.ts`, import the function and register the tool with
   `server.registerTool()`:

```typescript
import { myNewTool } from './example-tools.js';

server.registerTool(
  'my_new_geti_ui_tool',
  {
    title: 'Short title',
    description: 'What the tool does — this is shown to the AI agent.',
    inputSchema: {
      param: z.string().describe('Parameter description'),
    },
  },
  async ({ param }) => {
    const result = await myNewTool(param);
    return {
      content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
    };
  },
);
```

3. Rebuild and test:

```bash
npm run mcp:build
(
  echo '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2025-03-26","capabilities":{},"clientInfo":{"name":"test","version":"0.1"}}}'
  sleep 0.2
  echo '{"jsonrpc":"2.0","method":"notifications/initialized"}'
  sleep 0.2
  echo '{"jsonrpc":"2.0","id":2,"method":"tools/call","params":{"name":"my_new_geti_ui_tool","arguments":{"param":"test"}}}'
  sleep 2
) | DOCS_DIR=./documentation/doc_build node packages/mcp/dist/index.js
```

---

## Troubleshooting

### "Page not found" errors

The page name must match an entry in `llms.txt`. Run `list_geti_ui_pages` to see all
available names. Common issues:

- Using a path with `.md` extension — the server strips it, but include it if unsure
- Using a category-prefixed name like `"ui/Button"` — this works via suffix matching
- Typos in the page name — matching is case-insensitive but not fuzzy

### Server exits immediately

The MCP server reads from stdin. If stdin is closed (e.g. running without piped input),
the server exits. This is normal — it's designed to be started by an MCP client, not
run interactively.

### "doc_build does not exist" warning during build

Run `npm run docs:build` from the repository root to generate the documentation output.
The MCP build depends on this output existing.

### Changes to documentation not reflected

If using `DOCS_DIR`, the server reads content on demand (no file watching). Restart
the server to pick up changes. If using bundled data, you need to rebuild:

```bash
npm run docs:build && npm run mcp:build
```
