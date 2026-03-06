# Review: Slider

**File:** `packages/ui/src/components/Slider/Slider.tsx`
**Reviewed:** 2026-03-06

---

## Summary

Slider has the same structure as Switch — custom token injection via `UNSAFE_style` when `isFilled` is true. Same convention violation as Switch. Tests are notably thin: no `onChange` test, no value assertion, no interaction with keyboard.

---

## 1. Code Quality, Type Safety & Styling

| #   | Severity      | Finding                                                                                                                                                                                                                                                                                                                                                                                                            |
| --- | ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1.1 | 🔴 Convention | **Uses `UNSAFE_style`** — same violation as Switch. Replace with `UNSAFE_className` + CSS module.                                                                                                                                                                                                                                                                                                                  |
| 1.2 | 🟡 Low        | The four overridden token names (`--spectrum-slider-fill-track-color`, `--spectrum-slider-handle-border-color`, `--spectrum-slider-handle-border-color-down`, `--spectrum-slider-handle-border-color-hover`) cover hover and down states but **miss focus-visible** — the keyboard focus ring on the handle will remain Spectrum's default accent colour, creating a visual inconsistency when `isFilled` is used. |
| 1.3 | 🟡 Low        | Same `UNSAFE_style` merge order / consumer-shadowing issue as Switch.                                                                                                                                                                                                                                                                                                                                              |
| 1.4 | 🟢 Good       | Token names correctly target Spectrum's slider component tokens.                                                                                                                                                                                                                                                                                                                                                   |

---

## 2. Accessibility

| #   | Severity   | Finding                                                                                                                                                              |
| --- | ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 2.1 | 🟢 Good    | Spectrum renders `role="slider"` with `aria-valuemin`, `aria-valuemax`, `aria-valuenow`, and `aria-valuetext` for formatted values.                                  |
| 2.2 | 🔴 Missing | **No keyboard test** — left/right/home/end arrow keys are the primary input mechanism for sliders. This is the most important a11y test missing in the entire group. |

---

## 3. Documentation (Storybook)

| #   | Severity | Finding                                                               |
| --- | -------- | --------------------------------------------------------------------- |
| 3.1 | 🟡 Low   | No story for `getValueLabel` (custom value formatting).               |
| 3.2 | 🟡 Low   | No story for `orientation: 'vertical'`.                               |
| 3.3 | 🟢 Good  | `Default`, `Filled`, `WithRange`, `Disabled` — covers the main cases. |

---

## 4. Tests

| #   | Severity   | Finding                                                                                         |
| --- | ---------- | ----------------------------------------------------------------------------------------------- |
| 4.1 | 🔴 Missing | **No `onChange` test** — dragging or using arrow keys should fire `onChange` with a number.     |
| 4.2 | 🔴 Missing | **No keyboard interaction test** — `ArrowRight` should increment by `step`.                     |
| 4.3 | 🟡 Low     | `accepts isFilled prop without error` only confirms render — no assertion on style application. |
| 4.4 | 🟢 Good    | `isDisabled` test is present.                                                                   |

---

## Fixes Needed

1. **Replace `UNSAFE_style` with `UNSAFE_className` + CSS module** (same fix as Switch). _(High — AGENTS.md convention)_
2. **Add missing focus-visible token** (`--spectrum-slider-handle-border-color-key-focus`) to the `isFilled` token set. _(Medium — visual consistency)_
3. **Add `onChange` test** with keyboard arrow key. _(High — core interaction)_
4. **Add keyboard navigation test** (`ArrowRight` increments value). _(High — a11y)_
5. **Add `orientation: 'vertical'` story.** _(Low)_
