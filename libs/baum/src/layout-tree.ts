// On the basis of Buchheim C, Jünger M, Leipert S. Improving Walker’s algorithm to run in linear time[C]
// Graph Drawing: 10th International Symposium, GD 2002 Irvine, CA, USA, August 26–28, 2002 Revised Papers 10. Springer Berlin Heidelberg, 2002: 344-353.
import { Options, NodeInfo, NodeRect, Edge, NodeBase, Position } from './types';
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
  const subtreesCount = rightNodeInfo.index - leftNodeInfo.index;
  rightNodeInfo.change -= shift / subtreesCount;
  rightNodeInfo.shift += shift;
  rightNodeInfo.prelim += shift;
  rightNodeInfo.mod += shift;
  leftNodeInfo.change += shift / subtreesCount;
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

// Some definitions:
// - size: if the orientation is left/right, it's the width, otherwise it's the height
// - span: if the orientation is left/right, it's the height, otherwise it's the width
export class LayoutTree<Node extends NodeBase<Node>> {
  rootInfo: NodeInfo<Node>;
  options: Options<Node>;
  width = 0;
  height = 0;
  levelsSpan: number[] = [];
  leafStart = 0;
  nodes: NodeRect<Node>[] = [];
  edges: Edge<Node>[] = [];
  constructor(root: NodeInfo<Node>, options: Options<Node>) {
    this.rootInfo = root;
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

  get isSizeEqualWidth() {
    const { orientation } = this.options;
    if (orientation === 'top' || orientation === 'bottom') {
      return true;
    }
    return false;
  }

  get secondWalkStart() {
    switch (this.options.orientation) {
      case 'top':
        return this.height;
      case 'left':
        return this.width;
      default:
        return 0;
    }
  }

  getSize(nodeInfo: NodeInfo<Node>) {
    if (this.isSizeEqualWidth) {
      return nodeInfo.width;
    }
    return nodeInfo.height;
  }

  getSpan(nodeInfo: NodeInfo<Node>) {
    if (this.isSizeEqualWidth) {
      return nodeInfo.height;
    }
    return nodeInfo.width;
  }

  getMeanSize(nodeInfo1: NodeInfo<Node>, nodeInfo2: NodeInfo<Node>) {
    return (this.getSize(nodeInfo1) + this.getSize(nodeInfo2)) / 2;
  }

  apportion(
    node: NodeInfo<Node>,
    defaultAncestor: NodeInfo<Node>
  ): NodeInfo<Node> {
    const leftSibling = node.previousSibling;
    if (leftSibling) {
      let rightTreeLeftmost = node;
      let rightTreeRightmost = node;
      let leftTreeRightmost = leftSibling;
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
          this.getMeanSize(leftTreeRightmost, rightTreeLeftmost);

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

  setLevelsSpan(nodeInfo: NodeInfo<Node>) {
    const { node, level } = nodeInfo;
    if (node) {
      this.levelsSpan[level] = Math.max(
        this.levelsSpan[level] ?? 0,
        this.getSpan(nodeInfo)
      );
    }
  }

  roomyWalk(nodeInfo: NodeInfo<Node>) {
    this.setLevelsSpan(nodeInfo);

    const { children = [] } = nodeInfo;
    if (children.length > 0) {
      children.forEach((childNodeInfo) => {
        this.roomyWalk(childNodeInfo);
      });
      const leftmost = children[0];
      const rightmost = children[children.length - 1];
      const midpoint = (leftmost.prelim + rightmost.prelim) / 2;

      nodeInfo.prelim = midpoint;
    } else {
      this.leafStart += this.getSize(nodeInfo) / 2;
      nodeInfo.prelim = this.leafStart;
      this.leafStart += this.getSize(nodeInfo) / 2 + this.siblingSpacing;
    }
  }

  compactWalk(nodeInfo: NodeInfo<Node>) {
    this.setLevelsSpan(nodeInfo);

    const { previousSibling, children = [] } = nodeInfo;

    if (children.length > 0) {
      let defaultAncestor = children[0];
      children.forEach((childNodeInfo) => {
        this.compactWalk(childNodeInfo);
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
          this.getMeanSize(previousSibling, nodeInfo);
        nodeInfo.mod = nodeInfo.prelim - midpoint;
      } else {
        nodeInfo.prelim = midpoint;
      }
    } else if (previousSibling) {
      nodeInfo.prelim =
        previousSibling.prelim +
        this.siblingSpacing +
        this.getMeanSize(previousSibling, nodeInfo);
    } else {
      nodeInfo.prelim = this.getSize(nodeInfo) / 2;
    }
  }

  calculateNodePosition(
    nodeInfo: NodeInfo<Node>,
    mod: number,
    levelStart: number
  ): number {
    const { width, height } = nodeInfo;
    const { orientation } = this.options;
    switch (orientation) {
      case 'top':
        nodeInfo.x = nodeInfo.prelim + mod - width / 2;
        nodeInfo.y = levelStart - nodeInfo.height;
        return levelStart - this.levelsSpan[nodeInfo.level] - this.levelSpacing;
      case 'left':
        nodeInfo.y = nodeInfo.prelim + mod - height / 2;
        nodeInfo.x = levelStart - nodeInfo.width;
        return levelStart - this.levelsSpan[nodeInfo.level] - this.levelSpacing;
      case 'right':
        nodeInfo.y = nodeInfo.prelim + mod - height / 2;
        nodeInfo.x = levelStart;
        return levelStart + this.levelsSpan[nodeInfo.level] + this.levelSpacing;
      default:
        nodeInfo.x = nodeInfo.prelim + mod - width / 2;
        nodeInfo.y = levelStart;
        return levelStart + this.levelsSpan[nodeInfo.level] + this.levelSpacing;
    }
  }

  calculateEdge(
    startRect: NodeRect<Node>,
    endRect: NodeRect<Node>
  ): Edge<Node> {
    const {
      node: startNode,
      x: startX,
      y: startY,
      width: startWidth,
      height: startHeight,
    } = startRect;
    const {
      node: endNode,
      x: endX,
      y: endY,
      width: endWidth,
      height: endHeight,
    } = endRect;
    let start!: Position;
    let end!: Position;
    switch (this.options.orientation) {
      case 'top':
        start = {
          x: startX + startWidth / 2,
          y: startY,
        };
        end = {
          x: endX + endWidth / 2,
          y: endY + endHeight,
        };
        break;
      case 'left':
        start = {
          x: startX,
          y: startY + startHeight / 2,
        };
        end = {
          x: endX + endWidth,
          y: endY + endHeight / 2,
        };
        break;
      case 'right':
        start = {
          x: startX + startWidth,
          y: startY + startHeight / 2,
        };
        end = {
          x: endX,
          y: endY + endHeight / 2,
        };
        break;
      default:
        start = {
          x: startX + startWidth / 2,
          y: startY + startHeight,
        };
        end = {
          x: endX + endWidth / 2,
          y: endY,
        };
        break;
    }
    return { start, end, startNode, endNode, startRect, endRect };
  }

  secondWalk(nodeInfo: NodeInfo<Node>, mod: number, levelStart: number) {
    levelStart = this.calculateNodePosition(nodeInfo, mod, levelStart);

    if (this.isSizeEqualWidth) {
      this.width = Math.max(this.width, nodeInfo.x + nodeInfo.width);
    } else {
      this.height = Math.max(this.height, nodeInfo.y + nodeInfo.height);
    }

    mod += nodeInfo.mod;

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
    nodeInfo.children?.forEach((childNodeInfo) => {
      const end = this.secondWalk(childNodeInfo, mod, levelStart)!;
      if (start) {
        this.edges.push(this.calculateEdge(start, end));
      }
    });
    return start;
  }

  calculateTreeSpan() {
    let treeSpan = (this.levelsSpan.length - 1) * this.levelSpacing;
    this.levelsSpan.forEach((levelSpan) => (treeSpan += levelSpan));
    if (this.isSizeEqualWidth) {
      this.height = treeSpan;
    } else {
      this.width = treeSpan;
    }
  }

  layout() {
    this.width = 0;
    this.height = 0;
    this.nodes = [];
    if (this.options.compact) {
      this.compactWalk(this.rootInfo);
    } else {
      this.roomyWalk(this.rootInfo);
    }
    this.calculateTreeSpan();
    this.secondWalk(this.rootInfo, 0, this.secondWalkStart);
    return {
      width: this.width,
      height: this.height,
      nodes: this.nodes,
      edges: this.edges,
    };
  }
}
