import type { StorybookConfig } from 'storybook-react-rsbuild';

const config: StorybookConfig = {
    stories: ['../src/**/*.stories.@(ts|tsx)'],
    addons: ['@storybook/addon-a11y', 'storybook-addon-rslib'],
    framework: {
        name: 'storybook-react-rsbuild',
        options: {},
    },
};

export default config;
