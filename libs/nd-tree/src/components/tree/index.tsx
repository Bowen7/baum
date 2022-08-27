import { memo, useEffect, useState } from 'react';
import { Change, Size, LaidoutEdge, LaidoutNode } from '../../types';
import { NodeContainer } from '../node';

export type NdTreeProps<T> = {
  nodes: LaidoutNode<T>[];
  edges: LaidoutEdge[];
  onNodesResize?: (changes: Change[]) => void;
  onResize?: (size: Size) => void;
};

export const NdTree = memo(<T,>(props: NdTreeProps<T>) => {
  const { nodes, edges, onNodesResize } = props;
  const [changes, setChanges] = useState<Change[]>([]);

  useEffect(() => {
    if (changes.length > 0) {
      onNodesResize?.(changes);
      setChanges(() => []);
    }
  }, [changes]);

  const onResize = (change: Change) => {
    setChanges((c) => [...c, change]);
  };
  return (
    <>
      {nodes.map(({ id, ...rest }) => (
        <NodeContainer key={id} id={id} {...rest} onResize={onResize} />
      ))}
    </>
  );
});
