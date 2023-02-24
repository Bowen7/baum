import { Options, NodeInfo, ID, NodePosition, Edge } from './types';

const getAncestor = <Node>(
  leftNode: NodeInfo<Node>,
  rightNode: NodeInfo<Node>,
  defaultAncestor: NodeInfo<Node>
) =>
  rightNode.parent === leftNode.ancestor?.parent
    ? leftNode.ancestor
    : defaultAncestor;

const moveSubTree = <Node>(
  leftNode: NodeInfo<Node>,
  rightNode: NodeInfo<Node>,
  shift: number
) => {
  const subtrees = rightNode.index - leftNode.index;
  rightNode.change -= shift / subtrees;
  rightNode.shift += shift;
  rightNode.prelim += shift;
  rightNode.mod += shift;
  leftNode.change += shift / subtrees;
};

const getLeftmost = <Node>(node: NodeInfo<Node>) =>
  node.children?.[0] ?? node.thread;
const getRightmost = <Node>(node: NodeInfo<Node>) =>
  node.children?.[node.children.length - 1] ?? node.thread;

const executeShifts = <Node>(node: NodeInfo<Node>) => {
  let shift = 0;
  let change = 0;
  const { children = [] } = node;
  for (let i = children.length - 1; i >= 0; i--) {
    const child = children[i];
    child.prelim += shift;
    child.mod += shift;
    change += child.change;
    shift += child.shift + change;
  }
};

export class LayoutTree<
  Node extends {
    children?: Node[];
    group?: Node[] | Node[][];
    width?: number;
    height?: number;
  }
> {
  root: Node | Node[];
  options: Options<Node>;
  nodeInfoTree!: NodeInfo<Node>;
  nodeInfoMap = new Map<ID<Node>, NodeInfo<Node>>();
  heights: number[] = [];
  nodes: NodePosition<Node>[] = [];
  edges: Edge<Node>[] = [];
  constructor(root: Node | Node[], options: Options<Node>) {
    this.root = root;
    this.options = options;
    this.nodeInfoTree = this.initNodeInfo(this.root, null);
  }

  get levelSpacing() {
    const spacing = this.options.spacing;
    return Array.isArray(spacing) ? spacing[0] : spacing;
  }

  get siblingSpacing() {
    const spacing = this.options.spacing;
    return Array.isArray(spacing) ? spacing[1] : spacing;
  }

  setNodeSize(
    id: ID<Node> | { id: ID<Node>; size: [number, number] }[],
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

    this.heights[level] = Math.max(this.heights[level] ?? 0, height);

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

  apportion(
    node: NodeInfo<Node>,
    defaultAncestor: NodeInfo<Node>
  ): NodeInfo<Node> {
    const sibling = node.previousSibling;
    if (sibling) {
      let rightTreeLeftmost = node;
      let rightTreeRightmost = node;
      let leftTreeRightmost = sibling;
      let parentFirstChildLeftmost = node.parent!.children[0];

      let rightTreeLeftmostModSum = rightTreeLeftmost.mod;
      let rightTreeRightmostModSum = rightTreeRightmost.mod;
      let leftTreeRightmostModSum = leftTreeRightmost.mod;
      let parentFirstChildLeftmostModSum = parentFirstChildLeftmost.mod;

      let nextRightmost = getRightmost(leftTreeRightmost);
      let nextLeftmost = getLeftmost(rightTreeLeftmost);

      while (nextRightmost && nextLeftmost) {
        leftTreeRightmost = nextRightmost;
        rightTreeLeftmost = nextLeftmost;
        parentFirstChildLeftmost = getLeftmost(parentFirstChildLeftmost);
        rightTreeRightmost = getRightmost(rightTreeRightmost);

        rightTreeRightmost.ancestor = node;
        const shift =
          leftTreeRightmost.prelim +
          leftTreeRightmostModSum -
          (rightTreeLeftmost.prelim + rightTreeLeftmostModSum) +
          this.siblingSpacing +
          (leftTreeRightmost.width + rightTreeLeftmost.width) / 2;
        if (shift > 0) {
          moveSubTree(
            getAncestor(leftTreeRightmost, node, defaultAncestor),
            node,
            shift
          );
          rightTreeLeftmostModSum += shift;
          rightTreeRightmostModSum += shift;
        }
        rightTreeLeftmostModSum += rightTreeLeftmost.mod;
        rightTreeRightmostModSum += rightTreeRightmost.mod;
        parentFirstChildLeftmostModSum += parentFirstChildLeftmost.mod;
        leftTreeRightmostModSum += leftTreeRightmost.mod;

        nextRightmost = getRightmost(leftTreeRightmost);
        nextLeftmost = getLeftmost(rightTreeLeftmost);
      }

      if (nextRightmost && !getRightmost(rightTreeRightmost)) {
        rightTreeRightmost.thread = nextRightmost;
        rightTreeRightmost.mod +=
          leftTreeRightmostModSum - rightTreeRightmostModSum;
      }
      if (nextLeftmost && !getLeftmost(parentFirstChildLeftmost)) {
        parentFirstChildLeftmost.thread = nextLeftmost;
        parentFirstChildLeftmost.mod +=
          rightTreeLeftmostModSum - parentFirstChildLeftmostModSum;
        defaultAncestor = node;
      }
    }
    return defaultAncestor;
  }

  firstWalk(nodeInfo: NodeInfo<Node>) {
    const { previousSibling, children = [] } = nodeInfo;
    if (children.length > 0) {
      let defaultAncestor = children[0];
      children.forEach((childNodeInfo) => {
        this.firstWalk(childNodeInfo);
        defaultAncestor = this.apportion(childNodeInfo, defaultAncestor);
      });
      executeShifts(nodeInfo);

      const leftmost = children[0];
      const rightmost = children[children.length - 1];
      const midpoint = (leftmost.prelim + rightmost.prelim) / 2;
      if (previousSibling) {
        nodeInfo.prelim =
          previousSibling.prelim +
          this.siblingSpacing +
          (previousSibling.width + nodeInfo.width) / 2;
        nodeInfo.mod = nodeInfo.prelim - midpoint;
      } else {
        nodeInfo.prelim = midpoint;
      }
    } else if (previousSibling) {
      nodeInfo.prelim =
        previousSibling.prelim +
        this.siblingSpacing +
        (previousSibling.width + nodeInfo.width) / 2;
    }
  }

  secondWalk(nodeInfo: NodeInfo<Node>, mod: number, y: number) {
    nodeInfo.x = nodeInfo.prelim + mod;
    nodeInfo.y = y;
    let start: NodePosition<Node> | null = null;
    if (nodeInfo.node) {
      start = {
        x: nodeInfo.x,
        y: nodeInfo.y,
        width: nodeInfo.width,
        height: nodeInfo.height,
        node: nodeInfo.node,
      };
      this.nodes.push(start);
    }
    mod += nodeInfo.mod;
    y += this.heights[nodeInfo.level] + this.levelSpacing;
    nodeInfo.children?.forEach((childNodeInfo) => {
      const end = this.secondWalk(childNodeInfo, mod, y)!;
      start && this.edges.push({ start, end });
    });
    return start;
  }

  layout() {
    this.nodes = [];
    this.firstWalk(this.nodeInfoTree);
    this.secondWalk(this.nodeInfoTree, 0, 0);
    return { nodes: this.nodes, edges: this.edges };
  }
}
