import { Graph } from '../../graph';

export const longestPath = (graph: Graph) => {
  const rootIds = graph.rootIds;
  let rank = 0;
  let ids: string[] = rootIds;
  let nextIds: string[] = [];
  while (ids.length && nextIds.length) {
    if (ids.length === 0) {
      rank++;
      ids = nextIds;
      nextIds = [];
    }
    const id = ids.pop();
    graph.rankMap.set(id!, rank);
    const targetSet = graph.targetMap.get(id!)!;
    nextIds.push(...targetSet);
  }
};
