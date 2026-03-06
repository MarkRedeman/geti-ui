# Well — Peer Review

**File:** `packages/ui/src/components/Well/Well.tsx`  
**Reviewer:** Oracle  
**Date:** 2026-03-06  
**Status:** ✅ Approved

---

## Summary

Clean, minimal Spectrum wrapper. Stories and tests are well-considered and specifically cover the accessibility `role="region"` use case. No significant issues.

---

## 1. Code Quality & Type Safety

| #   | Severity | Finding                                                                                   |
| --- | -------- | ----------------------------------------------------------------------------------------- |
| 1.1 | 🟡 Low   | `WellProps extends SpectrumWellProps {}` — empty interface extension, consistent pattern. |
| 1.2 | ✅       | Copyright header present.                                                                 |
| 1.3 | ✅       | Props fully spread.                                                                       |
| 1.4 | ✅       | No `any` types.                                                                           |

---

## 2. Accessibility

| #   | Severity | Finding                                                                                                                                                                                                                                                                                                                           |
| --- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 2.1 | ✅       | Spectrum's `Well` renders as a generic `<div>` by default — correct for non-semantic content containers.                                                                                                                                                                                                                          |
| 2.2 | ✅       | The `role="region"` use case is correctly documented in the `WithRegionRole` story and tested.                                                                                                                                                                                                                                    |
| 2.3 | 🟡 Low   | When `role="region"` is used, an `aria-label` is required by WCAG 2.1 (SC 1.3.6 and 4.1.2) to give the region a meaningful name. The `WithRegionRole` story does supply `aria-label='Notes section'`, which is good — but neither the component JSDoc nor the props type explicitly documents this requirement. Add a JSDoc note. |

**Suggested JSDoc addition:**

```ts
/**
 * A content container that wraps Adobe React Spectrum's Well.
 * ...
 * @note When `role="region"` is set, always provide `aria-label` to
 *       name the landmark region (WCAG 2.1, SC 4.1.2).
 */
```

---

## 3. Documentation (JSDoc / Storybook)

| #   | Severity | Finding                                                                             |
| --- | -------- | ----------------------------------------------------------------------------------- |
| 3.1 | ✅       | JSDoc on component and props.                                                       |
| 3.2 | ✅       | `title: 'Components/Well'`.                                                         |
| 3.3 | ✅       | Three stories: Default, CodeExample, WithRegionRole — excellent practical coverage. |
| 3.4 | ✅       | `parameters.a11y: {}` present.                                                      |

---

## 4. Tests

| #   | Severity | Finding                                                                                                                                                            |
| --- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 4.1 | ✅       | Renders without crash.                                                                                                                                             |
| 4.2 | ✅       | Children render.                                                                                                                                                   |
| 4.3 | ✅       | `role="region"` with `aria-label` is correctly tested.                                                                                                             |
| 4.4 | ✅       | Multiline / pre-formatted content test.                                                                                                                            |
| 4.5 | 🟡 Low   | No test ensuring that a plain `Well` (without explicit `role`) does **not** expose a landmark role, preventing unintended navigation landmarks in complex layouts. |

---

## Action Items

- [ ] Add JSDoc note that `aria-label` is required when `role="region"` is set (`Low`).
- [ ] Add test asserting default Well has no unexpected landmark role (`Low`).
