import { Options, NodeInfo, NodeRect, Edge, NodeBase } from './types';

const getAncestor = <Node>(
  leftNodeInfo: NodeInfo<Node>,
  rightNodeInfo: NodeInfo<Node>,
  defaultAncestor: NodeInfo<Node>
) =>
  rightNodeInfo.parent === leftNodeInfo.ancestor?.parent
    ? leftNodeInfo.ancestor
    : defaultAncestor;

const moveSubTree = <Node>(
  leftNodeInfo: NodeInfo<Node>,
  rightNodeInfo: NodeInfo<Node>,
  shift: number
) => {
  const subtrees = rightNodeInfo.index - leftNodeInfo.index;
  rightNodeInfo.change -= shift / subtrees;
  rightNodeInfo.shift += shift;
  rightNodeInfo.prelim += shift;
  rightNodeInfo.mod += shift;
  leftNodeInfo.change += shift / subtrees;
};

const getLeftmost = <Node>(nodeInfo: NodeInfo<Node>) =>
  nodeInfo.children?.[0] ?? nodeInfo.thread;
const getRightmost = <Node>(nodeInfo: NodeInfo<Node>) =>
  nodeInfo.children?.[nodeInfo.children.length - 1] ?? nodeInfo.thread;

const executeShifts = <Node>(nodeInfo: NodeInfo<Node>) => {
  let shift = 0;
  let change = 0;
  const { children = [] } = nodeInfo;
  for (let i = children.length - 1; i >= 0; i--) {
    const child = children[i];
    child.prelim += shift;
    child.mod += shift;
    change += child.change;
    shift += child.shift + change;
  }
};

export class LayoutTree<Node extends NodeBase<Node>> {
  nodeInfoRoot: NodeInfo<Node>;
  options: Options<Node>;
  heights: number[] = [];
  nodes: NodeRect<Node>[] = [];
  edges: Edge<Node>[] = [];
  constructor(root: NodeInfo<Node>, options: Options<Node>) {
    this.nodeInfoRoot = root;
    this.options = options;
  }

  get levelSpacing() {
    const spacing = this.options.spacing;
    return Array.isArray(spacing) ? spacing[0] : spacing;
  }

  get siblingSpacing() {
    const spacing = this.options.spacing;
    return Array.isArray(spacing) ? spacing[1] : spacing;
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
    const { previousSibling, children = [], node, height, level } = nodeInfo;
    if (node) {
      this.heights[level] = Math.max(this.heights[level] ?? 0, height);
    }
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
    let start: NodeRect<Node> | null = null;
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
    this.firstWalk(this.nodeInfoRoot);
    this.secondWalk(this.nodeInfoRoot, 0, 0);
    return { nodes: this.nodes, edges: this.edges };
  }
}
