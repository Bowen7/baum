import { Graph } from '../../graph';
import { setGraphMap, removeGraphMap } from './utils';

export const bergerShorFAS = (graph: Graph) => {
  const g = graph.clone();
  const edgeMap = new Map<string, Set<string>>();
  g.nodes.forEach((node) => {
    const targeSet = g.targetMap.get(node.id);
    const sourceSet = g.sourceMap.get(node.id);
    const outDegree = targeSet?.size || 0;
    const inDegree = sourceSet?.size || 0;
    if (outDegree >= inDegree) {
      if (targeSet) {
        setGraphMap(edgeMap, node.id, targeSet);
      }
    } else {
      if (sourceSet) {
        setGraphMap(edgeMap, sourceSet, node.id);
      }
    }
    if (sourceSet) {
      removeGraphMap(g.targetMap, sourceSet, node.id);
    }
    if (targeSet) {
      removeGraphMap(g.sourceMap, targeSet, node.id);
    }
  });

  graph.edges = graph.edges.map((edge) => {
    const { source, target } = edge;
    if (edgeMap.get(source)?.has(target)) {
      return edge;
    }
    removeGraphMap(graph.sourceMap, target, source);
    removeGraphMap(graph.targetMap, source, target);
    return { ...edge, reversed: true };
  });
};
