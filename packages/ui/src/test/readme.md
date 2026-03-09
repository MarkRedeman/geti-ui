# packages/ui/src/test/

## Responsibility

Global test infrastructure for the `@geti-ai/ui` package. Currently contains a single file: `setup.ts`, which is the global test setup entry point executed by rstest before any test suite runs.

## Design

**`setup.ts`** has one line:

```ts
import '@testing-library/jest-dom';
```

This augments the global `expect` with DOM-specific matchers (`.toBeInTheDocument()`, `.toHaveValue()`, `.toBeVisible()`, etc.) provided by `@testing-library/jest-dom`. Without it, these matchers would not exist in the rstest/Vitest environment.

**Why a dedicated file?** rstest (like Vitest) requires a `setupFiles` entry in the config (`rstest.config.ts`) that points to a module run before all tests. Keeping setup logic in its own directory makes it easy to add more global configuration in the future (e.g. mocking `window.matchMedia`, setting up MSW, configuring i18n).

## Flow

```
rstest starts
  → loads rstest.config.ts
  → executes src/test/setup.ts  (global setup)
  → runs each *.test.tsx file in a jsdom environment
```

## Integration

- **`rstest.config.ts`** (at `packages/ui/`) references `./src/test/setup.ts` as the `setupFiles` entry.
- **All test files** (`*.test.tsx` co-located with components) implicitly receive the jest-dom matchers without needing to import `setup.ts` themselves.
- **No test utilities here**: shared test render helpers or mock factories, if needed in the future, would be added to this directory (e.g. `test/render.tsx`, `test/mocks.ts`).
