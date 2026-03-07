# Example Rspress application

Let's build a new example application that consumes our package directly.
This application should be placed in `examples/documentation-spa/` and should be scaffolded using,
```
npm create rspress@latest
```

The application should have a homepage where we showcase most of the components in a nice way.

Next there will also be a "docs" page that includes a single page per component, similar to how other UI component design systems do this.

We can also add a "Used by" page where we list the projects using this design system:
- Geti
- Anomalib Studio
- Geti Instant Learn
- Geti Tune
- Physical AI Studio

## routing with react router

We will use react router with data mode to handle any page navigation.

## mdx support

The application should support rendering markdown and mdx files.
Specifically the "docs" pages should be reading the readme.md files from the `packages/ui/components/{category}/{component}/readme.md` files and use that for its contents.


