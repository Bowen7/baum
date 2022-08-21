import { memo } from 'react';
import { NodeContainer } from '../node';

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
  const { nodes, edges } = props;
  return (
    <>
      {nodes.map(({ id, ...rest }) => (
        <NodeContainer key={id} id={id} {...rest} />
      ))}
    </>
  );
});
