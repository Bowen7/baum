import { Graph } from '../../graph';
export const BergerShorFAS = (graph: Graph) => {
  const g = graph.clone();
  const edgeMap = new Map<string, string>();
  g.nodes.forEach((node) => {
    const targeSet = g.targetMap.get(node.id);
    const sourceSet = g.sourceMap.get(node.id);
    const outDegree = targeSet?.size || 0;
    const inDegree = sourceSet?.size || 0;
    if (outDegree >= inDegree) {
      if (targeSet) {
        targeSet.forEach((target) => {
          edgeMap.set(node.id, target);
        });
      }
    } else {
      if (sourceSet) {
        sourceSet.forEach((source) => {
          edgeMap.set(source, node.id);
        });
      }
    }
    if (sourceSet) {
      sourceSet.forEach((source) => {
        g.targetMap.get(source)?.delete(node.id);
      });
    }
    if (targeSet) {
      targeSet.forEach((target) => {
        g.sourceMap.get(target)?.delete(node.id);
      });
    }
  });
  const fas = g.edges.filter((edge) => !edgeMap.has(edge.source));
};
