# Meter — Peer Review

**File:** `packages/ui/src/components/Meter/Meter.tsx`  
**Group:** 5 — Feedback & Status  
**Reviewer:** Oracle

---

## Summary

A minimal, clean passthrough wrapper over `SpectrumMeter`. No custom logic or styling. Good stories with all variant coverage. Tests are structurally sound but lack meaningful ARIA attribute assertions.

---

## 1. Code Quality & Type Safety

| #   | Severity | Finding                                                                                                                                             |
| --- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | 🟡 Low   | Empty interface extension (`MeterProps extends SpectrumMeterProps {}`) — same as ProgressBar/ProgressCircle pattern. Functional but slightly noisy. |
| 2   | ✅ —     | Full prop passthrough with spread. No `any`. Correct pattern.                                                                                       |

---

## 2. Accessibility

| #   | Severity | Finding                                                                                                                                                                                                                        |
| --- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | ✅ —     | `SpectrumMeter` renders `role="meter"` with `aria-valuenow`, `aria-valuemin`, `aria-valuemax`, and `aria-valuetext`. Fully delegated.                                                                                          |
| 2   | 🟡 Low   | The `Default` story uses `label: 'Storage space'` but no `aria-label`. The Spectrum `Meter` will derive its accessible name from the visible `label` prop — this is correct. But it is not documented in the JSDoc or stories. |
| 3   | 🟡 Low   | No story or test demonstrates a **no-label** scenario with `aria-label` fallback (unlike ProgressBar's `NoLabel` story).                                                                                                       |

---

## 3. Documentation

| #   | Severity | Finding                                                                                                                                                                       |
| --- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | ✅ —     | Component JSDoc accurately describes purpose and threshold indicator concept.                                                                                                 |
| 2   | ✅ —     | Stories cover all four semantic variants (`informative`, `positive`, `warning`, `critical`) plus `CustomValueLabel`. `argTypes` for `variant` and `value` with range control. |
| 3   | 🟡 Low   | Missing a `NoLabel` story (analogous to ProgressBar) showing `aria-label` fallback.                                                                                           |

---

## 4. Tests

| #   | Severity  | Finding                                                                                                                                                                                                                                         |
| --- | --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | 🔴 Medium | **Duplicate tests**: `'renders without crash'` and `'renders with role=meter'` are identical. Remove one.                                                                                                                                       |
| 2   | 🟡 Low    | `'renders positive variant'` and `'renders critical variant'` only assert the element is present — no visual or ARIA difference is tested. These tests provide zero discrimination. Should assert `aria-valuenow` or that the label is present. |
| 3   | 🟡 Low    | No test for `aria-valuemin` / `aria-valuemax` via custom `minValue`/`maxValue`.                                                                                                                                                                 |
| 4   | 🟡 Low    | No test for `valueLabel` prop — i.e., the custom label is visible in the DOM.                                                                                                                                                                   |

---

## Specific Fixes Required

```tsx
// 1. Remove duplicate. Keep:
it('renders with role meter', () => {
    renderMeter();
    expect(screen.getByRole('meter')).toBeInTheDocument();
});

// 2. Add meaningful variant tests:
it('renders positive variant with correct aria-valuenow', () => {
    renderMeter({ variant: 'positive', value: 80 });
    expect(screen.getByRole('meter')).toHaveAttribute('aria-valuenow', '80');
});

// 3. Custom valueLabel is visible:
it('displays custom value label', () => {
    renderMeter({ value: 7, maxValue: 10, valueLabel: '7 of 10' });
    expect(screen.getByText('7 of 10')).toBeInTheDocument();
});
```

---

## Overall Rating: 🟢 Good

Clean wrapper. Duplicate test fix and deeper assertions needed.
