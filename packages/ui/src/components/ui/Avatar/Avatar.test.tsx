import { render, screen } from '@testing-library/react';
import { Provider, defaultTheme } from '@adobe/react-spectrum';
import { describe, it, expect } from '@rstest/core';

import { Avatar } from './Avatar';
import { AvatarGroup } from './AvatarGroup';

const PLACEHOLDER_SRC = 'https://i.pravatar.cc/150?img=1';

const renderAvatar = (props: Partial<React.ComponentProps<typeof Avatar>> = {}) =>
    render(
        <Provider theme={defaultTheme}>
            <Avatar src={PLACEHOLDER_SRC} alt="Test user" {...props} />
        </Provider>
    );

describe('Avatar', () => {
    it('renders without crash', () => {
        renderAvatar();
        expect(screen.getByRole('img')).toBeInTheDocument();
    });

    it('has alt text', () => {
        renderAvatar({ alt: 'Jane Doe' });
        expect(screen.getByRole('img', { name: 'Jane Doe' })).toBeInTheDocument();
    });

    it('renders as disabled when isDisabled is set', () => {
        renderAvatar({ isDisabled: true });
        expect(screen.getByRole('img')).toBeInTheDocument();
    });
});

describe('AvatarGroup', () => {
    const avatars = [
        { src: 'https://i.pravatar.cc/150?img=1', alt: 'User 1' },
        { src: 'https://i.pravatar.cc/150?img=2', alt: 'User 2' },
        { src: 'https://i.pravatar.cc/150?img=3', alt: 'User 3' },
        { src: 'https://i.pravatar.cc/150?img=4', alt: 'User 4' },
        { src: 'https://i.pravatar.cc/150?img=5', alt: 'User 5' },
    ];

    it('renders without crash', () => {
        render(
            <Provider theme={defaultTheme}>
                <AvatarGroup avatars={avatars} max={3} />
            </Provider>
        );
        expect(screen.getByRole('group')).toBeInTheDocument();
    });

    it('shows overflow count when more avatars than max', () => {
        render(
            <Provider theme={defaultTheme}>
                <AvatarGroup avatars={avatars} max={3} />
            </Provider>
        );
        expect(screen.getByText('+2')).toBeInTheDocument();
    });

    it('does not show overflow when avatars fit within max', () => {
        render(
            <Provider theme={defaultTheme}>
                <AvatarGroup avatars={avatars.slice(0, 2)} max={3} />
            </Provider>
        );
        expect(screen.queryByText(/^\+/)).not.toBeInTheDocument();
    });

    it('renders all avatars when count equals max', () => {
        render(
            <Provider theme={defaultTheme}>
                <AvatarGroup avatars={avatars.slice(0, 3)} max={3} />
            </Provider>
        );
        expect(screen.getAllByRole('img')).toHaveLength(3);
    });
});
