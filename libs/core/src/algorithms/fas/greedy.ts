import { Graph } from '../../graph';
import { setGraphMap, removeGraphMap } from './utils';

const getSink = (
  sourceMap: Map<string, Set<string>>,
  targetMap: Map<string, Set<string>>
) => {
  for (const key in sourceMap) {
    if (!targetMap.has(key)) {
      return key;
    }
  }
  return null;
};

const getSource = (
  sourceMap: Map<string, Set<string>>,
  targetMap: Map<string, Set<string>>
) => {
  for (const key in targetMap) {
    if (!sourceMap.has(key)) {
      return key;
    }
  }
  return null;
};

export const greedyFAS = (graph: Graph) => {
  const g = graph.clone();
  const edgeMap = new Map<string, Set<string>>();
  while (g.sourceMap.size > 0 || g.targetMap.size > 0) {
    let sink: string | null;
    while ((sink = getSink(g.sourceMap, g.targetMap))) {
      setGraphMap(edgeMap, g.sourceMap.get(sink)!, sink);
      g.removeEdgeFromMap(sink, 'target');
    }

    let source: string | null;
    while ((source = getSource(g.sourceMap, g.targetMap))) {
      setGraphMap(edgeMap, source, g.targetMap.get(source)!);
      g.removeEdgeFromMap(source, 'source');
    }

    if (g.sourceMap.size > 0 || g.targetMap.size > 0) {
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
      setGraphMap(edgeMap, v!, g.targetMap.get(v!)!);
      g.removeEdgeFromMap(v!);
    }
  }

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
