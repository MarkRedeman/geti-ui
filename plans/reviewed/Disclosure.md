# Disclosure — Peer Review

**File:** `packages/ui/src/components/Disclosure/Disclosure.tsx`  
**Reviewer:** Oracle  
**Date:** 2026-03-06  
**Status:** ✅ Approved

---

## Summary

A well-structured, compositional wrapper around Spectrum's `Disclosure`. Exports sub-components and their types correctly. Tests cover interactive behaviour with `userEvent`. No significant issues.

---

## 1. Code Quality & Type Safety

| #   | Severity | Finding                                                                                                                                            |
| --- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1.1 | ✅       | `DisclosureProps extends SpectrumDisclosureProps {}` — consistent pattern (same empty-interface note as other wrappers, not repeated here).        |
| 1.2 | ✅       | Copyright header present.                                                                                                                          |
| 1.3 | ✅       | Sub-components (`DisclosurePanel`, `DisclosureTitle`) and their Prop types are cleanly re-exported via type aliases.                               |
| 1.4 | ✅       | Props fully spread through.                                                                                                                        |
| 1.5 | 🟡 Low   | No JSDoc on `DisclosurePanel` or `DisclosureTitle` — as re-exports they inherit Spectrum's docs, but a brief wrapper comment would help consumers. |

---

## 2. Accessibility

| #   | Severity | Finding                                                                                                                                    |
| --- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| 2.1 | ✅       | Spectrum's `Disclosure` renders `<button>` with `aria-expanded` and a controlled hidden panel — all handled upstream.                      |
| 2.2 | ✅       | Test verifies that panel content is `not.toBeVisible()` by default and `toBeVisible()` after click — covers the core accessible state.     |
| 2.3 | 🟡 Low   | No keyboard test for `Enter`/`Space` to toggle panel. Spectrum handles this natively, but an explicit test provides regression protection. |

**Suggested test:**

```ts
it('expands panel on Enter keypress', async () => {
    renderDisclosure();
    const button = screen.getByRole('button', { name: 'Section Title' });
    button.focus();
    await userEvent.keyboard('{Enter}');
    expect(screen.getByText('Panel Content')).toBeVisible();
});
```

---

## 3. Documentation (JSDoc / Storybook)

| #   | Severity | Finding                                                                                              |
| --- | -------- | ---------------------------------------------------------------------------------------------------- |
| 3.1 | ✅       | JSDoc on `Disclosure` component.                                                                     |
| 3.2 | ✅       | Four stories: Default, Expanded, Quiet, Disabled — excellent variant coverage.                       |
| 3.3 | ✅       | `argTypes` for `isQuiet`, `isExpanded`, `isDisabled`.                                                |
| 3.4 | ✅       | `parameters.a11y: {}` present.                                                                       |
| 3.5 | 🟡 Low   | No story showing `onExpandedChange` callback — useful for consumers building controlled disclosures. |

---

## 4. Tests

| #   | Severity     | Finding                                                                                                                               |
| --- | ------------ | ------------------------------------------------------------------------------------------------------------------------------------- |
| 4.1 | ✅           | Panel hidden by default.                                                                                                              |
| 4.2 | ✅           | Click expands panel.                                                                                                                  |
| 4.3 | ✅           | `isExpanded` prop renders open.                                                                                                       |
| 4.4 | 🟠 Duplicate | `'renders without crash'` and `'renders the title'` both assert `getByText('Section Title')`. They are identical — collapse into one. |
| 4.5 | 🔴 Missing   | No test for `isDisabled` — disabled disclosures should not expand.                                                                    |

**Suggested test:**

```ts
it('does not expand when disabled', async () => {
    renderDisclosure({ isDisabled: true });
    const button = screen.getByRole('button', { name: 'Section Title' });
    await userEvent.click(button);
    expect(screen.queryByText('Panel Content')).not.toBeVisible();
});
```

---

## Action Items

- [ ] Remove duplicate `'renders the title'` test (`Low`).
- [ ] Add `isDisabled` no-expand test (`Medium`).
- [ ] Add keyboard (`Enter`/`Space`) expand test (`Low`).
- [ ] Add `onExpandedChange` Storybook story (`Low`).
