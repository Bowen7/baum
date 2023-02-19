export type TreeId = number | string | symbol;

export type TreeNode = {
  id: TreeId;
  children?: TreeNode[];
  isSubTreeRoot?: boolean;
  [key: string]: any;
};
