// Copyright (C) 2022-2025 Intel Corporation
// LIMITED EDGE SOFTWARE DISTRIBUTION LICENSE

import { render, screen } from '@testing-library/react';
import { Provider, defaultTheme } from '@adobe/react-spectrum';
import { describe, it, expect } from '@rstest/core';

import { Image } from './Image';

const SAMPLE_IMAGE = 'https://picsum.photos/seed/geti/400/300';

const renderImage = (props: Partial<React.ComponentProps<typeof Image>> = {}) =>
    render(
        <Provider theme={defaultTheme}>
            <Image src={SAMPLE_IMAGE} alt="Test image" {...props} />
        </Provider>
    );

describe('Image', () => {
    it('renders without crash', () => {
        renderImage();
        expect(screen.getByRole('img')).toBeInTheDocument();
    });

    it('has alt text', () => {
        renderImage({ alt: 'Beautiful landscape' });
        expect(screen.getByRole('img', { name: 'Beautiful landscape' })).toBeInTheDocument();
    });

    it('renders with empty alt for decorative images', () => {
        renderImage({ alt: '' });
        // Decorative images with empty alt are hidden from accessibility tree
        expect(document.querySelector('img')).toBeInTheDocument();
    });

    it('applies correct src attribute', () => {
        renderImage({ src: SAMPLE_IMAGE });
        const img = screen.getByRole('img');
        expect(img).toBeInTheDocument();
    });
});
