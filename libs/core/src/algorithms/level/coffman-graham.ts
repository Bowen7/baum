import { Graph } from '../../graph';

export const transitiveReduction = (graph: Graph) => {
  const { nodes, sourceMap, targetMap } = graph;
  nodes.forEach(({ id: i }) => {
    nodes.forEach(({ id: j }) => {
      if (targetMap.get(i)?.has(j)) {
        nodes.forEach(({ id: k }) => {
          if (targetMap.get(j)?.has(k)) {
            if (targetMap.get(i)?.has(k)) {
              targetMap.get(i)?.delete(k);
              sourceMap.get(k)?.delete(i);
            }
          }
        });
      }
    });
  });
};

// const coffmanGraham = (graph: Graph) => {};
