// Copyright (C) 2022-2025 Intel Corporation
// LIMITED EDGE SOFTWARE DISTRIBUTION LICENSE

import { CSSProperties, ReactNode } from 'react';

/**
 * Props for the Tag component.
 */
export interface TagProps {
    /** Optional element ID, also used as data-testid. */
    id?: string;
    /** Text content to display inside the tag. */
    text: string;
    /** Optional element to display before the text (overrides the dot). */
    prefix?: ReactNode;
    /** Optional element to display after the text. */
    suffix?: ReactNode;
    /** Whether to show the accent dot before the text. @default true */
    withDot?: boolean;
    /** Additional CSS class name. */
    className?: string;
    /** Tooltip text shown on hover. */
    tooltip?: string;
    /** Whether to use dark-mode background color. */
    darkMode?: boolean;
    /** Inline styles for the tag container. */
    style?: CSSProperties;
}

const styles = {
    tag: {
        display: 'flex',
        borderRadius: 'var(--spectrum-global-dimension-size-125)',
        color: 'var(--spectrum-global-color-gray-800)',
        fontSize: 'var(--spectrum-global-dimension-size-130)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 'var(--spectrum-global-dimension-size-50) var(--spectrum-global-dimension-size-75)',
    } as CSSProperties,
    tagNoPrefix: {
        paddingLeft: 'var(--spectrum-global-dimension-size-125)',
    } as CSSProperties,
    tagNoSuffix: {
        paddingRight: 'var(--spectrum-global-dimension-size-125)',
    } as CSSProperties,
    affix: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    } as CSSProperties,
    prefixWrapper: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 'var(--spectrum-global-dimension-size-75)',
    } as CSSProperties,
    suffixWrapper: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 'var(--spectrum-global-dimension-size-75)',
    } as CSSProperties,
    dot: {
        backgroundColor: 'var(--energy-blue, #0168b5)',
        borderRadius: 'var(--spectrum-global-dimension-size-125)',
        width: 'var(--spectrum-global-dimension-size-100)',
        height: 'var(--spectrum-global-dimension-size-100)',
    } as CSSProperties,
};

/**
 * A standalone Geti tag component for displaying categorized metadata.
 *
 * By default the Tag component will display an accent dot before the text.
 * This can be disabled by setting `withDot` to false.
 * It also supports prefix or suffix elements for custom icons or actions.
 */
export const Tag = ({
    id,
    text,
    prefix,
    suffix,
    className,
    withDot = true,
    tooltip,
    darkMode,
    style,
    ...rest
}: TagProps) => {
    const hasPrefix = !!(withDot || prefix);

    const containerStyle: CSSProperties = {
        ...styles.tag,
        ...(!hasPrefix ? styles.tagNoPrefix : {}),
        ...(!suffix ? styles.tagNoSuffix : {}),
        backgroundColor: darkMode ? 'var(--spectrum-global-color-gray-100)' : 'var(--spectrum-global-color-gray-200)',
        ...style,
    };

    return (
        <div
            className={className}
            id={id}
            data-testid={id}
            style={containerStyle}
            aria-label={text}
            title={tooltip}
            {...rest}
        >
            {hasPrefix && (
                <span style={styles.prefixWrapper}>
                    {prefix ? prefix : withDot ? <span style={styles.dot} aria-hidden="true" /> : null}
                </span>
            )}
            <span>{text}</span>
            {suffix ? <span style={styles.suffixWrapper}>{suffix}</span> : null}
        </div>
    );
};
