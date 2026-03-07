# Documentation Review — `@geti/ui` Component Docs

> **Status**: Initial audit complete. This document is the source of truth for documentation quality across all 81 component MDX files.
> **Last updated**: 2026-03-07

---

## 1. Executive Summary

The `@geti/ui` documentation is in a strong but uneven state. Roughly a third of the 81 component MDX files are genuinely excellent — detailed, developer-centric, and structured to the High Quality standard. Another third are competent mid-tier docs that cover the basics but lack depth in Flow, Integration, and Accessibility sections. The final third are thin stubs: present, structurally sound, but shallow.

**The good news**: there is no blank-page problem. Every exported component (except `AvatarGroup`) has at least a stub. The pattern is established; the task is consistent elevation.

**The critical issues**:
1. All 9 KitchenSink pages have a structural bug: `<Stories />` is embedded inside the `## Responsibility` section instead of appearing before it.
2. `AvatarGroup` — exported from `src/index.ts`, documented in the `ui/KitchenSink.mdx` — has no dedicated `.mdx` file.
3. `MediaViewModes` and `SelectBoxGroup` have component directories but no `.mdx` file.
4. ~30 components are missing **Design** and **Flow** sections entirely.
5. ~25 components are missing substantive **Accessibility** sections (they have a heading but only 2–3 bullet points).

---

## 2. The High-Quality Standard

The target structure, in canonical order, for every component MDX file:

```
1. Title  (# ComponentName or <Title />)
2. Subtitle  (<Subtitle>one sentence</Subtitle>)
3. Import block  (```tsx import { X } from '@geti/ui'; ```)
4. Reference link  (→ upstream Spectrum/RAC docs)
5. <Stories />  (visual examples, immediately visible)
6. ## Responsibility  (what it is; when to use / when to avoid)
7. ## Variants  (all meaningful states/modes)
8. ## Props  (table or <Controls />, categorised)
9. ## Design  (internal architecture; how the wrapper works)
10. ## Flow  (data/state flow, pseudocode or code snippet)
11. ## Integration  (dependencies, related components, placement guidance)
12. ## Accessibility  (ARIA roles, keyboard nav, labelling requirements)
```

Sections 9–10 (Design, Flow) are the most commonly absent. They are also the most valuable for contributors and maintainers.

---

## 3. Structural Bug — KitchenSink Pages

**All 9 KitchenSink pages** share the same structural error: `<Stories />` is placed **inside** the `## Responsibility` section body instead of appearing before it (as visual context for everything that follows).

**Affected files:**
- `packages/ui/src/components/KitchenSink.mdx`
- `packages/ui/src/components/ui/KitchenSink.mdx`
- `packages/ui/src/components/feedback/KitchenSink.mdx`
- `packages/ui/src/components/navigation/KitchenSink.mdx`
- `packages/ui/src/components/data/KitchenSink.mdx`
- `packages/ui/src/components/layouts/KitchenSink.mdx`
- `packages/ui/src/components/overlays/KitchenSink.mdx`
- `packages/ui/src/components/form/KitchenSink.mdx`
- `packages/ui/src/components/form/pickers/KitchenSink.mdx`

**Fix pattern** (same for all 9):
Move `<Stories />` to appear *after* the import block / before `## Responsibility`.

The top-level `KitchenSink.mdx` has an additional issue: the table in the Responsibility section is split by `<Stories />` — the heading row and separator row appear *after* `<Stories />` renders, making the table malformed in the Storybook docs view.

---

## 4. Missing MDX Files

Three exported components have no dedicated documentation page:

| Component | Location | Priority | Status |
|---|---|---|---|
| `AvatarGroup` | `packages/ui/src/components/ui/Avatar/AvatarGroup.tsx` | **High** | ✅ Created |
| `MediaViewModes` | `packages/ui/src/components/navigation/MediaViewModes/` | **Medium** | ✅ Created |
| `SelectBoxGroup` | `packages/ui/src/components/form/SelectBoxGroup/` | **Medium** | ⚠️ Not Implemented |

`AvatarGroup` should be co-located in `packages/ui/src/components/ui/Avatar/AvatarGroup.mdx` (not a separate directory, since `AvatarGroup.tsx` already lives there).

---

## 5. Tier Classification

### Tier A — High Quality (≥120 lines, all major sections present)

These files meet or nearly meet the full High Quality standard. Use them as exemplars when upgrading other docs.

| Component | Lines | Standout strength |
|---|---|---|
| `Toast` | 134 | Complete imperative API docs; accessibility live-region table |
| `ActionBar` | 130 | Solid Flow + Design sections; TableView integration code snippet |
| `CardView` | 125 | Clear Design + Flow; ActionBar integration example |
| `IllustratedMessage` | 115 | Slot-based Design section; DropZone/Empty state integration |
| `TableView` | 209 | Comprehensive: variants, loading states, drag & drop, accessibility deep-dive |
| `CustomPopover` | 173 | Excellent Design + Flow sections; RAC composition explained clearly |
| `TimeField` | 183 | Strong Integration section linking DateField/DateRangePicker family |
| `DateField` | 167 | Full controlled/uncontrolled coverage; calendar system awareness |
| `ColorSwatchPicker` | 187 | Complete color suite integration map |
| `Calendar` / `RangeCalendar` | 154 / 152 | Good keyboard + internationalization coverage |
| `DateRangePicker` | 129 | Good breadth |
| `FullscreenAction` | 148 | Design pattern for overlay composition well documented |
| `ActionButton` | 153 | Excellent `colorVariant` CSS module explanation |
| `ColorPickerDialog` | 119 | Good composite assembly doc |
| `Tag` | 126 | Clean flow, good use/avoid guidance |
| `Loading` | 125 | All variants covered; `mode` × `variant` matrix |
| `Skeleton` | 127 | Explicit shimmer implementation; animation accessibility note |
| `StatusLight` | 110 | Concise, complete |
| `Badge` | 98 | Excellent use/avoid section; accessibility thoroughness |
| `IntelBrandedLoading` | 95 | Correctly documents its own deprecation; migration path |
| `InlineAlert` | 125 | Comprehensive |
| `ProgressBar` / `ProgressCircle` | 117 / 110 | Solid state + accessibility |
| `Picker` | 137 | Good filtering/search guidance |
| `Avatar` | 114 | Clean; AvatarGroup crosslink present |
| `ColorArea` | 97 | Perfect Design section for a thin wrapper |
| `ActionMenu` | 107 | Good selection mode coverage |
| `Link` | 117 | Clear router integration guidance |
| `DialogContainer` | 117 | Explains `useDialogContainer` usage well |
| `Meter` | 120 | Accessible label requirements well covered |

### Tier B — Mid-Grade (68–98 lines, missing 1–3 major sections)

Structurally sound, missing Design, Flow, or deep Accessibility.

| Component | Lines | What's missing |
|---|---|---|
| `AlertDialog` | 67 | No Design section; no Flow; no destructive confirmation code example |
| `Dialog` | 73 | No Design section; no slot-based children example; no `close` render-prop example |
| `Tooltip` | 68 | No Design section; no Flow; tooltip on disabled elements guidance is present but thin |
| `Tabs` | 78 | No Design section; no Flow; `keyboardActivation` usage example missing |
| `Menu` | 76 | No Design section; `Section`/divider usage not shown in code |
| `ComboBox` | 92 | No Design or Flow; async filtering pattern missing |
| `TextField` | 87 | No Design or Flow; validation integration with `Form` missing |
| `Button` | 89 | No Design section (the `UNSAFE_className` merge pattern is undocumented) |
| `ToggleButtons` | 78 | No Design or Flow (but Implementation Details partially covers it) |
| `TreeView` | 72 | No Design section; no RAC alpha status warning |
| `ListView` | 71 | No Design section; `dragAndDropHooks` usage not shown |
| `NumberField` | 90 | No Design or Flow |
| `RangeSlider` | 80 | No Design; no controlled usage example |
| `Slider` | 84 | No Design or Flow |
| `CheckboxGroup` | 75 | No Design or Flow |
| `RadioGroup` | 72 | No Design or Flow |
| `SearchField` | 77 | No Design or Flow |
| `Switch` | 74 | No Design or Flow |
| `TextArea` | 85 | No Design or Flow |
| `TagGroup` | 73 | No Design or Flow; `onRemove` usage example missing |
| `Breadcrumbs` | 76 | No Design or Flow; router integration missing |
| `ContextualHelp` | 69 | No Design; trigger content composition not shown |
| `Popover` | 62 | No Design; contrast with `CustomPopover` not explained |
| `DropZone` | 69 | No Design or Flow; `FileTrigger` pairing pattern missing |
| `FileTrigger` | 67 | No Design or Flow; `DropZone` pairing missing |
| `Form` | 76 | No Design or Flow; validation pattern missing |
| `Disclosure` | 72 | No Design or Flow |
| `Flex` | 65 | No Design or Flow |
| `Grid` | 66 | No Design or Flow |
| `Well` | 60 | No Design or Flow |
| `Card` | 63 | No Design or Flow; static vs interactive branching pattern not documented |
| `Accordion` | 65 | No Design or Flow; relationship to `Disclosure` not explained |
| `PasswordField` | 73 | No Design or Flow |
| `ColorField` | 107 | Has Design; Flow could be richer |
| `ColorWheel` | 104 | Has Design; Flow could be richer |
| `ColorSlider` | 112 | Has Design; could explain channel mapping more |
| `ColorThumb` | 113 | Good but internal-only; usage guidance thin |
| `ColorSwatch` | 135 | Good overall |
| `DatePicker` | 124 | Solid but missing controlled/time zone example |

### Tier C — Thin Stubs (<68 lines, skeleton structure only)

These have the correct sections listed but minimal content in each.

| Component | Lines | Key gap |
|---|---|---|
| `VirtualizedHorizontalGrid` | 57 | No Accessibility section; no Subtitle heading; `<Stories />` at wrong position |
| `Toast` | 59 | No Subtitle heading; `<Stories />` at wrong position; no Accessibility section |
| `CardView` | 60 | No Subtitle; no Accessibility; no Design |
| `VirtualizedListLayout` | 60 | No Accessibility section; `<Stories />` at wrong position |
| `ListBox` | 66 | No Design, no Flow, no Accessibility |
| `ActionBar` | 70 | No Design, no Flow, minimal Accessibility |
| `IllustratedMessage` | 62 | No Design, no Flow |
| `CornerIndicator` | 81 | No Design, no Flow |
| `Image` | 82 | No Design, no Flow |
| `View` | 76 | No Design, no Flow |
| `PhotoPlaceholder` | 80 | No Design (hash-based colour algorithm not explained in doc) |
| `PressableElement` | 92 | Decent structure but Design (two-library bridge) not documented |
| `Divider` | 63 | Pure stub |

---

## 6. Cross-Cutting Issues

### 6.1 Missing Design sections

The **Design** section (internal architecture) is missing from ~40 components. This is the single highest-value section for contributors because it explains:
- Whether the component is a thin wrapper, prop-restricting wrapper, or custom composite
- What CSS strategy is used (Spectrum props / `UNSAFE_className` / CSS modules / inline tokens)
- Any non-obvious implementation choices

The canonical "thin wrapper" Design block is three lines and should be added to every component where it applies:

```tsx
// Design section for thin wrappers:
export interface XyzProps extends SpectrumXyzProps {}
export const Xyz = (props: XyzProps) => <SpectrumXyz {...props} />;
```

### 6.2 Missing Flow sections

**Flow** is missing from ~35 components. For thin wrappers, Flow is trivially short:

```
props → <SpectrumXyz> → DOM
No state, no effects, no refs.
```

This takes 3 lines and removes all ambiguity. It should be added to every component.

### 6.3 `<Stories />` placement

Beyond the KitchenSink pages, several individual component docs place `<Stories />` after the `## Responsibility` section rather than before it. The canonical position is **immediately after the import block**, so users see visual examples before reading prose.

Components with `<Stories />` in the wrong position (after `## Responsibility` or at end-of-file):
- `Toast`
- `VirtualizedHorizontalGrid`
- `VirtualizedListLayout`
- `VirtualizedListLayout` (also at bottom)

### 6.4 `<Title />` vs `# ComponentName`

Some docs use `<Title />` (Storybook block), others use `# ComponentName` (static markdown). Both work, but mixing creates inconsistency. **Recommendation**: use `# ComponentName` for explicit static titles where you want Storybook to use the heading literally. Use `<Title />` only when you want Storybook to auto-derive the title from the story metadata.

### 6.5 Deprecated component framing

`IntelBrandedLoading.mdx` is actually a **model doc** for how to handle deprecated components — it leads with the deprecation warning, shows the migration path, and documents the legacy props. No other deprecated component doc approaches this quality.

If any other components are deprecated or on a migration path (e.g., components that will move from Spectrum v3 to RAC during the Tailwind migration), they should follow `IntelBrandedLoading`'s pattern.

### 6.6 RAC alpha status not flagged

`TreeView` wraps `react-spectrum/v3/TreeView` which was alpha/experimental at v3.39. The doc links to the alpha docs but does not warn consumers. A callout block should be added.

---

## 7. Recommended Canonical Structure (with examples)

### Title block pattern

```mdx
# ComponentName

<Subtitle>One sentence: what it is and the primary use case.</Subtitle>

```tsx
import { ComponentName } from '@geti/ui';
```

- [React Spectrum ComponentName](https://react-spectrum.adobe.com/...)

<Stories />
```

### Responsibility section pattern

```mdx
## Responsibility

Brief explanation (2–4 sentences) of what the component owns.

### When to use
- ...

### When to avoid
- ...
```

### Design section pattern (thin wrapper)

```mdx
## Design

Pure thin wrapper — zero local state, no CSS overrides:

```tsx
export interface FooProps extends SpectrumFooProps {}
export const Foo = (props: FooProps) => <SpectrumFoo {...props} />;
```
```

### Design section pattern (custom composite)

```mdx
## Design

`Foo` composes `Bar` and `Baz` to achieve X.

- **`Bar`** — handles Y
- **`Baz`** — handles Z

The key extension point is the `colorVariant` prop, which maps to CSS module
classes via `clsx`:

```tsx
const CLASS_MAP = { dark: styles.dark, light: styles.light };
export const Foo = ({ colorVariant = 'dark', ...rest }: FooProps) => (
  <Bar UNSAFE_className={clsx(CLASS_MAP[colorVariant], rest.UNSAFE_className)} {...rest} />
);
```
```

### Flow section pattern

```mdx
## Flow

```
props → <SpectrumFoo> → DOM
No state, no effects, no refs.
```
```

Or for components with state:

```mdx
## Flow

```
props { value, onChange }
  → useState(value)          // draft state
  → <input>
     onBlur → validate
     onChange → setDraft
  → parent notified via onChange(validated)
```
```

---

## 8. Prioritised Upgrade Backlog

### P0 — Structural fixes (no content writing needed)

| Task | Files |
|---|---|
| Fix `<Stories />` position in all KitchenSink pages | 9 files |
| Fix top-level `KitchenSink.mdx` broken table | 1 file |
| Create `AvatarGroup.mdx` | 1 new file |
| Create `MediaViewModes.mdx` | 1 new file |
| Create `SelectBoxGroup.mdx` | 1 new file |

### P1 — High-traffic components with missing Design/Flow sections

These are the components developers reach for most. Upgrading them has the highest impact.

1. `Dialog` — Add Design (slot-based children pattern, `close` render prop) + Flow
2. `AlertDialog` — Add Design (pre-composed Dialog variant) + Flow + migration note
3. `Tooltip` / `TooltipTrigger` — Add Design + Flow; expand disabled-element guidance
4. `Tabs` — Add Design + Flow; document `keyboardActivation="manual"` use case
5. `Button` — Add Design section (UNSAFE_className merge, variant restriction)
6. `ComboBox` — Add Design + Flow; document async filtering pattern
7. `TextField` / `TextArea` / `NumberField` — Add Design + Flow; `Form` validation integration
8. `Menu` / `ActionMenu` — Add Design + Flow; Section/divider code examples
9. `Breadcrumbs` — Add Flow; router integration note
10. `ListView` — Add Design section; drag & drop hooks example

### P2 — Mid-tier form controls

All form controls in `form/` that are missing Design + Flow:

- `Checkbox`, `CheckboxGroup`
- `RadioGroup`
- `Switch`
- `SearchField`
- `Slider`, `RangeSlider`
- `PasswordField`
- `DropZone` + `FileTrigger` (document as a pair)
- `Form` (validation pattern with `isInvalid` + `errorMessage`)

### P3 — Layout primitives

- `Flex`, `Grid` — Add Design + Flow; responsive prop examples
- `Well` — Add Design + Flow
- `Card` — Add Design (static vs interactive branching)
- `Disclosure` — Add Design + Flow
- `Accordion` — Add Design; explain `Disclosure` relationship

### P4 — Thin stub elevation

- `VirtualizedHorizontalGrid` — Add Subtitle, fix `<Stories />` position, add Accessibility
- `VirtualizedListLayout` — Fix `<Stories />` position, add Accessibility
- `Toast` — Add Subtitle, fix `<Stories />` position, add Accessibility
- `CardView` — Add Subtitle, add Design, add Accessibility
- `ListBox` — Add Design, Flow, Accessibility
- `ActionBar` — Add Design, Flow, Accessibility
- `IllustratedMessage` — Add Design, Flow
- `CornerIndicator`, `Image`, `View`, `Divider` — Add Design + Flow (all 4 are trivial wrappers)

### P5 — Alpha/deprecation warnings

- `TreeView` — Add alpha status callout
- Any future deprecated components — follow `IntelBrandedLoading` pattern

---

## 9. KitchenSink Page Guidance

KitchenSink pages serve a different purpose than component pages — they document a **category** of components rather than a single one. The current content quality is good (the `ui/KitchenSink.mdx` and top-level `KitchenSink.mdx` are genuinely excellent). The structural bug is the primary issue.

**Recommended structure for category KitchenSink pages:**

```
<Title />  (auto from story metadata)
<Subtitle>One sentence about the category.</Subtitle>

<Stories />  ← HERE (visual overview first)

## Responsibility  ← then prose
Component table: | Component | Purpose |

## Design
Patterns used across this category.

## Integration
How this category relates to other categories.

## Flow
(optional for category pages — skip if not applicable)

<Primary />
<Controls />
```

The top-level `KitchenSink.mdx` should additionally include a "Getting Started" or "Quick Import" section showing the single `@geti/ui` import pattern, since it is the most likely entry point for new consumers.

---

## 10. Quality Metrics Snapshot

| Metric | Count |
|---|---|
| Total MDX files | 81 (72 component + 9 KitchenSink) |
| Tier A (≥120 lines, complete) | ~25 |
| Tier B (68–119 lines, missing 1–3 sections) | ~34 |
| Tier C (<68 lines, stub) | ~13 |
| Missing MDX entirely | 3 (AvatarGroup, MediaViewModes, SelectBoxGroup) |
| KitchenSink pages with structural bug | 9 of 9 |
| Components missing Design section | ~40 |
| Components missing Flow section | ~35 |
| Components missing substantive Accessibility | ~25 |
| Components with `<Stories />` in wrong position | ~13 |

---

## Appendix: File Index by Tier

### Tier A
`ActionButton`, `TableView`, `CustomPopover`, `TimeField`, `DateField`, `ColorSwatchPicker`,
`Calendar`, `RangeCalendar`, `DateRangePicker`, `FullscreenAction`, `ColorPickerDialog`,
`Tag`, `Loading`, `Skeleton`, `StatusLight`, `Badge`, `IntelBrandedLoading`, `InlineAlert`,
`ProgressBar`, `ProgressCircle`, `Picker`, `Avatar`, `ColorArea`, `ActionMenu`, `Link`,
`DialogContainer`, `Meter`

### Tier B
`AlertDialog`, `Dialog`, `Tooltip`, `Tabs`, `Menu`, `ComboBox`, `TextField`, `Button`,
`ToggleButtons`, `TreeView`, `ListView`, `NumberField`, `RangeSlider`, `Slider`,
`CheckboxGroup`, `RadioGroup`, `SearchField`, `Switch`, `TextArea`, `TagGroup`,
`Breadcrumbs`, `ContextualHelp`, `Popover`, `DropZone`, `FileTrigger`, `Form`,
`Disclosure`, `Flex`, `Grid`, `Well`, `Card`, `Accordion`, `PasswordField`,
`ColorField`, `ColorWheel`, `ColorSlider`, `ColorThumb`, `ColorSwatch`, `DatePicker`,
`ToggleButton`, `Image`, `View`, `PhotoPlaceholder`, `PressableElement`

### Tier C
`VirtualizedHorizontalGrid`, `Toast`, `CardView`, `VirtualizedListLayout`, `ListBox`,
`ActionBar`, `IllustratedMessage`, `CornerIndicator`, `Divider`

### Missing
`AvatarGroup`, `MediaViewModes`, `SelectBoxGroup`
