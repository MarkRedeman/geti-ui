import type { StorybookConfig } from 'storybook-react-rsbuild';
import { mergeRsbuildConfig } from '@rsbuild/core';

const config: StorybookConfig = {
    stories: ['../src/**/*.stories.@(ts|tsx)'],
    addons: ['@storybook/addon-a11y', 'storybook-addon-rslib', '@storybook/addon-docs'],
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
