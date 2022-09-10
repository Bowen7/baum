export type Node = {
  id: string;
  label?: string;
  [key: string]: unknown;
};

export type Edge = {
  source: string;
  target: string;
  type?: string;
};
