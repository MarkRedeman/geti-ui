# Plan: High-Quality User Documentation Refactor

This plan outlines the transition of Geti UI component documentation from auto-generated-style summaries to high-quality, developer-centric documentation suitable for internal colleagues and external contributors.

## 🎯 Goal
Transform every component's `.mdx` file into a comprehensive guide that prioritizes usage patterns, clear import paths, and deep parity with Adobe React Spectrum's documentation style.

## 📝 Template Specification
Every component `.mdx` file must follow this exact structure:

1.  **Title & Description**: A human-friendly title and a 1-2 sentence description of what the component is and when to use it.
2.  **Imports**: A clear code block showing the primary import path from `@geti/ui`.
3.  **Reference Link**: If the component wraps an Adobe Spectrum component, provide a direct link to the official [React Spectrum documentation](https://react-spectrum.adobe.com/react-spectrum/).
4.  **Visual Examples (`<Stories />`)**: Immediate visual context showing the component in action.
5.  **Variants**: A section detailing the different variants available (e.g., `accent`, `primary`, `negative`).
6.  **Props (Deep Dive)**: Detailed information about the component's props, following the categorization used in Spectrum docs (e.g., Content, Value, Events, Validation).
7.  **Integration/Responsibility (Optional but Recommended)**: Brief notes on Geti-specific wrapping logic or responsibilities.

---

## 🏗️ Component Inventory
We will iterate through these categories one by one. All existing components require a revisit.

### 📁 UI Primitives (`ui/`)
- [ ] ActionButton
- [ ] Avatar
- [ ] Button
- [ ] CornerIndicator
- [ ] Divider
- [ ] Image
- [ ] PhotoPlaceholder
- [ ] PressableElement
- [ ] ToggleButton
- [ ] ToggleButtons
- [ ] View

### 📁 Form Controls (`form/`)
- [ ] Checkbox
- [ ] CheckboxGroup
- [ ] DropZone
- [ ] FileTrigger
- [ ] Form
- [ ] NumberField
- [ ] PasswordField
- [ ] RadioGroup
- [ ] RangeSlider
- [ ] SearchField
- [ ] SelectBoxGroup (Missing MDX)
- [ ] Slider
- [ ] Switch
- [ ] TextArea
- [ ] TextField

#### 📂 Form Pickers (`form/pickers/`)
- [ ] Calendar
- [ ] RangeCalendar
- [ ] ColorArea
- [ ] ColorField
- [ ] ColorPickerDialog
- [ ] ColorSlider
- [ ] ColorSwatch
- [ ] ColorSwatchPicker
- [ ] ColorThumb
- [ ] ColorWheel
- [ ] ComboBox
- [ ] DateField
- [ ] DatePicker
- [ ] DateRangePicker
- [ ] Picker
- [ ] TimeField

### 📁 Data Display (`data/`)
- [ ] ActionBar
- [ ] CardView
- [ ] ListBox
- [ ] ListView
- [ ] TableView
- [ ] Tag
- [ ] TagGroup
- [ ] TreeView
- [ ] VirtualizedHorizontalGrid
- [ ] VirtualizedListLayout

### 📁 Feedback & Status (`feedback/`)
- [ ] Badge
- [ ] IllustratedMessage
- [ ] InlineAlert
- [ ] IntelBrandedLoading
- [ ] Loading
- [ ] Meter
- [ ] ProgressBar
- [ ] ProgressCircle
- [ ] Skeleton
- [ ] StatusLight
- [ ] Toast

### 📁 Navigation (`navigation/`)
- [ ] ActionMenu
- [ ] Breadcrumbs
- [ ] Link
- [ ] MediaViewModes (Missing MDX)
- [ ] Menu
- [ ] Tabs

### 📁 Layout Primitives (`layouts/`)
- [ ] Accordion
- [ ] Card
- [ ] Disclosure
- [ ] Flex
- [ ] Grid
- [ ] Well

### 📁 Overlays & Dialogs (`overlays/`)
- [ ] AlertDialog
- [ ] ContextualHelp
- [ ] CustomPopover
- [ ] Dialog
- [ ] DialogContainer
- [ ] FullscreenAction
- [ ] Popover
- [ ] Tooltip

---

## 🚀 Execution Strategy
1.  **Phase 1: UI Primitives**: Standardize the most basic components to set the tone.
2.  **Phase 2: Form & Pickers**: Tackle the most complex prop signatures and interactive states.
3.  **Phase 3: Data & Feedback**: Focus on visualization and status indicators.
4.  **Phase 4: Navigation, Layouts & Overlays**: Finalize structural and contextual components.
5.  **Audit**: Ensure no "auto-generated" fluff remains and all reference links are accurate.
