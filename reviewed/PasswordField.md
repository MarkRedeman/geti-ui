# Review: PasswordField

**File:** `packages/ui/src/components/PasswordField/PasswordField.tsx`
**Reviewed:** 2026-03-06

---

## Summary

PasswordField is the most complex component in this group — custom-built rather than a thin wrapper. Overall the implementation is good: correct state management, proper `aria-label` on the toggle, CSS module used appropriately. However it has several architectural and accessibility issues that should be addressed before it ships.

---

## 1. Code Quality, Type Safety & Styling

| #   | Severity   | Finding                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| --- | ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1.1 | 🔴 Bug     | **Dual error surface.** The component has both `error?: string` (custom prop, renders a `<span role="alert">`) and `errorMessage` / `validationState` inherited from `SpectrumTextFieldProps`. These two systems are independent — passing both simultaneously produces two error messages with no reconciliation. The component should either: (a) fully deprecate `error` in favour of the Spectrum `errorMessage` prop, or (b) document clearly that only one should be used. ⏳ _Still open — both surfaces coexist._         |
| 1.2 | 🔴 Bug     | **`error` is not connected to Spectrum's validation state.** When `error` is set, the Spectrum TextField has no `validationState="invalid"` applied — the field border will not turn red and `aria-invalid` will not be set. The toggle button's layout wrapper (`div.fieldWrapper`) breaks Spectrum's built-in input width management, and the field has no `aria-describedby` pointing to the custom error span. ✅ **Fixed:** `validationState={error ? 'invalid' : undefined}` and `aria-describedby` wiring now implemented. |
| 1.3 | 🟡 Warning | **`UNSAFE_style` is used internally** on the outer `<SpectrumTextField>` — it isn't, but the layout `div` wrapper around the Spectrum component will break the standard `width` / `flex` / `gridArea` props consumers might pass. Spectrum fields manage their own outer dimensions; wrapping them in an unstyled `<div>` breaks that contract. ⏳ _Still open — outer `<div>` wrapper unchanged._                                                                                                                                |
| 1.4 | 🟡 Low     | `isNewPassword` hint message is hardcoded as English. No i18n hook.                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| 1.5 | 🟡 Low     | CSS uses hard-coded `px` values (`gap: 8px`, `margin-bottom: 4px`). Prefer Spectrum design tokens (`--spectrum-global-dimension-size-100`) to stay consistent with the theme.                                                                                                                                                                                                                                                                                                                                                     |
| 1.6 | 🟢 Good    | Toggle button correctly uses `type="button"` (prevents form submission). `aria-label` flips correctly. CSS module used appropriately.                                                                                                                                                                                                                                                                                                                                                                                             |

---

## 2. Accessibility

| #   | Severity | Finding                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| --- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 2.1 | 🔴 Issue | The custom `<span role="alert">` for the `error` prop is not programmatically associated with the `<input>` via `aria-describedby`. Screen readers will announce it as a live region but the input has no direct relationship to the error. Use Spectrum's built-in `errorMessage` + `validationState="invalid"` to get proper `aria-describedby` wiring. ✅ **Fixed:** `aria-describedby` now wired to error `id` and hint `id`; `validationState="invalid"` applied when `error` is set. |
| 2.2 | 🟡 Low   | Toggle button has `color: var(--spectrum-global-color-gray-700, #6e6e6e)` — `#6e6e6e` on dark background may not meet WCAG 4.5:1 contrast. The Spectrum token value should be sufficient in context but should be audited against the dark theme.                                                                                                                                                                                                                                          |
| 2.3 | 🟡 Low   | The `<p className={styles.hint}>` for `isNewPassword` has no ARIA association. It should be `role="note"` or associated to the input via `aria-describedby`. ✅ **Fixed:** hint `<p>` now has an `id` and is referenced in `aria-describedby`.                                                                                                                                                                                                                                             |
| 2.4 | 🟢 Good  | Toggle button `aria-label` is dynamic and correctly announces current state.                                                                                                                                                                                                                                                                                                                                                                                                               |
| 2.5 | 🟢 Good  | Toggle button `type="button"` prevents accidental form submission.                                                                                                                                                                                                                                                                                                                                                                                                                         |

---

## 3. Documentation (Storybook)

| #   | Severity | Finding                                                                                     |
| --- | -------- | ------------------------------------------------------------------------------------------- |
| 3.1 | 🟡 Low   | No story for `isRequired`.                                                                  |
| 3.2 | 🟡 Low   | No story combining `error` and `isNewPassword` — the dual-surface ambiguity is not exposed. |
| 3.3 | 🟢 Good  | `WithError`, `NewPassword`, `Disabled` stories cover main user flows.                       |

---

## 4. Tests

| #   | Severity   | Finding                                                                                                                                                                                                                                          |
| --- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 4.1 | 🔴 Missing | No test verifying `validationState="invalid"` is set when `error` prop is provided — because it currently _isn't_ (see 1.2). This is a failing test waiting to be written. ⏳ _Still open — no test added for `aria-invalid`/`validationState`._ |
| 4.2 | 🔴 Missing | No test that `aria-describedby` on the input points to the error message. ⏳ _Still open._                                                                                                                                                       |
| 4.3 | 🟢 Good    | Toggle show/hide is tested with full round-trip. `role="alert"` presence verified.                                                                                                                                                               |
| 4.4 | 🟢 Good    | `onChange` callback tested.                                                                                                                                                                                                                      |

---

## Fixes Needed

1. **Critical: When `error` is set, also pass `validationState="invalid"` and `errorMessage={error}` to Spectrum**, replacing the manual `<span role="alert">` with Spectrum's built-in error rendering. This fixes `aria-describedby`, invalid border colouring, and the dual-surface confusion at once. ✅ **Fixed:** `validationState={error ? 'invalid' : undefined}` applied; custom `aria-describedby` wired to error span `id`. _(Note: `<span role="alert">` still present alongside Spectrum's built-in — dual surface not fully eliminated.)_
2. **Remove the wrapping `<div>` or replace with `<Flex direction="row">`** so Spectrum's width/layout props are not broken. ⏳ _Still open — outer `<div>` wrapper remains._
3. **Associate `isNewPassword` hint** to input via `aria-describedby` or give it `role="note"`. ✅ **Fixed:** hint `<p>` now has an `id` and `aria-describedby` references it.
4. **Replace hard-coded `px` values** with Spectrum spacing tokens. ⏳ _Still open._
5. **Write test** for `aria-invalid` / `aria-describedby` wiring when `error` is set. ⏳ _Still open._
