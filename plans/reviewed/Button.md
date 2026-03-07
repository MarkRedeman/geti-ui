# Button — Peer Review

**Reviewed:** 2026-03-06  
**Reviewer:** Oracle  
**Files reviewed:**

- `packages/ui/src/components/Button/Button.tsx`
- `packages/ui/src/components/Button/Button.module.css`
- `packages/ui/src/components/Button/Button.stories.tsx`
- `packages/ui/src/components/Button/Button.test.tsx`

---

## Summary

Solid, production-ready baseline component. The implementation is clean, type-safe, and follows all stated conventions. The primary gaps are: (1) a missing `ref` forwarding path that the reference implementation had, (2) a missing `href`/router-link integration that the reference implementation explicitly handled, (3) the CSS module file is an empty placeholder, and (4) a cosmetically redundant `clsx()` call in the main implementation. Tests are good but contain one duplicate test case.

**Rating: 🟢 Good — minor issues only**

---

## Implementation Audit

### ✅ What's correct

| Area                 | Finding                                                                                                                |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| Type safety          | `VariantWithoutLegacy` correctly excludes `cta` and `overBackground` at the type level via `Exclude<>`.                |
| Prop spread          | All upstream `SpectrumButtonProps` are forwarded via `...rest`; only `variant` and `UNSAFE_className` are intercepted. |
| Default variant      | Correctly defaults to `'accent'`, matching Geti's dark-mode-first styling expectation.                                 |
| JSDoc                | Component and each prop are documented.                                                                                |
| Convention adherence | Uses `UNSAFE_className` correctly as the styling escape hatch, not `UNSAFE_style`.                                     |

### ❌ Issues

**1. Redundant `clsx()` call (low severity)**

```tsx
// Current — clsx with a single string string adds zero value
UNSAFE_className={clsx(UNSAFE_className) || undefined}
```

`clsx` with a single argument is a no-op. The intent (passing `undefined` instead of `""`) is good, but it's simpler and more honest as:

```tsx
UNSAFE_className={UNSAFE_className || undefined}
```

If future callers are expected to pass multiple class strings, the pattern makes more sense but then should be documented.

**2. Missing `ref` forwarding (medium severity)**

The reference implementation (`reference-packages/ui/src/button/button.component.tsx`) explicitly types a `ref?: FocusableRef<HTMLButtonElement>` on `ButtonProps`. The new implementation drops this entirely. Consumers who need to programmatically focus the button (e.g. for focus management in dialogs or modals) have no typed path to do so.

**3. Missing `href`/`elementType` routing integration (medium severity)**

The reference implementation includes a `LinkBuilder` pattern that, when `href` is provided, replaces `elementType` with a React Router `<Link>` component. The new library has removed this entirely. This was a deliberate design choice (presumably removing `react-router-dom` as a dependency), but there is **no documentation** acknowledging this break and no migration guide. Consumers porting from the reference library will be silently broken.

**4. Empty CSS module (low severity)**

`Button.module.css` contains only a license header. Either this file should be deleted (if there are truly no Geti-specific button styles) or it is a placeholder stub that will confuse future contributors. The import is not even present in `Button.tsx`, so the file is unreferenced.

---

## Documentation & Stories

### Stories (`Button.stories.tsx`)

| Check                                                               | Status                                                         |
| ------------------------------------------------------------------- | -------------------------------------------------------------- |
| CSF3 format                                                         | ✅                                                             |
| Default story present                                               | ✅                                                             |
| All variants covered                                                | ✅ (`Default`, `Primary`, `Secondary`, `Negative`, `Disabled`) |
| `argTypes` controls defined                                         | ✅                                                             |
| `parameters.a11y` present                                           | ✅                                                             |
| Missing: `isLoading` state story                                    | ❌                                                             |
| Missing: `isPending` / loading spinner state                        | ❌                                                             |
| Missing: `elementType` override story (demonstrates link-as-button) | ❌                                                             |

### Tests (`Button.test.tsx`)

| Test                              | Status                                                                                                      |
| --------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| Renders without crash             | ✅                                                                                                          |
| Displays children text            | ✅                                                                                                          |
| `onPress` fires on click          | ✅                                                                                                          |
| `onPress` blocked when disabled   | ✅                                                                                                          |
| Has role `button`                 | ⚠️ **Duplicate** — `'renders without crash'` already asserts `getByRole('button')`. This test is redundant. |
| Keyboard navigation (Enter/Space) | ❌ Missing                                                                                                  |
| `UNSAFE_className` pass-through   | ❌ Missing                                                                                                  |

---

## TODO List

- [ ] **Remove or justify the `clsx(UNSAFE_className) || undefined` pattern** — either simplify to `UNSAFE_className || undefined` or add multiple-class support and document it.
- [ ] **Add `ref` forwarding** — wrap with `React.forwardRef` and type `ref` as `FocusableRef<HTMLButtonElement>` from `@react-types/shared`.
- [ ] **Document the removal of `href`/router-link support** — add a JSDoc `@deprecated`-style note or a `@remarks` tag on `ButtonProps` explaining this divergence from the reference package.
- [ ] **Delete or populate `Button.module.css`** — the empty file is misleading. If no custom styles are needed, remove the file.
- [ ] **Add a keyboard interaction test** — `await userEvent.keyboard('{Enter}')` and `'{Space}'` after focusing the button.
- [ ] **Remove duplicate `has role button` test** — it is fully covered by `'renders without crash'`.
- [ ] **Add a story for `isLoading` / pending state** (if supported by the underlying Spectrum version).
- [ ] **Export `ActionButtonColorVariant` from `index.ts`** — _not applicable to Button directly, noted in ActionButton review, but `index.ts` does not re-export it._

---

## Documentation Section

### Usage

```tsx
import { Button } from '@geti/ui';

// Default (accent)
<Button onPress={() => console.log('pressed')}>Save</Button>

// Variants
<Button variant="primary">Primary</Button>
<Button variant="secondary">Cancel</Button>
<Button variant="negative">Delete</Button>

// Disabled
<Button isDisabled>Cannot press</Button>

// Custom class via escape hatch
<Button UNSAFE_className={styles.myOverride}>Styled</Button>
```

### API

| Prop               | Type                                                 | Default    | Description                                                            |
| ------------------ | ---------------------------------------------------- | ---------- | ---------------------------------------------------------------------- |
| `variant`          | `'accent' \| 'primary' \| 'secondary' \| 'negative'` | `'accent'` | Visual style. Legacy variants `cta` and `overBackground` are excluded. |
| `isDisabled`       | `boolean`                                            | `false`    | Disables the button and blocks interaction.                            |
| `onPress`          | `(e: PressEvent) => void`                            | —          | Fires on pointer press or keyboard activation.                         |
| `UNSAFE_className` | `string`                                             | —          | Appended to the root element class list. Use sparingly.                |
| `children`         | `ReactNode`                                          | —          | Button label or content.                                               |

> All other `SpectrumButtonProps` are accepted and forwarded.

### Notes

- **No `href` support**: Unlike the reference implementation, this component does not accept `href` or render as a router link. Use a plain `<a>` or wrap with a router `<Link>` and set `elementType` manually if navigation is needed.
- Always prefer `onPress` over `onClick`; `onPress` handles keyboard, pointer, and touch uniformly.
