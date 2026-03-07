# Review: TextArea

**File:** `packages/ui/src/components/TextArea/TextArea.tsx`
**Reviewed:** 2026-03-06

---

## Summary

TextArea mirrors TextField — minimal correct pass-through. Solid baseline but has the same gaps as TextField plus two additional TextArea-specific issues.

---

## 1. Code Quality, Type Safety & Styling

| #   | Severity | Finding                                                                                                                                                                                                                                            |
| --- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1.1 | 🟡 Low   | Same empty `interface` extension as TextField — no value added over a `type` alias.                                                                                                                                                                |
| 1.2 | 🟡 Low   | No `minRows`/`maxRows` Geti-specific prop — Spectrum v3 `TextArea` does not expose these natively, so if auto-resize is a common use case in Geti products, this would be the right place to add it. Consider noting this as a future enhancement. |
| 1.3 | 🟢 Good  | No CSS module needed; theme inheritance is sufficient.                                                                                                                                                                                             |

---

## 2. Accessibility

| #   | Severity | Finding                                                                                      |
| --- | -------- | -------------------------------------------------------------------------------------------- |
| 2.1 | 🟢 Good  | Label, `aria-required`, `aria-describedby`, `aria-invalid` fully delegated to Spectrum.      |
| 2.2 | 🟡 Low   | Storybook `parameters.a11y: {}` — same empty config as TextField (see TextField review 2.2). |

---

## 3. Documentation (Storybook)

| #   | Severity   | Finding                                                                                                                                  |
| --- | ---------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| 3.1 | 🔴 Missing | No story showing `errorMessage` / `validationState: 'invalid'` — TextField has this, TextArea does not. Inconsistency in story coverage. |
| 3.2 | 🟡 Low     | `isRequired` story missing.                                                                                                              |
| 3.3 | 🟢 Good    | CSF3 format, good spread of basic states.                                                                                                |

---

## 4. Tests

| #   | Severity   | Finding                                                                                             |
| --- | ---------- | --------------------------------------------------------------------------------------------------- |
| 4.1 | 🔴 Missing | No validation / error message test. TextField has `showsErrorMessage` test — TextArea should match. |
| 4.2 | 🔴 Missing | No `isRequired` / `aria-required` test.                                                             |
| 4.3 | 🟡 Low     | `onChange` tested for invocation only — no value assertion.                                         |
| 4.4 | 🟢 Good    | Covers render, label, onChange, disabled, readOnly.                                                 |

---

## Fixes Needed

1. **Add `WithError` story** to match TextField story set. _(Medium — doc parity)_
2. **Add `isRequired` story** with visible asterisk. _(Low)_
3. **Add error message test** — `validationState: 'invalid'` + `errorMessage`. _(Medium — coverage parity with TextField)_
4. **Add `aria-required` test.** _(Medium — a11y coverage)_
5. **Assert `onChange` payload.** _(Low)_
