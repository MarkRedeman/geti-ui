# ProgressBar — Peer Review

**File:** `packages/ui/src/components/ProgressBar/ProgressBar.tsx`  
**Group:** 5 — Feedback & Status  
**Reviewer:** Oracle

---

## Summary

A minimal, clean passthrough wrapper over `SpectrumProgressBar`. No custom logic, no CSS overrides. The implementation is correct; issues are primarily in test quality (duplicate test) and minor story completeness.

---

## 1. Code Quality & Type Safety

| #   | Severity | Finding                                                                                                                                                                                                                                                                                                         |
| --- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | 🟡 Low   | `export interface ProgressBarProps extends SpectrumProgressBarProps {}` — empty interface extension is idiomatic here but adds a layer of indirection without value. Prefer `export type ProgressBarProps = SpectrumProgressBarProps` if no future extension is planned, but keep if extensibility is the goal. |
| 2   | ✅ —     | Props fully passed through with spread. No `any`. No inline styles. Pattern is correct.                                                                                                                                                                                                                         |
| 3   | ✅ —     | No `UNSAFE_className` or `UNSAFE_style` usage; appropriate since this is a pure delegate.                                                                                                                                                                                                                       |

---

## 2. Accessibility

| #   | Severity | Finding                                                                                                                                                                  |
| --- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | ✅ —     | Delegates entirely to `SpectrumProgressBar` which has well-tested a11y (ARIA progressbar role, `aria-valuenow`, `aria-valuemin`, `aria-valuemax`, `aria-valuetext`).     |
| 2   | ✅ —     | `NoLabel` story correctly demonstrates `aria-label` as fallback when no visual label is present.                                                                         |
| 3   | 🟡 Low   | No story or test verifies that **indeterminate** state correctly omits `aria-valuenow` (ARIA spec requirement). Spectrum handles it, but it should be documented/tested. |

---

## 3. Documentation

| #   | Severity | Finding                                                                                                                                                                                        |
| --- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | ✅ —     | JSDoc on component and interface are clear and accurate.                                                                                                                                       |
| 2   | ✅ —     | Stories cover determinate, indeterminate, no-label, and custom value label cases. `argTypes` are well-defined.                                                                                 |
| 3   | 🟡 Low   | Stories use `parameters.a11y: {}` (empty object). This enables the a11y addon but provides no custom config. If there are known violations to suppress, document them. Otherwise this is fine. |

---

## 4. Tests

| #   | Severity  | Finding                                                                                                                                                                                           |
| --- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | 🔴 Medium | **Duplicate test**: `'renders without crash'` and `'renders with role=progressbar'` are identical — both simply call `getByRole('progressbar')`. One should be removed.                           |
| 2   | 🟡 Low    | `'renders as indeterminate'` only asserts the element is in the document. It should additionally assert `aria-valuenow` is **absent** when `isIndeterminate: true` to validate the ARIA contract. |
| 3   | 🟡 Low    | `'renders with custom min/max values'` only asserts existence. Should assert `aria-valuemin` / `aria-valuemax` are set to the expected values.                                                    |
| 4   | ✅ —      | `renderProgressBar` helper with `Provider` wrapper is correct pattern.                                                                                                                            |

---

## Specific Fixes Required

```tsx
// 1. Remove duplicate test — keep only one:
it('renders with role progressbar', () => {
    renderProgressBar();
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
});

// 2. Strengthen indeterminate assertion:
it('renders as indeterminate without aria-valuenow', () => {
    renderProgressBar({ isIndeterminate: true });
    const el = screen.getByRole('progressbar');
    expect(el).not.toHaveAttribute('aria-valuenow');
});

// 3. Strengthen min/max assertion:
it('renders with custom min/max reflected in ARIA', () => {
    renderProgressBar({ value: 5, minValue: 0, maxValue: 10 });
    const el = screen.getByRole('progressbar');
    expect(el).toHaveAttribute('aria-valuemin', '0');
    expect(el).toHaveAttribute('aria-valuemax', '10');
    expect(el).toHaveAttribute('aria-valuenow', '5');
});
```

---

## Overall Rating: 🟢 Good

Solid thin wrapper. Fix the duplicate test and strengthen the indeterminate/min-max assertions.
