import { Graph } from './index';
import { Edge } from '../types';

export const traverseNodes = (graph: Graph) => {
  const roots = graph.roots;
  const visited = new Set<string>(roots);
  const result: string[] = [];
  const queue = [...graph.roots];
  while (queue.length) {
    const id = queue.shift()!;
    result.push(id);
    graph.targets(id).forEach((target) => {
      if (!visited.has(target)) {
        queue.push(target);
        visited.add(target);
      }
    });
  }
  return result;
};

export const traverseEdgesByRoots = (graph: Graph, roots: string[]) => {
  const visited = new Set<Edge>();
  const result: Edge[] = [];
  // TODO
  const queue = [...roots];
  while (queue.length > 0) {
    const id = queue.shift()!;
    const edges = graph.edges(id);
    edges.forEach((edge) => {
      if (!visited.has(edge)) {
        visited.add(edge);
        result.push(edge);
      }
    });
  }
  return result;
};
