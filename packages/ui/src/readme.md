# packages/ui/src/

## Responsibility

The `src/` directory is the entire source tree of the `@geti/ui` library. It contains every file that gets compiled and shipped to consumers. The public surface is defined by `index.ts`.

Top-level entries:
| Path | Role |
|------|------|
| `index.ts` | Single barrel export — the only file consumers import from |
| `components/` | All UI components, organised into 8 domain groups |
| `theme/` | `ThemeProvider`, design tokens, CSS theme modules |
| `utils/` | Shared utilities (color helpers) |
| `test/` | Global test setup (jest-dom matchers) |
| `declarations.d.ts` | Global type declarations (e.g. CSS module types) |
| `types.d.ts` | Shared ambient type definitions |

## Design

- **Barrel exports only**: `index.ts` is the sole public entry point. It re-exports every component, every `Props` type, and selected enums/utilities. Consumers never deep-import from `@geti/ui/components/...`.
- **Component organisation**: components are split into 8 groups mirroring the export groups in `index.ts`: `ui/`, `form/`, `form/pickers/`, `overlays/`, `navigation/`, `feedback/`, `data/`, `layouts/`. See `components/codemap.md` for details.
- **Theme isolation**: the theme system lives in `theme/` and is completely separate from components — components never import from `theme/` directly (they rely on CSS custom properties at runtime). Only `ThemeProvider` imports the theme modules.
- **No path aliases**: all imports use relative paths (e.g. `../button/Button`), consistent with rslib's `bundle: false` file-per-module output.
- **CSS Modules**: component-level styles use CSS Modules (`.module.css`). Global/theme CSS is in `theme/*.module.css`. `declarations.d.ts` declares the `*.module.css` module type.

## Flow

```
Consumer: import { Button } from '@geti/ui'
  → dist/esm/index.js  (or dist/cjs/index.js)
    → dist/esm/components/ui/Button/Button.js
      → @adobe/react-spectrum (peer)
```

At build time:

```
src/index.ts  (rslib entry)
  → re-exports from components/, theme/, utils/
  → rslib emits one output file per source file (bundle: false)
```

## Integration

- **`index.ts`** is the only file rslib treats as the public API boundary.
- **`theme/ThemeProvider`** must wrap the consumer's component tree — without it, no Spectrum components render correctly and Geti design tokens are absent.
- **`utils/`** exports (`getDistinctColorBasedOnHash`, `DISTINCT_COLORS`) are used internally by `PhotoPlaceholder` but are also re-exported for consumers who need brand-consistent hash-based colors.
- **`test/setup.ts`** is registered in `rstest.config.ts` as the global setup file; it imports `@testing-library/jest-dom` to add DOM matchers to all tests.
