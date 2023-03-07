import { BaumOptions, NodeBase, LayoutOptions } from './types';

const DEFAULT_LEVEL_SPACING = 20;
const DEFAULT_SIBLING_SPACING = 15;

const getDefaultOptions = <
  Node extends NodeBase<Node>
>(): BaumOptions<Node> => ({
  orientation: 'bottom',
  levelAlign: 'start',
  compact: true,
  spacing: [DEFAULT_LEVEL_SPACING, DEFAULT_SIBLING_SPACING],
  getID: (node: Node) => node.id!,
  getChildren: (node: Node) => node.children,
  getGroup: (node: Node) => node.group,
});

export const getLayoutOptions = <Node extends NodeBase<Node>>(
  options: Partial<BaumOptions<Node>>
): LayoutOptions<Node> => {
  const mergedOptions = { ...getDefaultOptions<Node>(), ...options };
  // if levelAlign is none, compact must be false
  if (mergedOptions.levelAlign === 'none') {
    mergedOptions.compact = false;
  }

  const { orientation, spacing, ...restOptions } = mergedOptions;

  const [levelSpacing, siblingSpacing] = Array.isArray(spacing)
    ? spacing
    : [spacing, spacing];

  let isSizeEqualWidth = false;
  if (orientation === 'top' || orientation === 'bottom') {
    isSizeEqualWidth = true;
  }

  return {
    ...restOptions,
    orientation,
    isSizeEqualWidth,
    levelSpacing,
    siblingSpacing,
  };
};
