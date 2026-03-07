import { DropZone as SpectrumDropZone, SpectrumDropZoneProps } from '@adobe/react-spectrum';

/**
 * DropZones are a drop target area where users can drop files or objects.
 */
export const DropZone = (props: SpectrumDropZoneProps) => {
    return <SpectrumDropZone {...props} />;
};

export type { SpectrumDropZoneProps as DropZoneProps };
