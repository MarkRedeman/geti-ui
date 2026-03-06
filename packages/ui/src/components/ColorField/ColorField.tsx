import { ColorField as SpectrumColorField, SpectrumColorFieldProps } from '@adobe/react-spectrum';

export interface ColorFieldProps extends SpectrumColorFieldProps {}

/**
 * A color field allows users to edit a hex color or individual color channel value.
 */
export const ColorField = (props: ColorFieldProps) => {
    return <SpectrumColorField {...props} />;
};
