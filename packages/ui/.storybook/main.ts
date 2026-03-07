import type { StorybookConfig } from 'storybook-react-rsbuild';
import { mergeRsbuildConfig } from '@rsbuild/core';
import remarkGfm from 'remark-gfm';

const config: StorybookConfig = {
    stories: ['../src/**/*.mdx', '../src/**/*.stories.@(ts|tsx)'],
    addons: [
        '@storybook/addon-a11y',
        'storybook-addon-rslib',
        {
            name: '@storybook/addon-docs',
            options: {
                mdxPluginOptions: {
                    mdxCompileOptions: {
                        remarkPlugins: [remarkGfm],
                    },
                },
            },
        },
    ],
    framework: {
        name: 'storybook-react-rsbuild',
        options: {},
    },
    async rsbuildFinal(config) {
        return mergeRsbuildConfig(config, {
            tools: {
                rspack: {
                    module: {
                        rules: [
                            {
                                test: /\.md$/,
                                type: 'asset/source', // return raw string
                            },
                            {
                                // storybook-addon-rslib merges rslib's source.exclude into the
                                // rsbuild config, which causes the builtin:swc-loader to skip
                                // *.stories.tsx files. The csf-plugin (enforce:"post") then
                                // outputs TypeScript that Rspack's final parser can't handle.
                                // This rule adds an explicit post-enforce SWC pass for stories
                                // files so TypeScript is always stripped after csf-plugin runs.
                                test: /\.stories\.[tj]sx?$/,
                                enforce: 'post',
                                use: [
                                    {
                                        loader: 'builtin:swc-loader',
                                        options: {
                                            jsc: {
                                                parser: {
                                                    syntax: 'typescript',
                                                    tsx: true,
                                                    decorators: true,
                                                },
                                                transform: {
                                                    react: {
                                                        runtime: 'automatic',
                                                    },
                                                },
                                            },
                                            isModule: 'unknown',
                                        },
                                    },
                                ],
                            },
                        ],
                    },
                },
            },
            output: {
                cssModules: {
                    // Ensure our theme CSS modules use a stable, readable localIdentName so that
                    // the JS object key returned by the CSS module import matches the hashed class
                    // that is injected into the DOM — and remains inspectable in devtools.
                    // rsbuild handles node_modules/@adobe as plain CSS automatically (not hashed),
                    // but our own *.module.css files will use this pattern.
                    localIdentName: '[local]--[hash:base64:5]',
                },
            },
        });
    },
};

export default config;
