# @geti-ui/blocks

Composable application-level building blocks for Geti products.

`@geti-ui/blocks` builds on top of `@geti-ui/ui` primitives and provides opinionated product-level patterns such as media workflows, logs surfaces, and managed tabs.

## What this package includes

- Media building blocks: filtering, chips, dialog, grid, and table flows
- Logs building blocks: list content, toolbar controls, level filtering
- Tabs building blocks: managed and overflowable tab behaviors
- Annotation-related blocks and utility surfaces used in product screens

## Installation

```bash
npm install @geti-ui/blocks @geti-ui/ui
```

## Required setup

Import both stylesheets and render under `ThemeProvider`:

```tsx
import { ThemeProvider } from '@geti-ui/ui';
import '@geti-ui/ui/styles.css';
import '@geti-ui/blocks/styles.css';

export function App() {
    return <ThemeProvider>{/* app */}</ThemeProvider>;
}
```

## Quick start

```tsx
import { MediaGrid, FilterDialog, FilterChips } from '@geti-ui/blocks';

// Use with your own state/data source
```

## Examples and docs

- Installation: `documentation/docs/blocks/installation.mdx`
- Blocks docs root: `documentation/docs/blocks/`
- Media overview example: `documentation/docs/blocks/media/media-overview.mdx`
- Logs docs: `documentation/docs/blocks/logs.mdx`

## Development

From repository root:

```bash
npm run build --workspace=@geti-ui/blocks
npm run test --workspace=@geti-ui/blocks
npm run type-check --workspace=@geti-ui/blocks
npm run lint --workspace=@geti-ui/blocks
npm run format:check --workspace=@geti-ui/blocks
```
