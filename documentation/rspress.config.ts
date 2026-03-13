import { defineConfig } from '@rspress/core';
import { pluginLlms } from '@rspress/plugin-llms';
import { pluginPreview } from '@rspress/plugin-preview';
import { pluginSitemap } from '@rspress/plugin-sitemap';
import path from 'node:path';
import { pluginSkills } from './plugins/skills-endpoint';
import sidebars from './sidebars.json';

const {
    componentsSidebar,
    chartsSidebar,
    assetsSidebar,
    smartToolsSidebar,
    aiSidebar,
    examplesSidebar,
} = sidebars;

export default defineConfig({
    root: path.join(__dirname, 'docs'),
    route: {
        cleanUrls: true,
    },
    title: 'Geti UI',
    description: 'Component design system for Intel Geti products',
    // icon: '/favicon.png',
    logo: '/geti-logo.svg',
    // Disable SSG because Adobe React Spectrum uses browser APIs (e.g. `document`)
    // at module evaluation time, which is incompatible with Node.js SSR/SSG.
    ssg: false,
    markdown: {},
    builderConfig: {
        html: {
            template: './static/index.html',
            tags: [
                {
                    tag: 'script',
                    children: "window.RSPRESS_THEME = 'dark';",
                    append: false,
                },
            ],
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
        darkMode: false,
        llmsUI: true,
        nav: [
            { text: 'Components', link: '/components/installation', activeMatch: '/components/' },
            { text: 'Assets', link: '/assets/', activeMatch: '/assets/' },
            { text: 'Charts', link: '/charts/installation', activeMatch: '/charts/' },
            { text: 'Smart tools', link: '/smart-tools/installation', activeMatch: '/smart-tools/' },
            { text: 'Examples', link: '/examples', activeMatch: '/examples' },
            { text: 'AI', link: '/ai/overview', activeMatch: '/ai/' },
        ],
        sidebar: {
            '/components': componentsSidebar,
            '/components/': componentsSidebar,
            '/assets': assetsSidebar,
            '/assets/': assetsSidebar,
            '/charts': chartsSidebar,
            '/charts/': chartsSidebar,
            '/smart-tools': smartToolsSidebar,
            '/smart-tools/': smartToolsSidebar,
            '/examples': examplesSidebar,
            '/examples/': examplesSidebar,
            '/ai': aiSidebar,
            '/ai/': aiSidebar,
        },
        socialLinks: [
            {
                icon: 'github',
                mode: 'link',
                content: 'https://github.com/MarkRedeman/geti-ui',
            },
        ],
        footer: {
            message: '© Intel Corporation',
        },
    },
    plugins: [
        pluginPreview(),
        pluginLlms(),
        pluginSitemap({
            siteUrl: 'https://docs.geti-ui.markredeman.nl',
            defaultChangeFreq: 'weekly',
            defaultPriority: '0.7',
        }),
        pluginSkills(),
    ],
});
