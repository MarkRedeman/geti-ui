import { Badge as BasicBadge, Tag as BasicTag } from '@rspress/core/theme-original';

export const Tag = ({ tag }: { tag?: string }) => {
    if (!tag) {
        return null;
    }

    if (tag === 'WIP') {
        return <BasicBadge text="WIP" type="danger" outline />;
    }

    return <BasicTag tag={tag} />;
};
