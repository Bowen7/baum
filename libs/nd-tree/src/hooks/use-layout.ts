import { useMemo, useRef, useCallback, useState, useEffect } from 'react';
import {
  Node,
  Size,
  Position,
  Edge,
  Change,
  LaidoutEdge,
  LaidoutNode,
} from '../types';

type Graph = {
  targetGraph: Map<string, string[]>;
  sourceGraph: Map<string, string[]>;
  rootIds: string[];
  leafIds: string[];
};

type DiffResult = {
  id: string;
  action: string;
};

const diffGraph = (prevGraph: Graph, nextGraph: Graph): DiffResult[] => {
  return [];
};

const emptyGraph: Graph = {
  targetGraph: new Map(),
  sourceGraph: new Map(),
  rootIds: [],
  leafIds: [],
};
export const useLayout = <T>(nodes: Node<T>[], edges: Edge[]) => {
  const prevGraph = useRef<Graph>(emptyGraph);
  const nodeSizeMap = useRef<Map<string, Size>>(new Map());
  const [positionMap, setPositionMap] = useState<Map<string, Position>>(
    () => new Map()
  );

  const onNodesResize = (changes: Change[]) => {
    changes.forEach((change: Change) => {
      const { id, action, size } = change;
      switch (action) {
        case 'mount':
        case 'update':
          nodeSizeMap.current.set(id, size);
          break;
        case 'unmount':
          nodeSizeMap.current.delete(id);
          break;
        default:
          break;
      }
    });
  };

  const laidoutNodes: LaidoutNode<T>[] = useMemo(
    () =>
      nodes.map((node) => {
        const [x, y] = positionMap.get(node.id) || [0, 0];
        return { ...node, x, y };
      }),
    [nodes, positionMap]
  );

  const laidoutEdges: LaidoutEdge[] = useMemo(
    () =>
      edges
        .filter(
          ({ source, target }) =>
            positionMap.has(source) && positionMap.has(target)
        )
        .map((edge) => {
          const { source, target } = edge;
          const [sourceX, sourceY] = positionMap.get(source)!;
          const [targetX, targetY] = positionMap.get(target)!;
          const [sourceWidth, sourceHeight] = nodeSizeMap.current.get(source)!;
          const [targetWidth, targetHeight] = nodeSizeMap.current.get(target)!;
          return {
            ...edge,
            sourceBox: {
              x: sourceX,
              y: sourceY,
              width: sourceWidth,
              height: sourceHeight,
            },
            targetBox: {
              x: targetX,
              y: targetY,
              width: targetWidth,
              height: targetHeight,
            },
          };
        }),
    [edges, positionMap]
  );

  return { nodes: laidoutNodes, edges: laidoutEdges, onNodesResize };
};
