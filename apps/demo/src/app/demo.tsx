import { useState } from 'react';
import { NdTree, useLayout, Node, Edge } from 'nd-tree';
import './demo.css';
const nodes: Node<{}>[] = [
  { id: '1', label: '1111111' },
  { id: '2', label: '222' },
  { id: '3', label: '3333' },
  { id: '4', label: '44' },
  { id: '5', label: '5555' },
  { id: '6', label: '666666' },
];
const edges: Edge[] = [
  { source: '1', target: '2' },
  { source: '1', target: '3' },
  { source: '3', target: '4' },
  { source: '3', target: '5' },
  { source: '3', target: '6' },
];

type ContentProps = { node: any };
const Content = (props: ContentProps) => {
  const { name } = props.node;
  const [collapsed, setCollapsed] = useState(true);
  return (
    <>
      <div>{name}</div>
      <button onClick={() => setCollapsed((c) => !c)}>
        {collapsed ? 'expand' : 'collapse'}
      </button>
      {!collapsed && <div>extra content</div>}
    </>
  );
};

export const Demo = () => {
  const bindings = useLayout(nodes, edges);
  return <NdTree {...bindings} />;
};
