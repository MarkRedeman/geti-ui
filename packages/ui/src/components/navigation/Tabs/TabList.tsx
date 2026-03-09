import { TabList as SpectrumTabList, SpectrumTabListProps } from '@adobe/react-spectrum';

/**
 * Props for the TabList component.
 * Extends Spectrum's SpectrumTabListProps without modification.
 */
export interface TabListProps<T extends object> extends SpectrumTabListProps<T> {}

/**
 * A tab list component that wraps Adobe React Spectrum's TabList.
 * Renders the row of tab selectors. Must be used inside Tabs with Item children.
 */
export const TabList = <T extends object>(props: TabListProps<T>) => <SpectrumTabList {...props} />;
