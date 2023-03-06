import { Options, NodeBase, LayoutOptions } from './types';

const DEFAULT_LEVEL_SPACING = 20;
const DEFAULT_SIBLING_SPACING = 15;

const getDefaultOptions = <Node extends NodeBase<Node>>(): Options<Node> => ({
  orientation: 'bottom',
  levelAlign: 'start',
  compact: true,
  spacing: [DEFAULT_LEVEL_SPACING, DEFAULT_SIBLING_SPACING],
  translate: 0,
  getID: (node: Node) => node.id!,
  getChildren: (node: Node) => node.children,
  getGroup: (node: Node) => node.group,
});

export const getLayoutOptions = <Node extends NodeBase<Node>>(
  options: Partial<Options<Node>>
): LayoutOptions<Node> => {
  const mergedOptions = { ...getDefaultOptions<Node>(), ...options };
  const { orientation, spacing, translate, ...restOptions } = mergedOptions;

  const [levelSpacing, siblingSpacing] = Array.isArray(spacing)
    ? spacing
    : [spacing, spacing];
  const [translateX, translateY] = Array.isArray(translate)
    ? translate
    : [translate, translate];

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
    translateX,
    translateY,
  };
};
