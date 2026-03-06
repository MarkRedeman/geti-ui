# Badge — Peer Review

**File:** `packages/ui/src/components/Badge/Badge.tsx`  
**Group:** 5 — Feedback & Status  
**Reviewer:** Oracle

---

## Summary

A minimal passthrough wrapper over `SpectrumBadge`. Good story coverage including icon-only and icon+label variants. Tests are shallow (text-presence only). The `IconOnly` story correctly adds `aria-label`, but this is not enforced or tested.

---

## 1. Code Quality & Type Safety

| #   | Severity | Finding                                                                                                                                                                                                                                                                                 |
| --- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | 🟡 Low   | Empty interface extension (same as other wrappers).                                                                                                                                                                                                                                     |
| 2   | ✅ —     | Full prop passthrough. No `any`. Correct.                                                                                                                                                                                                                                               |
| 3   | 🟡 Low   | The `variant` control in `argTypes` lists 10 options. Spectrum Badge actually supports more (`'seafoam'`, `'chartreuse'`, `'celery'`, `'red'`, `'orange'`, `'fuchsia'`, `'purple'`) — verify the list is exhaustive against the current Spectrum version to avoid misleading consumers. |

---

## 2. Accessibility

| #   | Severity | Finding                                                                                                                                                                                                                                           |
| --- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | ✅ —     | `SpectrumBadge` renders as a `<span>` with no interactive semantics — correct for decorative metadata.                                                                                                                                            |
| 2   | 🔴 High  | **`IconOnly` story provides `aria-label` but no test verifies it.** An icon-only badge without `aria-label` is completely invisible to screen readers. This is the most critical a11y gap — the prop must be tested and its necessity documented. |
| 3   | 🟡 Low   | No JSDoc note that when `children` is icon-only, `aria-label` is **required** for accessibility.                                                                                                                                                  |

---

## 3. Documentation

| #   | Severity | Finding                                                                                                                                                                                            |
| --- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | ✅ —     | Component JSDoc is accurate.                                                                                                                                                                       |
| 2   | ✅ —     | Stories cover neutral, info, positive, negative, icon+label, icon-only. `argTypes` with select control.                                                                                            |
| 3   | 🟡 Low   | `IconOnly` story uses a `Checkmark` icon — this is semantically odd for an icon-only badge (normally something like an info icon or status icon would be used). This is a minor doc quality issue. |

---

## 4. Tests

| #   | Severity | Finding                                                                                                                                                                     |
| --- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | 🔴 High  | **No test for icon-only badge with `aria-label`.** The accessibility contract for icon-only badges is untested.                                                             |
| 2   | 🟡 Low   | All tests assert text content only. No test checks ARIA attributes or element structure.                                                                                    |
| 3   | 🟡 Low   | `renderBadge` helper sets `variant="neutral"` and `children="Label"` as defaults — correct, but no test checks that the `children` are rendered as-is (e.g., with an icon). |
| 4   | ✅ —     | Five tests covering render, label, and three variants — reasonable baseline.                                                                                                |

---

## Specific Fixes Required

```tsx
// 1. Test icon-only badge accessibility:
it('icon-only badge requires aria-label for accessibility', () => {
    render(
        <Provider theme={defaultTheme}>
            <Badge variant="info" aria-label="Information">
                <Checkmark />
            </Badge>
        </Provider>
    );
    // Badge content is not queryable by text, so aria-label is the only handle
    expect(screen.getByLabelText('Information')).toBeInTheDocument();
});

// 2. Document aria-label requirement in JSDoc:
/**
 * ...
 * @example
 * // Icon-only badge — aria-label is required
 * <Badge variant="info" aria-label="Informational badge">
 *   <InfoIcon />
 * </Badge>
 */
```

---

## Overall Rating: 🟡 Acceptable

Clean wrapper with good stories. Critical gap: icon-only badge accessibility is completely untested.
