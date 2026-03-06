# Geti UI component design system

Please have a look at @requirements.md this file describes the requirements and design choices for a new project that I'd like to set up.
I'd like you to make a plan for implementing this concept.

The plan should contain the following steps:
- setup an rslib (or rsbuild?) project that includes storybook
- setup CI & CD, create a todo list for:
  - unit & integration tests with rstest [rstest](https://rstest.rs/guide/start/quick-start) and [testing library](https://testing-library.com/)
  - End to end testing with [Playwright](https://playwright.dev/) with support for [visual comparisons](https://playwright.dev/docs/test-snapshots) and [accessibility testing](https://playwright.dev/docs/accessibility-testing)

  - [RenovateBot](https://docs.renovatebot.com/) that automatically updates our dependencies
  - deployment to github pages
  - github actions integration
- Setup our custom AI agent infrastructure - we can start out with a simple `AGENTS.md` file.
  - Create a TODO list for the mcp, skills and llms.txt integration
- UI component integration

For the UI component integration we will start out with what we already have, which is a "unofficial" `@geti/ui` package that we cloned via,

```bash
npx tiged --force --mode=git https://github.com/open-edge-platform/geti.git/web_ui/packages/config#66e564274dbc35e173b78802587060e463846060 reference-packages/config 
npx tiged --force --mode=git https://github.com/open-edge-platform/geti.git/web_ui/packages/ui#66e564274dbc35e173b78802587060e463846060 reference-packages/ui
```

These components are meant as a reference: we will use it to start building our own component library. On occasion we can copy over component implementation from these folder, however we should not use it as a source of truth.
We will start from scratch, first setting up a rslib + storybook project.

I'd like you to make sure we have a separate `components-todo-list.md` where we describe which component to work on next.
Ideally we should also group these components in some form of category.

Note that while I cloned these into the @packages folder, I have not yet spend time on the actual set up for this.

Please let someone analyze the components exposed by these packages - as well as the one from React Specturm and react-aria-components.
And then come up with a plan to integrate each component 1 step at a time.

I want to emphasize here that all of these plans have a very long deadline: it is better to be correct than to be hasty.

Use conventional commits when commiting changes and commit frequently.
