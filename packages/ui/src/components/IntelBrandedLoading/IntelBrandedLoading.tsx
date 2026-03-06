import { Flex } from '@adobe/react-spectrum';
import IntelBrandedLoadingGif from './intel-loading.webp';

export interface IntelBrandedLoadingProps {
    /** The height of the loading container. Defaults to 100vh. */
    height?: string;
}

/**
 * IntelBrandedLoading displays the Intel branded loading animation.
 * It is typically used for full-page loading states.
 */
export const IntelBrandedLoading = ({ height = '100vh' }: IntelBrandedLoadingProps) => {
    return (
        <Flex
            justifyContent="center"
            alignItems="center"
            height={height}
            direction="column"
            UNSAFE_className="geti-intel-loading-container"
        >
            <img
                src={IntelBrandedLoadingGif}
                role="progressbar"
                alt="Loading"
                width="192px" // Equivalent to size-2400 in Spectrum
                height="192px"
            />
        </Flex>
    );
};
