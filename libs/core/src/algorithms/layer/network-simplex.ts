import minBy from 'lodash/minBy';
import { Graph, postOrder } from '../../graph';
import { Edge } from '../../types';
import { longestPath } from './longest-path';
import { bfs } from '../../graph/utils';
import { defaults } from 'lodash-es';
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
  const cutValueMap = new Map<Edge, number>();
  bfs(tightGraph, (id: string) => {
    const sourceEdges = graph.sourceEdges(id);
    const targetEdges = graph.targetEdges(id);
    const targetSize = targetEdges.length;
    targetEdges.forEach((edge) => {
      let cutValue = targetSize;
      sourceEdges.forEach((sourceEdge) => {
        cutValue--;
        const { source, target } = sourceEdge;
        if (tightGraph.hasEdge(source, target)) {
          cutValue += cutValueMap.get(sourceEdge)!;
        }
      });
      cutValueMap.set(edge, cutValue);
    });
  });
  return cutValueMap;
};

const leaveEdge = (graph: Graph, tightGraph: Graph): Edge | null => {
  const cutValueMap = initCutValues(graph, tightGraph);
  for (const [edge, cutValue] of cutValueMap) {
    if (cutValue < 0) {
      return edge;
    }
  }
  return null;
};

const enterEdge = (graph: Graph, tightGraph: Graph, edge: Edge): Edge => {
  const [lowMap, limMap] = initLowsLims(tightGraph);

  const isTailComponent = (node: string, edge: Edge) => {
    const { source, target } = edge;
    return (
      limMap.get(source)! < limMap.get(target)! &&
      limMap.get(node)! >= lowMap.get(source)! &&
      limMap.get(node)! <= limMap.get(source)!
    );
  };
  return minBy(
    graph
      .edges()
      .filter(
        ({ source, target }) =>
          !isTailComponent(source, edge) && isTailComponent(target, edge)
      ),
    ({ source, target }: Edge) => getEdgeSlack(graph, source, target)
  );
};

const exchange = (tightGraph: Graph, edge1: Edge, edge2: Edge) => {
  tightGraph.removeEdge(edge1);
  tightGraph.addEdge(edge2);
};

const updateRanks = (graph: Graph, tightGraph: Graph) => {
  bfs(tightGraph, (id: string) => {
    const child = tightGraph.targets(id)[0];
    if (child) {
      graph.setRank(child, graph.getRank(id)!);
    }
  });
};

export const networkSimplex = (graph: Graph) => {
  const tightGraph = feasibleTree(graph);
  let edge: Edge | null = null;
  while ((edge = leaveEdge(graph, tightGraph))) {
    exchange(tightGraph, edge, enterEdge(graph, tightGraph, edge));
    updateRanks(graph, tightGraph);
  }
};
