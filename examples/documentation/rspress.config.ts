import { defineConfig } from '@rspress/core';
import path from 'node:path';
import { componentDocsPlugin } from './plugins/component-docs';

export default defineConfig({
  root: path.join(__dirname, 'docs'),
  title: 'Geti UI',
  description: 'Component design system for Intel Geti products',
  // icon: '/favicon.png',
  // logo: '/logo.png',
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
