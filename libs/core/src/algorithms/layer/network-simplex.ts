import { Graph } from '../../graph';
import { Edge } from '../../types';
import { longestPath } from './longest-path';
// https://ieeexplore.ieee.org/stamp/stamp.jsp?tp=&arnumber=221135

// in the simplest case,
// minlen = 1 for all edges
const MIN_LEN = 1;

// the slack of an edge is the difference of its length and its minimum length
const getEdgeSlack = (graph: Graph, source: string, target: string) => {
  const { rankMap } = graph;
  return rankMap.get(target)! - rankMap.get(source)! - MIN_LEN;
};

const getMinimalSlackEdge = (graph: Graph, tightNodeSet: Set<string>) =>
  graph.edges
    .filter(
      ({ source, target }) =>
        tightNodeSet.has(source) !== tightNodeSet.has(target)
    )
    .reduce(
      ([minEdge, minSlack]: [Edge | null, number], edge: Edge) => {
        const slack = getEdgeSlack(graph, edge.source, edge.target);
        if (slack < minSlack) {
          return [edge, slack] as [Edge | null, number];
        }
        return [minEdge, minSlack] as [Edge | null, number];
      },
      [null, Infinity]
    );

// an edge is tight if its slack is zero
// return tight tree node size
const tightTree = (graph: Graph, tightNodeSet: Set<string>) => {
  const dfs = (id: string) => {
    const sources = graph.sourceMap.get(id);
    const targets = graph.targetMap.get(id);
    if (sources) {
      sources.forEach((source) => {
        if (getEdgeSlack(graph, source, id) === 0) {
          tightNodeSet.add(source);
          dfs(source);
        }
      });
    }
    if (targets) {
      targets.forEach((target) => {
        if (getEdgeSlack(graph, id, target) === 0) {
          tightNodeSet.add(target);
          dfs(target);
        }
      });
    }
  };
  tightNodeSet.forEach((id) => dfs(id));
  return tightNodeSet.size;
};

export const feasibleTree = (graph: Graph) => {
  // use longest path algorithm to init rank
  longestPath(graph);
  const tightNodeSet = new Set<string>();
  tightNodeSet.add(graph.nodes[0].id);
  while (tightTree(graph, tightNodeSet) !== graph.nodes.length) {
    const [edge, slack] = getMinimalSlackEdge(graph, tightNodeSet);
    if (tightNodeSet.has(edge!.source)) {
      graph.rankMap.set(edge!.target, graph.rankMap.get(edge!.target)! - slack);
    } else {
      graph.rankMap.set(edge!.source, graph.rankMap.get(edge!.source)! + slack);
    }
  }
};

const initCutValues = (graph: Graph) => {
  const map = new Map<string, number>();
};

export const networkSimplex = (graph: Graph) => {
  // TODO
};
