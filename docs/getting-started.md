# Getting Started with Geti UI

Welcome to the **Geti UI Design System**, the official component library for Intel Geti products. 

Geti UI is built as a robust, accessible, and high-performance React component library on top of **Adobe React Spectrum** and **react-aria-components**, with custom Geti branding and theming.

---

## 🏗 Architecture & Design

Geti UI follows a **thin-wrapper pattern**. Instead of reinventing core UI logic, we wrap industry-standard accessible primitives from [React Spectrum v3](https://react-spectrum.adobe.com/v3/getting-started.html) to provide a consistent visual language while maintaining full accessibility and keyboard support.

### Future Roadmap
We are planning a gradual migration from React Spectrum v3 to a [react-aria-components](https://react-spectrum.adobe.com/react-aria/react-aria-components.html)-based implementation. This transition will be executed in phases, allowing us to maintain visual consistency while gaining more control over the DOM structure and styling.

### Component Domains
Components are organized into logical categories to simplify discovery:

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

### Installation

```bash
npm install @geti/ui
```

After installing, import the bundled stylesheet once at your application entry point so that component styles are loaded:

```ts
import '@geti/ui/styles.css';
```

### Wrapping your App

You must wrap your application root with the `ThemeProvider` to provide the Geti brand colors and Adobe Spectrum context:

```tsx
import '@geti/ui/styles.css';
import { ThemeProvider } from '@geti/ui';

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
import { Button, Flex, TextField } from '@geti/ui';

export const MyComponent = () => (
  <Flex gap="size-100">
    <TextField label="Name" placeholder="Enter your name" />
    <Button variant="accent">Save</Button>
  </Flex>
);
```

> **Note:** Prefer Geti's `Flex`/`Grid` layout components or Adobe Spectrum style props over plain `div` + inline styles, to stay within the design-token system.

---

## 📚 Development & Documentation

### Storybook
We use Storybook for component documentation and visual testing. 
```bash
npm run storybook
```
Each component has a `*.stories.tsx` file covering its variants, states (disabled, error, loading), and accessibility scenarios.

### Conventional Commits
To ensure automated releases and clean changelogs, we strictly follow [Conventional Commits](https://www.conventionalcommits.org/):
- `feat(button): add loading state`
- `fix(table): resolve overflow in narrow containers`

### Releases
We use **Changesets** for versioning. When contributing a change that affects the package version, run:
```bash
npx changeset
```

---

## 🤝 Contributing

Before adding a new component or modifying an existing one:
1. Check the **KitchenSink** stories in Storybook to see existing patterns.
2. Read the **Security Architecture** in `docs/security.md`.
3. Ensure all new components follow the **Accessibility (A11y)** standards provided by the underlying React Spectrum primitives.
