# packages/ui/src/components/navigation/Tabs/

## Responsibility

Provides a tabbed navigation system that organises content into multiple sections, each accessible via a labelled tab. Exists to give the library a stable, consistently-themed API surface for tabbed UIs while delegating all accessibility, keyboard navigation, and ARIA semantics to Adobe React Spectrum.

## Design

The folder is split into four co-located files that mirror the composable structure of Spectrum's own Tabs API:

- **`Tabs.tsx`** — thin wrapper over `SpectrumTabs`. Declares `TabsProps<T>` extending `SpectrumTabsProps<T>` and renders `<SpectrumTabs {...props} />` with a single-line generic arrow function.
- **`TabList.tsx`** — thin wrapper over `SpectrumTabList`. Same pattern: `TabListProps<T>` extending `SpectrumTabListProps<T>`, renders `<SpectrumTabList {...props} />`.
- **`TabPanels.tsx`** — thin wrapper over `SpectrumTabPanels`. `TabPanelsProps<T>` extending `SpectrumTabPanelsProps<T>`, renders `<SpectrumTabPanels {...props} />`.
- **`Item.tsx`** — a direct re-export of `Item` from `@adobe/react-spectrum`. No wrapper needed; the Spectrum primitive is consumed as-is.

All three wrapper components are generic over `T extends object` (the key type for tab items) and pass every prop through unchanged via `{...props}`. No additional CSS, state, or logic is introduced.

## Flow

Props in → wrapper component → Spectrum component → rendered output.

1. A caller provides `TabsProps<T>` (e.g. `selectedKey`, `onSelectionChange`, `orientation`) to `<Tabs>`.
2. `Tabs` forwards all props unchanged to `<SpectrumTabs>`.
3. Inside `<Tabs>`, the caller composes `<TabList>` (containing `<Item>` children for each tab label) and `<TabPanels>` (containing `<Item>` children for each panel's content).
4. `TabList` and `TabPanels` similarly forward all props to their Spectrum counterparts.
5. Spectrum manages selection state, keyboard focus, and ARIA attributes internally.

## Integration

- **Dependencies:** `@adobe/react-spectrum` (`Tabs`, `TabList`, `TabPanels`, `Item`).
- **Exported symbols:** `Tabs`, `TabsProps`, `TabList`, `TabListProps`, `TabPanels`, `TabPanelsProps`, and `Item` — all re-exported from the library's public `index.ts`.
- **Callers** compose the four pieces together; `Tabs` is the root, `TabList` and `TabPanels` are its immediate children, and `Item` populates both.
