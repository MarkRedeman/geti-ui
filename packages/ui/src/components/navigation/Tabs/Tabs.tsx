import { Tabs as SpectrumTabs, SpectrumTabsProps } from '@adobe/react-spectrum';

/**
 * Props for the Tabs component.
 * Extends Spectrum's SpectrumTabsProps without modification.
 */
export interface TabsProps<T extends object> extends SpectrumTabsProps<T> {}

/**
 * A tabs component that wraps Adobe React Spectrum's Tabs.
 * Organizes content into multiple sections that can be navigated using tab controls.
 * Compose with TabList, TabPanels, and Item.
 */
export const Tabs = <T extends object>(props: TabsProps<T>) => <SpectrumTabs {...props} />;
