// Copyright (C) 2022-2025 Intel Corporation
// LIMITED EDGE SOFTWARE DISTRIBUTION LICENSE

import { render, screen } from '@testing-library/react';
import { describe, it, expect } from '@rstest/core';

import { Tag } from './Tag';

describe('Tag', () => {
    it('renders without crash', () => {
        render(<Tag text="Test Tag" />);
        expect(screen.getByText('Test Tag')).toBeInTheDocument();
    });

    it('renders with a dot by default', () => {
        render(<Tag text="test tag" id="test-id" />);
        // tag container has: prefix wrapper + text span = 2 children
        expect(screen.getByTestId('test-id').children).toHaveLength(2);
    });

    it('renders without a dot when withDot is false', () => {
        render(<Tag text="test tag" withDot={false} id="test-id" />);
        // tag container has only text span = 1 child
        expect(screen.getByTestId('test-id').children).toHaveLength(1);
    });

    it('renders with a prefix if provided', () => {
        render(<Tag text="test tag" prefix={<div>Fake icon</div>} />);
        expect(screen.getByText('Fake icon')).toBeInTheDocument();
    });

    it('renders with a suffix if provided', () => {
        render(<Tag text="test tag" suffix={<div>Fake suffix</div>} />);
        expect(screen.getByText('Fake suffix')).toBeInTheDocument();
    });

    it('has aria-label set to the text', () => {
        render(<Tag text="Accessible Tag" />);
        expect(screen.getByLabelText('Accessible Tag')).toBeInTheDocument();
    });

    it('shows tooltip via title attribute', () => {
        render(<Tag text="Tooltip Tag" tooltip="My tooltip" />);
        expect(screen.getByTitle('My tooltip')).toBeInTheDocument();
    });
});
