import { Node, Edge } from '../types';

export class Graph {
  nodes: Set<Node> = new Set();
  edges: Set<Edge> = new Set();
  sourceMap: Map<string, Map<string, Edge>> = new Map();
  targetMap: Map<string, Map<string, Edge>> = new Map();
  rankMap: Map<string, number> = new Map();
  constructor(nodes: Node[], edges: Edge[]) {
    nodes.forEach((node) => this.addNode(node));
    edges.forEach((edge) => this.addEdge(edge));
  }

  addNode(node: Node) {
    this.nodes.add(node);
  }

  addEdge(edge: Edge) {
    this.edges.add(edge);
    const { source, target } = edge;
    if (!this.sourceMap.has(target)) {
      this.sourceMap.set(target, new Map());
    }
    if (!this.targetMap.has(source)) {
      this.targetMap.set(source, new Map());
    }
    this.sourceMap.get(target)!.set(source, edge);
    this.targetMap.get(source)!.set(target, edge);
  }

  clone() {
    const graph = new Graph([], []);
    this.nodes.forEach((node) => graph.addNode(node));
    this.edges.forEach((edge) => graph.addEdge(edge));
    return graph;
  }

  get roots() {
    const roots: Node[] = [];
    this.nodes.forEach(
      (node) => !this.sourceMap.has(node.id) && roots.push(node)
    );
    return roots;
  }

  get leaves() {
    const leaves: Node[] = [];
    this.nodes.forEach(
      (node) => !this.targetMap.has(node.id) && leaves.push(node)
    );
    return leaves;
  }

  removeEdge(edge: Edge) {
    const { source, target } = edge;
    this.edges.delete(edge);
    this.sourceMap.get(target)?.delete(source);
    this.targetMap.get(source)?.delete(target);
  }

  removeEdges(edges: Edge[]) {
    edges.forEach((edge) => this.removeEdge(edge));
  }

  sourceEdges(node: Node) {
    const sources = this.sourceMap.get(node.id);
    return [...sources!.values()];
  }

  targetEdges(node: Node) {
    const targets = this.targetMap.get(node.id);
    return [...targets!.values()];
  }
}
