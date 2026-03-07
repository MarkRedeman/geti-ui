import type { Preview, Decorator } from '@storybook/react';
import { ThemeProvider } from '../src/theme/ThemeProvider';
import { darkTheme } from './theme';

const withThemeProvider: Decorator = (Story, context) => {
    return (
        <ThemeProvider width={'100%'}>
            <Story {...context.args} />
        </ThemeProvider>
    );
};

const preview: Preview = {
    decorators: [withThemeProvider],
    initialGlobals: {
        // 👇 Set the initial background color
        backgrounds: { value: 'dark' },
    },

    parameters: {
        docs: {
            theme: darkTheme,
        },
        backgrounds: {
            options: {
                dark: { name: 'Dark', value: '#242528' },
            },
            default: 'dark',
        },
        layout: 'centered',
        a11y: {
            config: {},
        },
        options: {
            storySort: {
                order: [
                    'Kitchen sink',
                    ['Overview', 'UI', 'Form', ['*', 'Pickers'], 'Data', 'Overlays', 'Feedback', 'Navigation', 'Layouts'],
                    'UI',
                    'Form',
                    'Data',
                    'Overlays',
                    'Feedback',
                    'Navigation',
                    'Layouts',
                ],
            },
        },
    },
};

export default preview;
