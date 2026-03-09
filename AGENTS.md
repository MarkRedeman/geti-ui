# AGENTS.md — Geti UI Design System

This file is for AI coding agents (Copilot, Claude, Cursor, etc.) working on this repository. It describes where things are, how the project works, and what conventions to follow.

---

## Repository purpose

`geti-ui` is the component design system for Intel Geti products. It exports a React + TypeScript component library built on top of Adobe React Spectrum and react-aria-components. Components are published as `@geti-ai/ui`.

---

## Project structure

```
geti-ui/
├── packages/
│   └── ui/                    # Main library package (rslib)
│       ├── src/
│       │   ├── components/    # One folder per component
│       │   └── index.ts       # Public exports
│       ├── .storybook/        # Storybook config
│       ├── e2e/               # Playwright end-to-end tests
│       ├── rslib.config.ts
│       ├── rstest.config.ts
│       └── package.json
├── reference-packages/        # READ ONLY — cloned from open-edge-platform/geti
│   ├── ui/                    # Reference component implementations
│   └── config/                # Reference ESLint/TypeScript config
├── .github/
│   └── workflows/             # CI/CD GitHub Actions
├── .agents/
│   └── skills/                # AgentSkills definitions
├── documentation/             # Rspress docs site
├── AGENTS.md                  # This file
├── plans/PLAN.md              # Master implementation plan
├── plans/components-todo-list.md # Component backlog
└── renovate.json              # Dependency update config
```

---

## Upstream libraries

| Library                      | Purpose                                         | Docs                                                                |
| ---------------------------- | ----------------------------------------------- | ------------------------------------------------------------------- |
| `@adobe/react-spectrum` (v3) | Current base — pre-styled accessible components | https://react-spectrum.adobe.com/react-spectrum/                    |
| `@react-spectrum/s2`         | Future base — Spectrum 2 design system          | https://react-spectrum.adobe.com/s2/                                |
| `react-aria-components`      | Headless accessible primitives                  | https://react-spectrum.adobe.com/react-aria/                        |
| `@spectrum-icons/workflow`   | Adobe workflow icon set                         | https://react-spectrum.adobe.com/react-spectrum/workflow-icons.html |

**Migration path:** React Spectrum v3 → Spectrum 2 → react-aria-components + Tailwind CSS (in phases, see `plans/PLAN.md`).

---

## Component conventions

### File structure per component

```
src/components/button/
├── Button.tsx              # Component implementation + type exports
├── Button.stories.tsx      # Storybook stories
├── Button.test.tsx         # rstest unit tests
└── index.ts                # Re-export (optional, for cleaner imports)
```

### TypeScript patterns

- Extend from upstream Spectrum/aria prop types rather than redefining them
- Export the component's Props type explicitly
- No `any` types — use generics or `unknown` when necessary
- Prefer `type` for component props (consistency across codebase)
- Use **relative imports** — no path aliases (e.g. `../button/Button`, not `@geti-ai/ui/button`)

```tsx
// Good
import { SpectrumButtonProps } from '@adobe/react-spectrum';

export interface ButtonProps extends Omit<SpectrumButtonProps, 'variant'> {
  variant?: 'primary' | 'secondary' | 'accent';
}

export const Button = (props: ButtonProps) => { ... };
```

### Wrapping React Spectrum components

- Pass all upstream props through with spread (`...rest`)
- Only intercept props you are changing or adding
- Use `UNSAFE_className` for CSS overrides (not `UNSAFE_style`)
- Never use `UNSAFE_className` in tests — rely on ARIA/semantic selectors

```tsx
// Good
export const Button = ({ variant = "accent", ...rest }: ButtonProps) => (
  <SpectrumButton {...rest} variant={variant} />
);
```

### Storybook stories

- Use CSF3 format (`export default { component: Button }`)
- Always provide a `Default` story
- Cover all meaningful variants and states
- Use `argTypes` for interactive controls
- Add `parameters.a11y` for accessibility annotations

```tsx
import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./Button";

const meta: Meta<typeof Button> = {
  component: Button,
};
export default meta;
type Story = StoryObj<typeof Button>;

export const Default: Story = {
  args: { children: "Click me" },
};
```

### Tests

- Use `@testing-library/react` + `@testing-library/user-event`
- Query by role, label, or text — never by class or test ID
- Test: renders without crash, keyboard interactions, ARIA attributes, edge cases
- Accessibility: use `@axe-core/react` in integration tests where appropriate

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

test("calls onPress when clicked", async () => {
  const onPress = vi.fn();
  render(<Button onPress={onPress}>Save</Button>);
  await userEvent.click(screen.getByRole("button", { name: "Save" }));
  expect(onPress).toHaveBeenCalledOnce();
});
```

---

## Reference packages

`reference-packages/` contains a snapshot of the existing `@geti-ai/ui` implementation from the main Geti repository. These files are **read-only reference material**:

- Do not modify files in `reference-packages/`
- Do not import from `reference-packages/` in the new library
- Use them to understand existing component APIs and copy patterns as a starting point
- They will not have their own `node_modules` installed — LSP errors there are expected

---

## Theme

The library is dark-mode-first. The theme is a custom CSS variable set that overrides Adobe Spectrum's design tokens.

- `ThemeProvider` wraps `@adobe/react-spectrum` `Provider` with `colorScheme="dark"` and the Geti theme
- Always render stories inside `ThemeProvider` (configured globally in `.storybook/preview.tsx`)
- Theme tokens are implemented in `src/theme/geti-*.module.css` (with shared token values in theme CSS files)

---

## Commits

Use **Conventional Commits** format:

```
feat(button): add colorVariant prop to ActionButton
fix(tooltip): correct placement offset on small screens
docs(readme): add installation instructions
chore(deps): update @adobe/react-spectrum to 3.44.0
test(checkbox): add indeterminate state tests
```

Types: `feat`, `fix`, `docs`, `chore`, `test`, `refactor`, `ci`, `perf`, `style`

---

## AI-specific tooling (planned — see TODO below)

This library is designed to be used by both humans and AI agents.

### Available now

- `AGENTS.md` (this file) — repository context for AI agents

### Planned

- **AgentSkills** — `.agents/skills/geti-ui/` — skill definition for building with Geti UI components
- **llms.txt** — `/llms.txt` — machine-readable index per https://llmstxt.org/
- **MCP Server** — exposes component metadata, prop types, and story URLs via Model Context Protocol

### AI TODO list

- [ ] Write initial `llms.txt` at repository root
  - Component list with brief descriptions
  - Usage pattern summary
  - Link to Storybook
  - Reference Adobe Spectrum's `llms.txt` at https://react-spectrum.adobe.com/llms.txt
- [ ] Implement `@geti-ai/ui` AgentSkill in `.agents/skills/geti-ui/SKILL.md`
  - Component discovery workflow
  - Theming conventions
  - Import patterns
  - Story-writing workflow
- [ ] MCP Server implementation
  - Read-only: lists components, returns prop types and stories
  - Based on https://modelcontextprotocol.io/docs/getting-started/intro
  - Reference: https://react-spectrum.adobe.com/ai (Adobe's MCP approach)
  - Playwright MCP integration for visual testing: https://github.com/microsoft/playwright-mcp
- [ ] Add `parameters.docs` metadata to all stories (component category, tags)
- [ ] Generate `llms.txt` automatically from Storybook metadata at build time

---

## Commands

> Core commands currently available in this repository.

```bash
# Development
npm run storybook             # Start Storybook dev server
npm run test                  # Run rstest unit tests
npm run test:watch            # Watch mode
npm run test:e2e              # Run Playwright tests (requires Storybook running)
npm run build                 # Build library with rslib
npm run type-check            # TypeScript check without emit
npm run lint                  # Rslint (rslint)
npm run format                # Prettier format
npm run format:check          # Prettier format check (used in CI)

# Storybook
npm run storybook:build       # Build static Storybook
```
