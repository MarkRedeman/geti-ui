import { defineConfig } from '@rspress/core';
import { pluginLlms } from '@rspress/plugin-llms';
import { pluginPreview } from '@rspress/plugin-preview';
import { pluginSitemap } from '@rspress/plugin-sitemap';
import path from 'node:path';
import { componentDocsPlugin } from './plugins/component-docs';

const chartsSidebar = [
    {
        text: 'Charts',
        collapsed: false,
        items: [
            { text: 'Installation', link: '/charts/installation' },
            { text: 'Overview', link: '/charts/overview' },
            {
                text: 'Theming',
                link: '/charts/theming',
                collapsed: false,
                items: [
                    { text: 'Overview', link: '/charts/theming' },
                    { text: 'Dataset subsets', link: '/charts/theming/dataset-subsets' },
                ],
            },
            {
                text: 'Primitives',
                link: '/charts/primitives',
                collapsed: false,
                items: [
                    { text: 'Overview', link: '/charts/primitives' },
                    { text: 'Legend', link: '/charts/primitives/legend' },
                    { text: 'Line chart', link: '/charts/primitives/line-chart' },
                    { text: 'Area chart', link: '/charts/primitives/area-chart' },
                    { text: 'Bar chart', link: '/charts/primitives/bar-chart' },
                    { text: 'Scatter chart', link: '/charts/primitives/scatter-chart' },
                    { text: 'Pie chart', link: '/charts/primitives/pie-chart' },
                    { text: 'Donut chart', link: '/charts/primitives/donut-chart' },
                    { text: 'Sparkline chart', link: '/charts/primitives/sparkline-chart' },
                ],
            },
            {
                text: 'Compositions',
                link: '/charts/compositions',
                collapsed: false,
                items: [
                    { text: 'Overview', link: '/charts/compositions' },
                    { text: 'Line chart', link: '/charts/compositions/line-chart' },
                    { text: 'Area chart', link: '/charts/compositions/area-chart' },
                    { text: 'Bar chart', link: '/charts/compositions/bar-chart' },
                    { text: 'Scatter chart', link: '/charts/compositions/scatter-chart' },
                    { text: 'Pie chart', link: '/charts/compositions/pie-chart' },
                    { text: 'Donut chart', link: '/charts/compositions/donut-chart' },
                    { text: 'Sparkline chart', link: '/charts/compositions/sparkline-chart' },
                ],
            },
            { text: 'Custom Charts', link: '/charts/custom-charts' },
        ],
    },
];

const assetsSidebar = [
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
];

const smartToolsSidebar = [
    {
        text: 'Smart Tools',
        collapsed: false,
        items: [
            { text: 'Installation', link: '/smart-tools/installation' },
            { text: 'OpenCV', link: '/smart-tools/opencv' },
        ],
    },
    {
        text: 'OpenCV based tools',
        collapsed: false,
        items: [
            { text: 'GrabCut', link: '/smart-tools/grabcut' },
            { text: 'Inference image', link: '/smart-tools/inference-image' },
            { text: 'Intelligent scissors', link: '/smart-tools/intelligent-scissors' },
            { text: 'SSIM', link: '/smart-tools/ssim' },
            { text: 'Watershed', link: '/smart-tools/watershed' },
        ],
    },
    {
        text: 'ONNX based tools',
        collapsed: false,
        items: [
            { text: 'RITM', link: '/smart-tools/ritm' },
            { text: 'Segment Anything', link: '/smart-tools/segment-anything' },
        ],
    },
];

const examplesSidebar = [
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
];

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
            { text: 'Components', link: '/components/ui/Button' },
            { text: 'Assets', link: '/assets/' },
            { text: 'Charts', link: '/charts/installation' },
            { text: 'Smart tools', link: '/smart-tools/installation' },
            { text: 'Examples', link: '/examples' },
            { text: 'Used By', link: '/used-by' },
        ],
        sidebar: {
            '/assets': assetsSidebar,
            '/assets/': assetsSidebar,
            '/charts': chartsSidebar,
            '/charts/': chartsSidebar,
            '/smart-tools': smartToolsSidebar,
            '/smart-tools/': smartToolsSidebar,
            '/examples': examplesSidebar,
            '/examples/': examplesSidebar,
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
        componentDocsPlugin(),
        pluginPreview(),
        pluginLlms(),
        pluginSitemap({
            siteUrl: 'https://docs.geti-ui.markredeman.nl',
            defaultChangeFreq: 'weekly',
            defaultPriority: '0.7',
        }),
    ],
});
