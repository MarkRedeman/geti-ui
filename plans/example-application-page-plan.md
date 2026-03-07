# Example Application Page Plan: The "Kitchen Sink"

This plan describes the implementation of a single, comprehensive "Kitchen Sink" page designed to render every component in the `@geti/ui` library. This serves as a visual regression testing tool and a live demonstration of component interoperability.

## 1. Goal

Create a single React page (`KitchenSink.tsx`) that:

- Uses every exported component at least once.
- Groups components by their logical categories (Actions, Forms, Overlays, etc.).
- Verifies that Geti's dark theme is applied consistently across all elements.
- Provides a quick way to spot visual regressions or layout conflicts.

## 2. Page Structure

The page will be organized into vertical sections with dividers and titles.

### Section 1: Actions & Primitives

- **Components**: `Button` (all variants), `ActionButton`, `ToggleButton`, `Link`, `FileTrigger`.
- **Layout**: `Flex` with `gap`.

### Section 2: Form Controls

- **Components**: `TextField`, `TextArea`, `NumberField`, `SearchField`, `PasswordField`, `CheckboxGroup`, `RadioGroup`, `Switch`, `Slider`, `RangeSlider`, `Picker`, `ComboBox`.
- **Layout**: `Grid` with 2-3 columns.

### Section 3: Navigation

- **Components**: `Tabs`, `Breadcrumbs`, `MenuTrigger`, `ActionMenu`.
- **Layout**: Horizontal layout.

### Section 4: Status & Feedback

- **Components**: `ProgressBar`, `ProgressCircle`, `Loading`, `StatusLight`, `InlineAlert`, `Badge`, `Skeleton`.
- **Layout**: `Flex` with wrapping.

### Section 5: Overlays (Triggers)

- **Components**: `TooltipTrigger`, `Popover`, `CustomPopover`, `DialogTrigger`, `AlertDialog`, `ContextualHelp`.
- **Layout**: Buttons that open each overlay.

### Section 6: Data Display

- **Components**: `TableView` (with mock data), `ListView`, `ListBox`, `TagGroup`, `AvatarGroup`, `IllustratedMessage`.
- **Layout**: Full-width containers.

### Section 7: Layout & Structure

- **Components**: `Accordion`, `Disclosure`, `Well`, `CardView` (with `Card` children).
- **Layout**: Vertical stack.

### Section 8: Color Picker & Date/Time

- **Components**: `ColorSwatchPicker`, `ColorSlider`, `ColorArea`, `ColorWheel`, `ColorPickerDialog`, `DatePicker`, `DateRangePicker`, `Calendar`.
- **Layout**: Grouped into a configuration-style layout.

### Section 9: Advanced / Application-Specific

- **Components**: `DropZone`, `ToggleButtons`, `MediaViewModes`, `IntelBrandedLoading`, `TreeView`, `ActionBar`.

## 3. Implementation Details

- **Location**: `packages/ui/src/pages/KitchenSink.tsx` (or as a special Storybook story).
- **Data Mocking**: Centralized mock data for tables, lists, and trees to keep the component code clean.
- **Theme**: Wrapped in `ThemeProvider` (Geti dark).

## 4. Todo Items

- [ ] Create `KitchenSink.stories.tsx` to host the page in Storybook.
- [ ] Implement layout sections (1-9).
- [ ] Add state management for interactive components (e.g., controlled inputs, open/close states).
- [ ] Add "Show Code" toggles if possible (optional).
