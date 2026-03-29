# @geti-ui/charts

Geti-themed chart components and chart primitives built on Recharts.

`@geti-ui/charts` provides reusable chart building blocks for product analytics, model metrics, and ML-focused visualizations.

## What this package includes

- Composition charts: line, area, bar, scatter, pie, donut, radar, radial bar, meter, treemap, sparkline
- Primitive chart helpers and theming wrappers via `@geti-ui/charts/primitives`
- `ChartsThemeProvider` for Geti-consistent chart colors and tokens

## Installation

```bash
npm install @geti-ui/charts recharts
```

## Quick start

```tsx
import { ChartsThemeProvider, LineChart } from '@geti-ui/charts';

const data = [
  { epoch: 1, loss: 1.2 },
  { epoch: 2, loss: 0.9 },
  { epoch: 3, loss: 0.7 },
];

export function App() {
  return (
    <ChartsThemeProvider>
      <LineChart data={data} xAxisKey="epoch" series={[{ dataKey: 'loss', name: 'Loss' }]} />
    </ChartsThemeProvider>
  );
}
```

If you already use `ThemeProvider` from `@geti-ui/ui`, nest `ChartsThemeProvider` inside it.

## Examples and docs

- Installation: `documentation/docs/charts/installation.mdx`
- Charts overview: `documentation/docs/charts/overview.mdx`
- Primitives: `documentation/docs/charts/primitives.mdx`
- Compositions: `documentation/docs/charts/compositions.mdx`

## Development

From repository root:

```bash
npm run build --workspace=@geti-ui/charts
npm run test --workspace=@geti-ui/charts
npm run type-check --workspace=@geti-ui/charts
npm run lint --workspace=@geti-ui/charts
npm run format:check --workspace=@geti-ui/charts
```
