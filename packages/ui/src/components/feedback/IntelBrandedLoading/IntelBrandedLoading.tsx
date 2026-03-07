// Copyright (C) 2022-2025 Intel Corporation
// LIMITED EDGE SOFTWARE DISTRIBUTION LICENSE

import { Flex } from '@adobe/react-spectrum';
import { Loading } from '../Loading/Loading';

export interface IntelBrandedLoadingProps {
    /** The height of the loading container. Defaults to 100vh. */
    height?: string;
}

/**
 * IntelBrandedLoading displays the Intel branded loading animation.
 * It is typically used for full-page loading states.
 *
 * @deprecated Use `<Loading variant="intel" />` directly.
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
            <Loading
                variant="intel"
                mode="inline"
                size="L"
                style={{ height }}
                className="geti-intel-loading-container"
            />
        </Flex>
    );
};
