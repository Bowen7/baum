import { baum, BaumOptions } from 'baum';
import { Fragment, useEffect, useState } from 'react';
type Tree = {
  title: string;
  children?: Tree[];
  width: number;
  height: number;
};

const root: Tree = {
  title: 'r',
  width: 30,
  height: 40,
  children: [
    {
      title: 'e',
      children: [
        { title: 'a', width: 30, height: 80 },
        {
          title: 'd',
          children: [
            { title: 'b', width: 30, height: 40 },
            { title: 'c', width: 30, height: 40 },
          ],
          width: 30,
          height: 40,
        },
      ],
      width: 30,
      height: 40,
    },
    { title: 'f', width: 30, height: 40 },
    {
      title: 'n',
      children: [
        { title: 'g', width: 30, height: 40 },
        {
          title: 'm',
          children: [
            { title: 'h', width: 30, height: 40 },
            { title: 'i', width: 30, height: 40 },
            { title: 'j', width: 30, height: 40 },
            { title: 'k', width: 30, height: 40 },
            { title: 'l', width: 30, height: 40 },
          ],
          width: 60,
          height: 40,
        },
      ],
      width: 30,
      height: 60,
    },
    {
      title: 'q',
      children: [
        {
          title: 'p',
          children: [{ title: 'o', width: 30, height: 40 }],
          width: 30,
          height: 40,
        },
      ],
      width: 30,
      height: 40,
    },
  ],
};
const options: Partial<BaumOptions<Tree>> = {
  orientation: 'bottom',
  levelAlign: 'center',
  spacing: [40, 25],
  compact: false,
  getID: (node: Tree) => node.title,
};

export const Demo = () => {
  const [{ nodes, edges, width, height }] = useState(() => baum(root, options));
  return (
    <div className="m-6">
      <svg width={width} height={height}>
        {nodes.map(
          ({
            node,
            x,
            y,
            width: nodeWidth,
            height: nodeHeight,
          }: {
            node: Tree;
            x: number;
            y: number;
            width: number;
            height: number;
          }) => (
            <g>
              <rect
                key={node.title}
                x={x}
                y={y}
                width={nodeWidth}
                height={nodeHeight}
                fill="transparent"
                stroke="black"
              />
              <text
                textAnchor="middle"
                fontSize={16}
                x={x + nodeWidth / 2}
                y={y + nodeHeight / 2}
                dy={8}
              >
                {node.title}
              </text>
            </g>
          )
        )}
        {edges.map(({ start, end, startNode, endNode }) => (
          <path
            d={`M${start.x},${start.y}L${end.x},${end.y}`}
            key={`${startNode.title}-${endNode.title}`}
            stroke="#000"
            strokeWidth={1}
            fill="none"
          />
        ))}
      </svg>
    </div>
  );
};
