type TreeNode = {
  children?: TreeNode[];
  [key: string]: any;
};

type Options = {
  siblingSeparation: number;
};
const DEFAULT_OPTIONS: Options = {
  siblingSeparation: 5,
};
export class GeneralTree {
  protected root: TreeNode;
  protected nodeSizeMap = new Map<any, [number, number]>();
  protected modifierMap = new Map<any, number>();
  protected prelimMap = new Map<any, number>();
  // the maximum number of levels in the tree to be positioned
  protected maxDepth = 0;
  // key: level, value: current right most
  protected rightMostMap = new Map<number, any>();
  protected leftNeighborMap = new Map<any, any>();
  protected parentMap = new Map<any, any>();
  protected nodeMap = new Map<any, TreeNode>();
  protected options = DEFAULT_OPTIONS;
  constructor(root: TreeNode, options: Options) {
    this.root = root;
    this.options = { ...this.options, ...options };
  }

  getId(node: TreeNode) {
    const id = node;
    this.nodeMap.set(id, node);
  }

  getChildren(node: TreeNode) {
    return node.children || [];
  }

  getNodeSize(node: TreeNode) {
    return this.nodeSizeMap.get(this.getId(node)) || [0, 0];
  }

  getNodeWidth(node: TreeNode) {
    return this.getNodeSize(node)[0];
  }

  getNodeHeight(node: TreeNode) {
    return this.getNodeSize(node)[1];
  }

  setNodeSize(node: TreeNode, size: [number, number]) {
    this.nodeSizeMap.set(this.getId(node), size);
  }

  getNodeById(id: any) {
    return this.nodeMap.get(id) || null;
  }

  getModifier(node: TreeNode) {
    return this.modifierMap.get(this.getId(node));
  }

  setModifier(node: TreeNode, modifier = 0) {
    this.modifierMap.set(this.getId(node), modifier);
  }

  getPrelim(node: TreeNode) {
    return this.prelimMap.get(this.getId(node));
  }

  setPrelim(node: TreeNode, prelim = 0) {
    this.prelimMap.set(this.getId(node), prelim);
  }

  getFirstChild(node: TreeNode) {
    return node.children?.[0];
  }

  isLeaf(node: TreeNode) {
    return this.getChildren(node).length === 0;
  }

  getLeftNeighbor(node: TreeNode) {
    const id = this.leftNeighborMap.get(this.getId(node));
    if (id) {
      return this.getNodeById(id);
    }
    return null;
  }

  getParent(node: TreeNode) {
    const id = this.parentMap.get(this.getId(node));
    if (id) {
      return this.getNodeById(id);
    }
    return null;
  }

  setParent(node: TreeNode, parent: TreeNode) {
    this.parentMap.set(this.getId(node), this.getId(parent));
  }

  getLeftSibling(node: TreeNode) {
    const leftNeighbor = this.leftNeighborMap.get(node);
    if (leftNeighbor) {
      return this.getParent(leftNeighbor) === this.getParent(node)
        ? leftNeighbor
        : null;
    }
    return null;
  }

  // TODO
  apportion(node: TreeNode, level: number) {
    let leftmost = this.getChildren(node)[0];
    const neighbor = this.getLeftNeighbor(node);
    const compareDepth = 1;
    const depthToStop = this.maxDepth - level;
    while (leftmost && neighbor && compareDepth <= depthToStop) {
      let leftModSum = 0;
      let rightModSum = 0;
      let ancestorLeftmost = leftmost;
      let ancestorNeighbor = neighbor;
      for (let i = 0; i < compareDepth; i++) {
        ancestorLeftmost = this.getParent(ancestorLeftmost) as TreeNode;
        ancestorNeighbor = this.getParent(ancestorNeighbor) as TreeNode;
        rightModSum += this.getModifier(ancestorLeftmost)!;
        leftModSum += this.getModifier(ancestorNeighbor)!;
      }

      if (this.isLeaf(leftmost)) {
      } else {
        leftmost = this.getFirstChild(leftmost)!;
      }
    }
  }

  getLeftmost(node: TreeNode, level: number, depth: number) {
    if (level >= depth) {
      return Node;
    } else if (this.isLeaf(node)) {
      return null;
    } else {
      const rightmost = this.getFirstChild(node)!;
      const leftMost = this.getLeftmost(rightmost, level + 1, depth);
    }
  }

  firstWalk(node: TreeNode, level: number) {
    this.setModifier(node);

    this.rightMostMap.set(level, node);
    const leftSibling = this.getLeftSibling(node);
    if (this.isLeaf(node)) {
      if (leftSibling) {
        const prelim =
          this.getPrelim(leftSibling)! +
          this.options.siblingSeparation +
          (this.getNodeWidth(leftSibling) + this.getNodeWidth(node)) / 2;
        this.setPrelim(node, prelim);
      } else {
        this.setPrelim(node);
      }
    } else {
      const children = this.getChildren(node);
      children.forEach((child) => {
        this.setParent(child, node);
        this.firstWalk(child, level + 1);
      });
      const leftmost = children[0];
      const rightmost = children[children.length - 1];
      const midPoint =
        (this.getPrelim(leftmost)! + this.getPrelim(rightmost)!) / 2;
      if (leftSibling) {
        const prelim =
          this.getPrelim(leftSibling)! +
          this.options.siblingSeparation +
          (this.getNodeWidth(leftSibling) + this.getNodeWidth(node)) / 2;
        this.setPrelim(node, prelim);
        this.setModifier(node, prelim - midPoint);
        this.apportion(node, level);
      } else {
        this.setPrelim(node, midPoint);
      }
    }
  }

  // secondWalk() {}
}
