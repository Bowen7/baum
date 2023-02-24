import { Options, NodeInfo, ID } from './types';
export * from './layout-tree';
export * from './types';
const DEFAULT_LEVEL_SPACING = 20;
const DEFAULT_SIBLING_SPACING = 15;

const getDefaultOptions = <
  Node extends {
    children?: Node[];
    group?: Node[] | Node[][];
    width?: number;
    height?: number;
  }
>(): Options<Node> => ({
  orientation: 'bottom',
  levelAlign: 'start',
  spacing: [DEFAULT_LEVEL_SPACING, DEFAULT_SIBLING_SPACING],
  getID: (node: Node) => node,
  getChildren: (node: Node) => node.children,
  getGroup: (node: Node) => node.group,
});

export class Baum<
  Node extends {
    children?: Node[];
    group?: Node[] | Node[][];
    width?: number;
    height?: number;
  }
> {
  root: Node | Node[];
  options = getDefaultOptions<Node>();
  nodeSizeMap = new Map<ID<Node>, [number, number]>();
  constructor(root: Node | Node[], options: Partial<Options<Node>> = {}) {
    this.root = root;
    this.options = { ...this.options, ...options };
  }
}

export default Baum;
