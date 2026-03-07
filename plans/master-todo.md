# Master Todo — Geti UI Component Library Fixes

> Generated from peer review of all 88 reviewed markdown files across Groups 1–10.  
> Last updated: 2026-03-06

---

## Legend

- 🔴 **P0 — Critical / Broken**: Bugs, WCAG violations, missing test files for non-trivial components, broken functionality
- 🟡 **P1 — Accessibility / Functional**: Missing keyboard tests, incorrect ARIA, missing core interaction tests, wrong imports, API inconsistencies, type-safety regressions
- 🔵 **P2 — Style / Refactoring**: Code hygiene, empty interface extends, duplicate tests, missing stories, polish

All items reference the source file(s) where the fix is needed.

---

## P0 — Critical / Broken

### Accessibility Regressions (WCAG violations)

- [ ] **Card**: Remove `style={{ all: 'unset' }}` from the interactive button wrapper — it strips browser focus rings entirely, violating WCAG SC 2.4.7. Restore a visible `:focus-visible` ring. (`Card.tsx`)
- [ ] **PressableElement**: Remove `role="button"` and `tabIndex={0}` from the inner `<div>` — `Pressable` already owns interactive semantics; the duplicate nested role violates ARIA authoring practices. (`PressableElement.tsx:47-48`)
- [ ] **IntelBrandedLoading**: Fix `role="progressbar"` on `<img>` — semantic conflict between `<img>` implicit role and `progressbar` assignment. Recommended fix: wrap in `<div role="status" aria-label="Loading">`, render `<img aria-hidden>`, add visually-hidden text. (`IntelBrandedLoading.tsx:22-28`)
- [ ] **VirtualizedHorizontalGrid**: Add `aria-label` prop to `VirtualizedHorizontalGridProps` and pass it to the inner `ListBox` — a list without a label is inaccessible. (`VirtualizedHorizontalGrid.tsx:41`)
- [ ] **VirtualizedListLayout / VirtualizedHorizontalGrid**: Replace `outline: none` in both CSS modules with a `:focus-visible` alternative to restore the keyboard focus ring for all keyboard users. (`VirtualizedListLayout.module.css:9`, `VirtualizedHorizontalGrid.module.css:6`)
- [ ] **CornerIndicator**: Add accessible `label` prop — when `isActive={true}`, render a visually-hidden `<span>` so the active state is announced to screen readers. (`CornerIndicator.tsx:18-27`)
- [ ] **PhotoPlaceholder**: Add `role="img"` and `aria-label={name || indicator}` to the outer `View`, and `aria-hidden="true"` to the inner `Text` to prevent duplicate announcements. (`PhotoPlaceholder.tsx:41-53`)
- [ ] **ToggleButtons**: Add `role="group"` and an `aria-label` prop to the wrapping `<Flex>` — screen readers have no context for what the buttons collectively represent. (`ToggleButtons.tsx:66`)
- [ ] **Skeleton**: Fix `role="img"` → `role="status"` — a loading placeholder conveys status, not an image. (`Skeleton.tsx`)
- [ ] **PasswordField**: Set `aria-invalid` and `aria-describedby` on the underlying `<input>` when the `error` prop is present. (`PasswordField.tsx`)
- [ ] **Tag**: Remove `aria-label={text}` from the `<div>` wrapper when a visible `<span>{text}</span>` child is already present — redundant/misleading screen reader announcement, violates WCAG 4.1.2. (`Tag.tsx`)

### Broken Functionality

- [ ] **Skeleton**: Define the `@keyframes geti-skeleton-shine` animation — it is referenced in the CSS but never declared, so the shimmer effect is silently broken in production. (`Skeleton.tsx` / associated CSS)
- [ ] **ColorPickerDialog**: Fix state sync bug — `colorProp` changes after initial render are silently ignored because the component initialises state only once. Sync `colorProp` prop to internal state on prop change. (`ColorPickerDialog.tsx`)
- [ ] **DatePicker / DateRangePicker**: Fix prop-override order — `width="size-2400" {...props}` means consumer-supplied `width` is silently dropped. Change to `{...props} width={props.width ?? 'size-2400'}`. (`DatePicker.tsx:8`, `DateRangePicker.tsx:8`)
- [ ] **MediaViewModes**: Fix duplicate icon imports — `GridSmall`, `GridMedium`, and `Grid` all import from `ViewGrid`, making all three modes visually identical. Assign distinct icons (`ViewSingle`, `ViewColumn`, `ViewGrid` or equivalent). (`MediaViewModes.tsx:4-6`)
- [ ] **FullscreenAction**: Fix `id` prop guard — when `id` is `undefined`, the trigger button gets `id="undefined-open-fullscreen"`. Change to `id={id ? \`${id}-open-fullscreen\` : undefined}`. (`FullscreenAction.tsx:40`)

### Missing Test Files (non-trivial components with zero tests)

- [ ] **DialogContainer**: Create `DialogContainer.test.tsx` — this is the only component in the entire library with no test file. Tests needed: mounts/unmounts dialog, dismiss closes dialog, keyboard Escape dismissal. (`DialogContainer/`)
- [ ] **PressableElement**: Create `PressableElement.test.tsx` — custom prop-filtering, press/double-click semantics, CSS truncation. (`PressableElement/`)
- [ ] **VirtualizedListLayout**: Create `VirtualizedListLayout.test.tsx` — infinite scroll, virtualization, loading state, selection. (`VirtualizedListLayout/`)
- [ ] **VirtualizedHorizontalGrid**: Create `VirtualizedHorizontalGrid.test.tsx` and `HorizontalLayout.test.ts` — pure layout logic is independently unit-testable. (`VirtualizedHorizontalGrid/`)
- [ ] **TreeView**: Create `TreeView.test.tsx` — expand/collapse, keyboard navigation (ArrowDown/ArrowRight), `onAction` callback. (`TreeView/`)
- [ ] **ActionBar**: Create `ActionBar.test.tsx` — ActionBar shows when items selected, `onAction` fires with correct key, `onClearSelection` fires, `selectedItemCount` displayed. (`ActionBar/`)
- [ ] **MediaViewModes**: Create `MediaViewModes.test.tsx` — render, menu opens, selecting mode calls `setViewMode`, `isDisabled` prevents menu. (`MediaViewModes/`)
- [ ] **TimeField**: Create `TimeField/TimeField.test.tsx` — at minimum: render, `isDisabled`, `onChange` callback. (`TimeField/`)

---

## P1 — Accessibility / Functional

### Type-Safety Regressions

- [ ] **All 6 date/time components**: Replace `<any>` generic with proper bound generics in a single sweep:
    - `DateField`: `<T extends DateValue>` (`DateField.tsx:15`)
    - `TimeField`: `<T extends TimeValue>` (`DateField.tsx:25`)
    - `DatePicker`: `<T extends DateValue>` (`DatePicker.tsx:6`)
    - `DateRangePicker`: `<T extends DateValue>` (`DateRangePicker.tsx:6`)
    - `Calendar`: `<T extends DateValue>` on both `Calendar` and `RangeCalendar` (`Calendar.tsx:11,20`)
    - Import `DateValue` from `@internationalized/date` in each file
- [ ] **PressableElement**: Replace `any` prop-filtering loop (`pressableProps: any`, `(props as any)[key]`) with a typed `Omit`/`Pick` approach. (`PressableElement.tsx:31-36`)

### Wrong Imports (bypassing library wrappers)

- [ ] **Accordion stories + tests**: Change imports of `Disclosure`, `DisclosurePanel`, `DisclosureTitle` from `@adobe/react-spectrum` to the local `../Disclosure/Disclosure` wrapper. (`Accordion.stories.tsx`, `Accordion.test.tsx`)
- [ ] **CheckboxGroup stories**: Change import of `Checkbox` from `@adobe/react-spectrum` to `@geti/ui` (or local wrapper). (`CheckboxGroup.stories.tsx`)
- [ ] **ColorPickerDialog**: Change all 14+ direct imports from `@adobe/react-spectrum` to the library's wrapper components. (`ColorPickerDialog.tsx`)

### Structural / Organisational Issues

- [ ] **TimeField**: Create `TimeField/TimeField.tsx` (or `index.ts` barrel) that re-exports `TimeField` from `DateField/DateField.tsx` to resolve the implementation/stories directory split. (`TimeField/`)
- [ ] **CardView**: Replace `key={index}` with a stable key — add a `getItemKey` prop or constrain the generic to require a unique `id` field. (`CardView.tsx`)
- [ ] **Card**: Replace native `onClick` with Spectrum `onPress` / `usePress` — `onClick` and `onPress` have different behaviour for pointer cancel and touch. (`Card.tsx`)
- [ ] **VirtualizedListLayout**: Replace `// @ts-ignore` on line 59 with a typed assertion and a `// TODO` comment referencing the upstream issue. (`VirtualizedListLayout.tsx:59`)
- [ ] **VirtualizedListLayout**: Fix duplicate `id="loader"` — use a generated unique ID to avoid duplicate DOM IDs when multiple instances coexist. (`VirtualizedListLayout.tsx:83`)

### Missing Keyboard / Interaction Tests

- [ ] **Button**: Add keyboard (`Enter`, `Space`) press tests. (`Button.test.tsx`)
- [ ] **ActionButton**: Add keyboard activation test. (`ActionButton.test.tsx`)
- [ ] **ToggleButton**: Add keyboard activation test and `isSelected` toggle test. (`ToggleButton.test.tsx`)
- [ ] **Link**: Add keyboard activation test. (`Link.test.tsx`)
- [ ] **Checkbox**: Add keyboard toggle test (Space key). (`Checkbox.test.tsx`)
- [ ] **CheckboxGroup**: Add keyboard selection test. (`CheckboxGroup.test.tsx`)
- [ ] **RadioGroup**: Add keyboard selection test (arrow keys between options). (`RadioGroup.test.tsx`)
- [ ] **Switch**: Add keyboard toggle test. (`Switch.test.tsx`)
- [ ] **Slider / RangeSlider**: Add arrow key value-change test. (`Slider.test.tsx`, `RangeSlider.test.tsx`)
- [ ] **ComboBox**: Add keyboard open/select/close test (ArrowDown opens, Enter selects, Escape closes). (`ComboBox.test.tsx`)
- [ ] **Picker**: Add keyboard open/select test. (`Picker.test.tsx`)
- [ ] **Tabs**: Add ArrowLeft/ArrowRight navigation between tab tests. (`Tabs.test.tsx`)
- [ ] **Menu / ActionMenu**: Add keyboard open and item-activation tests. (`Menu.test.tsx`, `ActionMenu.test.tsx`)
- [ ] **Tooltip**: Add focus-triggered show/hide test. (`Tooltip.test.tsx`)
- [ ] **Dialog / AlertDialog**: Add Escape-to-close test and focus-return-to-trigger test. (`Dialog.test.tsx`, `AlertDialog.test.tsx`)
- [ ] **TreeView**: Add arrow key expand/collapse/navigate tests (once test file is created). (`TreeView.test.tsx`)
- [ ] **ToggleButtons**: Add Tab-between-buttons test and `getLabel` prop coverage test. (`ToggleButtons.test.tsx`)
- [ ] **FullscreenAction**: Add focus-return-to-trigger test after dialog close; strengthen ambiguous `getByRole('button')` selector to use named selector. (`FullscreenAction.test.tsx:49`)

### Missing ARIA Assertions in Tests

- [ ] **Checkbox**: Assert `aria-checked` attribute value in tests. (`Checkbox.test.tsx`)
- [ ] **Switch**: Assert `aria-checked` in tests. (`Switch.test.tsx`)
- [ ] **Dialog**: Assert `role="dialog"` and `aria-labelledby` in tests. (`Dialog.test.tsx`)
- [ ] **AlertDialog**: Assert `role="alertdialog"` in tests. (`AlertDialog.test.tsx`)
- [ ] **Tooltip**: Assert `role="tooltip"` in tests. (`Tooltip.test.tsx`)
- [ ] **Tabs**: Assert `role="tablist"` and `role="tab"` + `aria-selected` in tests. (`Tabs.test.tsx`)
- [ ] **Breadcrumbs**: Assert `aria-current="page"` on the last item. (`Breadcrumbs.test.tsx`)
- [ ] **ProgressBar / ProgressCircle / Meter**: Assert `aria-valuenow`, `aria-valuemin`, `aria-valuemax` in tests. (`ProgressBar.test.tsx`, `ProgressCircle.test.tsx`, `Meter.test.tsx`)
- [ ] **Toast**: Assert `role="alert"` or `aria-live` in tests. (`Toast.test.tsx`)
- [ ] **StatusLight**: Assert `role="status"` in tests. (`StatusLight.test.tsx`)
- [ ] **PhotoPlaceholder**: After A1 fix, assert `getByRole('img', { name: /John Doe/i })` in tests. (`PhotoPlaceholder.test.tsx`)

### Callback Assertion Weaknesses

- [ ] **Calendar / RangeCalendar**: Strengthen `onChange` assertion — check the date value payload, not just that the callback was called. (`Calendar.test.tsx:28,55`)
- [ ] **RangeCalendar**: Strengthen `onChange` — assert `{ start, end }` range object returned. (`Calendar.test.tsx:55`)
- [ ] **Slider / RangeSlider**: Assert the numeric value passed to `onChange` callback. (`Slider.test.tsx`, `RangeSlider.test.tsx`)

### Deprecated API Usage

- [ ] **DateField stories**: Replace `validationState: 'invalid'` with `isInvalid={true}` + `errorMessage`. (`DateField.stories.tsx:14-17`)
- [ ] **DatePicker stories**: Replace `validationState` with `isInvalid`. (`DatePicker.stories.tsx`)
- [ ] **DateRangePicker stories**: Replace `validationState` with `isInvalid`. (`DateRangePicker.stories.tsx`)
- [ ] **ColorField**: Replace `validationState="invalid"` with `isInvalid` prop. (`ColorField.tsx` / `ColorField.stories.tsx`)

### AGENTS.md Convention Violations

- [ ] **Switch**: Replace `UNSAFE_style` with `UNSAFE_className` + CSS module for token injection. (`Switch.tsx`)
- [ ] **Slider**: Replace `UNSAFE_style` with `UNSAFE_className` + CSS module for token injection. (`Slider.tsx`)
- [ ] **ColorThumb**: Replace `UNSAFE_style` with `UNSAFE_className` + CSS module. (`ColorThumb.tsx`)
- [ ] **IntelBrandedLoading**: Remove `UNSAFE_className="geti-intel-loading-container"` and replace the class-selector test with a role-based or `data-testid` query. (`IntelBrandedLoading.tsx:21`, `IntelBrandedLoading.test.tsx:39`)
- [ ] **Menu / ActionMenu stories**: Replace `alert()` calls with `fn()` from `@storybook/test`. (`Menu.stories.tsx`, `ActionMenu.stories.tsx`)
- [ ] **ActionBar stories**: Replace `console.log` callbacks with `fn()` from `@storybook/test`. (`ActionBar.stories.tsx:26-27`)

### Other Functional Issues

- [ ] **Card**: Fix `disabled` + `aria-disabled` dual usage — pick one consistent pattern. (`Card.tsx`)
- [ ] **CardView**: Fix `aria-pressed` vs `aria-selected` — list selection contexts should use `aria-selected` on `role="option"` items, not `aria-pressed`. (`CardView.tsx`, `Card.tsx`)
- [ ] **ColorSwatchPicker**: Fix `@ts-ignore` for `aria-label` — extend `ColorSwatchPickerProps` to include `aria-label` instead of suppressing the error. (`ColorSwatchPicker.stories.tsx`)
- [ ] **FullscreenAction**: Fix `actionButton` function signature — pass the `RefObject` itself (not `.current`) so the callback can access the ref reactively after mount. (`FullscreenAction.tsx:55`)
- [ ] **VirtualizedListLayout**: Move loader `ListBoxItem` outside the `<ListBox>` scope to prevent it being announced as a selectable list item to screen readers. (`VirtualizedListLayout.tsx:82-86`)
- [ ] **VirtualizedListLayout**: Add `selectionMode` prop to allow single/multiple/none selection. (`VirtualizedListLayout.tsx:68`)
- [ ] **VirtualizedListLayout**: Rename `ariaLabel` prop to `aria-label` for HTML convention consistency. (`VirtualizedListLayout.tsx:24`)
- [ ] **VirtualizedHorizontalGrid**: Fix trailing gap in `getContentSize` — `(numItems * sizeWithGap) - gap` when `numItems > 0`. (`HorizontalLayout.ts:80-82`)
- [ ] **ActionMenu stories**: Add `aria-label` to the three icon-only button stories that currently have no accessible name. (`ActionMenu.stories.tsx`)
- [ ] **TreeView stories**: Move misplaced `import { Text }` from line 28 (after story exports) to the top of the file. (`TreeView.stories.tsx:28`)
- [ ] **TreeView stories**: Replace `Item` with `TreeViewItem` as the typed-safe child component API. (`TreeView.stories.tsx`)
- [ ] **MediaViewModes**: Use enum values directly as `Item` keys — remove `.toLocaleLowerCase()` transformation. (`MediaViewModes.tsx:36,51,53`)
- [ ] **MediaViewModes**: Simplify `setViewMode` prop type from `Dispatch<SetStateAction<ViewModes>>` to `(viewMode: ViewModes) => void`. (`MediaViewModes.tsx:26`)
- [ ] **Calendar**: Strengthen button selector from `/15/` regex to a specific date string to avoid ambiguity in multi-month views. (`Calendar.test.tsx:26,50-51`)

---

## P2 — Style / Refactoring

### Systemic Code Hygiene (sweep tasks)

- [ ] **All Group 8 files**: Add copyright header `// Copyright (C) 2022-2025 Intel Corporation\n// LIMITED EDGE SOFTWARE DISTRIBUTION LICENSE` to all Color component files (implementation, stories, tests). (All `Color*.tsx`, `color-swatch/` files)
- [ ] **All Group 8 test files**: Remove unused `import React from 'react'` from all 8 Color component test files. (`ColorArea.test.tsx`, `ColorField.test.tsx`, `ColorSlider.test.tsx`, `ColorWheel.test.tsx`, `ColorThumb.test.tsx`, `ColorSwatch.test.tsx`, `ColorSwatchPicker.test.tsx`, `ColorPickerDialog.test.tsx`)
- [ ] **All Group 8 stories**: Add `parameters: { a11y: {} }` to every Color component story meta. (All `Color*.stories.tsx`)
- [ ] **Empty `interface extends`**: Replace the `interface FooProps extends SpectrumFooProps {}` anti-pattern (empty extension) with `type FooProps = SpectrumFooProps` across the library. Affects almost every component.
- [ ] **Standardise test provider**: Use `<ThemeProvider>` (library wrapper) instead of `<Provider theme={defaultTheme}>` (raw Spectrum) in all test files so Geti theme tokens are exercised. (Group 7 tests)

### Folder / File Naming

- [ ] **`color-swatch/` folder**: Rename to `ColorSwatch/` (and separate `ColorSwatchPicker/`) to match the PascalCase convention used by all other components. Update all import paths in `index.ts`. (`color-swatch/`)

### Storybook Polish

- [ ] **FullscreenAction stories**: Fix title from `'Components/FullscreenAction'` to `'Advanced/FullscreenAction'`. (`FullscreenAction.stories.tsx:6`)
- [ ] **IntelBrandedLoading stories**: Fix title from `'Components/IntelBrandedLoading'` to `'Advanced/IntelBrandedLoading'`. (`IntelBrandedLoading.stories.tsx:5`)
- [ ] **ToggleButtons stories**: Fix title from `'Components/ToggleButtons'` to `'Advanced/ToggleButtons'`. (`ToggleButtons.stories.tsx:9`)
- [ ] **ActionBar stories**: Add `argTypes` for `selectedItemCount`, `isEmphasized`, `onAction`. Add `Emphasized`, `SingleItem`, and dynamic-selection stories. (`ActionBar.stories.tsx`)
- [ ] **TreeView stories**: Add `argTypes` for `selectionMode`, `onAction`, `disabledKeys`. Add `MultiSelect`, `WithActions`, `DisabledKeys` stories. (`TreeView.stories.tsx`)
- [ ] **ToggleButtons stories**: Add `aria-label` demonstration story showing correct accessible usage. (`ToggleButtons.stories.tsx`)
- [ ] **CornerIndicator stories**: Add `argTypes` for `isActive` and new `color` prop; replace placeholder `View` child with a realistic element (ActionButton, PhotoPlaceholder). (`CornerIndicator.stories.tsx`)
- [ ] **DropZone stories**: Add `FilledState`, `WithFileTrigger`, and `onDrop`-wired stories. (`DropZone.stories.tsx`)
- [ ] **DateField stories**: Add `ReadOnly`, `Required` stories. (`DateField.stories.tsx`)
- [ ] **TimeField stories**: Add `WithSeconds` (`granularity="second"`), `Disabled`, `ReadOnly` stories. (`TimeField.stories.tsx`)
- [ ] **DatePicker stories**: Add `Invalid`, `Required` stories; document Safari width constraint in JSDoc `@remarks`. (`DatePicker.stories.tsx`)
- [ ] **DateRangePicker stories**: Add `WithMinMax`, `Invalid` stories. (`DateRangePicker.stories.tsx`)
- [ ] **Calendar stories**: Add `WithMinMax` story. (`Calendar.stories.tsx`)
- [ ] **RangeCalendar stories**: Add `DefaultValue` (pre-populated range), `WithConstraints`, and `Controlled` stories. (`RangeCalendar.stories.tsx`)
- [ ] **MediaViewModes**: Create `MediaViewModes.stories.tsx` — `Default`, `Disabled`, `SubsetOfModes` stories with `useState` wiring. (Missing file)
- [ ] **VirtualizedListLayout stories**: Add `InfiniteScroll` and `EmptyState` stories. (`VirtualizedListLayout.stories.tsx`)
- [ ] **VirtualizedHorizontalGrid stories**: Add `EmptyState` story. (`VirtualizedHorizontalGrid.stories.tsx`)
- [ ] **PhotoPlaceholder stories**: Add `FallbackIndicator` story demonstrating the `name=""` fallback path. (`PhotoPlaceholder.stories.tsx`)
- [ ] **Disclosure stories**: Add `onExpandedChange` story. (`Disclosure.stories.tsx`)
- [ ] **Well**: Document `aria-label` requirement in JSDoc when `role="region"` is intended. (`Well.tsx`)
- [ ] **ColorThumb stories**: Add `title` field to story meta. (`ColorThumb.stories.tsx`)
- [ ] **ColorPickerDialog stories**: Add `aria-hidden` to trigger swatch; add `aria-label` to all 8 preset `ColorSwatch` items. (`ColorPickerDialog.tsx`)
- [ ] **FullscreenAction stories**: Add `WithReactNodeTitle` story for the ReactNode title path and its fallback `aria-label` behaviour. (`FullscreenAction.stories.tsx`)

### Minor Code Improvements

- [ ] **ColorThumb**: Add `aria-hidden="true"` — purely decorative element must be hidden from AT. (`ColorThumb.tsx`)
- [ ] **VirtualizedHorizontalGrid**: Increase `DEFAULT_OVERSCAN` from `0` to `1` or `2` to reduce scroll flicker. (`HorizontalLayout.ts:6`)
- [ ] **VirtualizedHorizontalGrid**: Change `protected` fields `gap`, `size`, `overscan` to `private` — no subclassing is documented or expected. (`HorizontalLayout.ts:15-17`)
- [ ] **PhotoPlaceholder**: Replace `ViewProps<5>` with `DimensionValue` for `width` and `height` prop types. (`PhotoPlaceholder.tsx:13-15`)
- [ ] **PhotoPlaceholder utils**: Add `hexaToRGBA` edge-case tests (empty string, 4-char, 7-char, 9-char inputs). (`PhotoPlaceholder/utils.ts`)
- [ ] **FullscreenAction**: Add test for `id={undefined}` case — trigger button should not have a malformed `id`. (`FullscreenAction.test.tsx`)
- [ ] **FullscreenAction**: Add `WithReactNodeTitle` test for fallback `aria-label`. (`FullscreenAction.test.tsx`)
- [ ] **Calendar test**: Verify `rstest.fn()` is the correct mock API — if not, change to `vi.fn()`. (`Calendar.test.tsx:3`)
- [ ] **ToggleButtons CSS**: Review `:first-child`/`:last-child` selectors — verify they work with Spectrum's Button DOM output; remove `!important` from border rule. (`ToggleButtons.module.css`)
- [ ] **DateField JSDoc**: Add timezone, locale, and supported date format documentation to `DateFieldProps` and `TimeFieldProps`. (`DateField.tsx:11-13,22-24`)
- [ ] **ActionBar JSDoc**: Document `ActionBarContainer` height requirement (must set `height` on container for `ActionBar` to display). (`ActionBar.tsx:15-16`)
- [ ] **HorizontalLayout JSDoc**: Add descriptions for `gap`, `size`, and `overscan` properties (units: pixels, defaults). (`HorizontalLayout.ts:8-12`)
- [ ] **View stories**: Reorder — move `ViewProps` type declaration above the component definition. (`View.tsx`)
- [ ] **DropZone tests**: Add drag interaction tests — `fireEvent.dragOver` to change visual state, `fireEvent.drop` to trigger `onDrop`, test `isDisabled` blocks drops. (`DropZone.test.tsx`)
- [ ] **CornerIndicator tests**: Add `isActive={false}` test asserting the indicator is not in the document; add `isActive={true}` test. (`CornerIndicator.test.tsx`)
- [ ] **IntelBrandedLoading**: Make image size responsive — add `maxWidth: '100%', height: 'auto'` CSS or equivalent. (`IntelBrandedLoading.tsx:26-27`)
- [ ] **MediaViewModes**: Verify `MenuTrigger > TooltipTrigger > ActionButton` nesting works correctly in Spectrum and document any limitations. (`MediaViewModes.tsx:44-51`)

---

## Component Summary Table

| Component                 | P0                                         | P1                                                             | P2                                                |
| ------------------------- | ------------------------------------------ | -------------------------------------------------------------- | ------------------------------------------------- |
| Button                    | —                                          | keyboard test                                                  | empty extends                                     |
| ActionButton              | —                                          | keyboard test, icon-only a11y                                  | —                                                 |
| ToggleButton              | —                                          | keyboard test                                                  | —                                                 |
| Link                      | —                                          | keyboard test                                                  | —                                                 |
| FileTrigger               | —                                          | —                                                              | —                                                 |
| TextField                 | —                                          | —                                                              | empty extends                                     |
| TextArea                  | —                                          | —                                                              | empty extends                                     |
| NumberField               | —                                          | —                                                              | empty extends                                     |
| SearchField               | —                                          | —                                                              | —                                                 |
| PasswordField             | aria-invalid missing                       | —                                                              | —                                                 |
| Checkbox                  | —                                          | aria-checked assert, keyboard test                             | —                                                 |
| CheckboxGroup             | —                                          | wrong import in stories                                        | —                                                 |
| RadioGroup                | —                                          | keyboard test                                                  | —                                                 |
| Switch                    | —                                          | keyboard test                                                  | UNSAFE_style → className                          |
| Slider                    | —                                          | onChange payload assert                                        | UNSAFE_style → className                          |
| RangeSlider               | —                                          | onChange payload assert                                        | —                                                 |
| Picker                    | —                                          | keyboard test                                                  | —                                                 |
| ComboBox                  | —                                          | keyboard test                                                  | —                                                 |
| Form                      | —                                          | —                                                              | —                                                 |
| Tooltip                   | —                                          | keyboard test, role assert                                     | —                                                 |
| Popover                   | —                                          | —                                                              | —                                                 |
| CustomPopover             | —                                          | —                                                              | —                                                 |
| Dialog                    | —                                          | Escape test, aria-labelledby assert                            | —                                                 |
| AlertDialog               | —                                          | role assert                                                    | —                                                 |
| DialogContainer           | **no tests**                               | —                                                              | —                                                 |
| ContextualHelp            | —                                          | —                                                              | —                                                 |
| Tabs                      | —                                          | keyboard nav test, aria asserts                                | —                                                 |
| Breadcrumbs               | —                                          | aria-current assert                                            | —                                                 |
| Menu                      | —                                          | keyboard test, alert() → fn()                                  | —                                                 |
| ActionMenu                | —                                          | keyboard test, alert() → fn(), aria-label on icon-only stories | —                                                 |
| ActionBar                 | **no tests**                               | console.log → fn()                                             | argTypes, more stories                            |
| ProgressBar               | —                                          | aria-value asserts                                             | —                                                 |
| ProgressCircle            | —                                          | aria-value asserts                                             | —                                                 |
| Loading                   | —                                          | —                                                              | —                                                 |
| Meter                     | —                                          | aria-value asserts                                             | —                                                 |
| StatusLight               | —                                          | role assert                                                    | —                                                 |
| InlineAlert               | —                                          | —                                                              | —                                                 |
| Toast                     | —                                          | role assert                                                    | —                                                 |
| Badge                     | —                                          | —                                                              | —                                                 |
| Skeleton                  | role bug, keyframes missing                | —                                                              | —                                                 |
| TableView                 | —                                          | —                                                              | —                                                 |
| ListView                  | —                                          | —                                                              | —                                                 |
| ListBox                   | —                                          | —                                                              | —                                                 |
| TagGroup                  | —                                          | —                                                              | —                                                 |
| Tag                       | aria-label duplicate                       | —                                                              | —                                                 |
| IllustratedMessage        | —                                          | —                                                              | —                                                 |
| Avatar                    | —                                          | —                                                              | —                                                 |
| Image                     | —                                          | —                                                              | —                                                 |
| Flex                      | —                                          | —                                                              | empty extends                                     |
| Grid                      | —                                          | —                                                              | empty extends                                     |
| View                      | —                                          | —                                                              | props ordering                                    |
| Divider                   | —                                          | —                                                              | empty extends                                     |
| Disclosure                | —                                          | —                                                              | onExpandedChange story                            |
| Accordion                 | —                                          | wrong import in stories/tests                                  | —                                                 |
| Well                      | —                                          | —                                                              | aria-label docs                                   |
| Card                      | focus ring (WCAG)                          | onClick → onPress, disabled duality                            | —                                                 |
| CardView                  | —                                          | key={index}, aria-pressed vs selected                          | —                                                 |
| ColorSwatch               | —                                          | —                                                              | copyright, a11y params, React import              |
| ColorSwatchPicker         | —                                          | @ts-ignore fix                                                 | copyright, a11y params, React import              |
| ColorSlider               | —                                          | —                                                              | copyright, a11y params, React import              |
| ColorArea                 | —                                          | —                                                              | copyright, a11y params, React import              |
| ColorWheel                | —                                          | —                                                              | copyright, a11y params, React import              |
| ColorField                | —                                          | validationState deprecated                                     | copyright, a11y params, React import              |
| ColorThumb                | —                                          | —                                                              | copyright, UNSAFE_style, aria-hidden, a11y params |
| ColorPickerDialog         | state sync bug                             | wrong imports (14+)                                            | copyright, preset swatch labels                   |
| DateField                 | —                                          | `<any>` generic                                                | validationState, more stories                     |
| TimeField                 | **no tests**, structural split             | `<any>` generic                                                | more stories                                      |
| DatePicker                | prop override bug                          | `<any>` generic                                                | validationState, more stories                     |
| DateRangePicker           | prop override bug                          | `<any>` generic                                                | validationState, more stories                     |
| Calendar                  | —                                          | `<any>` generic, onChange payload                              | more stories                                      |
| RangeCalendar             | —                                          | `<any>` generic, onChange payload                              | more stories                                      |
| DropZone                  | —                                          | drag tests                                                     | more stories                                      |
| PressableElement          | **no tests**, nested role                  | `any` cast                                                     | more stories                                      |
| CornerIndicator           | no accessible label                        | —                                                              | argTypes, realistic story                         |
| PhotoPlaceholder          | no accessible label                        | —                                                              | utils edge cases                                  |
| FullscreenAction          | id bug                                     | ref signature, test improvements                               | more stories                                      |
| MediaViewModes            | **no tests**, **no stories**, icon bug     | setViewMode type, key transform                                | —                                                 |
| ToggleButtons             | no group role                              | —                                                              | CSS selectors, title fix                          |
| VirtualizedListLayout     | **no tests**, outline: none                | @ts-ignore, selectionMode, ariaLabel rename                    | more stories                                      |
| VirtualizedHorizontalGrid | **no tests**, no aria-label, outline: none | trailing gap                                                   | overscan, private fields                          |
| IntelBrandedLoading       | role conflict                              | —                                                              | UNSAFE_className in tests, title fix              |
| TreeView                  | **no tests**                               | misplaced import, Item API                                     | argTypes, more stories                            |
| ActionBar                 | **no tests**                               | —                                                              | argTypes, more stories                            |
