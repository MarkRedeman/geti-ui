import { Layout as OriginalLayout } from '@rspress/core/theme-original';
import { ThemeProvider } from '@geti/ui';
import '@geti/ui/styles.css';
import './index.css';

export const Layout = () => {
    return (
        <ThemeProvider>
            <OriginalLayout />
        </ThemeProvider>
    );
};

export * from '@rspress/core/theme-original';
