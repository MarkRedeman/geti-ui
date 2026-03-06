# Groups 3 & 4 — Peer Review Summary

## Overlays (Tooltip, Popover, CustomPopover, Dialog, DialogTrigger, AlertDialog, DialogContainer, ContextualHelp) and Navigation (Tabs, Breadcrumbs, Menu, ActionMenu)

---

## Overall Assessment

These 12 components follow a consistent thin-wrapper pattern against Adobe React Spectrum and react-aria-components. The implementation layer is largely correct — props flow through without breakage, TypeScript generics are handled properly, and JSDoc is present. However, two systemic weaknesses cut across nearly every component: **keyboard/interaction testing is almost entirely absent**, and **Storybook stories import directly from `@adobe/react-spectrum` rather than `@geti/ui`**.

| Component       | Code Quality | Accessibility | Docs / Stories | Tests | Overall     |
| --------------- | ------------ | ------------- | -------------- | ----- | ----------- |
| Tooltip         | 4/5          | 3/5           | 3/5            | 2/5   | **3.0**     |
| Popover         | 3/5          | 3/5           | 3/5            | 3/5   | **3.0**     |
| CustomPopover   | 3/5          | 3/5           | 3/5            | 2/5   | **2.75**    |
| Dialog          | 4/5          | 2/5           | 3/5            | 3/5   | **3.0**     |
| AlertDialog     | 4/5          | 3/5           | 4/5            | 4/5   | **3.75** ✅ |
| DialogContainer | 4/5          | 3/5           | 3/5            | 0/5   | **2.5** ⚠️  |
| ContextualHelp  | 4/5          | 3/5           | 3/5            | 3/5   | **3.25**    |
| Tabs            | 3/5          | 3/5           | 3/5            | 3/5   | **3.0**     |
| Breadcrumbs     | 3/5          | 4/5           | 3/5            | 3/5   | **3.25**    |
| Menu            | 3/5          | 2/5           | 3/5            | 2/5   | **2.5** ⚠️  |
| ActionMenu      | 4/5          | 2/5           | 3/5            | 4/5   | **3.25**    |

**Best:** AlertDialog — most complete testing including callback verification and correct `alertdialog` role.  
**Most critical:** DialogContainer — zero tests on a component with a required footgun callback. Menu — no `onAction` test, no keyboard nav, `alert()` in stories.

---

## Blocking Issues (P1) — Fix Before Shipping

### 1. `DialogContainer` has no test file

The only component in this batch without any tests. It manages programmatic open/close state where `onDismiss` is required. If `onDismiss` does not close the dialog state, the dialog becomes permanently open. **Create `DialogContainer.test.tsx` immediately.**

### 2. Keyboard/interaction tests are missing across the group

| Component   | Missing keyboard tests                                                 |
| ----------- | ---------------------------------------------------------------------- |
| Tooltip     | `hover()` / `tab()` to show tooltip                                    |
| Dialog      | Escape to close, focus trap, focus return to trigger                   |
| Tabs        | `ArrowRight`/`ArrowLeft` tab navigation                                |
| Menu        | `ArrowDown`/`Up` item navigation, `Enter` to select, `Escape` to close |
| ActionMenu  | `Enter`/`Space` to open, `Escape` to close, arrow navigation           |
| Breadcrumbs | `onAction` callback (primary SPA pattern)                              |
| AlertDialog | `Escape` to dismiss (for `isDismissable`)                              |
| Popover     | `Escape` to dismiss                                                    |

These are WCAG 2.1 SC 2.1.1 requirements and cover the APG patterns for each widget type. This is a systematic gap — the test suite currently only covers click interactions.

### 3. `alert()` in Storybook stories

`Menu.stories.tsx` (Default story) and `ActionMenu.stories.tsx` (Default, Quiet, Disabled stories) use `onAction={(key) => alert(...)}`. This opens a real browser dialog in Storybook and blocks the UI. **Replace with `console.log` or Storybook `action()`.**

### 4. `ActionMenu` stories missing `aria-label` (3 of 4 stories)

`ActionMenu` renders an icon-only button. Without `aria-label`, the button has no accessible name. The `a11y` Storybook plugin will flag this as a violation. Default, Quiet, and Disabled stories all omit `aria-label`.

---

## Systemic Issues (P2) — Fix in Next Sprint

### 5. Empty `interface extends` pattern

Every component in this batch uses:

```tsx
export interface FooProps extends SpectrumFooProps {}
```

This is a no-op that adds semantic noise. Either:

- Switch to `type FooProps = SpectrumFooProps` for pure re-exports
- Or add a JSDoc comment: `// interface kept as extension point for Geti-specific props`

The latter is the correct choice here since the project explicitly intends to add Geti-specific props over time, but it should be documented consistently.

### 6. Stories import from `@adobe/react-spectrum` directly

Stories should demonstrate the consumer experience using `@geti/ui` imports. Currently:

- `Dialog.stories.tsx` — uses `Button`, `ButtonGroup`, `Content`, `Divider`, `Footer`, `Heading` from Adobe Spectrum
- `AlertDialog.stories.tsx` — uses `Button` from Adobe Spectrum
- `Popover.stories.tsx` — uses `ActionButton`, `Dialog`, `Heading`, `Content` from Adobe Spectrum
- `ContextualHelp.stories.tsx` — uses `Content`, `Flex`, `Heading`, `Text` from Adobe Spectrum
- `ActionMenu.stories.tsx` — uses `Item` from Adobe Spectrum
- `Menu.stories.tsx` — uses `ActionButton` from Adobe Spectrum

### 7. `Item.tsx` / `Section.tsx` bare re-exports

`Tabs/Item.tsx`, `Breadcrumbs/Item.tsx`, `Menu/Item.tsx`, and `Menu/Section.tsx` are all `export { Item } from '@adobe/react-spectrum'` with no type export and no JSDoc. These are first-class library exports (`TabItem`, `BreadcrumbItem`, `MenuItem`, `MenuSection`). At minimum add:

```tsx
export type { ItemProps as TabItemProps } from '@adobe/react-spectrum';
export { Item } from '@adobe/react-spectrum';
```

### 8. `Popover` naming/API confusion

`Popover` wraps `SpectrumDialogTrigger` (trigger+overlay manager) and is named like an overlay surface — the opposite of what consumers expect. It should be renamed `PopoverTrigger` or the `type` prop range should be restricted to `'popover'` only. The relationship between `Popover` and `CustomPopover` is currently confusing.

### 9. `import React from 'react'` in every test file

All 10 test files import React unnecessarily. This is dead code with the modern JSX transform.

### 10. Generic component `displayName` absent

`Tabs`, `TabList`, `TabPanels`, `Breadcrumbs`, `Menu`, and `ActionMenu` are all arrow function generics without `displayName`. This can confuse React DevTools and Storybook component introspection.

---

## Minor Issues (P3) — Good-To-Have

- **`Section title` prop is deprecated** — Menu stories use `<Section title="Clipboard">` (deprecated in Spectrum v3). Update to `<Section><Heading>Clipboard</Heading>...</Section>`.
- **`size: 'XL'` missing from Dialog argTypes** — Spectrum supports S/M/L/XL; only S/M/L are exposed.
- **`ContextualHelp` `act()` misuse** — Outer `act()` wrappers around `userEvent` are redundant and can suppress real warnings.
- **CustomPopover `triggerElement: ReactNode`** — Should be `ReactElement` for type safety.
- **CustomPopover code duplication** — The entire popover body is copy-pasted across the two conditional branches. Extract to a shared render helper.
- **CustomPopover SVG missing `aria-hidden`** — The arrow SVG has no `aria-hidden="true"`.
- **`ContextualHelp` variant tests are vacuous** — Both variant tests only assert a button exists, not that variants differ.
- **Breadcrumbs relies on Spectrum's internal aria-label string** — Test assertion is implementation-dependent.

---

## Cross-Cutting Recommendations

### Testing strategy

Adopt a layered test template for all overlay/interactive components:

1. **Mount:** Component renders without crash, trigger present.
2. **Open:** Click (or keyboard Enter/Space) shows content.
3. **Close:** Click outside or Escape dismisses content.
4. **Keyboard nav:** Arrow keys, Tab/Shift+Tab navigate correctly inside the open overlay.
5. **Focus restoration:** Focus returns to trigger after close.
6. **Callbacks:** All action callbacks fire with correct arguments.

Currently only layers 1–2 are consistently covered. Layers 3–6 are the critical gaps.

### Storybook consistency rule

Add to `AGENTS.md`: "Stories must import all components from `@geti/ui`, not from `@adobe/react-spectrum` directly. Use `console.log` or the `action` addon for event handler callbacks — never `alert()`."

### `displayName` for generic components

Add to `AGENTS.md`: "Generic arrow-function components must set `ComponentName.displayName = 'ComponentName'` after the definition."

### Individual report files

- [`Tooltip.md`](./Tooltip.md)
- [`Popover.md`](./Popover.md)
- [`CustomPopover.md`](./CustomPopover.md)
- [`Dialog.md`](./Dialog.md)
- [`AlertDialog.md`](./AlertDialog.md)
- [`DialogContainer.md`](./DialogContainer.md)
- [`ContextualHelp.md`](./ContextualHelp.md)
- [`Tabs.md`](./Tabs.md)
- [`Breadcrumbs.md`](./Breadcrumbs.md)
- [`Menu.md`](./Menu.md)
- [`ActionMenu.md`](./ActionMenu.md)
