# IntelBrandedLoading — Peer Review

> **Location:** `packages/ui/src/components/IntelBrandedLoading/IntelBrandedLoading.tsx`

---

## Summary

`IntelBrandedLoading` is a simple, purpose-built loading screen component. The tests are solid. The main issues are: semantic incorrect use of `role="progressbar"` on an `<img>` (ARIA role conflict), a `UNSAFE_className` test anti-pattern, and the image asset being `192px` hardcoded in an otherwise flexible component.

---

## 1. Code Quality & Type Safety

### 🟡 Warnings

| #   | Issue                                                                                                                                                                                                                                                                                                                                                   | Location                                                        |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------- |
| W1  | **`width="192px"` and `height="192px"` are hardcoded strings on `<img>`.** The component accepts a `height` prop for the container but the image size is fixed. If the container is smaller than 192×192, the image overflows. Consider using CSS `max-width: 100%; height: auto` via `UNSAFE_style` or making image size a prop.                       | `IntelBrandedLoading.tsx:26-27`                                 |
| W2  | **`UNSAFE_className="geti-intel-loading-container"`** is used only to enable the height test to query via `querySelector`. Per AGENTS.md conventions, `UNSAFE_className` should not be relied upon in tests. The test on line 39 uses `container.querySelector('.geti-intel-loading-container')` which violates the "no class selectors in tests" rule. | `IntelBrandedLoading.tsx:21`, `IntelBrandedLoading.test.tsx:39` |

---

## 2. Accessibility

### 🔴 Critical

| #   | Issue                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                | Location                        |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------- |
| A1  | **`role="progressbar"` on an `<img>` is a semantic conflict.** An `<img>` element has an implicit `role="img"`. Assigning `role="progressbar"` overrides this, but the element still has `alt` text (`"Loading"`) which is an `img`-specific attribute. A `progressbar` role should have `aria-label` (not `alt`), and optionally `aria-valuenow`/`aria-valuemin`/`aria-valuemax` (or none for indeterminate). The correct fix is either: use a `<div role="progressbar" aria-label="Loading">` with the image as decorative inside it, OR keep the `<img>` with `role="img" alt="Loading"` and add a separate `<span role="progressbar" aria-label="Loading" aria-valuetext="Loading in progress">`. ✅ **Partially resolved:** `role="progressbar"` removed; component now uses `role="img"` with `aria-label` on the `<img>` — cleaner than the original but does not add a `progressbar` role. The full recommendation (wrapper `div` with `role="status"`) was not implemented. | `IntelBrandedLoading.tsx:22-28` |

### 🟡 Warnings

| #   | Issue                                                                                                                                                                                             | Location                        |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------- |
| A2  | **No `aria-live` region.** Full-page loading screens typically benefit from an `aria-live="assertive"` or `aria-live="polite"` region to announce to screen reader users that content is loading. | `IntelBrandedLoading.tsx`       |
| A3  | **`IntelBrandedLoading` has no `aria-label` or accessible name on the container.** The `Flex` container with `role` implied by its children has no label for the overall loading state.           | `IntelBrandedLoading.tsx:15-29` |

---

## 3. Documentation

### 🟡 Warnings

| #   | Issue                                                                                                                                                                               | Location                              |
| --- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------- |
| D1  | **Storybook title is `'Components/IntelBrandedLoading'`** — should be `'Advanced/IntelBrandedLoading'` to match the other components in Group 10.                                   | `IntelBrandedLoading.stories.tsx:5`   |
| D2  | **No `argTypes`** for the `height` prop control in stories — it defaults to a text control which is fine, but a range slider or specific preset options would improve the story UX. | `IntelBrandedLoading.stories.tsx:4-8` |

---

## 4. Tests

### ✅ Positive

- Three tests covering role, alt text, image source pattern, and height application.
- `toMatch(/intel-loading.*\.webp/)` is a good pattern for hashed asset filenames.

### 🟡 Warnings

| #   | Issue                                                                                                                                                                                                                                                     | Location                            |
| --- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------- |
| T1  | **Test uses `container.querySelector('.geti-intel-loading-container')`** which is a class-selector query — explicitly prohibited by AGENTS.md conventions ("Never use `UNSAFE_className` in tests"). Fix: use a `data-testid` attribute or query by role. | `IntelBrandedLoading.test.tsx:39`   |
| T2  | **`progressbar` role test passes despite the semantic conflict** — the test verifies the role exists, but the semantics are wrong (see A1). Once the semantic issue is fixed, the test should be updated to match the corrected structure.                | `IntelBrandedLoading.test.tsx:8-18` |

---

## Specific Fixes Required

1. **Fix `role="progressbar"` semantic conflict.** Recommended approach: wrap in a `<div role="status" aria-label="Loading">` container, render the `<img>` as `aria-hidden`, and add a visually-hidden `<span>Loading</span>` text for screen readers. ⏳ _Partially done: `role="progressbar"` removed, now uses `role="img"`. Full recommended wrapper structure not yet implemented._
2. **Remove `UNSAFE_className` and the class-selector test.** Replace with `data-testid` or a role-based query. ⏳ _Still open — `UNSAFE_className="geti-intel-loading-container"` remains in component and test still uses `.querySelector`._
3. **Fix Storybook title** to `'Advanced/IntelBrandedLoading'`. ⏳ _Not verified — needs review._
4. **Make image size responsive**: add `UNSAFE_style={{ maxWidth: '100%', height: 'auto' }}` or equivalent. ⏳ _Still open — image is still hardcoded `192px`._
