import { useMemo, useRef, useState } from 'react';
import {
  Node,
  Size,
  Position,
  Edge,
  Change,
  LaidoutEdge,
  LaidoutNode,
} from '../types';
const marginH = 50;
const marginV = 25;

const calcChildTreeSize = (
  targetGraph: Map<string, string[]>,
  rootIds: string[],
  nodeSizeMap: Map<string, Size>
): [Size, Map<string, Size>] => {
  const childTreeSizeMap = new Map<string, Size>();

  const dfs = (ids: string[]): Size =>
    ids.length > 0
      ? ids.reduce(
          ([width, height], id) => {
            const [nodeWidth, nodeHeight] = nodeSizeMap.get(id) || [0, 0];
            const children = targetGraph.get(id) || [];
            let childTreeWidth = nodeWidth;
            let childTreeHeight = nodeHeight;
            if (children.length) {
              const [childrenWidth, childrenHeight] = dfs(children);
              [childTreeWidth, childTreeHeight] = [
                nodeWidth + childrenWidth + marginH,
                Math.max(nodeHeight, childrenHeight),
              ];
            }
            childTreeSizeMap.set(id, [childTreeWidth, childTreeHeight]);
            return [Math.max(width, childTreeWidth), height + childTreeHeight];
          },
          [0, marginV * (ids.length - 1)]
        )
      : [0, 0];
  const size = dfs(rootIds);
  return [size, childTreeSizeMap];
};

const calcPosition = (
  targetGraph: Map<string, string[]>,
  rootIds: string[],
  nodeSizeMap: Map<string, Size>
): [Size, Map<string, Position>] => {
  const [size, childTreeSizeMap] = calcChildTreeSize(
    targetGraph,
    rootIds,
    nodeSizeMap
  );
  const positionMap = new Map<string, Position>();

  const dfs = (ids: string[], position: Position) => {
    const [x, y] = position;
    let curY = y;
    ids.forEach((id) => {
      const [nodeWidth, nodeHeight] = nodeSizeMap.get(id) || [0, 0];
      const [, childTreeHeight] = childTreeSizeMap.get(id) || [0, 0];
      const nodeX = x;
      const nodeY = curY + (childTreeHeight - nodeHeight) / 2;
      positionMap.set(id, [nodeX, nodeY]);
      const children = targetGraph.get(id) || [];
      dfs(children, [nodeX + nodeWidth + marginH, curY]);
      curY += childTreeHeight + marginV;
    });
  };
  dfs(rootIds, [0, 0]);
  return [size, positionMap];
};

export const useLayout = <T>(nodes: Node<T>[], edges: Edge[]) => {
  const nodeSizeMap = useRef<Map<string, Size>>(new Map());
  const [positionMap, setPositionMap] = useState<Map<string, Position>>(
    () => new Map()
  );
  const [size, setSize] = useState<Size>([0, 0]);

  const { targetGraph, rootIds } = useMemo(() => {
    const targetGraph = new Map<string, string[]>();
    const childMap = new Set<string>();
    const rootIds: string[] = [];
    edges.forEach(({ source, target }) => {
      if (!targetGraph.has(source)) {
        targetGraph.set(source, []);
      }
      childMap.add(target);
      targetGraph.get(source)!.push(target);
    });
    nodes.forEach(({ id }) => {
      if (!childMap.has(id)) {
        rootIds.push(id);
      }
    });
    return { targetGraph, rootIds };
  }, [nodes, edges]);

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
    const [size, positionMap] = calcPosition(
      targetGraph,
      rootIds,
      nodeSizeMap.current
    );
    setSize(size);
    setPositionMap(positionMap);
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

  return { size, nodes: laidoutNodes, edges: laidoutEdges, onNodesResize };
};
