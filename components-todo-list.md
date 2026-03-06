# Geti UI — Component To-Do List

This document tracks which components to implement, in what order, and their current status.
Each component should be implemented fully before starting the next one: story, implementation, tests.

**Status legend:**

- `[ ]` Not started / Pending Review
- `[~]` In progress
- `[x]` Complete (impl + story + tests)
- `[S]` Available in React Spectrum S2 — wrap only
- `[A]` Available in react-aria-components — headless, needs styling
- `[C]` Custom — no upstream equivalent, build from scratch
- `[R]` Reference implementation exists in `reference-packages/ui/`

---

## Group 0 — Foundation [COMPLETE]

| Status | Component            | Notes                                                         |
| ------ | -------------------- | ------------------------------------------------------------- |
| `[x]`  | **Project scaffold** | rslib init, TypeScript config, linting (ESLint v10)           |
| `[x]`  | **Storybook setup**  | storybook-react-rsbuild, dark theme decorator                 |
| `[x]`  | **Design tokens**    | CSS custom properties: colors, spacing, typography, radii     |
| `[x]`  | **ThemeProvider**    | Wraps `@adobe/react-spectrum` `Provider` with Geti dark theme |
| `[x]`  | **Testing setup**    | rstest + Testing Library config, Playwright config            |

---

## Group 1 — Primitive Actions [COMPLETE]

| Status | Component        | Upstream          | Notes                                                    |
| ------ | ---------------- | ----------------- | -------------------------------------------------------- |
| `[x]`  | **Button**       | S2 `Button`       | Primary, secondary, accent variants; link support        |
| `[x]`  | **ActionButton** | S2 `ActionButton` | Icon-only and icon+label; dark/light/blue color variants |
| `[x]`  | **ToggleButton** | S2 `ToggleButton` | Selected state styling                                   |
| `[x]`  | **Link**         | S2 `Link`         | Internal (router) and external links                     |
| `[x]`  | **FileTrigger**  | S2 `FileTrigger`  | Headless trigger for file input                          |

---

## Group 2 — Form Controls [COMPLETE]

| Status | Component           | Upstream           | Notes                                  |
| ------ | ------------------- | ------------------ | -------------------------------------- |
| `[x]`  | **TextField**       | S2 `TextField`     | Label, description, error message      |
| `[x]`  | **TextArea**        | S2 `TextArea`      | Auto-grow option                       |
| `[x]`  | **NumberField**     | S2 `NumberField`   | Step, min/max, formatting              |
| `[x]`  | **SearchField**     | S2 `SearchField`   | Clear button, loading state            |
| `[x]`  | **PasswordField**   | Custom             | TextField + show/hide toggle           |
| `[x]`  | **Checkbox**        | S2 `Checkbox`      | Indeterminate state                    |
| `[x]`  | **CheckboxGroup**   | S2 `CheckboxGroup` | Horizontal and vertical orientations   |
| `[x]`  | **RadioGroup**      | S2 `RadioGroup`    | With `Radio` child component           |
| `[x]`  | **Switch**          | S2 `Switch`        | On/off toggle                          |
| `[x]`  | **Slider**          | S2 `Slider`        | Single value; custom thumb styling     |
| `[x]`  | **RangeSlider**     | S2 `RangeSlider`   | Two-handle range                       |
| `[x]`  | **Picker** (Select) | S2 `Picker`        | Single-select dropdown                 |
| `[x]`  | **ComboBox**        | S2 `ComboBox`      | Filterable select with free input      |
| `[x]`  | **Form**            | S2 `Form`          | Layout wrapper; validation integration |

---

## Group 3 — Overlay & Popover [COMPLETE]

| Status | Component           | Upstream                        | Notes                                                      |
| ------ | ------------------- | ------------------------------- | ---------------------------------------------------------- |
| `[x]`  | **Tooltip**         | S2 `Tooltip` + `TooltipTrigger` | Delay, placement                                           |
| `[x]`  | **Popover**         | S2 `Popover`                    | Controlled and uncontrolled                                |
| `[x]`  | **CustomPopover**   | Custom                          | Geti-specific popover with custom chrome; wraps S2 Popover |
| `[x]`  | **Dialog**          | S2 `Dialog` + `DialogTrigger`   | Sizes, dismiss on outside click                            |
| `[x]`  | **AlertDialog**     | S2 `AlertDialog`                | Confirm/cancel variants                                    |
| `[x]`  | **DialogContainer** | S2 `DialogContainer`            | Programmatic dialog opening                                |
| `[x]`  | **ContextualHelp**  | S2 `ContextualHelp`             | Info / help icon + popover                                 |

---

## Group 4 — Navigation [COMPLETE]

| Status | Component       | Upstream                  | Notes                          |
| ------ | --------------- | ------------------------- | ------------------------------ |
| `[x]`  | **Tabs**        | S2 `Tabs`                 | With `TabList` and `TabPanels` |
| `[x]`  | **Breadcrumbs** | S2 `Breadcrumbs`          | Router-aware breadcrumb items  |
| `[x]`  | **Menu**        | S2 `Menu` + `MenuTrigger` | With `ActionMenu` variant      |
| `[x]`  | **ActionMenu**  | S2 `ActionMenu`           | Icon-triggered action list     |

---

## Group 5 — Feedback & Status [COMPLETE]

| Status | Component          | Upstream            | Notes                                                     |
| ------ | ------------------ | ------------------- | --------------------------------------------------------- |
| `[x]`  | **ProgressBar**    | S2 `ProgressBar`    | Determinate and indeterminate                             |
| `[x]`  | **ProgressCircle** | S2 `ProgressCircle` | Indeterminate spinner                                     |
| `[x]`  | **Loading**        | Custom              | Wraps ProgressCircle; inline / fullscreen / overlay modes |
| `[x]`  | **Meter**          | S2 `Meter`          | Quantity visualization                                    |
| `[x]`  | **StatusLight**    | S2 `StatusLight`    | Color-coded status indicators                             |
| `[x]`  | **InlineAlert**    | S2 `InlineAlert`    | Non-modal contextual alerts                               |
| `[x]`  | **Toast**          | Custom              | Uses Spectrum toast queue; Geti dark theme styling        |
| `[x]`  | **Badge**          | S2 `Badge`          | Small metadata label                                      |
| `[x]`  | **Skeleton**       | S2 `Skeleton`       | Loading placeholder; circle and rectangle variants        |

---

## Group 6 — Data Display [COMPLETE]

| Status | Component              | Upstream                | Notes                                         |
| ------ | ---------------------- | ----------------------- | --------------------------------------------- |
| `[x]`  | **TableView**          | S2 `TableView`          | Sortable, selectable; virtualized             |
| `[x]`  | **ListView**           | S2 `ListView`           | Selectable list with drag-and-drop            |
| `[x]`  | **ListBox**            | S2 `ListBox`            | Single/multi-select list                      |
| `[x]`  | **TagGroup**           | S2 `TagGroup`           | Removable tags                                |
| `[x]`  | **Tag**                | Custom                  | Standalone tag (not in a group); Geti variant |
| `[x]`  | **IllustratedMessage** | S2 `IllustratedMessage` | Empty state with SVG illustration             |
| `[x]`  | **Avatar**             | S2 `Avatar`             | User avatar with fallback                     |
| `[x]`  | **AvatarGroup**        | S2 `AvatarGroup`        | Stacked avatars                               |
| `[x]`  | **Image**              | S2 `Image`              | Skeleton loading + error state                |

---

## Group 7 — Layout & Structure [COMPLETE]

| Status | Component      | Upstream        | Notes                                 |
| ------ | -------------- | --------------- | ------------------------------------- |
| `[x]`  | **Flex**       | S2 / `Flex`     | Flexbox layout helper                 |
| `[x]`  | **Grid**       | S2 / `Grid`     | CSS grid layout helper                |
| `[x]`  | **View**       | S2 `View`       | Styled container with Spectrum props  |
| `[x]`  | **Divider**    | S2 `Divider`    | Horizontal/vertical separator         |
| `[x]`  | **Disclosure** | S2 `Disclosure` | Collapsible section with header/panel |
| `[x]`  | **Accordion**  | S2 `Accordion`  | Multi-item disclosure container       |
| `[x]`  | **Well**       | S2 `Well`       | Visually distinct container region    |
| `[x]`  | **Card**       | S2 `Card`       | Selectable summary card               |
| `[x]`  | **CardView**   | S2 `CardView`   | Collection of selectable cards        |

---

## Group 8 — Color Picker [COMPLETE]

| Status | Component             | Upstream               | Notes                                              |
| ------ | --------------------- | ---------------------- | -------------------------------------------------- |
| `[x]`  | **ColorSwatch**       | S2 `ColorSwatch`       | Color preview chip                                 |
| `[x]`  | **ColorSwatchPicker** | S2 `ColorSwatchPicker` | List of swatches                                   |
| `[x]`  | **ColorSlider**       | S2 `ColorSlider`       | Single-channel slider                              |
| `[x]`  | **ColorArea**         | S2 `ColorArea`         | 2D gradient color selector                         |
| `[x]`  | **ColorWheel**        | S2 `ColorWheel`        | Hue wheel                                          |
| `[x]`  | **ColorField**        | S2 `ColorField`        | Hex / channel text input                           |
| `[x]`  | **ColorThumb**        | Custom                 | Draggable color thumb (used inside pickers)        |
| `[x]`  | **ColorPickerDialog** | Custom                 | Full color picker in a dialog; composed from above |

---

## Group 9 — Date & Time [COMPLETE]

| Status | Component           | Upstream             | Notes                           |
| ------ | ------------------- | -------------------- | ------------------------------- |
| `[x]`  | **DateField**       | S2 `DateField`       | Keyboard-editable date segments |
| `[x]`  | **DatePicker**      | S2 `DatePicker`      | DateField + Calendar popover    |
| `[x]`  | **DateRangePicker** | S2 `DateRangePicker` | Two DateFields + RangeCalendar  |
| `[x]`  | **Calendar**        | S2 `Calendar`        | Single-date calendar grid       |
| `[x]`  | **RangeCalendar**   | S2 `RangeCalendar`   | Range-selection calendar        |
| `[x]`  | **TimeField**       | S2 `TimeField`       | Time segment input              |

---

## Group 10 — Advanced / Application-Specific [COMPLETE]

| Status | Component                     | Upstream       | Notes                                                 |
| ------ | ----------------------------- | -------------- | ----------------------------------------------------- |
| `[x]`  | **DropZone**                  | S2 `DropZone`  | File and object drop target                           |
| `[x]`  | **PressableElement**          | Custom         | Generic pressable wrapper for arbitrary elements      |
| `[x]`  | **CornerIndicator**           | Custom         | Small decorative indicator for corners of UI elements |
| `[x]`  | **PhotoPlaceholder**          | Custom         | Avatar/photo placeholder with initials                |
| `[x]`  | **FullscreenAction**          | Custom         | Fullscreen toggle control                             |
| `[x]`  | **MediaViewModes**            | Custom         | Grid/list view mode switcher                          |
| `[x]`  | **ToggleButtons**             | Custom         | Geti-specific toggle button group                     |
| `[x]`  | **VirtualizedListLayout**     | Custom         | Virtualized list layout helper                        |
| `[x]`  | **VirtualizedHorizontalGrid** | Custom         | Virtualized horizontal grid                           |
| `[x]`  | **IntelBrandedLoading**       | Custom         | Intel logo loading animation                          |
| `[x]`  | **TreeView**                  | S2 `TreeView`  | Hierarchical navigation tree                          |
| `[x]`  | **ActionBar**                 | S2 `ActionBar` | Bulk-selection action bar                             |

---

## Phase 6 — Review & Verification [PENDING]

### Todo: Review every single UI component

- [ ] Group 1: Button, ActionButton, ToggleButton, Link, FileTrigger
- [ ] Group 2: TextField, TextArea, NumberField, SearchField, PasswordField, Checkbox, CheckboxGroup, RadioGroup, Switch, Slider, RangeSlider, Picker, ComboBox, Form
- [ ] Group 3: Tooltip, Popover, CustomPopover, Dialog, AlertDialog, DialogContainer, ContextualHelp
- [ ] Group 4: Tabs, Breadcrumbs, Menu, ActionMenu
- [ ] Group 5: ProgressBar, ProgressCircle, Loading, Meter, StatusLight, InlineAlert, Toast, Badge, Skeleton
- [ ] Group 6: TableView, ListView, ListBox, TagGroup, Tag, IllustratedMessage, Avatar, AvatarGroup, Image
- [ ] Group 7: Flex, Grid, View, Divider, Disclosure, Accordion, Well, Card, CardView
- [ ] Group 8: ColorSwatch, ColorSwatchPicker, ColorSlider, ColorArea, ColorWheel, ColorField, ColorThumb, ColorPickerDialog
- [ ] Group 9: DateField, DatePicker, DateRangePicker, Calendar, RangeCalendar, TimeField
- [ ] Group 10: DropZone, PressableElement, CornerIndicator, PhotoPlaceholder, FullscreenAction, MediaViewModes, ToggleButtons, VirtualizedListLayout, VirtualizedHorizontalGrid, IntelBrandedLoading, TreeView, ActionBar
