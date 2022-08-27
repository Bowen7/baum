export type Size = [number, number];

export type Position = [number, number];

export type Box = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type Node<T> = T & {
  id: string;
  label?: string;
};

export type Edge = {
  source: string;
  target: string;
  type?: string;
};

export type LaidoutNode<T> = Node<T> & {
  x: number;
  y: number;
};

export type LaidoutEdge = Edge & {
  sourceBox: Box;
  targetBox: Box;
};

export type Change = {
  id: string;
  action: string;
  size: Size;
};
