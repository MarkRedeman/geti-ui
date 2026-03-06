import { TreeView as SpectrumTreeView, SpectrumTreeViewProps } from '@adobe/react-spectrum';

/**
 * TreeViews display hierarchical data and allow users to navigate through it.
 */
export const TreeView = <T extends object>(props: SpectrumTreeViewProps<T>) => {
    return <SpectrumTreeView {...props} />;
};

export type { SpectrumTreeViewProps as TreeViewProps };
