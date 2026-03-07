// Copyright (C) 2022-2025 Intel Corporation
// LIMITED EDGE SOFTWARE DISTRIBUTION LICENSE

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from '@adobe/react-spectrum';
import { describe, it, expect, rstest } from '@rstest/core';

import { FileTrigger } from './FileTrigger';

const renderFileTrigger = (props: Partial<React.ComponentProps<typeof FileTrigger>> = {}) =>
    render(
        <FileTrigger {...props}>
            <Button variant="accent">Upload</Button>
        </FileTrigger>
    );

describe('FileTrigger', () => {
    it('renders without crash', () => {
        renderFileTrigger();
        expect(screen.getByRole('button', { name: 'Upload' })).toBeInTheDocument();
    });

    it('renders a hidden file input', () => {
        const { container } = renderFileTrigger();
        const input = container.querySelector('input[type="file"]');
        expect(input).toBeInTheDocument();
    });

    it('accepts specific file types', () => {
        const { container } = renderFileTrigger({ acceptedFileTypes: ['image/*'] });
        const input = container.querySelector('input[type="file"]');
        expect(input).toHaveAttribute('accept', 'image/*');
    });

    it('allows multiple files when allowsMultiple is set', () => {
        const { container } = renderFileTrigger({ allowsMultiple: true });
        const input = container.querySelector('input[type="file"]');
        expect(input).toHaveAttribute('multiple');
    });

    it('calls onSelect when files are chosen', async () => {
        const onSelect = rstest.fn();
        const { container } = renderFileTrigger({ onSelect });
        const input = container.querySelector('input[type="file"]') as HTMLInputElement;

        const file = new File(['content'], 'test.png', { type: 'image/png' });
        await userEvent.upload(input, file);

        expect(onSelect).toHaveBeenCalledOnce();
    });
});
