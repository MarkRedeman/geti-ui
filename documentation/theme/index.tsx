import { Layout as OriginalLayout } from '@rspress/core/theme-original';
import { ThemeProvider } from '@geti-ui/ui';
import '@geti-ui/blocks/styles.css';
import '@geti-ui/ui/styles.css';
import './index.css';
import { Tag } from './components/Tag';

export const Layout = () => {
    return (
        <ThemeProvider>
            <OriginalLayout />
        </ThemeProvider>
    );
};

export * from '@rspress/core/theme-original';
export { HomeLayout } from './HomeLayout';
export { Tag };
