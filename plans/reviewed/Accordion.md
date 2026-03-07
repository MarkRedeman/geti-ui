# Accordion — Peer Review

**File:** `packages/ui/src/components/Accordion/Accordion.tsx`  
**Reviewer:** Oracle  
**Date:** 2026-03-06  
**Status:** 🟠 Needs fixes

---

## Summary

The component implementation itself is clean. However, both the Storybook stories and the tests import `Disclosure`, `DisclosurePanel`, and `DisclosureTitle` **directly from `@adobe/react-spectrum`** rather than from the library's own `Disclosure` component. This is a systemic consistency violation — if the library's `Disclosure` wrapper ever adds Geti-specific behaviour (theming, accessibility overrides), the stories and tests would silently bypass it.

---

## 1. Code Quality & Type Safety

| #   | Severity | Finding                                                                                |
| --- | -------- | -------------------------------------------------------------------------------------- |
| 1.1 | ✅       | `AccordionProps extends SpectrumAccordionProps {}` — consistent pattern.               |
| 1.2 | ✅       | Copyright header present.                                                              |
| 1.3 | ✅       | Props fully spread through.                                                            |
| 1.4 | ✅       | No `any` types.                                                                        |
| 1.5 | 🟡 Low   | `AccordionProps` is an empty interface — same minor pattern concern as other wrappers. |

---

## 2. Accessibility

| #   | Severity | Finding                                                                                                       |
| --- | -------- | ------------------------------------------------------------------------------------------------------------- |
| 2.1 | ✅       | Spectrum's `Accordion` renders as a `<div>` containing `Disclosure` children with correct `button` semantics. |
| 2.2 | ✅       | `allowsMultipleExpanded` prop is correctly passed through.                                                    |

No accessibility issues in the component itself.

---

## 3. Documentation (JSDoc / Storybook)

| #   | Severity   | Finding                                                                                                                                                                         |
| --- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 3.1 | ✅         | JSDoc on component and props.                                                                                                                                                   |
| 3.2 | ✅         | Three stories: Default, MultipleExpanded, Quiet — covers primary behaviour.                                                                                                     |
| 3.3 | ✅         | `parameters.a11y: {}` present.                                                                                                                                                  |
| 3.4 | 🔴 **Bug** | Stories import `Disclosure`, `DisclosurePanel`, `DisclosureTitle` from `'@adobe/react-spectrum'` — should import from `'../Disclosure/Disclosure'` (the library's own wrapper). |

**Fix (3.4):**

```ts
// In Accordion.stories.tsx — CHANGE:
import { Disclosure, DisclosurePanel, DisclosureTitle } from '@adobe/react-spectrum';
// TO:
import { Disclosure, DisclosurePanel, DisclosureTitle } from '../Disclosure/Disclosure';
```

---

## 4. Tests

| #   | Severity   | Finding                                                                                                                                           |
| --- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| 4.1 | ✅         | Renders section titles.                                                                                                                           |
| 4.2 | ✅         | Expands a section on click.                                                                                                                       |
| 4.3 | ✅         | `allowsMultipleExpanded` opens both panels simultaneously.                                                                                        |
| 4.4 | 🔴 **Bug** | Test file imports `Disclosure`, `DisclosurePanel`, `DisclosureTitle` from `'@adobe/react-spectrum'` — must import from the local wrapper instead. |

**Fix (4.4):**

```ts
// In Accordion.test.tsx — CHANGE:
import { Disclosure, DisclosurePanel, DisclosureTitle, Provider, defaultTheme } from '@adobe/react-spectrum';
// TO:
import { Provider, defaultTheme } from '@adobe/react-spectrum';
import { Disclosure, DisclosurePanel, DisclosureTitle } from '../Disclosure/Disclosure';
```

| 4.5 | 🔴 Missing | No test for `isQuiet` variant. |
| 4.6 | 🔴 Missing | No test for exclusive expand (default `allowsMultipleExpanded=false` — opening Section Two should close Section One). |

**Suggested test:**

```ts
it('collapses other sections by default (exclusive expand)', async () => {
    renderAccordion();
    await userEvent.click(screen.getByRole('button', { name: 'Section One' }));
    await userEvent.click(screen.getByRole('button', { name: 'Section Two' }));
    expect(screen.queryByText('Content One')).not.toBeVisible();
    expect(screen.getByText('Content Two')).toBeVisible();
});
```

---

## Action Items

- [ ] **Fix**: `Accordion.stories.tsx` — import `Disclosure` sub-components from local wrapper, not `@adobe/react-spectrum` (`High`).
- [ ] **Fix**: `Accordion.test.tsx` — same import fix (`High`).
- [ ] Add exclusive-expand behaviour test (`Medium`).
- [ ] Add `isQuiet` test (`Low`).
