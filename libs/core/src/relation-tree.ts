import { TreeNode } from './types';
type RelationNode = {
  id: any;
  parent: RelationNode;
  firstChild: RelationNode;
  leftNeighbor: RelationNode;
  rightNeighbor: RelationNode;
};
export class RelationTree {
  treeNodeMap = new Map<any, TreeNode>();
  relationNodeMap = new Map<any, RelationNode>();
  constructor(root: TreeNode) {}

  getId(treeNode: TreeNode) {
    return treeNode;
  }

  getNodeById(id: any) {
    return this.treeNodeMap.get(id) || null;
  }

  getChildren(node: TreeNode) {
    return node.children || [];
  }

  getRelationNode(node: TreeNode) {
    return this.relationNodeMap.get(this.getId(node)) || null;
  }

  initRelation(node: TreeNode) {}

  parent() {}

  firstChild(node: TreeNode) {
    return this.getChildren(node)[0];
  }

  leftSibling() {}

  rightSibling() {}

  leftNeighbor() {}

  insert(node: TreeNode, parent: TreeNode, index: number) {}

  remove() {}
}
