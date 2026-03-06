import { type ComponentProps } from 'react';

import { Provider } from '@adobe/react-spectrum';

import getiTheme from './theme';

export type ThemeProviderProps = ComponentProps<typeof Provider>;

/**
 * ThemeProvider wraps Adobe React Spectrum's Provider with the Geti dark theme.
 * All Geti UI components must be rendered inside ThemeProvider.
 *
 * @example
 * <ThemeProvider>
 *   <App />
 * </ThemeProvider>
 */
export const ThemeProvider = ({ children, ...rest }: ThemeProviderProps) => {
    return (
        //<Provider locale="en-US" theme={darkTheme} colorScheme="dark" scale="medium" id="theme-provider" {...rest}>
        <Provider locale="en-US" theme={getiTheme} colorScheme="dark" scale="medium" id="theme-provider" {...rest}>
            {children}
        </Provider>
    );
};
