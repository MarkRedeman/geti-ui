# Geti UI design system

We are building a new repository for the UI design system / components of Intel Geti products.
This new component system is based on React and Typescript.

Each component is strongly typed with typescript that doesn't get in the way of the user.

As a base we will use Adobe's React Spectrum component library, and we restyle and add new components on top of that. 
Later we will migrate to using Adobe's react-aria-components as headless components with tailwindcss as our styling choice. Furthermore we may consider adopting a shadcn like UX.
The later proposal to use react-aria-components will be done in phases after we finish the initial concept of our new component system.

## Design decisions

Most of our components will be small wrappers around either React Spectrum or react-aria-components (if we finished a migration). As such we often don't need to care too much about architectural decisions.
Regardless some most of what we will implement will be based on the following principles: 
- Open Closed principle (open for extension, closed for modification)
- Tell don't ask
- Composition over inheritance
- Pure and functional components

### Visual theme

The visual theme uses a dark mode design by default. The theme follows along with the theme on https://docs.geti.intel.com/.

## A modern CI & CD

An important aspect of this project is that we will have a responsive CI that helps us prevent merging regressions as well as help us design new components. It includes:
- A build system powered by [rslib](https://rslib.rs/guide/solution/react)/[rsbuild](https://rsbuild.rs/guide/framework/react)
- First party integration with storybook using [storybook-rsbuild](https://storybook.rsbuild.rs/)
- Unit and integration tests with [rstest](https://rstest.rs/guide/start/quick-start) and https://testing-library.com/
- End to end testing with [Playwright](https://playwright.dev/) with support for [visual comparisons](https://playwright.dev/docs/test-snapshots) and [accessibility testing](https://playwright.dev/docs/accessibility-testing)
- [RenovateBot](https://docs.renovatebot.com/) that automatically updates our dependencies
- We auto deploy previews of storybook to github pages, and auto deploy when merging to main

When a new PR is made to this project's repository we should auto detect which components have been affected.
We should use playwright to take screenshots of these components and post them as a comment in the PR.

Furthermore this library is designed to be used by both humans and AI bots.
We provide [AgentSkills](https://agentskills.io/home), [llms.txt](https://llmstxt.org/) as well as [MCP](https://modelcontextprotocol.io/docs/getting-started/intro).
These are based on [Adobe Spectrum's](https://react-spectrum.adobe.com/ai) and [React Aria's](https://react-aria.adobe.com/ai) AI guidelines.

Opens:
- Do we use storybook as our primary website, or do we add [rspress](https://rspress.rs/) or docusaurus? (already used by our main website)

## Build system

Rstack
https://rslib.rs/guide/solution/react
https://rstest.rs/guide/start/quick-start
https://rslint.rs/rules/
https://github.com/rstackjs/agent-skills
https://github.com/rstackjs/storybook-rsbuild
npx skills add rstackjs/agent-skills --skill storybook-rsbuild

https://github.com/rstackjs/storybook-rsbuild/tree/main/sandboxes/react-18
https://github.com/rstackjs/storybook-rsbuild/tree/main/sandboxes/rslib-react-component

## Continuous Integration

### Playwright and auto screenshots
https://github.com/microsoft/playwright-mcp
https://github.com/microsoft/playwright-cli

### Rstest

### Storybook

### Renovate configuration

## Theme
