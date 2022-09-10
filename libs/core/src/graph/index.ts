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
  rootIds: string[];
  leafIds: string[];
  constructor(nodes: Node[], edges: Edge[]) {
    this.nodes = nodes;
    this.edges = edges;
    edges.forEach((edge) => {
      const { source, target } = edge;
      if (!this.sourceMap.has(target)) {
        this.sourceMap.set(target, new Set([source]));
      }
      if (!this.targetMap.has(source)) {
        this.targetMap.set(source, new Set([target]));
      }
      this.sourceMap.get(target)!.add(source);
      this.targetMap.get(source)!.add(target);
    });
    const ids = this.nodes.map((node) => node.id);
    this.rootIds = ids.filter((id) => !this.sourceMap.has(id));
    this.leafIds = ids.filter((id) => !this.targetMap.has(id));
  }

  clone() {
    const graph = new Graph([], []);
    graph.nodes = this.nodes.slice();
    graph.edges = this.edges.slice();
    graph.sourceMap = cloneSourceMap(this.sourceMap);
    graph.targetMap = cloneSourceMap(this.targetMap);
    graph.rootIds = this.rootIds.slice();
    graph.leafIds = this.leafIds.slice();
    return graph;
  }
}
