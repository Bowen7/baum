import { memo } from 'react';
import { Change, Size, Node, Edge } from '../../types';
import { NodeContainer } from '../node';

export type NdTreeProps = {
  nodes: Node[];
  edges: Edge[];
  onNodesResize: (changes: Change[]) => void;
  onResize: (size: Size) => void;
};

export const NdTree = memo((props: NdTreeProps) => {
  const { nodes, edges } = props;
  return (
    <>
      {nodes.map(({ id, ...rest }) => (
        <NodeContainer key={id} id={id} {...rest} />
      ))}
    </>
  );
});
