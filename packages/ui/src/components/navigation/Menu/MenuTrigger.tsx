import { MenuTrigger as SpectrumMenuTrigger, SpectrumMenuTriggerProps } from '@adobe/react-spectrum';

/**
 * Props for the MenuTrigger component.
 * Extends Spectrum's SpectrumMenuTriggerProps without modification.
 */
export interface MenuTriggerProps extends SpectrumMenuTriggerProps {}

/**
 * A menu trigger component that wraps Adobe React Spectrum's MenuTrigger.
 * Links a Menu's open state with a trigger element's press state.
 * Accepts a trigger element as its first child and a Menu as its second child.
 */
export const MenuTrigger = (props: MenuTriggerProps) => <SpectrumMenuTrigger {...props} />;
