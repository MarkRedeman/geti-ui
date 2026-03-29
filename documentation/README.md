# @geti-ui/documentation

Rspress documentation workspace for the Geti UI monorepo.

This package powers the docs site and acts as the primary integration surface for `@geti-ui/ui`, `@geti-ui/blocks`, `@geti-ui/charts`, `@geti-ui/smart-tools`, and `@geti-ui/mcp` content.

## What this workspace includes

- Documentation pages for all package areas under `documentation/docs/`
- Rspress configuration and theme customizations
- Skills endpoint generation and LLM-targeted docs artifacts (`llms.txt`, `llms-full.txt`)
- Docs checks and Playwright docs route smoke tests

## Getting started

From repository root:

```bash
npm install
npm run docs:dev
```

For component authoring with live package builds:

```bash
npm run docs:dev:with-ui
```

## Docs structure

- Components: `documentation/docs/components/`
- Blocks: `documentation/docs/blocks/`
- Charts: `documentation/docs/charts/`
- Smart tools: `documentation/docs/smart-tools/`
- AI and MCP docs: `documentation/docs/ai/`

## Development commands

From repository root:

```bash
npm run docs:dev
npm run docs:build
npm run docs:preview
npm run docs:check:coverage
npm run docs:check:sidebar
npm run docs:check:links
npm run docs:test:e2e
```

## Related references

- Main contributor guide: `CONTRIBUTING.md`
- MCP developer guide: `docs/mcp.md`
- Root workspace overview: `README.md`
