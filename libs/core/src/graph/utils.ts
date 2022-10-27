import { Graph } from './index';

export const postOrder = (graph: Graph, callback: (id: string) => void) => {
  const stack = graph.leaves;
  const visited = new Set<string>();
  while (stack.length) {
    const id = stack[stack.length - 1];
    const children = [...(graph.targetMap.get(id) ?? []).keys()] as string[];
    if (children.length === 0 || visited.has(id)) {
      stack.pop();
      callback(id);
      continue;
    }

    children.forEach((child) => stack.push(child));
    visited.add(id);
  }
};

const getRankNodeMap = (graph: Graph): [Map<number, string[]>, number] => {
  const rankNodeMap = new Map<number, string[]>();
  let maxRank = 0;
  graph.nodes.forEach((node) => {
    const rank = graph.getRank(node)!;
    maxRank = Math.max(maxRank, rank);
    let ids: string[] = [];
    if (rankNodeMap.has(rank)) {
      ids = rankNodeMap.get(rank)!;
    } else {
      rankNodeMap.set(rank, ids);
    }
    ids.push(node.id);
  });
  return [rankNodeMap, maxRank];
};

export const bfs = (graph: Graph, callback: (id: string) => void) => {
  const [rankNodeMap, maxRank] = getRankNodeMap(graph);
  for (let i = 0; i <= maxRank; i++) {
    (rankNodeMap.get(i) || []).forEach((id) => callback(id));
  }
};

// reserved bfs
export const rbfs = (graph: Graph, callback: (id: string) => void) => {
  const [rankNodeMap, maxRank] = getRankNodeMap(graph);
  for (let i = maxRank; i > 0; i--) {
    (rankNodeMap.get(i) || []).forEach((id) => callback(id));
  }
};
