# Geti UI Design System

A comprehensive React component library for Intel Geti products, built on top of Adobe React Spectrum and react-aria-components.

## Project Structure

- `packages/ui/`: Main library package (built with `rslib`)
- `packages/ui/src/components/`: Component implementations
- `packages/ui/src/theme/`: Custom Geti theme and CSS tokens
- `packages/ui/.storybook/`: Storybook configuration

## Available Components

The library exports over 70+ components categorized as follows:

- **Primitive Actions**: Button, ActionButton, ToggleButton, Link, FileTrigger
- **Form Controls**: TextField, TextArea, NumberField, SearchField, PasswordField, Checkbox, RadioGroup, Switch, Slider, Picker, ComboBox, Form
- **Overlay & Popover**: Tooltip, Popover, Dialog, AlertDialog, ContextualHelp
- **Navigation**: Tabs, Breadcrumbs, Menu, ActionMenu
- **Status & Feedback**: ProgressBar, ProgressCircle, StatusLight, InlineAlert, Toast, Badge, Skeleton
- **Data Display**: TableView, ListView, ListBox, TagGroup, Avatar, Image
- **Layout**: Flex, Grid, View, Divider, Disclosure, Accordion, Well, Card
- **Color Picker**: ColorSwatch, ColorSwatchPicker, ColorSlider, ColorArea, ColorWheel, ColorField, ColorPickerDialog
- **Date & Time**: DateField, TimeField, Calendar, DatePicker, DateRangePicker
- **Advanced**: VirtualizedListLayout, VirtualizedHorizontalGrid, ToggleButtons, IntelBrandedLoading, FullscreenAction

## Development Workflow

### Prerequisites

- `pnpm` (Workspace managed)
- `node` (v18+)

### Scripts

Run these from the root using `pnpm --filter @geti/ui <command>` or inside `packages/ui`:

```bash
pnpm install       # Install dependencies
pnpm storybook     # Start Storybook dev server
pnpm build         # Build the library (ESM/CJS/Types)
pnpm test          # Run unit tests (rstest)
pnpm lint          # Run ESLint
pnpm type-check    # Run TypeScript check
```

## Component Conventions

- **Theme**: All components are dark-mode first. Use `ThemeProvider` to wrap your application.
- **Styling**: Components use CSS Modules for Geti-specific overrides.
- **Accessibility**: Built on Adobe Spectrum primitives to ensure high accessibility standards (WCAG 2.1).

## License

Internal Intel Project.
