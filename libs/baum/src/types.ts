export type Orientation = 'top' | 'bottom' | 'left' | 'right' | 'radial';

export type LevelAlign = 'start' | 'center' | 'none';

export type ID = string | number | symbol;
export interface NodeBase<Node> {
  id?: string;
  children?: Node[];
  group?: Node[] | Node[][];
  width?: number;
  height?: number;
}

export type Options<Node extends NodeBase<Node>> = {
  orientation: Orientation;
  levelAlign: LevelAlign;
  spacing: number | [number, number];
  getID: (node: Node) => ID;
  getChildren: (node: Node) => Node['children'];
  getGroup: (node: Node) => Node['group'];
};

export type NodeInfo<Node> = {
  virtual: boolean;
  node: Node | null;
  x: number;
  y: number;
  width: number;
  height: number;
  level: number;
  prelim: number;
  mod: number;
  change: number;
  shift: number;
  index: number;
  children: NodeInfo<Node>[];
  parent: NodeInfo<Node> | null;
  previousSibling: NodeInfo<Node> | null;
  thread: NodeInfo<Node> | null;
  ancestor: NodeInfo<Node> | null;
};

export type NodeRect<Node> = {
  x: number;
  y: number;
  width: number;
  height: number;
  node: Node;
};

export type Position = { x: number; y: number };

export type Edge<Node> = {
  start: Position;
  end: Position;
  startRect: NodeRect<Node>;
  endRect: NodeRect<Node>;
  startNode: Node;
  endNode: Node;
};
