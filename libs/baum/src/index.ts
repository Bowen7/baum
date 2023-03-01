import { LayoutTree } from './layout-tree';
import { Options, NodeBase, NodeInfo, ID } from './types';
export * from './layout-tree';
export * from './types';
const DEFAULT_LEVEL_SPACING = 20;
const DEFAULT_SIBLING_SPACING = 15;

const getDefaultOptions = <Node extends NodeBase<Node>>(): Options<Node> => ({
  orientation: 'bottom',
  levelAlign: 'start',
  compact: true,
  spacing: [DEFAULT_LEVEL_SPACING, DEFAULT_SIBLING_SPACING],
  getID: (node: Node) => node.id!,
  getChildren: (node: Node) => node.children,
  getGroup: (node: Node) => node.group,
});

export class Baum<Node extends NodeBase<Node>> {
  rootInfo!: NodeInfo<Node>;
  nodeInfoMap = new Map<ID, NodeInfo<Node>>();
  options = getDefaultOptions<Node>();
  constructor(root: Node | Node[], options: Partial<Options<Node>> = {}) {
    this.options = { ...this.options, ...options };
    this.rootInfo = this.initNodeInfo(root, null);
  }

  checkOptions() {
    const { options } = this;
    // if levelAlign is none, compact must be false
    if (options.levelAlign === 'none') {
      options.compact = false;
    }
  }

  createNodeInfo = (
    node: Node | null,
    parentInfo: NodeInfo<Node> | null,
    virtual = false
  ): NodeInfo<Node> => {
    const width = node?.width ?? 0;
    const height = node?.height ?? 0;
    const level = (parentInfo?.level ?? -1) + 1;

    const nodeInfo: NodeInfo<Node> = {
      virtual: virtual,
      node,
      x: 0,
      y: 0,
      width,
      height,
      level,
      prelim: 0,
      mod: 0,
      change: 0,
      shift: 0,
      index: 0,
      children: [],
      previousSibling: null,
      parent: parentInfo,
      thread: null,
      ancestor: null,
    };

    if (node) {
      const { getID } = this.options;
      const id = getID(node);
      this.nodeInfoMap.set(id, nodeInfo);
    }
    return nodeInfo;
  };

  initNodeInfo(node: Node | Node[], parent: NodeInfo<Node> | null) {
    let nodeInfo!: NodeInfo<Node>;
    let children: Node[] | undefined;
    if (Array.isArray(node)) {
      nodeInfo = this.createNodeInfo(null, parent, true);
      children = node;
    } else {
      nodeInfo = this.createNodeInfo(node, parent);
      children = node.children;
    }
    let previousSiblingInfo: NodeInfo<Node> | null = null;
    children?.forEach((childNode, index) => {
      const childNodeInfo = this.initNodeInfo(childNode, nodeInfo);
      childNodeInfo.previousSibling = previousSiblingInfo;
      childNodeInfo.index = index;
      nodeInfo.children.push(childNodeInfo);

      previousSiblingInfo = childNodeInfo;
    });
    return nodeInfo;
  }

  setNodeSize(
    id: ID | { id: ID; size: [number, number] }[],
    size?: [number, number]
  ) {
    if (Array.isArray(id)) {
      const nodeSizes = id;
      nodeSizes.forEach(({ id, size: [width, height] }) => {
        const nodeInfo = this.nodeInfoMap.get(id);
        if (nodeInfo) {
          nodeInfo.width = width;
          nodeInfo.height = height;
        }
      });
    } else if (size) {
      const nodeInfo = this.nodeInfoMap.get(id);
      if (nodeInfo) {
        nodeInfo.width = size[0];
        nodeInfo.height = size[1];
      }
    }
  }

  layout() {
    const layoutTree = new LayoutTree(this.rootInfo, this.options);
    return layoutTree.layout();
  }
}

export const baum = <Node extends NodeBase<Node>>(
  root: Node | Node[],
  options: Partial<Options<Node>> = {}
) => {
  return new Baum(root, options).layout();
};
