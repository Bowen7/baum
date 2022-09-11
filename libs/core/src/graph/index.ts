import { Node, Edge } from '../types';
const cloneSourceMap = (map: Map<string, Set<string>>) => {
  const newMap = new Map();
  map.forEach((value, key) => {
    newMap.set(key, new Set(value));
  });
  return newMap;
};

export class Graph {
  nodes: Node[];
  edges: Edge[];
  sourceMap: Map<string, Set<string>> = new Map();
  targetMap: Map<string, Set<string>> = new Map();
  constructor(nodes: Node[], edges: Edge[]) {
    this.nodes = nodes;
    this.edges = edges;
    edges.forEach((edge) => {
      let { source, target } = edge;
      if (edge.reversed) {
        [target, source] = [source, target];
      }
      if (!this.sourceMap.has(target)) {
        this.sourceMap.set(target, new Set([source]));
      }
      if (!this.targetMap.has(source)) {
        this.targetMap.set(source, new Set([target]));
      }
      this.sourceMap.get(target)!.add(source);
      this.targetMap.get(source)!.add(target);
    });
  }

  clone() {
    const graph = new Graph([], []);
    graph.nodes = this.nodes.slice();
    graph.edges = this.edges.slice();
    graph.sourceMap = cloneSourceMap(this.sourceMap);
    graph.targetMap = cloneSourceMap(this.targetMap);
    return graph;
  }

  get rootIds() {
    return this.nodes
      .map((node) => node.id)
      .filter((id) => !this.sourceMap.has(id));
  }

  get leafIds() {
    return this.nodes
      .map((node) => node.id)
      .filter((id) => !this.targetMap.has(id));
  }
}
