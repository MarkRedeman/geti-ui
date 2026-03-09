import { render, screen } from '@testing-library/react';
import { Provider, defaultTheme } from '@adobe/react-spectrum';
import { describe, it, expect } from '@rstest/core';

import { View } from './View';

const renderView = (props: Partial<React.ComponentProps<typeof View>> = {}) =>
    render(
        <Provider theme={defaultTheme}>
            <View backgroundColor="gray-100" padding="size-200" {...props}>
                {props.children ?? <span>Content</span>}
            </View>
        </Provider>
    );

describe('View', () => {
    it('renders without crash', () => {
        renderView();
        expect(screen.getByText('Content')).toBeInTheDocument();
    });

    it('renders children', () => {
        renderView({ children: <span>Custom content</span> });
        expect(screen.getByText('Custom content')).toBeInTheDocument();
    });

    it('renders with border props', () => {
        renderView({
            borderWidth: 'thin',
            borderColor: 'dark',
            children: <span>Bordered</span>,
        });
        expect(screen.getByText('Bordered')).toBeInTheDocument();
    });
});
