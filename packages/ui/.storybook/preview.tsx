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
        backgrounds: { value: '#242528' },
        theme: 'dark',
    },
    parameters: {
        backgrounds: {
            default: 'dark',
            values: [{ name: 'dark', value: '#242528' }],
        },
        docs: {
            theme: darkTheme,
        },
        layout: 'centered',
        a11y: {
            config: {},
        },
        options: {
            storySort: {
                order: [
                    'Kitchen sink',
                    [
                        'Overview',
                        'UI',
                        'Form',
                        ['*', 'Pickers'],
                        'Data',
                        'Overlays',
                        'Feedback',
                        'Navigation',
                        'Layouts',
                    ],
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
