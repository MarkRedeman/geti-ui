# @geti-ui/ui

Geti UI core design system package for React applications.

`@geti-ui/ui` provides accessible, production-ready UI primitives and patterns used across Geti products, with a dark-mode-first theme and typed APIs.

## What this package includes

- 80+ components across form, data, feedback, navigation, overlays, and layout
- Theme integration via `ThemeProvider` and bundled stylesheet
- Asset and icon subpath exports:
  - `@geti-ui/ui/icons`
  - `@geti-ui/ui/assets`
  - `@geti-ui/ui/assets/images`
  - `@geti-ui/ui/assets/domains`
  - `@geti-ui/ui/assets/primary-tools`

## Installation

```bash
npm install @geti-ui/ui
```

## Quick start

```tsx
import '@geti-ui/ui/styles.css';
import { ThemeProvider, Button } from '@geti-ui/ui';

export function App() {
  return (
    <ThemeProvider>
      <Button variant="accent">Get started</Button>
    </ThemeProvider>
  );
}
```

## Examples and docs

- Installation: `documentation/docs/components/installation.mdx`
- Component docs root: `documentation/docs/components/`
- Asset docs: `documentation/docs/assets/`
- Kitchen sink examples: `documentation/docs/examples/`

## Development

From repository root:

```bash
npm run build --workspace=@geti-ui/ui
npm run test --workspace=@geti-ui/ui
npm run test:e2e --workspace=@geti-ui/ui
npm run type-check --workspace=@geti-ui/ui
npm run lint --workspace=@geti-ui/ui
npm run format:check --workspace=@geti-ui/ui
```
