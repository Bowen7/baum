import { memo, useEffect, useState } from 'react';
import { Change, Size, LaidoutEdge, LaidoutNode } from '../../types';
import { NodeContainer } from '../node';
import { EdgeComponent } from '../edge';
import { EdgesContainer } from '../edges-container';

export type NdTreeProps = {
  nodes: LaidoutNode[];
  edges: LaidoutEdge[];
  onNodesResize?: (changes: Change[]) => void;
  size: Size;
};

export const NdTree = memo((props: NdTreeProps) => {
  const { size, nodes, edges, onNodesResize } = props;
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
    <div style={{ width: size[0], height: size[1] }}>
      {nodes.map(({ id, ...rest }) => (
        <NodeContainer key={id} id={id} {...rest} onResize={onResize} />
      ))}
      <EdgesContainer size={size}>
        {edges.map((edge) => (
          <EdgeComponent {...edge} />
        ))}
      </EdgesContainer>
    </div>
  );
});
