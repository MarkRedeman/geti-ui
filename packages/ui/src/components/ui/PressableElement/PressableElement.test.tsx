// Copyright (C) 2022-2025 Intel Corporation
// LIMITED EDGE SOFTWARE DISTRIBUTION LICENSE

import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider, defaultTheme } from '@adobe/react-spectrum';
import { describe, it, expect, rstest } from '@rstest/core';

import { PressableElement } from './PressableElement';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const renderPressableElement = (props: Partial<React.ComponentProps<typeof PressableElement>> = {}) =>
    render(
        <Provider theme={defaultTheme}>
            <PressableElement {...props}>{props.children ?? <span>Pressable content</span>}</PressableElement>
        </Provider>
    );

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('PressableElement', () => {
    // --- Rendering ---

    it('renders without crash', () => {
        renderPressableElement();
        expect(screen.getByText('Pressable content')).toBeInTheDocument();
    });

    it('renders provided children', () => {
        renderPressableElement({ children: <span>Custom child</span> });
        expect(screen.getByText('Custom child')).toBeInTheDocument();
    });

    it('renders with a given id', () => {
        renderPressableElement({ id: 'pressable-root', children: <span>Labelled</span> });
        expect(document.getElementById('pressable-root')).toBeInTheDocument();
    });

    // --- Press interactions ---

    it('calls onPress when clicked', async () => {
        const onPress = rstest.fn();
        renderPressableElement({ onPress });
        await userEvent.click(screen.getByText('Pressable content'));
        expect(onPress).toHaveBeenCalledOnce();
    });

    it('calls onPress when Enter key is pressed', async () => {
        const onPress = rstest.fn();
        // Must focus the pressable wrapper div (tabIndex=0), not the inner text span,
        // because react-aria's Pressable attaches keyboard handlers to the div itself.
        renderPressableElement({ onPress, id: 'kb-enter-wrapper' });
        const wrapper = document.getElementById('kb-enter-wrapper') as HTMLElement;
        wrapper.focus();
        await userEvent.keyboard('{Enter}');
        expect(onPress).toHaveBeenCalledOnce();
    });

    it('calls onPress when Space key is pressed', async () => {
        const onPress = rstest.fn();
        // Must focus the pressable wrapper div (tabIndex=0), not the inner text span,
        // because react-aria's Pressable attaches keyboard handlers to the div itself.
        renderPressableElement({ onPress, id: 'kb-space-wrapper' });
        const wrapper = document.getElementById('kb-space-wrapper') as HTMLElement;
        wrapper.focus();
        await userEvent.keyboard(' ');
        expect(onPress).toHaveBeenCalledOnce();
    });

    it('calls onDoubleClick when double-clicked', async () => {
        const onDoubleClick = rstest.fn();
        renderPressableElement({ onDoubleClick });
        await userEvent.dblClick(screen.getByText('Pressable content'));
        expect(onDoubleClick).toHaveBeenCalledOnce();
    });

    it('does not call onPress when isDisabled is true', async () => {
        const onPress = rstest.fn();
        renderPressableElement({ onPress, isDisabled: true });
        await userEvent.click(screen.getByText('Pressable content'));
        expect(onPress).not.toHaveBeenCalled();
    });

    // --- Truncation ---

    it('renders truncated text styles when isTruncated is true', () => {
        renderPressableElement({ isTruncated: true, id: 'truncated-wrapper' });
        const wrapper = document.getElementById('truncated-wrapper');
        expect(wrapper).toBeInTheDocument();
        // The truncation styles are applied inline — verify the key property
        expect(wrapper).toHaveStyle({ overflow: 'hidden' });
    });

    it('does not apply truncation styles when isTruncated is false', () => {
        renderPressableElement({ isTruncated: false, id: 'normal-wrapper' });
        const wrapper = document.getElementById('normal-wrapper');
        expect(wrapper).toBeInTheDocument();
        // overflow should not be set to 'hidden'
        expect(wrapper).not.toHaveStyle({ overflow: 'hidden' });
    });

    // --- Accessibility ---

    it('wraps children in a single container element', () => {
        renderPressableElement({ id: 'a11y-wrapper', children: <span>Accessible child</span> });
        // Confirm the labelled wrapper div is present and contains the child
        const wrapper = document.getElementById('a11y-wrapper');
        expect(wrapper).toBeInTheDocument();
        expect(wrapper).toContainElement(screen.getByText('Accessible child'));
    });

    it('renders multiple children without error', () => {
        renderPressableElement({
            children: (
                <>
                    <span>First</span>
                    <span>Second</span>
                </>
            ),
        });
        expect(screen.getByText('First')).toBeInTheDocument();
        expect(screen.getByText('Second')).toBeInTheDocument();
    });
});
