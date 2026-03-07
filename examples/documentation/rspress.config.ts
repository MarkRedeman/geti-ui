import { defineConfig } from '@rspress/core';
import path from 'node:path';
import { componentDocsPlugin } from './plugins/component-docs';

export default defineConfig({
  root: path.join(__dirname, 'docs'),
  title: 'Geti UI',
  description: 'Component design system for Intel Geti products',
  // icon: '/favicon.png',
  // logo: '/logo.png',
  // Disable SSG because Adobe React Spectrum uses browser APIs (e.g. `document`)
  // at module evaluation time, which is incompatible with Node.js SSR/SSG.
  ssg: false,
  markdown: {
    // Exclude Storybook-internal /docs/... links from dead-link checking.
    // These links appear in component MDX source files (written for Storybook)
    // and cannot be resolved in the Rspress build context.
    link: {
      checkDeadLinks: {
        excludes: (url: string) => url.startsWith('/docs/') || url.includes('?path=/docs/'),
      },
    },
  },
  builderConfig: {
    source: {
      // Ensure the component source files from @geti/ui are compiled
      // with the full TypeScript/JSX transform (not treated as external CJS).
      include: [path.resolve(__dirname, '../../packages/ui/src')],
    },
    tools: {
      rspack: {
        module: {
          parser: {
            javascript: {
              // Downgrade ESM linking errors to warnings so that components
              // re-exporting from @adobe/react-spectrum (CJS) don't break the build.
              exportsPresence: 'warn',
            },
          },
        },
      },
    },
  },
  themeConfig: {
    darkMode: true,
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Components', link: '/components/ui/Button' },
      { text: 'Used By', link: '/used-by' },
    ],
    socialLinks: [
      {
        icon: 'github',
        mode: 'link',
        content: 'https://github.com/open-edge-platform/geti-ui',
      },
    ],
    footer: {
      message: '© Intel Corporation',
    },
  },
  plugins: [componentDocsPlugin()],
});
