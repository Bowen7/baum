import { Graph } from '../../graph';
import { Edge } from '../../types';

export const greedyFAS = (graph: Graph) => {
  const g = graph.clone();
  const edgeSet = new Set<Edge>();
  while (g.edgeSet.size > 0) {
    let sink: string | null;
    while ((sink = g.roots[0])) {
      const sourceEdges = g.sourceEdges(sink);
      sourceEdges.forEach((edge) => edgeSet.add(edge));
      g.removeEdges(sourceEdges);
    }

    let source: string | null;
    while ((source = g.leaves[0])) {
      const targetEdges = g.targetEdges(source);
      targetEdges.forEach((edge) => edgeSet.add(edge));
      g.removeEdges(targetEdges);
    }

    if (g.edgeSet.size > 0) {
      let maxDValue = -Infinity;
      let v: string;
      // TODO
      for (const [key] of g.sourceMap) {
        const dValue =
          g.sourceMap.get(key)?.size ?? 0 - g.targetMap.get(key)!.size ?? 0;
        if (dValue > maxDValue) {
          maxDValue = dValue;
          v = key;
        }
      }
      g.targetEdges(v!).forEach((edge) => edgeSet.add(edge));
      g.removeEdges(g.edges(v!));
    }
  }

  graph.edgeSet.forEach((edge) => {
    if (edgeSet.has(edge)) {
      return;
    }
    graph.reverseEdge(edge);
  });
};
