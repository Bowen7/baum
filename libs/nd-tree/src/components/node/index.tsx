import { useEffect, useRef } from 'react';
type NodeProps = {
  className: string;
  x: number;
  y: number;
  node: any;
  ContentComponent: React.ComponentType<NodeContentProps>;
  onNodeLayout: (layout: [number, number]) => void;
};
export const Node = (props: NodeProps) => {
  const { className = '', x, y, node, ContentComponent, onNodeLayout } = props;

  const nodeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!nodeRef.current) {
      return;
    }
    const { width, height } = nodeRef.current.getBoundingClientRect();
    onNodeLayout([width, height]);
  });
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
      <ContentComponent node={node} />
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
