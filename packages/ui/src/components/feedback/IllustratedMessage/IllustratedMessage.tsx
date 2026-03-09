import { IllustratedMessage as SpectrumIllustratedMessage } from '@adobe/react-spectrum';
import type { SpectrumIllustratedMessageProps } from '@adobe/react-spectrum';

/**
 * Props for the IllustratedMessage component.
 * Extends Spectrum's SpectrumIllustratedMessageProps.
 */
export interface IllustratedMessageProps extends SpectrumIllustratedMessageProps {}

/**
 * An illustrated message component that wraps Adobe React Spectrum's IllustratedMessage.
 * Used for empty states, error messages, or other informational displays
 * that combine an illustration with a heading and description.
 */
export const IllustratedMessage = (props: IllustratedMessageProps) => <SpectrumIllustratedMessage {...props} />;
