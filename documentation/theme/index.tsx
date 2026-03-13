import { Layout as OriginalLayout } from '@rspress/core/theme-original';
import { ThemeProvider } from '@geti-ai/ui';
import '@geti-ai/blocks/styles.css';
import '@geti-ai/ui/styles.css';
import './index.css';

export const Layout = () => {
    return (
        <ThemeProvider>
            <OriginalLayout />
        </ThemeProvider>
    );
};

export * from '@rspress/core/theme-original';
export { HomeLayout } from './HomeLayout';
