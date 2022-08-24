import { useMemo } from 'react';
import { Node, Edge } from '../types';
export const useLayout = (nodes: Node[], edges: Edge[]) => {
  const temp = useMemo(() => ({ nodes, edges }), [nodes, edges]);
  const onNodesResize = () => {};
  return { onNodesResize };
};
