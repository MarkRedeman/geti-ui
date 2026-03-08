# Example Rspress Application

A documentation site for `@geti/ui` built with [Rspress](https://rspress.dev), placed at `documentation/`.

## Goals

1. **Homepage** — showcase components in a visually appealing way (hero + feature grid)
2. **Component docs** — one page per component, content sourced from each component's `readme.md`
3. **"Used by" page** — lists projects consuming this design system

## Key decisions

| Topic | Decision | Rationale |
|---|---|---|
| **Routing** | Rspress built-in file-based routing | Rspress uses `react-router-dom` v7 internally via `BrowserRouter`. React Router "data mode" (`RouterProvider` + loaders) requires being the root router and conflicts. We use Rspress's native routing + its re-exported hooks (`useNavigate`, `Link`, etc.) instead. |
| **MDX** | Rspress native MDX support | First-class — no plugins needed. `.md` and `.mdx` files compile to React components at build time. |
| **External docs** | `addPages` plugin | Reads `readme.md` files from `packages/ui/src/components/{category}/{component}/readme.md` and maps them to `/components/{category}/{component}` routes. More flexible than `route.include`. |
| **Directory** | `documentation/` | Changed from `documentation-spa` since Rspress is an SSG framework, not a traditional SPA. |
| **Workspace** | Add `"documentation"` to `pnpm-workspace.yaml` | Allows the docs app to consume `@geti/ui` as a workspace dependency. |

## Architecture

```
documentation/
├── docs/                          # Rspress document root
│   ├── index.mdx                  # Homepage (pageType: home)
│   ├── used-by.mdx                # "Used by" page (pageType: custom or doc)
│   └── components/                # Auto-generated component doc routes (via plugin)
├── theme/                         # Theme customization
│   ├── index.tsx                  # Layout overrides, dark mode
│   └── index.css                  # CSS variable overrides for Geti theme
├── plugins/
│   └── component-docs.ts         # addPages plugin that reads readme.md files
├── public/                        # Static assets (logos, favicons)
├── rspress.config.ts              # Central config
├── package.json
└── tsconfig.json
```

### Component categories mapped to sidebar

| Category | Components | Route prefix |
|---|---|---|
| `data/` | ActionBar, CardView, ListBox, ListView, TableView, Tag, TagGroup, TreeView, etc. (10) | `/components/data/` |
| `feedback/` | Badge, IllustratedMessage, InlineAlert, Loading, Meter, ProgressBar, Skeleton, StatusLight, Toast, etc. (11) | `/components/feedback/` |
| `form/` | Checkbox, CheckboxGroup, DropZone, NumberField, RadioGroup, SearchField, Slider, Switch, TextField, etc. (15) | `/components/form/` |
| `form/pickers/` | Calendar, ColorArea, ColorField, ComboBox, DatePicker, Picker, TimeField, etc. (14) | `/components/form/pickers/` |
| `layouts/` | Accordion, Card, Disclosure, Flex, Grid, Well (6) | `/components/layouts/` |
| `navigation/` | ActionMenu, Breadcrumbs, Link, Menu, Tabs (6) | `/components/navigation/` |
| `overlays/` | AlertDialog, Dialog, DialogContainer, Popover, Tooltip, etc. (8) | `/components/overlays/` |
| `ui/` | ActionButton, Avatar, Button, Divider, Image, ToggleButton, View, etc. (11) | `/components/ui/` |

**Total: ~81 component pages** sourced from 88 existing `readme.md` files.

---

## Execution Plan

### Phase 1: Scaffold & workspace integration
- [ ] Add `"documentation"` to `pnpm-workspace.yaml`
- [ ] Scaffold Rspress project in `documentation/` using `npm create rspress@latest`
- [ ] Update the generated `package.json`: add `@geti/ui` as a workspace dependency (`"@geti/ui": "workspace:*"`)
- [ ] Run `pnpm install` from root to link workspace packages
- [ ] Verify `pnpm --filter documentation dev` starts the dev server

### Phase 2: Theme & configuration
- [ ] Configure `rspress.config.ts` with site title ("Geti UI"), description, dark mode default, and sidebar structure
- [ ] Create `theme/index.css` with Geti dark theme CSS variable overrides
- [ ] Create `theme/index.tsx` to customize the layout (dark mode default, optional Geti branding in navbar)
- [ ] Add Geti logo to `public/` and reference it in config (`logo` / `icon` fields)

### Phase 3: Homepage
- [ ] Create `docs/index.mdx` with `pageType: home` frontmatter
- [ ] Add hero section: title "Geti UI", tagline, CTA buttons ("Get Started", "Components")
- [ ] Add features grid showcasing component categories with icons and descriptions
- [ ] Optionally embed live component demos (import `@geti/ui` components directly in MDX)

### Phase 4: Component docs via `addPages` plugin
- [ ] Create `plugins/component-docs.ts` — an Rspress plugin using the `addPages` hook
- [ ] The plugin should:
  - Glob `packages/ui/src/components/{category}/{component}/readme.md`
  - Map each file to a route: `/components/{category}/{component}`
  - Inject frontmatter (title, sidebar label, sidebar group) programmatically
- [ ] Configure sidebar in `rspress.config.ts` to group components by category
- [ ] Verify all ~81 component pages render correctly from their source `readme.md` files
- [ ] Add category-level index pages (one per category) using the category-level `readme.md` files

### Phase 5: "Used by" page
- [ ] Create `docs/used-by.mdx` (or `.tsx` with `pageType: custom` for richer layout)
- [ ] List projects with logos/descriptions:
  - Geti
  - Anomalib Studio
  - Geti Instant Learn
  - Geti Tune
  - Physical AI Studio
- [ ] Add to navbar navigation

### Phase 6: Polish & CI integration
- [ ] Add scripts to root `package.json`: `"docs:dev"`, `"docs:build"`, `"docs:preview"`
- [ ] Add the example to CI workflow (build check)
- [ ] Verify the full static build works: `pnpm --filter documentation build`
- [ ] Test that component readme changes are reflected on rebuild
- [ ] Add a brief README.md to `documentation/` explaining how to run it

---

## Notes

- **88 existing `readme.md` files** across components — these are the primary content source
- **`form/pickers/`** is the only nested sub-category — the plugin and sidebar must handle 2-level nesting
- The library is ESM-first with a single `@geti/ui` entry point — straightforward to import in MDX
- Rspress re-exports all `react-router-dom` hooks from `@rspress/core/runtime` — use those for any programmatic navigation
