import { Node, Edge } from '../types';
const cloneGraphMap = (map: Map<string, Set<string>>) => {
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
  rankMap: Map<string, number> = new Map();
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
    graph.sourceMap = cloneGraphMap(this.sourceMap);
    graph.targetMap = cloneGraphMap(this.targetMap);
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

  // remove edge from sourceMap or targetMap or sourceMap & targetMap
  removeEdgeFromMap(nodeId: string, type: 'all' | 'target' | 'source' = 'all') {
    // remove edge from sourceMap
    if (type !== 'target') {
      const sourceSet = this.sourceMap.get(nodeId);
      if (sourceSet) {
        sourceSet.forEach((source) => {
          this.targetMap.get(source)?.delete(nodeId);
        });
        this.sourceMap.delete(nodeId);
      }
    }
    // remove edge from targetMap
    if (type !== 'source') {
      const targetSet = this.targetMap.get(nodeId);
      if (targetSet) {
        targetSet.forEach((target) => {
          this.sourceMap.get(target)?.delete(nodeId);
        });
        this.targetMap.delete(nodeId);
      }
    }
  }
}
