import { useEffect, useRef } from 'react';
import { Position } from '../../types';
type NodeProps = {
  className: string;
  node: any;
  path: string;
  positionMap: Map<string, Position>;
  onResize: (path: string, node: any, layout: [number, number]) => void;
};
export const Node = (props: NodeProps) => {
  const { path, className = '', node, positionMap, onResize } = props;
  const nodeRef = useRef<HTMLDivElement>(null);
  const [x = -9999, y = -9999] = positionMap.get(path) || [];

  useEffect(() => {
    if (!nodeRef.current) {
      return;
    }
    const { width, height } = nodeRef.current.getBoundingClientRect();
    onResize(path, node, [width, height]);
  }, [path]);

  return (
    <div
      ref={nodeRef}
      className={className}
      style={{
        transform: `translate(${x}px, ${y}px)`,
        position: 'absolute',
        top: 0,
        left: 0,
      }}
    >
      <NodeContent node={node} />
    </div>
  );
};

export type NodeContentProps = {
  node: any;
};
export const NodeContent = (props: NodeContentProps) => {
  const { node } = props;
  const { name = '' } = node;
  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <>{name}</>;
};
