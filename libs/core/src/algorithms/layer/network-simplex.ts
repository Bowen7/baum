import { Graph } from '../../graph';
import { Edge } from '../../types';
import { longestPath } from './longest-path';
// https://ieeexplore.ieee.org/stamp/stamp.jsp?tp=&arnumber=221135

// in the simplest case,
// minlen = 1 for all edges
const MIN_LEN = 1;

// the slack of an edge is the difference of its length and its minimum length
const getEdgeSlack = (graph: Graph, source: string, target: string) =>
  graph.getRank(target)! - graph.getRank(source)! - MIN_LEN;

const getMinimalSlackEdge = (
  graph: Graph,
  tightGraph: Graph
): [number, Edge] => {
  let minSlack = Infinity;
  let minEdge: Edge;
  // TODO: performance
  graph.edges().forEach((edge) => {
    const { source, target } = edge;
    if (tightGraph.hasEdge(source, target)) {
      return;
    }
    const slack = getEdgeSlack(graph, source, target);
    if (slack < minSlack) {
      minSlack = slack;
      minEdge = edge;
    }
  });
  return [minSlack, minEdge!];
};

// an edge is tight if its slack is zero
// return tight tree node size
const getTightTreeSize = (graph: Graph, tightGraph: Graph) => {
  const dfs = (id: string) => {
    const sources = graph.sources(id);
    const targets = graph.targets(id);
    sources.forEach((source) => {
      if (getEdgeSlack(graph, source, id) === 0) {
        tightGraph.addNode(graph.node(source)!);
        tightGraph.addEdge({ source, target: id });
        dfs(source);
      }
    });
    targets.forEach((target) => {
      if (getEdgeSlack(graph, id, target) === 0) {
        tightGraph.addNode(graph.node(target)!);
        tightGraph.addEdge({ source: id, target });
        dfs(target);
      }
    });
  };
  tightGraph.nodes.forEach(({ id }) => dfs(id));
  return tightGraph.nodeSize;
};

export const feasibleTree = (graph: Graph) => {
  // use longest path algorithm to init rank
  longestPath(graph);
  const tightGraph = new Graph();
  tightGraph.addNode(graph.nodes[0]);
  while (getTightTreeSize(graph, tightGraph) !== graph.nodeSize) {
    const [slack, edge] = getMinimalSlackEdge(graph, tightGraph);
    if (tightGraph.hasNode(edge!.source)) {
      graph.setRank(edge!.target, graph.getRank(edge!.target)! - slack);
    } else {
      graph.setRank(edge!.source, graph.getRank(edge!.source)! + slack);
    }
  }
};

const initCutValues = (graph: Graph) => {
  const map = new Map<string, number>();
};

export const networkSimplex = (graph: Graph) => {
  // TODO
};
