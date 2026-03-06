import type { Preview, Decorator } from '@storybook/react';
import { ThemeProvider } from '../src/theme/ThemeProvider';

const withThemeProvider: Decorator = (Story, context) => (
    <ThemeProvider>
        <Story {...context.args} />
    </ThemeProvider>
);

const preview: Preview = {
    decorators: [withThemeProvider],
    parameters: {
        backgrounds: {
            default: 'geti-dark',
            values: [
                { name: 'geti-dark', value: '#1b1b1b' },
                { name: 'geti-darker', value: '#0f0f0f' },
            ],
        },
        layout: 'centered',
        a11y: {
            config: {},
        },
    },
};

export default preview;
