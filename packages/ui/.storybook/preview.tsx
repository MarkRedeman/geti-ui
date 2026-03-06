import type { Preview, Decorator } from '@storybook/react';
import { ThemeProvider } from '../src/theme/ThemeProvider';

const withThemeProvider: Decorator = (Story, context) => {
    console.log('oh it is being wrapped!!!');
    return (
        <ThemeProvider>
            <Story {...context.args} />
        </ThemeProvider>
    );
};

const preview: Preview = {
    decorators: [withThemeProvider],
    parameters: {
        backgrounds: {
            default: 'geti-dark',
            values: [
                { name: 'geti-dark', value: '#313236' }, // matches --spectrum-alias-background-color-default
                { name: 'geti-darker', value: '#242528' }, // matches --spectrum-global-color-gray-50
            ],
        },
        layout: 'centered',
        a11y: {
            config: {},
        },
    },
};

export default preview;
