# TagGroup — Peer Review

**File:** `packages/ui/src/components/TagGroup/TagGroup.tsx`  
**Group:** 6 — Data Display  
**Reviewer:** Oracle

---

## Summary

`TagGroup` is a Spectrum passthrough with `Item` re-export. Good stories including the removable pattern. Critical gap: the `onRemove` callback is central to `TagGroup`'s value but is completely absent from tests. The `Removable` story uses `console.log` instead of a state-driven demo.

---

## 1. Code Quality & Type Safety

| #   | Severity | Finding                                                                                                                                           |
| --- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | ✅ —     | Generic type correctly propagated. Full spread passthrough. No `any`.                                                                             |
| 2   | 🟡 Low   | `Item` is exported as `TagItem` from `index.ts` — correct alias to avoid collision, but undocumented in JSDoc.                                    |
| 3   | 🟡 Low   | `TagGroupProps<T>` inherits `SpectrumTagGroupProps<T>`. The `onRemove` callback types `(keys: Set<React.Key>) => void` — not documented in JSDoc. |

---

## 2. Accessibility

| #   | Severity | Finding                                                                                                                                                                                                               |
| --- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | ✅ —     | `SpectrumTagGroup` renders `role="grid"` — tests use `getByRole('grid')` correctly.                                                                                                                                   |
| 2   | 🔴 High  | **No test for the remove button's accessibility.** When `onRemove` is provided, each tag renders a remove button. These buttons must have accessible names (Spectrum provides "Remove [tag text]"). This is untested. |
| 3   | 🟡 Low   | No test for keyboard navigation within the tag group (`ArrowLeft`/`ArrowRight` between tags).                                                                                                                         |
| 4   | 🟡 Low   | No story for `isDisabled` or `disabledKeys`.                                                                                                                                                                          |

---

## 3. Documentation

| #   | Severity  | Finding                                                                                                                                                                                                                                          |
| --- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | ✅ —      | JSDoc on component is accurate.                                                                                                                                                                                                                  |
| 2   | ✅ —      | Three stories: Default, Removable (with `onRemove`), WithLabel.                                                                                                                                                                                  |
| 3   | 🟠 Medium | **`Removable` story uses `console.log`** for `onRemove`. Should use React state to actually demonstrate tag removal: items should disappear when removed. This is a documentation quality issue — the story doesn't demonstrate the expected UX. |
| 4   | 🟡 Low    | No story for `maxRows` prop (Spectrum supports collapsing overflowing tags).                                                                                                                                                                     |

---

## 4. Tests

| #   | Severity | Finding                                                                                                                      |
| --- | -------- | ---------------------------------------------------------------------------------------------------------------------------- |
| 1   | 🔴 High  | **`onRemove` is completely untested.** The tag group's primary interactive feature — removing tags — has zero test coverage. |
| 2   | 🟡 Low   | Only 3 tests: render, tag items visible, accessible label. No interaction coverage at all.                                   |
| 3   | 🟡 Low   | No test for `label` prop (the `WithLabel` story shows a visible label, but this is not tested).                              |

---

## Specific Fixes Required

### 1. Fix Removable story to use state

```tsx
export const Removable: Story = {
    render: () => {
        const [items, setItems] = React.useState([
            { key: 'chocolate', label: 'Chocolate' },
            { key: 'vanilla', label: 'Vanilla' },
            { key: 'strawberry', label: 'Strawberry' },
        ]);
        return (
            <TagGroup
                aria-label="Removable tags"
                items={items}
                onRemove={(keys) => setItems((prev) => prev.filter((i) => !keys.has(i.key)))}
            >
                {(item) => <Item key={item.key}>{item.label}</Item>}
            </TagGroup>
        );
    },
};
```

### 2. Add remove interaction test

```tsx
import userEvent from '@testing-library/user-event';
import { vi } from '@rstest/core';

it('calls onRemove when remove button is clicked', async () => {
    const onRemove = vi.fn();
    render(
        <Provider theme={defaultTheme}>
            <TagGroup aria-label="Tags" onRemove={onRemove}>
                <Item key="one">Tag One</Item>
                <Item key="two">Tag Two</Item>
            </TagGroup>
        </Provider>
    );
    const removeBtn = screen.getByRole('button', { name: /remove tag one/i });
    await userEvent.click(removeBtn);
    expect(onRemove).toHaveBeenCalledWith(new Set(['one']));
});

it('remove buttons have accessible names', () => {
    render(
        <Provider theme={defaultTheme}>
            <TagGroup aria-label="Tags" onRemove={() => {}}>
                <Item key="alpha">Alpha</Item>
            </TagGroup>
        </Provider>
    );
    expect(screen.getByRole('button', { name: /remove alpha/i })).toBeInTheDocument();
});
```

---

## Overall Rating: 🟠 Needs Attention

Core interaction (`onRemove`) is completely untested. The Removable story doesn't demonstrate actual removal. These are must-fix for a component used in data management UIs.
