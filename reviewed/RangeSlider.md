# Review: RangeSlider

**File:** `packages/ui/src/components/RangeSlider/RangeSlider.tsx`
**Reviewed:** 2026-03-06

---

## Summary

RangeSlider is a thin pass-through — the cleanest of the slider pair. No custom token injection, no styling. Tests correctly verify the two-thumb structure. Main gaps mirror Slider: no interaction tests.

---

## 1. Code Quality, Type Safety & Styling

| #   | Severity | Finding                                                                                                                                                                                                                                             |
| --- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1.1 | 🟡 Low   | Empty `interface` extension — same pattern.                                                                                                                                                                                                         |
| 1.2 | 🟡 Low   | Unlike `Slider`, RangeSlider has no `isFilled` equivalent — the filled track between the two thumbs is Spectrum's default behaviour. Consider documenting whether energy-blue token overrides should be added for design consistency with `Slider`. |
| 1.3 | 🟢 Good  | No `UNSAFE_style` usage — correctly avoids the Switch/Slider anti-pattern.                                                                                                                                                                          |

---

## 2. Accessibility

| #   | Severity   | Finding                                                                                                                                                            |
| --- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 2.1 | 🟢 Good    | Spectrum renders two `role="slider"` elements with correct `aria-valuemin`, `aria-valuemax`, `aria-valuenow`. The group has `role="group"` with `aria-labelledby`. |
| 2.2 | 🔴 Missing | No keyboard test. The start thumb and end thumb are both independently keyboard-controllable — this should be verified.                                            |
| 2.3 | 🟡 Low     | No test that `start` thumb cannot exceed `end` thumb value (boundary enforcement).                                                                                 |

---

## 3. Documentation (Storybook)

| #   | Severity | Finding                                                                 |
| --- | -------- | ----------------------------------------------------------------------- |
| 3.1 | 🟡 Low   | No story with `getValueLabel` for custom display (e.g., `"$20 – $80"`). |
| 3.2 | 🟡 Low   | No story with `formatOptions` for currency/percentage display.          |
| 3.3 | 🟢 Good  | `Default`, `WithMinMax`, `WithStep`, `Disabled` — appropriate spread.   |

---

## 4. Tests

| #   | Severity   | Finding                                                                                                                     |
| --- | ---------- | --------------------------------------------------------------------------------------------------------------------------- |
| 4.1 | 🔴 Missing | No `onChange` test — changing either thumb should fire `onChange` with a `{ start, end }` object.                           |
| 4.2 | 🔴 Missing | No keyboard test for either thumb.                                                                                          |
| 4.3 | 🟡 Low     | `renders two slider thumbs` correctly asserts length 2. No check of initial `aria-valuenow` values matching `defaultValue`. |
| 4.4 | 🟢 Good    | Disabled test iterates both thumbs — correct.                                                                               |

---

## Fixes Needed

1. **Add `onChange` test** — keyboard-move a thumb, verify callback receives `{ start: number, end: number }`. _(High — core interaction)_
2. **Add keyboard test** for both thumbs. _(High — a11y)_
3. **Add boundary enforcement test** (start ≤ end). _(Medium — correctness)_
4. **Decide on energy-blue token parity** with Slider and document the decision. _(Low)_
5. **Add `getValueLabel` story.** _(Low)_
