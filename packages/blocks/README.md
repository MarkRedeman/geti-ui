# @geti-ai/blocks

Composable application-level building blocks for Intel Geti products.

`@geti-ai/blocks` is built on top of `@geti-ai/ui` and provides higher-level, opinionated UI patterns (for example media filtering and media grid composition).

## Installation

```bash
npm install @geti-ai/blocks @geti-ai/ui
```

## Required setup

Import both stylesheets and render under `ThemeProvider`:

```tsx
import { ThemeProvider } from '@geti-ai/ui';
import '@geti-ai/ui/styles.css';
import '@geti-ai/blocks/styles.css';

export function App() {
    return <ThemeProvider>{/* app */}</ThemeProvider>;
}
```

## Usage

```tsx
import { MediaGrid, FilterDialog, FilterChips } from '@geti-ai/blocks';
```

## Documentation

- Blocks docs: `documentation/docs/blocks/**`
- Public docs site: https://docs.geti-ui.markredeman.nl/blocks/installation
