import { Graph } from '../../graph';

export const longestPath = (graph: Graph) => {
  const roots = graph.roots;
  let rank = 0;
  let ids: string[] = roots;
  let nextIds: string[] = [];
  while (ids.length && nextIds.length) {
    if (ids.length === 0) {
      rank++;
      ids = nextIds;
      nextIds = [];
    }
    const id = ids.pop()!;
    graph.nodeRankMap.set(id, rank);
    nextIds.push(...graph.targets(id));
  }
};
