import { NdTree } from 'nd-tree';
import './demo.css';

const data = {
  name: '1',
  children: [
    { name: '1-1 zzz', children: [{ name: '1-1-1' }] },
    {
      name: '1-2',
      children: [
        { name: '1-2-1' },
        { name: '1-2-2', children: [{ name: '1-2-2-1' }] },
      ],
    },
  ],
};

export const Demo = () => {
  return <NdTree data={data} nodeClassName="node" />;
};
