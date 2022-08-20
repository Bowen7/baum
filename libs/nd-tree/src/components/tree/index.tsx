import { memo } from 'react';

type Node<T = {}> = T & {
  id: string;
  label?: string;
};

type Edge = {
  source: string;
  target: string;
  type: string;
};

export type NdTreeProps<T> = {
  nodes: Node<T>[];
  edges: Edge[];
};

export const NdTree = memo(<T,>(props: NdTreeProps<T>) => {
  return <></>;
});
