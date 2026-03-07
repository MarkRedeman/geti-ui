# ActionButton — Peer Review

**Reviewed:** 2026-03-06  
**Reviewer:** Oracle  
**Files reviewed:**

- `packages/ui/src/components/ActionButton/ActionButton.tsx`
- `packages/ui/src/components/ActionButton/ActionButton.module.css`
- `packages/ui/src/components/ActionButton/ActionButton.stories.tsx`
- `packages/ui/src/components/ActionButton/ActionButton.test.tsx`

---

## Summary

The most feature-rich of the five reviewed components. The CSS module is well-structured and mirrors the reference implementation faithfully (SCSS nesting translated to `:global()` selectors for plain CSS). The implementation is clean. Key gaps: `ActionButtonColorVariant` is not re-exported from `index.ts` (breaking consumer type imports), the default `colorVariant` behaviour diverges from the reference, `clsx()` emits an empty string instead of `undefined` when no classes are applied, and the CSS relies on two undocumented custom tokens (`--blue-header-option-hover`, `--blue-header-option-selected`, `--energy-blue`) that are not validated.

**Rating: 🟡 Good with notable gaps**

---

## Implementation Audit

### ✅ What's correct

| Area                         | Finding                                                                                                           |
| ---------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| Prop typing                  | `ActionButtonProps extends SpectrumActionButtonProps` — correct extension pattern; no upstream props are blocked. |
| `colorVariant` prop addition | Cleanly added without conflicting with upstream props.                                                            |
| `clsx` merging               | `UNSAFE_className` and the variant class are both forwarded; external overrides are composable.                   |
| CSS token usage              | Uses Spectrum alias tokens (`--spectrum-alias-*`, `--spectrum-global-color-*`) for most styles.                   |
| `!important` usage           | Acceptable given the Spectrum theming model; consistent with the reference.                                       |

### ❌ Issues

**1. `clsx()` returns `""` when both args are falsy (medium severity)**

```tsx
// Current
UNSAFE_className={clsx(getColorVariantClass(colorVariant), UNSAFE_className)}
// When colorVariant=undefined and UNSAFE_className=undefined → produces ""
```

`clsx(undefined, undefined)` returns `""`, and Spectrum's `UNSAFE_className` receiving `""` differs from receiving `undefined`. The Button component handled this correctly with `|| undefined`; ActionButton doesn't. Fix:

```tsx
UNSAFE_className={clsx(getColorVariantClass(colorVariant), UNSAFE_className) || undefined}
```

**2. `ActionButtonColorVariant` not exported from `index.ts` (medium severity)**

`ActionButtonColorVariant` is a named `export type` in `ActionButton.tsx` but is absent from `packages/ui/src/index.ts`. Consumers who import `ActionButton` and want to type their `colorVariant` prop programmatically cannot do so without reaching into the internal module path. This breaks the "import everything from `@geti/ui`" contract.

**3. Default `colorVariant` behaviour diverges from reference (low severity)**

The reference implementation's `getActionButtonClass` defaults to `'dark'` when `colorVariant` is `undefined`:

```ts
// reference
const getActionButtonClass = (colorVariant: ActionButtonColorVariant = 'dark') => { ... }
```

The new implementation returns `undefined` when `colorVariant` is not provided, meaning the "no variant" state renders with no custom class at all — a plain Spectrum ActionButton. This is arguably an improvement (less opinionated default) but is an **undocumented breaking change** from the reference.

**4. Undocumented custom CSS tokens (low severity)**

`ActionButton.module.css` relies on:

- `--blue-header-option-hover`
- `--blue-header-option-selected`
- `--energy-blue`

These are not Spectrum standard tokens. They must be defined in the global theme (e.g. `tokens.css`). Their absence from any theme file validation means a consumer who omits `ThemeProvider` will get invisible/broken styles with no error. These should be documented as required ThemeProvider tokens.

**5. No `isQuiet + colorVariant` interaction story (low severity)**

`isQuiet` and `colorVariant` can be combined but this state is not tested or shown in stories.

---

## Documentation & Stories

### Stories (`ActionButton.stories.tsx`)

| Check                                             | Status                       |
| ------------------------------------------------- | ---------------------------- |
| CSF3 format                                       | ✅                           |
| Default story                                     | ✅                           |
| All `colorVariant` values covered                 | ✅ (`Dark`, `Light`, `Blue`) |
| `isQuiet` story                                   | ✅                           |
| Disabled story                                    | ✅                           |
| Missing: `isQuiet` + `colorVariant` combined      | ❌                           |
| Missing: with icon child (workflow icon)          | ❌                           |
| Missing: `aria-label` example for icon-only usage | ❌                           |

### Tests (`ActionButton.test.tsx`)

| Test                                       | Status                            |
| ------------------------------------------ | --------------------------------- |
| Renders without crash                      | ✅                                |
| Displays children text                     | ✅                                |
| `onPress` fires on click                   | ✅                                |
| `onPress` blocked when disabled            | ✅                                |
| Each `colorVariant` renders                | ✅ (parameterised with `it.each`) |
| Keyboard activation (Enter/Space)          | ❌ Missing                        |
| `clsx` empty-string passthrough regression | ❌ Missing                        |
| Icon-only with `aria-label`                | ❌ Missing                        |

---

## TODO List

- [ ] **Fix `clsx()` empty-string issue** — append `|| undefined` to prevent passing `""` to `UNSAFE_className`.
- [ ] **Export `ActionButtonColorVariant` from `index.ts`** — add `export type { ActionButtonColorVariant } from './components/ActionButton/ActionButton'`.
- [ ] **Document default `colorVariant` change** — add a `@remarks` or `@defaultValue` JSDoc tag clarifying that omitting `colorVariant` applies no color style (unlike the reference default of `'dark'`).
- [ ] **Document required custom CSS tokens** — add a JSDoc `@remarks` note listing `--blue-header-option-hover`, `--blue-header-option-selected`, and `--energy-blue` as required theme tokens.
- [ ] **Add keyboard interaction test** — verify `Enter` and `Space` both trigger `onPress`.
- [ ] **Add icon-only accessibility test** — render with `aria-label` and no text children; assert accessible name is present.
- [ ] **Add combined `isQuiet` + `colorVariant` story**.
- [ ] **Add an icon-child story** using `@spectrum-icons/workflow` to demonstrate the canonical icon-button pattern.

---

## Documentation Section

### Usage

```tsx
import { ActionButton } from '@geti/ui';
import type { ActionButtonColorVariant } from '@geti/ui'; // NOTE: not yet exported from index.ts

// Default (no color variant — plain Spectrum ActionButton)
<ActionButton onPress={() => {}}>Edit</ActionButton>

// With color variant
<ActionButton colorVariant="dark" onPress={() => {}}>Settings</ActionButton>
<ActionButton colorVariant="light" onPress={() => {}}>Header Action</ActionButton>
<ActionButton colorVariant="blue" onPress={() => {}}>Link-style</ActionButton>

// Quiet
<ActionButton isQuiet>Quiet action</ActionButton>

// Icon-only (requires aria-label for accessibility)
<ActionButton aria-label="Delete item">
  <Delete />
</ActionButton>
```

### API

| Prop               | Type                          | Default     | Description                                                                  |
| ------------------ | ----------------------------- | ----------- | ---------------------------------------------------------------------------- |
| `colorVariant`     | `'dark' \| 'light' \| 'blue'` | `undefined` | Applies a Geti-specific CSS override. When omitted, no extra class is added. |
| `isQuiet`          | `boolean`                     | `false`     | Removes the button border; shows only on hover.                              |
| `isDisabled`       | `boolean`                     | `false`     | Disables interaction.                                                        |
| `UNSAFE_className` | `string`                      | —           | Additional class merged with the variant class via `clsx`.                   |

> All other `SpectrumActionButtonProps` are accepted and forwarded.

### `colorVariant` semantics

| Value   | Use-case                                                                       |
| ------- | ------------------------------------------------------------------------------ |
| `dark`  | Toolbar actions on a dark background (default Geti UI surface).                |
| `light` | Header areas with a lighter background (uses `--blue-header-option-*` tokens). |
| `blue`  | Text-style button with blue colour; used for supplementary actions.            |

### Required ThemeProvider tokens

The `light` and `blue` variants require these CSS custom properties to be defined (provided by `ThemeProvider`):

- `--blue-header-option-hover`
- `--blue-header-option-selected`
- `--energy-blue`
