export type Size = [number, number];

export type Position = [number, number];

export type Box = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type Node = {
  id: string;
  label?: string;
  [key: string]: unknown;
};

export type Edge = {
  source: string;
  target: string;
  type: string;
};

export type Change = {
  id: string;
  action: string;
  size: Size;
};
