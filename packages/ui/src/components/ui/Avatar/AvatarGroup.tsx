// Copyright (C) 2022-2025 Intel Corporation
// LIMITED EDGE SOFTWARE DISTRIBUTION LICENSE

import { CSSProperties } from 'react';

import { Avatar } from './Avatar';
import type { AvatarProps } from './Avatar';

/**
 * Props for the AvatarGroup component.
 */
export interface AvatarGroupProps {
    /**
     * Array of avatar props to render in the group.
     * To ensure stable rendering and correct re-ordering, it is recommended
     * that each item provides a unique `alt` text or stable React key.
     */
    avatars: AvatarProps[];
    /**
     * Maximum number of avatars to display before showing a count badge.
     * @default 3
     */
    max?: number;
    /** Size applied to all avatars in the group. */
    size?: AvatarProps['size'];
}

const styles: Record<string, CSSProperties> = {
    group: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
    item: {
        marginRight: '-8px',
        borderRadius: '50%',
        border: '2px solid var(--spectrum-global-color-gray-800)',
        position: 'relative',
    },
    overflow: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '50%',
        backgroundColor: 'var(--spectrum-global-color-gray-300)',
        color: 'var(--spectrum-global-color-gray-800)',
        fontSize: '0.75rem',
        fontWeight: 600,
        width: '32px',
        height: '32px',
        marginLeft: '12px',
        flexShrink: 0,
    },
};

/**
 * An avatar group component that renders multiple Avatar components in a row.
 * When the number of avatars exceeds `max`, a count badge is shown for the remainder.
 */
export const AvatarGroup = ({ avatars, max = 3, size }: AvatarGroupProps) => {
    const visible = avatars.slice(0, max);
    const overflow = avatars.length - max;

    return (
        <div style={styles.group} role="group" aria-label={`${avatars.length} avatars`}>
            {visible.map((avatarProps, index) => (
                <span key={avatarProps.alt ?? index} style={styles.item}>
                    <Avatar {...avatarProps} size={size ?? avatarProps.size} />
                </span>
            ))}
            {overflow > 0 && (
                <span style={styles.overflow} aria-label={`${overflow} more`}>
                    +{overflow}
                </span>
            )}
        </div>
    );
};
