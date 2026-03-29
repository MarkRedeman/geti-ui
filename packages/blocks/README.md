# @geti-ui/blocks

Composable application-level building blocks for Intel Geti products.

`@geti-ui/blocks` is built on top of `@geti-ui/ui` and provides higher-level, opinionated UI patterns (for example media filtering and media grid composition).

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

## Usage

```tsx
import { MediaGrid, FilterDialog, FilterChips } from '@geti-ui/blocks';
```

## Documentation

- Blocks docs: `documentation/docs/blocks/**`
- Public docs site: https://docs.geti-ui.markredeman.nl/blocks/installation
