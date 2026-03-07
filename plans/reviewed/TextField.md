# Review: TextField

**File:** `packages/ui/src/components/TextField/TextField.tsx`
**Reviewed:** 2026-03-06

---

## Summary

TextField is a minimal, correct pass-through wrapper. It does its job well. The main gaps are in test coverage and Storybook depth.

---

## 1. Code Quality, Type Safety & Styling

| #   | Severity | Finding                                                                                                                                                                                                                             |
| --- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1.1 | 🟡 Low   | `export interface TextFieldProps extends SpectrumTextFieldProps {}` — an empty `interface` extension adds no value. Use a `type` alias or add at least one Geti-specific prop; otherwise just re-export the Spectrum type directly. |
| 1.2 | 🟢 Info  | No custom styling needed for this component — it is correctly theme-inherited. CSS module not warranted.                                                                                                                            |
| 1.3 | 🟢 Good  | JSDoc on both the `interface` and the component. Concise and accurate.                                                                                                                                                              |

**No blocking issues.**

---

## 2. Accessibility

| #   | Severity | Finding                                                                                                                                                                                                 |
| --- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 2.1 | 🟢 Good  | Full delegation to Spectrum — label association, `aria-required`, `aria-describedby` (description/error), `aria-invalid`, and keyboard navigation are all handled by the upstream.                      |
| 2.2 | 🟡 Low   | Storybook `parameters.a11y: {}` is present but empty — consider adding `a11y: { config: { rules: [{ id: 'label', enabled: true }] } }` to enforce label-present rule explicitly in Storybook's axe run. |

---

## 3. Documentation (Storybook)

| #   | Severity | Finding                                                                                                                                                                              |
| --- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 3.1 | 🟡 Low   | Missing stories for: `isRequired` with visible asterisk interaction, `type` prop (email/url/tel — all valid for Spectrum TextField), and `width`/`maxWidth` layout props.            |
| 3.2 | 🟡 Low   | `validationState` is a deprecated Spectrum v3 prop — the v3 → v2 migration path uses the `isInvalid` boolean + `errorMessage`. Consider annotating this in a story comment or JSDoc. |
| 3.3 | 🟢 Good  | CSF3 format, argTypes well-configured, `Default` story present.                                                                                                                      |

---

## 4. Tests

| #   | Severity   | Finding                                                                                                                                                                                     |
| --- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 4.1 | 🔴 Missing | No test for `isRequired` — the input should have `aria-required="true"`.                                                                                                                    |
| 4.2 | 🔴 Missing | No test for `description` rendering (should be associated via `aria-describedby`).                                                                                                          |
| 4.3 | 🔴 Missing | No test that `onChange` receives the correct string value (current test only checks it was _called_, not the payload).                                                                      |
| 4.4 | 🟡 Low     | `rstest` is imported as a namespace (`rstest.fn()`) but `vi.fn()` or the rstest equivalent should be checked — ensure the import is consistent with the test runner setup across all files. |
| 4.5 | 🟢 Good    | Covers render, label, onChange, validation error, disabled, readOnly. Good baseline.                                                                                                        |

---

## Fixes Needed

1. **Replace empty interface with `type` alias** or add a Geti-specific prop placeholder comment. _(Low — style)_
2. **Add `aria-required` test.** _(Medium — accessibility coverage)_
3. **Add `description` / `aria-describedby` test.** _(Medium — accessibility coverage)_
4. **Assert `onChange` payload** (not just call count). _(Low)_
5. **Add `type` prop story** (email, url, tel). _(Low — docs)_
