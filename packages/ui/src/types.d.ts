declare module '*.webp' {
    const src: string;
    export default src;
}

declare module '@spectrum-icons/workflow/*' {
    import { ComponentType } from 'react';
    import { IconProps } from '@react-types/shared';
    const Icon: ComponentType<IconProps>;
    export default Icon;
}
