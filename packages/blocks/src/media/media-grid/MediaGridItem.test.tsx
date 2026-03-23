import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from '@rstest/core';
import { MediaGridItem } from './MediaGridItem';

describe('MediaGridItem', () => {
    it('does not call onPress for placeholders', async () => {
        const onPress = rstest.fn();
        render(
            <MediaGridItem isPlaceholder onPress={onPress}>
                Item
            </MediaGridItem>
        );

        await userEvent.click(screen.getByText('Item'));
        expect(onPress).not.toHaveBeenCalled();
    });

    it('calls onPress with shiftKey on normal item', () => {
        const onPress = rstest.fn();
        render(<MediaGridItem onPress={onPress}>Item</MediaGridItem>);

        fireEvent.click(screen.getByText('Item'), { shiftKey: true });
        expect(onPress).toHaveBeenCalledWith({ shiftKey: true });
    });

    it('does not trigger onPress when clicking interactive child', async () => {
        const onPress = rstest.fn();
        render(
            <MediaGridItem onPress={onPress}>
                <button data-media-grid-interactive="true">Inner action</button>
            </MediaGridItem>
        );

        await userEvent.click(screen.getByRole('button', { name: 'Inner action' }));
        expect(onPress).not.toHaveBeenCalled();
    });

    it('stops overlay click bubbling to onPress', async () => {
        const onPress = rstest.fn();
        render(
            <MediaGridItem onPress={onPress} topRight={<button>Menu</button>}>
                Item
            </MediaGridItem>
        );

        await userEvent.click(screen.getByRole('button', { name: 'Menu' }));
        expect(onPress).not.toHaveBeenCalled();
    });
});
