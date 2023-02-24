export type Orientation = 'top' | 'bottom' | 'left' | 'right' | 'radial';

export type LevelAlign = 'start' | 'center' | 'none';

export type ID<Node> = string | number | symbol | Node;

export type Options<
  Node extends { children?: Node[]; group?: Node[] | Node[][] }
> = {
  orientation: Orientation;
  levelAlign: LevelAlign;
  spacing: number | [number, number];
  getID: (node: Node) => ID<Node>;
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

export type NodePosition<Node> = {
  x: number;
  y: number;
  width: number;
  height: number;
  node: Node;
};
export type Edge<Node> = {
  start: NodePosition<Node>;
  end: NodePosition<Node>;
};
