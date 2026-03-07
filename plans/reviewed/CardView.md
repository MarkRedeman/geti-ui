# CardView — Peer Review

**File:** `packages/ui/src/components/CardView/CardView.tsx`  
**Reviewer:** Oracle  
**Date:** 2026-03-06  
**Status:** 🟠 Needs fixes

---

## Summary

`CardView` is a custom generic collection renderer. The structural logic is sound, but there are three significant issues: using `index` as React list `key`, the lack of responsive layout support, and the accessibility model for interactive cards needing `aria-selected` rather than `aria-pressed`. Tests are adequate but share the key issue in expectations.

---

## 1. Code Quality & Type Safety

| #   | Severity | Finding                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| --- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| 1.1 | 🔴 High  | `key={index}` is used for list items. When `items` is reordered, filtered, or spliced, React cannot correctly reconcile the DOM, leading to stale state, broken animations, and wrong key recycling. Items should be keyed by a stable identity. The current generic `<T = unknown>` type prevents enforcing this at the type level, but the `renderCard` callback should receive a `key` hint from the caller, or the generic should be constrained to `{ id: string | number }`. |
| 1.2 | 🟡 Low   | The layout uses raw CSS `style={{ display: 'grid', ... }}` — this bypasses Spectrum's style system and doesn't theme correctly. Prefer `Grid` from the library with Spectrum dimension values, or at minimum use `UNSAFE_className` + CSS module.                                                                                                                                                                                                                     |
| 1.3 | ✅       | Generic component correctly uses `<T,>` syntax to avoid JSX ambiguity in `.tsx`.                                                                                                                                                                                                                                                                                                                                                                                      |
| 1.4 | ✅       | `columns` and `gap` are typed and defaulted clearly.                                                                                                                                                                                                                                                                                                                                                                                                                  |
| 1.5 | ✅       | Copyright header present.                                                                                                                                                                                                                                                                                                                                                                                                                                             |

**Fix (1.1):** Add a `getItemKey` optional prop, or constrain the generic:

```ts
// Option A: explicit key extractor
export interface CardViewProps<T = unknown> {
  getItemKey?: (item: T, index: number) => React.Key;
  // ...
}

// In the render:
<div key={getItemKey ? getItemKey(item, index) : index} role="listitem">

// Option B: constraint-based (breaking change)
export interface CardViewProps<T extends { id: string | number }> { ... }
```

---

## 2. Accessibility

| #   | Severity  | Finding                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| --- | --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 2.1 | 🟠 Medium | The outer `div` has `role="list"` + `aria-label`. Each item has `role="listitem"`. This is correct for a static list. However, when cards are interactive (`onPress` provided), the pattern becomes a list of interactive buttons — this is valid, but the component does **not** manage focus across items. Arrow-key navigation is not provided. For a true selection widget, `role="listbox"` with `role="option"` on each item and keyboard arrow navigation would be more appropriate. At minimum, document the limitation. |
| 2.2 | 🟠 Medium | `CardView` passes `isSelected` to `Card` which sets `aria-pressed`. In a list-selection context `aria-pressed` (toggle button semantics) is wrong — `aria-selected` on `role="option"` is the correct ARIA pattern for single/multi selection lists. See also `Card` review.                                                                                                                                                                                                                                                     |
| 2.3 | ✅        | `aria-label` is correctly propagated to the `role="list"` container.                                                                                                                                                                                                                                                                                                                                                                                                                                                             |

---

## 3. Documentation (JSDoc / Storybook)

| #   | Severity | Finding                                                                                                                                                                                                                                             |
| --- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 3.1 | ✅       | JSDoc on component and all props.                                                                                                                                                                                                                   |
| 3.2 | ✅       | Three stories: Default, Selectable, TwoColumn — good breadth.                                                                                                                                                                                       |
| 3.3 | ✅       | `argTypes` for `columns` and `gap`.                                                                                                                                                                                                                 |
| 3.4 | ✅       | `parameters.a11y: {}` present.                                                                                                                                                                                                                      |
| 3.5 | 🟡 Low   | No story for `EmptyState` (zero items). Consumers need to know what's rendered.                                                                                                                                                                     |
| 3.6 | 🟡 Low   | `sampleItems` is defined at module level in the stories file — good reuse. The `Default` story `renderCard` renders JSX inline which Storybook controls can't easily modify. A `Playground` story with controllable per-card state would be useful. |

---

## 4. Tests

| #   | Severity   | Finding                                                                                                                                                               |
| --- | ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 4.1 | ✅         | Renders `role="list"` with `aria-label`.                                                                                                                              |
| 4.2 | ✅         | All items render.                                                                                                                                                     |
| 4.3 | ✅         | Correct number of `listitem` roles.                                                                                                                                   |
| 4.4 | ✅         | Empty items renders zero list items.                                                                                                                                  |
| 4.5 | ✅         | Custom columns prop smoke test.                                                                                                                                       |
| 4.6 | 🔴 Missing | No test for interactive (`onPress`) cards within `CardView` — the most common use case.                                                                               |
| 4.7 | 🔴 Missing | No test for `gap` prop affecting grid layout (even a smoke test).                                                                                                     |
| 4.8 | 🟡 Low     | No test that confirms only one card is "selected" at a time when `isSelected` is used (the component defers this entirely to the consumer; at minimum document this). |

**Suggested test:**

```ts
it('renders interactive cards inside CardView', async () => {
  const onPress = rstest.fn();
  renderCardView({
    items: testItems.slice(0, 1),
    renderCard: (item) => ({
      'aria-label': item.label,
      onPress,
      children: <span>{item.label}</span>,
    }),
  });
  await userEvent.click(screen.getByRole('button', { name: 'Card One' }));
  expect(onPress).toHaveBeenCalledOnce();
});
```

---

## Action Items

- [ ] **Fix High**: Replace `key={index}` with a stable key — add `getItemKey` prop or constrain generic (`High`).
- [ ] **Fix Medium**: Replace inline `style` with Spectrum `Grid` or `UNSAFE_className` + CSS module (`Medium`).
- [ ] **Fix Medium**: Reconsider `aria-pressed` vs `aria-selected` semantics for interactive card selection within a list (`Medium`).
- [ ] Add interactive card test inside `CardView` (`Medium`).
- [ ] Add `EmptyState` Storybook story (`Low`).
