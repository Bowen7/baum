import { Graph } from '../../graph';
import { Edge } from '../../types';

export const bergerShorFAS = (graph: Graph) => {
  const g = graph.clone();
  const edgeSet = new Set<Edge>();
  g.nodeSet.forEach((node) => {
    const targetEdges = g.targetEdges(node.id);
    const sourceEdges = g.sourceEdges(node.id);
    const outDegree = targetEdges.length;
    const inDegree = sourceEdges.length;
    if (outDegree >= inDegree) {
      targetEdges.forEach((edge) => edgeSet.add(edge));
    } else {
      sourceEdges.forEach((edge) => edgeSet.add(edge));
    }
    g.removeEdges(g.edges(node.id));
  });

  graph.edgeSet.forEach((edge) => {
    if (edgeSet.has(edge)) {
      return;
    }
    graph.reverseEdge(edge);
  });
};
