import { Graph } from './index';

export const postOrder = (graph: Graph, callback: (id: string) => void) => {
  const stack = graph.leaves;
  const visited = new Set<string>();
  while (stack.length) {
    const id = stack[stack.length - 1];
    const children = [...(graph.targetMap.get(id) ?? []).keys()] as string[];
    if (children.length === 0 || visited.has(id)) {
      stack.pop();
      callback(id);
      continue;
    }

    children.forEach((child) => stack.push(child));
    visited.add(id);
  }
};
