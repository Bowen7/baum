export type Props<TreeNode> = {
  tree: TreeNode;
  getChildren: (node: TreeNode) => TreeNode[];
  getGroup: (node: TreeNode) => TreeNode[];
};
