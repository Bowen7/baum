import { Node, Edge } from '../types';

const getId = (nodeOrId: Node | string) =>
  typeof nodeOrId === 'string' ? nodeOrId : nodeOrId.id;
export class Graph {
  nodeSet: Set<Node> = new Set();
  edgeSet: Set<Edge> = new Set();
  sourceMap: Map<string, Map<string, Edge>> = new Map();
  targetMap: Map<string, Map<string, Edge>> = new Map();
  rankMap: Map<string, number> = new Map();
  constructor(nodes: Node[], edges: Edge[]) {
    nodes.forEach((node) => this.addNode(node));
    edges.forEach((edge) => this.addEdge(edge));
  }

  addNode(node: Node) {
    this.nodeSet.add(node);
  }

  addEdge(edge: Edge) {
    this.edgeSet.add(edge);
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
    this.nodeSet.forEach((node) => graph.addNode(node));
    this.edgeSet.forEach((edge) => graph.addEdge(edge));
    return graph;
  }

  get roots() {
    const roots: Node[] = [];
    this.nodeSet.forEach(
      (node) => !this.sourceMap.has(node.id) && roots.push(node)
    );
    return roots;
  }

  get leaves() {
    const leaves: Node[] = [];
    this.nodeSet.forEach(
      (node) => !this.targetMap.has(node.id) && leaves.push(node)
    );
    return leaves;
  }

  removeEdge(edge: Edge) {
    const { source, target } = edge;
    this.edgeSet.delete(edge);
    this.sourceMap.get(target)?.delete(source);
    this.targetMap.get(source)?.delete(target);
  }

  edges(nodeOrId: Node | string) {
    return [...this.sourceEdges(nodeOrId), ...this.targetEdges(nodeOrId)];
  }

  removeEdges(edges: Edge[]) {
    edges.forEach((edge) => this.removeEdge(edge));
  }

  sourceEdges(nodeOrId: Node | string) {
    const sources = this.sourceMap.get(getId(nodeOrId));
    return [...sources!.values()];
  }

  targetEdges(nodeOrId: Node | string) {
    const targets = this.targetMap.get(getId(nodeOrId));
    return [...targets!.values()];
  }

  sourceIds(nodeOrId: Node | string) {
    return [...(this.sourceMap.get(getId(nodeOrId)) ?? []).keys()];
  }

  targetIds(nodeOrId: Node | string) {
    return [...(this.targetMap.get(getId(nodeOrId)) ?? []).keys()];
  }
}
