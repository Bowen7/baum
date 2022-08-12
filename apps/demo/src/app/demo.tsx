import { useState } from 'react';
import { NdTree } from 'nd-tree';
import { NdTreePerfectArrows } from 'nd-tree-perfect-arrows';
import './demo.css';
type Node = {
  name: string;
  children: Node[];
};
const data: Node = {
  name: '1',
  children: [
    {
      name: '1-1 zzz',
      children: [{ name: '1-1-1\n111111\n22222', children: [] }],
    },
    {
      name: '1-2',
      children: [
        { name: '1-2-1\n33333333\n4\n5\n6', children: [] },
        { name: '1-2-2', children: [{ name: '1-2-2-1', children: [] }] },
      ],
    },
  ],
};

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
  return (
    <NdTree
      data={data}
      nodeClassName="node"
      components={{ arrow: NdTreePerfectArrows, content: Content }}
    />
  );
};
