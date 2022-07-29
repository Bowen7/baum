type NodeProps = {
  x: number;
  y: number;
  node: any;
};

export const Node = (props: NodeProps) => {
  const { x, y, node } = props;
  const { name, children: nodeChildren } = node;
  return (
    <>
      <div
        style={{
          transform: `translate(${x}px, ${y}px)`,
          position: "absolute",
          top: 0,
          left: 0,
        }}
      >
        {name}
      </div>
      {nodeChildren}
    </>
  );
};
