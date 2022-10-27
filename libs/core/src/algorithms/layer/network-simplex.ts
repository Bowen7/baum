import { Graph, postOrder } from '../../graph';
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
  return tightGraph;
};

const initLowsLims = (tightGraph: Graph) => {
  const lowMap = new Map<string, number>();
  const limMap = new Map<string, number>();
  let lim = 0;
  postOrder(tightGraph, (id) => {
    limMap.set(id, lim++);
    const targets = tightGraph.targets(id);
    if (targets.length === 0) {
      lowMap.set(id, lim - 1);
    } else {
      lowMap.set(id, Math.min(...targets.map((target) => limMap.get(target)!)));
    }
  });
  return [lowMap, limMap];
};

const initCutValues = (graph: Graph, tightGraph: Graph) => {
  const [lowMap, limMap] = initLowsLims(tightGraph);
};

const leaveEdge = (graph: Graph, tightGraph: Graph): Edge | undefined => {};

const enterEdge = (graph: Graph, tightGraph: Graph): Edge => {};

const exchange = (edge1: Edge, edge2: Edge) => {};

export const networkSimplex = (graph: Graph) => {
  const tightGraph = feasibleTree(graph);
  let edge: Edge | undefined;
  while ((edge = leaveEdge(graph, tightGraph))) {
    exchange(edge, enterEdge(graph, tightGraph));
  }
};
