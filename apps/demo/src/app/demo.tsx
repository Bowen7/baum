import { NdTree } from 'nd-tree';
import { NdTreePerfectArrows } from 'nd-tree-perfect-arrows';
import './demo.css';

const data = {
  name: '1',
  children: [
    { name: '1-1 zzz', children: [{ name: '1-1-1\n111111\n22222' }] },
    {
      name: '1-2',
      children: [
        { name: '1-2-1\n33333333\n4\n5\n6' },
        { name: '1-2-2', children: [{ name: '1-2-2-1' }] },
      ],
    },
  ],
};

export const Demo = () => {
  return (
    <NdTree
      data={data}
      nodeClassName="node"
      components={{ arrow: NdTreePerfectArrows }}
    />
  );
};
