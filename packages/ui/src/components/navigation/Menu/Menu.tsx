import { Menu as SpectrumMenu, SpectrumMenuProps } from '@adobe/react-spectrum';

/**
 * Props for the Menu component.
 * Extends Spectrum's SpectrumMenuProps without modification.
 */
export interface MenuProps<T extends object> extends SpectrumMenuProps<T> {}

/**
 * A menu component that wraps Adobe React Spectrum's Menu.
 * Displays a list of actions or options that a user can choose from.
 * Compose with MenuTrigger, Item, and optionally Section for grouped items.
 */
export const Menu = <T extends object>(props: MenuProps<T>) => <SpectrumMenu {...props} />;
