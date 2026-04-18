# Getting Started with Geti Packages

Welcome to the Geti frontend package workspace.

This repository currently contains:

- `@geti-ui/ui`: React component design system for Intel Geti products.
- `@geti-ui/blocks`: composable application-level building blocks built on top of `@geti-ui/ui`.
- `@geti-ui/smart-tools`: browser/worker smart-tooling utilities (OpenCV/ONNX based).
- `@geti-ui/charts`: composable chart primitives and ML-oriented chart compositions.
- `@geti-ui/mcp`: MCP server that exposes docs/tools for AI agents.

---

## 🏗 Architecture & Design

`@geti-ui/ui` follows a thin-wrapper pattern on top of [React Spectrum v3](https://react-spectrum.adobe.com/v3/getting-started.html) and `react-aria-components`.

`@geti-ui/smart-tools` provides framework-agnostic tool logic, model wrappers, and utility functions, with package docs under `documentation/docs/smart-tools/`.

`@geti-ui/charts` provides themed chart primitives and higher-level ML composition charts, with docs under `documentation/docs/charts/`.

### Future Roadmap
We are planning a gradual migration from React Spectrum v3 to a [react-aria-components](https://react-spectrum.adobe.com/react-aria/react-aria-components.html)-based implementation. This transition will be executed in phases, allowing us to maintain visual consistency while gaining more control over the DOM structure and styling.

### UI Component Domains
`@geti-ui/ui` components are organized into logical categories:

- **`ui/`**: Low-level foundational elements (Buttons, Icons, Dividers, Badges).
- **`form/`**: User input and data entry (Inputs, Checkboxes, Selects, File Uploaders).
- **`data/`**: Visualization and structured information (Tables, Lists, Cards, Tag Groups).
- **`navigation/`**: Movement through the application (Tabs, Breadcrumbs, Steppers).
- **`feedback/`**: Status updates and user communication (Loading, Alerts, Progress Bars).
- **`overlays/`**: Contextual UI that appears above the main flow (Modals, Dialogs, Tooltips).
- **`layouts/`**: Structural components for spacing and page flow (Flex, Grid, Page Headers).

---

## 🎨 Theming & Styling

Geti UI is **dark-mode first**. The theme is driven by a custom set of CSS variables (tokens) that override Adobe Spectrum's design tokens.

- **Design Tokens**: Defined across `src/theme/geti-global.module.css` (brand palette, animation, global overrides), `src/theme/geti-dark.module.css` (dark-mode color ramp), and related scale/light variants. Tokens are assembled into the `getiTheme` object in `src/theme/theme.ts`.
- **CSS Modules**: Used for component-specific overrides when Spectrum's standard props aren't sufficient.

---

## 🚀 Usage

### Prerequisites

- **Node.js** 24 or later
- **npm** 11 or later

### Install UI package

```bash
npm install @geti-ui/ui
```

After installing, import the bundled stylesheet once at your application entry point so that component styles are loaded:

```ts
import '@geti-ui/ui/styles.css';
```

### Wrapping your App

You must wrap your application root with the `ThemeProvider` to provide the Geti brand colors and Adobe Spectrum context:

```tsx
import '@geti-ui/ui/styles.css';
import { ThemeProvider } from '@geti-ui/ui';

function App() {
  return (
    <ThemeProvider>
      <YourAppContent />
    </ThemeProvider>
  );
}
```

### Using Components

Import components directly from the package:

```tsx
import { Button, Flex, TextField } from '@geti-ui/ui';

export const MyComponent = () => (
  <Flex gap="size-100">
    <TextField label="Name" placeholder="Enter your name" />
    <Button variant="accent">Save</Button>
  </Flex>
);
```

> **Note:** Prefer Geti's `Flex`/`Grid` layout components or Adobe Spectrum style props over plain `div` + inline styles, to stay within the design-token system.

### Install smart-tools package

```bash
npm install @geti-ui/smart-tools
```

Example imports:

```ts
import { buildGrabcutInstance } from '@geti-ui/smart-tools';
import { buildRITMInstance, RITMModels } from '@geti-ui/smart-tools/ritm';
import { buildSegmentAnythingInstance, SegmentAnythingModels } from '@geti-ui/smart-tools/segment-anything';
```

For OpenCV build/runtime constraints, see smart-tools docs:

- `documentation/docs/smart-tools/opencv.mdx`

---

## 📚 Development & Documentation

### Storybook
Storybook is available for UI development and visual debugging.
```bash
npm run storybook
```
Primary docs source of truth is the docs site (`documentation/`).

### Conventional Commits
To ensure automated releases and clean changelogs, we strictly follow [Conventional Commits](https://www.conventionalcommits.org/):
- `feat(button): add loading state`
- `fix(table): resolve overflow in narrow containers`
### Releases
We use **release-please** for automated, PR-first versioning. When your PR is merged to `main`, release-please analyses conventional commit messages and opens/updates a release PR. When that release PR is merged, the workflow creates the git tag + GitHub Release and publishes to npm. No manual version management is needed - just write good commit messages.

---

## 🤝 Contributing

Before adding a new component or modifying an existing one:
1. Check the **KitchenSink** stories in Storybook to see existing patterns.
2. Read the **Security Architecture** in `docs/security.md`.
3. Ensure all new components follow the **Accessibility (A11y)** standards provided by the underlying React Spectrum primitives.
