# @geti-ui/mcp

MCP (Model Context Protocol) server for Geti UI documentation. Exposes component, chart, blocks, and smart-tools docs to AI coding agents via 8 MCP tools.

## What this package includes

- Stdio MCP server binary (`geti-ui-mcp`)
- Bundled documentation dataset (`llms.txt`, `llms-full.txt`, markdown pages, skills artifacts)
- Query tools for pages, search, component props, charts, and blocks

## Quick start

### Claude Code

```bash
claude mcp add geti-ui -- npx @geti-ui/mcp@latest
```

### VS Code (Copilot)

Add to `.vscode/mcp.json`:

```json
{
    "servers": {
        "geti-ui": {
            "type": "stdio",
            "command": "npx",
            "args": ["@geti-ui/mcp@latest"]
        }
    }
}
```

### Cursor

Add to `.cursor/mcp.json`:

```json
{
    "mcpServers": {
        "geti-ui": {
            "command": "npx",
            "args": ["@geti-ui/mcp@latest"]
        }
    }
}
```

### Windsurf

Add to `~/.codeium/windsurf/mcp_config.json`:

```json
{
    "mcpServers": {
        "geti-ui": {
            "command": "npx",
            "args": ["@geti-ui/mcp@latest"]
        }
    }
}
```

## Available tools

| Tool                          | Description                                  |
| ----------------------------- | -------------------------------------------- |
| `list_geti_ui_pages`          | List all documentation pages                 |
| `get_geti_ui_page_info`       | Get page description and section list        |
| `get_geti_ui_page`            | Get full page markdown or a specific section |
| `search_geti_ui_docs`         | Full-text search across all docs             |
| `list_geti_ui_components`     | List UI components by category               |
| `get_geti_ui_component_props` | Get structured prop info for a component     |
| `list_geti_ui_charts`         | List chart components by type                |
| `list_geti_ui_blocks`         | List block docs pages by category            |

## Examples and docs

- MCP docs page: `documentation/docs/ai/mcp.mdx`
- AI docs overview: `documentation/docs/ai/overview.mdx`
- Developer guide: `docs/mcp.md`

## Environment variables

| Variable        | Description                                              |
| --------------- | -------------------------------------------------------- |
| `DOCS_BASE_URL` | Fetch docs from a remote URL instead of bundled data     |
| `DOCS_DIR`      | Read docs from a local directory instead of bundled data |

By default, the server reads from bundled documentation shipped with the npm package. No configuration needed.

The bundled dataset includes:

- `llms.txt`
- `llms-full.txt`
- all documentation markdown pages (`**/*.md`)
- generated skills endpoint artifacts (`.well-known/skills/*`)

## Local development

```bash
# From the repository root:
npm run docs:build           # Generate documentation
npm run mcp:build            # Bundle docs + compile server
npm run mcp:start            # Start the server

# Or point to a local doc_build directory:
DOCS_DIR=./documentation/doc_build node packages/mcp/dist/index.js
```

## Development tooling

```bash
npm run test                 # Run unit tests (rstest)
npm run test:watch           # Watch mode
npm run lint                 # Lint (rslint)
npm run lint:fix             # Auto-fix lint issues
npm run format               # Format (prettier)
npm run format:check         # Check formatting (CI)
npm run type-check           # TypeScript check
```

For the full developer guide (testing the MCP handshake, architecture internals,
adding new tools), see [`docs/mcp.md`](../../docs/mcp.md).

## License

Apache-2.0
