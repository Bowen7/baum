import { PriorityQueue } from '@datastructures-js/priority-queue';
import { Graph } from '../../graph';

// https://stackoverflow.com/a/16357676/19427123
export const transitiveReduction = (graph: Graph) => {
  const { nodes, sourceMap, targetMap } = graph;
  nodes.forEach(({ id: i }) => {
    nodes.forEach(({ id: j }) => {
      if (targetMap.get(i)?.has(j)) {
        nodes.forEach(({ id: k }) => {
          if (targetMap.get(j)?.has(k)) {
            if (targetMap.get(i)?.has(k)) {
              targetMap.get(i)?.delete(k);
              sourceMap.get(k)?.delete(i);
            }
          }
        });
      }
    });
  });
};

type QueueItem = {
  id: string;
  sourceIndices: number[];
};

const compare = (item1: QueueItem, item2: QueueItem) => {
  const sourceIndices1 = item1.sourceIndices;
  const sourceIndices2 = item2.sourceIndices;
  for (let i = 0; i < sourceIndices1.length; i++) {
    if (sourceIndices2[i] === undefined) {
      return -1;
    }
    if (sourceIndices1[i] !== sourceIndices2[i]) {
      return sourceIndices1[i] - sourceIndices2[i];
    }
  }
  return 1;
};

// TODO: optional maxWidth
// how to calculate a proper maxWidth?
// https://en.wikipedia.org/wiki/Coffman%E2%80%93Graham_algorithm
export const coffmanGraham = (graph: Graph, maxWidth: number) => {
  const { rankMap } = graph;
  const g = graph.clone();
  transitiveReduction(g);
  const { sourceMap, targetMap } = g;
  const rootIds = graph.rootIds;
  const queue = new PriorityQueue(compare);
  const sourceIndicesMap = new Map<string, number[]>();
  let index = 0;
  let layer = 0;
  let width = 0;

  rootIds.forEach((id) => {
    queue.enqueue({ id, sourceIndices: [] });
  });

  while (!queue.isEmpty()) {
    const { id } = queue.dequeue();
    let leastLayer = 0;
    sourceMap.get(id)?.forEach((source) => {
      leastLayer = Math.max(leastLayer, rankMap.get(source)! + 1);
    });
    if (leastLayer <= layer && width < maxWidth) {
      rankMap.set(id, layer);
      width++;
    } else {
      layer = Math.max(layer + 1, leastLayer);
      rankMap.set(id, layer);
      width = 1;
    }
    targetMap.get(id)?.forEach((target) => {
      if (!sourceIndicesMap.has(target)) {
        sourceIndicesMap.set(target, []);
      }
      const sourceIndices = sourceIndicesMap.get(target)!;
      sourceIndices.push(index);
      if (sourceIndices.length === sourceMap.get(target)?.size ?? 0) {
        queue.enqueue({ id: target, sourceIndices });
      }
    });
    index++;
  }
};
