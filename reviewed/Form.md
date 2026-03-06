# Review: Form

**File:** `packages/ui/src/components/Form/Form.tsx`
**Reviewed:** 2026-03-06

---

## Summary

Form is the simplest component in the entire review set — a one-liner pass-through with no custom logic. It is correct and its tests are actually the most thoughtful in the group (the `aria-label` in `renderForm` correctly triggers `role="form"`, explained via a comment). The main gaps are in Storybook coverage of real-world composition patterns.

---

## 1. Code Quality, Type Safety & Styling

| #   | Severity | Finding                                                                                                                                                                   |
| --- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1.1 | 🟡 Low   | Empty `interface` extension.                                                                                                                                              |
| 1.2 | 🟢 Good  | JSDoc accurately describes the propagation of `isDisabled` and `validationBehavior` to children — this is the primary value of the Form wrapper and it's well-documented. |
| 1.3 | 🟢 Good  | No custom styling needed.                                                                                                                                                 |

---

## 2. Accessibility

| #   | Severity | Finding                                                                                                                                                                                                 |
| --- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 2.1 | 🟢 Good  | Spectrum renders a `<form>` element. `role="form"` is only exposed when an accessible name is present (per ARIA spec) — the test correctly provides `aria-label="Contact form"`.                        |
| 2.2 | 🟡 Low   | No test or story showing `aria-label` or `aria-labelledby` guidance for consumers. Many forms in the wild are submitted without a name, which silently drops `role="form"` from the accessibility tree. |
| 2.3 | 🟡 Low   | No test for `onSubmit` handler — keyboard form submission (Enter in a text field) should trigger it.                                                                                                    |

---

## 3. Documentation (Storybook)

| #   | Severity   | Finding                                                                                                                                              |
| --- | ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| 3.1 | 🔴 Missing | No story showing validation error states on submit — this is the most important Form use case (field-level errors appearing after submit attempt).   |
| 3.2 | 🟡 Low     | `NativeValidation` story has `type="email"` on a TextField and `isRequired` but no `onSubmit` handler to see the validation in action. It is static. |
| 3.3 | 🟡 Low     | No story combining Form with the full set of form controls (TextField, Picker, Checkbox, etc.) — consumers lack a reference for form composition.    |
| 3.4 | 🟢 Good    | `Default`, `Disabled`, `NativeValidation` — covers the three main Form props.                                                                        |

---

## 4. Tests

| #   | Severity     | Finding                                                                                                                                                                                                                      |
| --- | ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 4.1 | 🔴 Missing   | No `onSubmit` test.                                                                                                                                                                                                          |
| 4.2 | 🟡 Low       | `disables all form controls when isDisabled` only tests TextField + Button — does not include Checkbox, Switch, etc. A broader test or a note clarifying that Spectrum propagates `isDisabled` via context would be helpful. |
| 4.3 | 🟢 Excellent | The comment explaining why `aria-label` is needed to expose `role="form"` is valuable — this is the kind of non-obvious implementation detail that helps future contributors.                                                |

---

## Fixes Needed

1. **Add `onSubmit` test** (fill required field, press Enter or click submit). _(High — core form behaviour)_
2. **Add `WithValidation` story** showing field-level errors appearing on submit attempt with `validationBehavior='aria'`. _(High — docs — most important Form use case)_
3. **Add `aria-label` guidance** to the Default story description or JSDoc for consumers. _(Medium — a11y)_
4. **Broaden `isDisabled` test** to include at least one non-TextField control. _(Low)_
