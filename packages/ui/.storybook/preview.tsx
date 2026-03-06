import type { Preview, Decorator } from '@storybook/react';
import { ThemeProvider } from '../src/theme/ThemeProvider';

const withThemeProvider: Decorator = (Story, context) => {
    console.log('oh it is being wrapped!!!');
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
    },
};

export default preview;
