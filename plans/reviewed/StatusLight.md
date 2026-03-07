# StatusLight — Peer Review

**File:** `packages/ui/src/components/StatusLight/StatusLight.tsx`  
**Group:** 5 — Feedback & Status  
**Reviewer:** Oracle

---

## Summary

A clean passthrough wrapper over `SpectrumStatusLight`. Good story coverage across all semantic and color variants. The primary weakness is the complete absence of ARIA role testing — Spectrum's `StatusLight` renders with `role="img"` implicitly via its color dot, so tests should verify accessible name propagation.

---

## 1. Code Quality & Type Safety

| #   | Severity | Finding                                                                           |
| --- | -------- | --------------------------------------------------------------------------------- |
| 1   | 🟡 Low   | Empty interface extension — same pattern as other wrappers. No correctness issue. |
| 2   | ✅ —     | Clean passthrough. No `any`. Correct.                                             |

---

## 2. Accessibility

| #   | Severity  | Finding                                                                                                                                                                                                                                           |
| --- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | ✅ —      | `SpectrumStatusLight` requires `children` (the label text) as its primary accessible name and uses it as visible text. No `aria-label` fallback is needed for the labelled use case.                                                              |
| 2   | 🔴 Medium | **`isDisabled` state is tested in stories but not tests.** Spectrum renders disabled status lights with `aria-disabled="true"` — this is untested.                                                                                                |
| 3   | 🟡 Low    | The `Disabled` story correctly shows the state but neither the test file nor story has an assertion that `isDisabled` prevents interaction (though `StatusLight` is non-interactive, so this is low risk).                                        |
| 4   | 🟡 Low    | Non-semantic color variants (`celery`, `chartreuse`, `yellow`, `magenta`, `fuchsia`, `purple`, `indigo`, `seafoam`) are in `argTypes` options but have **no stories**. Users relying on these for data visualization have no Storybook reference. |

---

## 3. Documentation

| #   | Severity | Finding                                                                                                                                                                                                                                               |
| --- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | ✅ —     | JSDoc is accurate, noting semantic vs. color usage correctly.                                                                                                                                                                                         |
| 2   | 🟡 Low   | Stories cover semantic variants (neutral, positive, negative, notice, info, disabled) but **none of the decorative color variants** (`celery`, `yellow`, `magenta`, etc.). A `ColorSwatches` story showing all non-semantic colors would be valuable. |
| 3   | 🟡 Low   | No story for `isDisabled` variant that would show the visual difference. The `Disabled` story exists but is listed after `Info` — it should be last for logical flow.                                                                                 |

---

## 4. Tests

| #   | Severity  | Finding                                                                                                                                                                                                                                                                                           |
| --- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | 🔴 Medium | **Zero ARIA role assertions.** All tests only use `screen.getByText(...)`. `StatusLight` renders `role="img"` on the color indicator internally — nothing verifies this.                                                                                                                          |
| 2   | 🟠 Medium | `isDisabled` is in stories but **completely absent from tests**.                                                                                                                                                                                                                                  |
| 3   | 🟡 Low    | Tests check all semantic variants by text content, which is fine, but no test verifies the `variant` prop actually produces the expected output (e.g., different color class). Since this is a Spectrum delegate, this may be acceptable, but at minimum a snapshot test would catch regressions. |
| 4   | ✅ —      | `renderStatusLight` helper correctly handles `children` via `props.children ?? 'Active'` pattern.                                                                                                                                                                                                 |

---

## Specific Fixes Required

```tsx
// 1. Test isDisabled prop:
it('renders in disabled state', () => {
    renderStatusLight({ variant: 'positive', children: 'Disabled', isDisabled: true });
    // Spectrum applies aria-disabled to the parent element
    const el = screen.getByText('Disabled').closest('[aria-disabled]');
    expect(el).toHaveAttribute('aria-disabled', 'true');
});

// 2. Add a color swatch story for non-semantic variants:
export const ColorVariants: Story = {
    render: () => (
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            {(['celery', 'chartreuse', 'yellow', 'magenta', 'fuchsia', 'purple', 'indigo', 'seafoam'] as const).map(
                (v) => (
                    <StatusLight key={v} variant={v}>
                        {v}
                    </StatusLight>
                )
            )}
        </div>
    ),
};
```

---

## Overall Rating: 🟡 Acceptable

Good coverage of semantic variants. Needs `isDisabled` test, color variant stories, and at least one ARIA role assertion.
