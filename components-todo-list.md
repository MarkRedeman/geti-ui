# Geti UI — Component To-Do List

This document tracks which components to implement, in what order, and their current status.
Each component should be implemented fully before starting the next one: story, implementation, tests.

**Status legend:**

- `[ ]` Not started
- `[~]` In progress
- `[x]` Complete (impl + story + tests)
- `[S]` Available in React Spectrum S2 — wrap only
- `[A]` Available in react-aria-components — headless, needs styling
- `[C]` Custom — no upstream equivalent, build from scratch
- `[R]` Reference implementation exists in `reference-packages/ui/`

---

## How to pick the next component

Work top-to-bottom within each group. A component is ready to start when:

1. All components it depends on are `[x]`
2. The theme/token foundation is in place (see Group 0)

---

## Group 0 — Foundation (must be done first)

These are prerequisites for all components. No component work should start before Group 0 is complete.

| Status | Component            | Notes                                                         |
| ------ | -------------------- | ------------------------------------------------------------- | ----- |
| `[ ]`  | **Project scaffold** | rslib init, TypeScript config, linting                        |
| `[ ]`  | **Storybook setup**  | storybook-react-rsbuild, dark theme decorator                 |
| `[ ]`  | **Design tokens**    | CSS custom properties: colors, spacing, typography, radii     |
| `[ ]`  | **ThemeProvider**    | Wraps `@adobe/react-spectrum` `Provider` with Geti dark theme | `[R]` |
| `[ ]`  | **Testing setup**    | rstest + Testing Library config, Playwright config            |

---

## Group 1 — Primitive Actions

Simple interactive elements with no dependencies on other components.

| Status | Component        | Upstream          | Ref   | Notes                                                    |
| ------ | ---------------- | ----------------- | ----- | -------------------------------------------------------- |
| `[ ]`  | **Button**       | S2 `Button`       | `[R]` | Primary, secondary, accent variants; link support        |
| `[ ]`  | **ActionButton** | S2 `ActionButton` | `[R]` | Icon-only and icon+label; dark/light/blue color variants |
| `[ ]`  | **ToggleButton** | S2 `ToggleButton` | `[S]` | Selected state styling                                   |
| `[ ]`  | **Link**         | S2 `Link`         | `[S]` | Internal (router) and external links                     |
| `[ ]`  | **FileTrigger**  | S2 `FileTrigger`  | `[S]` | Headless trigger for file input                          |

---

## Group 2 — Form Controls

Forms are the backbone of the product. Implement these before any complex composed components.

| Status | Component           | Upstream           | Ref      | Notes                                                |
| ------ | ------------------- | ------------------ | -------- | ---------------------------------------------------- |
| `[ ]`  | **TextField**       | S2 `TextField`     | `[S][R]` | Label, description, error message                    |
| `[ ]`  | **TextArea**        | S2 `TextArea`      | `[S]`    | Auto-grow option                                     |
| `[ ]`  | **NumberField**     | S2 `NumberField`   | `[S]`    | Step, min/max, formatting                            |
| `[ ]`  | **SearchField**     | S2 `SearchField`   | `[S][R]` | Clear button, loading state                          |
| `[ ]`  | **PasswordField**   | Custom             | `[R]`    | TextField + show/hide toggle; no upstream equivalent |
| `[ ]`  | **Checkbox**        | S2 `Checkbox`      | `[S][R]` | Indeterminate state                                  |
| `[ ]`  | **CheckboxGroup**   | S2 `CheckboxGroup` | `[S][R]` | Horizontal and vertical orientations                 |
| `[ ]`  | **RadioGroup**      | S2 `RadioGroup`    | `[S]`    | With `Radio` child component                         |
| `[ ]`  | **Switch**          | S2 `Switch`        | `[S][R]` | On/off toggle                                        |
| `[ ]`  | **Slider**          | S2 `Slider`        | `[S][R]` | Single value; custom thumb styling                   |
| `[ ]`  | **RangeSlider**     | S2 `RangeSlider`   | `[S]`    | Two-handle range                                     |
| `[ ]`  | **Picker** (Select) | S2 `Picker`        | `[S]`    | Single-select dropdown                               |
| `[ ]`  | **ComboBox**        | S2 `ComboBox`      | `[S]`    | Filterable select with free input                    |
| `[ ]`  | **Form**            | S2 `Form`          | `[S]`    | Layout wrapper; validation integration               |

---

## Group 3 — Overlay & Popover

Depends on Group 1 (buttons trigger overlays).

| Status | Component           | Upstream                        | Ref   | Notes                                                      |
| ------ | ------------------- | ------------------------------- | ----- | ---------------------------------------------------------- |
| `[ ]`  | **Tooltip**         | S2 `Tooltip` + `TooltipTrigger` | `[S]` | Delay, placement                                           |
| `[ ]`  | **Popover**         | S2 `Popover`                    | `[S]` | Controlled and uncontrolled                                |
| `[ ]`  | **CustomPopover**   | Custom                          | `[R]` | Geti-specific popover with custom chrome; wraps S2 Popover |
| `[ ]`  | **Dialog**          | S2 `Dialog` + `DialogTrigger`   | `[S]` | Sizes, dismiss on outside click                            |
| `[ ]`  | **AlertDialog**     | S2 `AlertDialog`                | `[S]` | Confirm/cancel variants                                    |
| `[ ]`  | **DialogContainer** | S2 `DialogContainer`            | `[S]` | Programmatic dialog opening                                |
| `[ ]`  | **ContextualHelp**  | S2 `ContextualHelp`             | `[S]` | Info / help icon + popover                                 |

---

## Group 4 — Navigation

| Status | Component       | Upstream                  | Ref      | Notes                          |
| ------ | --------------- | ------------------------- | -------- | ------------------------------ |
| `[ ]`  | **Tabs**        | S2 `Tabs`                 | `[S]`    | With `TabList` and `TabPanels` |
| `[ ]`  | **Breadcrumbs** | S2 `Breadcrumbs`          | `[S][R]` | Router-aware breadcrumb items  |
| `[ ]`  | **Menu**        | S2 `Menu` + `MenuTrigger` | `[S]`    | With `ActionMenu` variant      |
| `[ ]`  | **ActionMenu**  | S2 `ActionMenu`           | `[S]`    | Icon-triggered action list     |

---

## Group 5 — Feedback & Status

| Status | Component          | Upstream            | Ref      | Notes                                                     |
| ------ | ------------------ | ------------------- | -------- | --------------------------------------------------------- |
| `[ ]`  | **ProgressBar**    | S2 `ProgressBar`    | `[S]`    | Determinate and indeterminate                             |
| `[ ]`  | **ProgressCircle** | S2 `ProgressCircle` | `[S]`    | Indeterminate spinner                                     |
| `[ ]`  | **Loading**        | Custom              | `[R]`    | Wraps ProgressCircle; inline / fullscreen / overlay modes |
| `[ ]`  | **Meter**          | S2 `Meter`          | `[S]`    | Quantity visualization                                    |
| `[ ]`  | **StatusLight**    | S2 `StatusLight`    | `[S]`    | Color-coded status indicators                             |
| `[ ]`  | **InlineAlert**    | S2 `InlineAlert`    | `[S]`    | Non-modal contextual alerts                               |
| `[ ]`  | **Toast**          | Custom              | `[R]`    | Uses `sonner` under the hood; wraps S2 toast queue        |
| `[ ]`  | **Badge**          | S2 `Badge`          | `[S]`    | Small metadata label                                      |
| `[ ]`  | **Skeleton**       | S2 `Skeleton`       | `[S][R]` | Loading placeholder; circle and rectangle variants        |

---

## Group 6 — Data Display

| Status | Component              | Upstream                | Ref   | Notes                                         |
| ------ | ---------------------- | ----------------------- | ----- | --------------------------------------------- |
| `[ ]`  | **TableView**          | S2 `TableView`          | `[S]` | Sortable, selectable; virtualized             |
| `[ ]`  | **ListView**           | S2 `ListView`           | `[S]` | Selectable list with drag-and-drop            |
| `[ ]`  | **ListBox**            | S2 `ListBox`            | `[S]` | Single/multi-select list                      |
| `[ ]`  | **TagGroup**           | S2 `TagGroup`           | `[S]` | Removable tags                                |
| `[ ]`  | **Tag**                | Custom                  | `[R]` | Standalone tag (not in a group); Geti variant |
| `[ ]`  | **IllustratedMessage** | S2 `IllustratedMessage` | `[S]` | Empty state with SVG illustration             |
| `[ ]`  | **Avatar**             | S2 `Avatar`             | `[S]` | User avatar with fallback                     |
| `[ ]`  | **AvatarGroup**        | S2 `AvatarGroup`        | `[S]` | Stacked avatars                               |
| `[ ]`  | **Image**              | S2 `Image`              | `[S]` | Skeleton loading + error state                |

---

## Group 7 — Layout & Structure

| Status | Component      | Upstream        | Ref      | Notes                                 |
| ------ | -------------- | --------------- | -------- | ------------------------------------- |
| `[ ]`  | **Flex**       | S2 / `Flex`     | `[S]`    | Flexbox layout helper                 |
| `[ ]`  | **Grid**       | S2 / `Grid`     | `[S]`    | CSS grid layout helper                |
| `[ ]`  | **View**       | S2 `View`       | `[S]`    | Styled container with Spectrum props  |
| `[ ]`  | **Divider**    | S2 `Divider`    | `[S][R]` | Horizontal/vertical separator         |
| `[ ]`  | **Disclosure** | S2 `Disclosure` | `[S]`    | Collapsible section with header/panel |
| `[ ]`  | **Accordion**  | S2 `Accordion`  | `[S]`    | Multi-item disclosure container       |
| `[ ]`  | **Well**       | S2 `Well`       | `[S]`    | Visually distinct container region    |
| `[ ]`  | **Card**       | S2 `Card`       | `[S]`    | Selectable summary card               |
| `[ ]`  | **CardView**   | S2 `CardView`   | `[S]`    | Collection of selectable cards        |

---

## Group 8 — Color Picker

Color picking is a complex multi-component feature; group these together.

| Status | Component             | Upstream               | Ref   | Notes                                              |
| ------ | --------------------- | ---------------------- | ----- | -------------------------------------------------- |
| `[ ]`  | **ColorSwatch**       | S2 `ColorSwatch`       | `[S]` | Color preview chip                                 |
| `[ ]`  | **ColorSwatchPicker** | S2 `ColorSwatchPicker` | `[S]` | List of swatches                                   |
| `[ ]`  | **ColorSlider**       | S2 `ColorSlider`       | `[S]` | Single-channel slider                              |
| `[ ]`  | **ColorArea**         | S2 `ColorArea`         | `[S]` | 2D gradient color selector                         |
| `[ ]`  | **ColorWheel**        | S2 `ColorWheel`        | `[S]` | Hue wheel                                          |
| `[ ]`  | **ColorField**        | S2 `ColorField`        | `[S]` | Hex / channel text input                           |
| `[ ]`  | **ColorThumb**        | Custom                 | `[R]` | Draggable color thumb (used inside pickers)        |
| `[ ]`  | **ColorPickerDialog** | Custom                 | `[R]` | Full color picker in a dialog; composed from above |

---

## Group 9 — Date & Time

| Status | Component           | Upstream             | Ref      | Notes                           |
| ------ | ------------------- | -------------------- | -------- | ------------------------------- |
| `[ ]`  | **DateField**       | S2 `DateField`       | `[S]`    | Keyboard-editable date segments |
| `[ ]`  | **DatePicker**      | S2 `DatePicker`      | `[S][R]` | DateField + Calendar popover    |
| `[ ]`  | **DateRangePicker** | S2 `DateRangePicker` | `[S][R]` | Two DateFields + RangeCalendar  |
| `[ ]`  | **Calendar**        | S2 `Calendar`        | `[S]`    | Single-date calendar grid       |
| `[ ]`  | **RangeCalendar**   | S2 `RangeCalendar`   | `[S]`    | Range-selection calendar        |
| `[ ]`  | **TimeField**       | S2 `TimeField`       | `[S]`    | Time segment input              |

---

## Group 10 — Advanced / Application-Specific

These components are highly specific to Geti product workflows. Implement after core library is stable.

| Status | Component                     | Upstream              | Ref      | Notes                                                 |
| ------ | ----------------------------- | --------------------- | -------- | ----------------------------------------------------- |
| `[ ]`  | **DropZone**                  | S2 `DropZone`         | `[S]`    | File and object drop target                           |
| `[ ]`  | **PressableElement**          | Custom                | `[R]`    | Generic pressable wrapper for arbitrary elements      |
| `[ ]`  | **CornerIndicator**           | Custom                | `[R][C]` | Small decorative indicator for corners of UI elements |
| `[ ]`  | **PhotoPlaceholder**          | Custom                | `[R][C]` | Avatar/photo placeholder with initials                |
| `[ ]`  | **FullscreenAction**          | Custom                | `[R][C]` | Fullscreen toggle control                             |
| `[ ]`  | **MediaViewModes**            | Custom                | `[R][C]` | Grid/list view mode switcher                          |
| `[ ]`  | **ToggleButtons**             | Custom                | `[R][C]` | Geti-specific toggle button group                     |
| `[ ]`  | **VirtualizedListLayout**     | Custom                | `[R][C]` | Virtualized list layout helper                        |
| `[ ]`  | **VirtualizedHorizontalGrid** | Custom                | `[R][C]` | Virtualized horizontal grid                           |
| `[ ]`  | **IntelBrandedLoading**       | Custom                | `[R][C]` | Intel logo loading animation                          |
| `[ ]`  | **TreeView**                  | S2 `TreeView`         | `[S]`    | Hierarchical navigation tree                          |
| `[ ]`  | **SegmentedControl**          | S2 `SegmentedControl` | `[S]`    | View-switching button group                           |
| `[ ]`  | **SelectBoxGroup**            | S2 `SelectBoxGroup`   | `[S]`    | Visual selection cards in a group                     |
| `[ ]`  | **ActionBar**                 | S2 `ActionBar`        | `[S]`    | Bulk-selection action bar                             |

---

## Group 11 — Icons Package

Icons should be a separate `@geti/icons` package to enable tree-shaking.

| Status | Task                                                          | Notes                                   |
| ------ | ------------------------------------------------------------- | --------------------------------------- |
| `[ ]`  | Set up `packages/icons/` rslib package                        | ESM-only, tree-shakeable                |
| `[ ]`  | Create SVGR pipeline                                          | Convert SVGs to typed React components  |
| `[ ]`  | Migrate 130+ custom icons from `reference-packages/ui/icons/` | Verify license on each icon             |
| `[ ]`  | Add Storybook icon gallery story                              | Visual index of all icons               |
| `[ ]`  | Document icon naming conventions                              |                                         |
| `[ ]`  | Integrate with `@spectrum-icons/workflow`                     | Re-export or alias where overlap exists |

---

## Implementation checklist per component

When implementing a component, all of the following must be done before marking `[x]`:

- [ ] Component implementation (`ComponentName.tsx`)
- [ ] TypeScript types exported from component file
- [ ] Re-export from `packages/ui/src/index.ts`
- [ ] Storybook story (`ComponentName.stories.tsx`) with: Default, all variants, interactive controls, accessibility notes
- [ ] Unit/integration tests (`ComponentName.test.tsx`): renders, keyboard nav, ARIA attributes, interactions
- [ ] JSDoc on component and non-obvious props
- [ ] Visual snapshot baseline (created by Playwright on first run)

---

## Prioritization rationale

The order above is chosen by dependency and impact:

1. **Foundation first** — no component works without the scaffold and theme
2. **Primitives before compositions** — Button before Dialog, TextField before Form
3. **High-frequency before low-frequency** — Button, TextField, and Tooltip appear in almost every screen
4. **Reference implementations exist** — components marked `[R]` can move faster
5. **Application-specific last** — Group 10 components are Geti-product-specific and need product context

One component at a time. There is no deadline pressure.
