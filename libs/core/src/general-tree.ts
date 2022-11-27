type TreeNode = {
  id?: string;
  children?: TreeNode[];
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
  protected options = DEFAULT_OPTIONS;
  constructor(root: TreeNode, options: Options) {
    this.root = root;
    this.options = { ...this.options, ...options };
  }

  getId(node: TreeNode) {
    return node.id || node;
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

  getLeftSibling(parent: TreeNode, index: number) {
    if (index < 1) {
      return null;
    }
    return this.getChildren(parent)[index - 1];
  }

  firstWalk(node: TreeNode, level: number, parent: TreeNode, index: number) {
    this.setModifier(node);

    if (this.isLeaf(node)) {
      const leftSibling = this.getLeftSibling(parent, index);
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
      children.forEach((child, index) => {
        this.firstWalk(child, level + 1, child, index);
      });
    }
  }

  // secondWalk() {}
}
