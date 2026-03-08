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
  markdown: {},
  builderConfig: {
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
      { text: 'Components', link: '/components/ui/Button' },
      { text: 'Assets', link: '/assets/' },
      { text: 'Examples', link: '/examples' },
      { text: 'Used By', link: '/used-by' },
    ],
    sidebar: {
      '/assets': [
        {
          text: 'Assets',
          collapsed: false,
          items: [
            { text: 'Overview', link: '/assets/' },
            { text: 'Icons', link: '/assets/icons' },
            { text: 'Images', link: '/assets/images' },
            { text: 'Domains', link: '/assets/domains' },
            { text: 'Primary Tools', link: '/assets/primary-tools' },
          ],
        },
      ],
      '/assets/': [
        {
          text: 'Assets',
          collapsed: false,
          items: [
            { text: 'Overview', link: '/assets/' },
            { text: 'Icons', link: '/assets/icons' },
            { text: 'Images', link: '/assets/images' },
            { text: 'Domains', link: '/assets/domains' },
            { text: 'Primary Tools', link: '/assets/primary-tools' },
          ],
        },
      ],
      '/examples': [
        {
          text: 'Kitchensinks',
          collapsed: false,
          items: [
            { text: 'Kitchensink', link: '/examples/kitchensink' },
            { text: 'UI kitchensink', link: '/examples/kitchensink-ui' },
            { text: 'Form kitchensink', link: '/examples/kitchensink-form' },
            { text: 'Date controls kitchensink', link: '/examples/kitchensink-date-controls' },
            { text: 'Color controls kitchensink', link: '/examples/kitchensink-color-controls' },
            { text: 'Data kitchensink', link: '/examples/kitchensink-data' },
            { text: 'Overlays kitchensink', link: '/examples/kitchensink-overlays' },
            { text: 'Feedback kitchensink', link: '/examples/kitchensink-feedback' },
            { text: 'Navigation kitchensink', link: '/examples/kitchensink-navigation' },
            { text: 'Layouts kitchensink', link: '/examples/kitchensink-layouts' },
          ],
        },
        {
          text: 'Composed examples',
          collapsed: false,
          items: [
            { text: 'Job management panel', link: '/examples/job-management-panel' },
            { text: 'Model list', link: '/examples/model-list' },
            { text: 'Annotation components', link: '/examples/annotation-components' },
            { text: 'Media filter', link: '/examples/media-filter' },
            { text: 'Media grid', link: '/examples/media-grid' },
            { text: 'Toolbar', link: '/examples/toolbar' },
            { text: 'Project list', link: '/examples/project-list' },
            { text: 'Project menu', link: '/examples/project-menu' },
            { text: 'Advanced parameters', link: '/examples/advanced-parameters' },
          ],
        },
      ],
      '/examples/': [
        {
          text: 'Kitchensinks',
          collapsed: false,
          items: [
            { text: 'Kitchensink', link: '/examples/kitchensink' },
            { text: 'UI kitchensink', link: '/examples/kitchensink-ui' },
            { text: 'Form kitchensink', link: '/examples/kitchensink-form' },
            { text: 'Date controls kitchensink', link: '/examples/kitchensink-date-controls' },
            { text: 'Color controls kitchensink', link: '/examples/kitchensink-color-controls' },
            { text: 'Data kitchensink', link: '/examples/kitchensink-data' },
            { text: 'Overlays kitchensink', link: '/examples/kitchensink-overlays' },
            { text: 'Feedback kitchensink', link: '/examples/kitchensink-feedback' },
            { text: 'Navigation kitchensink', link: '/examples/kitchensink-navigation' },
            { text: 'Layouts kitchensink', link: '/examples/kitchensink-layouts' },
          ],
        },
        {
          text: 'Composed examples',
          collapsed: false,
          items: [
            { text: 'Job management panel', link: '/examples/job-management-panel' },
            { text: 'Model list', link: '/examples/model-list' },
            { text: 'Annotation components', link: '/examples/annotation-components' },
            { text: 'Media filter', link: '/examples/media-filter' },
            { text: 'Media grid', link: '/examples/media-grid' },
            { text: 'Toolbar', link: '/examples/toolbar' },
            { text: 'Project list', link: '/examples/project-list' },
            { text: 'Project menu', link: '/examples/project-menu' },
            { text: 'Advanced parameters', link: '/examples/advanced-parameters' },
          ],
        },
      ],
    },
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
