# @geti-ai/mcp

MCP (Model Context Protocol) server for Geti UI documentation. Exposes component, chart, and smart-tools docs to AI coding agents via 7 MCP tools.

## Quick start

### Claude Code

```bash
claude mcp add geti-ui -- npx @geti-ai/mcp@latest
```

### VS Code (Copilot)

Add to `.vscode/mcp.json`:

```json
{
  "servers": {
    "geti-ui": {
      "type": "stdio",
      "command": "npx",
      "args": ["@geti-ai/mcp@latest"]
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
      "args": ["@geti-ai/mcp@latest"]
    }
  }
}
```

### Windsurf

Add to `~/.windsurf/mcp_config.json`:

```json
{
  "mcpServers": {
    "geti-ui": {
      "command": "npx",
      "args": ["@geti-ai/mcp@latest"]
    }
  }
}
```

## Available tools

| Tool | Description |
|------|-------------|
| `list_geti_ui_pages` | List all documentation pages |
| `get_geti_ui_page_info` | Get page description and section list |
| `get_geti_ui_page` | Get full page markdown or a specific section |
| `search_geti_ui_docs` | Full-text search across all docs |
| `list_geti_ui_components` | List UI components by category |
| `get_geti_ui_component_props` | Get structured prop info for a component |
| `list_geti_ui_charts` | List chart components by type |

## Environment variables

| Variable | Description |
|----------|-------------|
| `DOCS_BASE_URL` | Fetch docs from a remote URL instead of bundled data |
| `DOCS_DIR` | Read docs from a local directory instead of bundled data |

By default, the server reads from bundled documentation shipped with the npm package. No configuration needed.

## Local development

```bash
# From the repository root:
npm run docs:build           # Generate documentation
npm run mcp:build            # Bundle docs + compile server
npm run mcp:start            # Start the server

# Or point to a local doc_build directory:
DOCS_DIR=./documentation/doc_build node packages/mcp/dist/index.js
```

## License

Apache-2.0
