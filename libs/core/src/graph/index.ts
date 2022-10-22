import { Node, Edge } from '../types';

const getId = (node: Node | string) =>
  typeof node === 'string' ? node : node.id;
export class Graph {
  nodeMap: Map<string, Node> = new Map();
  edgeSet: Set<Edge> = new Set();
  sourceMap: Map<string, Map<string, Edge>> = new Map();
  targetMap: Map<string, Map<string, Edge>> = new Map();
  rankMap: Map<string, number> = new Map();
  reversedEdgeSet: Set<Edge> = new Set();
  constructor(nodes: Node[] = [], edges: Edge[] = []) {
    nodes.forEach((node) => this.addNode(node));
    edges.forEach((edge) => this.addEdge(edge));
  }

  addNode(node: Node) {
    this.nodeMap.set(node.id, node);
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

  get nodes() {
    return [...this.nodeMap.values()];
  }

  node(id: string) {
    return this.nodeMap.get(id);
  }

  clone() {
    const graph = new Graph([], []);
    this.nodes.forEach((node) => graph.addNode(node));
    this.edgeSet.forEach((edge) => graph.addEdge(edge));
    return graph;
  }

  hasNode(node: string | Node) {
    return this.nodeMap.has(getId(node));
  }

  hasEdge(source: string, target: string) {
    return this.sourceMap.get(target)?.has(source) ?? false;
  }

  get roots() {
    const roots: string[] = [];
    this.nodes.forEach(
      (node) => !this.sourceMap.has(node.id) && roots.push(node.id)
    );
    return roots;
  }

  get leaves() {
    const leaves: string[] = [];
    this.nodes.forEach(
      (node) => !this.targetMap.has(node.id) && leaves.push(node.id)
    );
    return leaves;
  }

  removeEdge(edge: Edge) {
    const { source, target } = edge;
    this.edgeSet.delete(edge);
    this.sourceMap.get(target)?.delete(source);
    this.targetMap.get(source)?.delete(target);
  }

  edges(id?: string) {
    if (id === undefined) {
      return [...this.edgeSet];
    }
    return [...this.sourceEdges(id), ...this.targetEdges(id)];
  }

  removeEdges(edges: Edge[]) {
    edges.forEach((edge) => this.removeEdge(edge));
  }

  sourceEdges(id: string) {
    const sources = this.sourceMap.get(id);
    return [...(sources ?? []).values()];
  }

  targetEdges(id: string) {
    const targets = this.targetMap.get(id);
    return [...(targets ?? []).values()];
  }

  sources(id: string) {
    return [...(this.sourceMap.get(id)?.keys() ?? [])];
  }

  targets(id: string) {
    return [...(this.targetMap.get(id)?.keys() ?? [])];
  }

  sourceSize(id: string) {
    return this.sourceMap.get(id)?.size ?? 0;
  }

  targetSize(id: string) {
    return this.targetMap.get(id)?.size ?? 0;
  }

  get nodeSize() {
    return this.nodeMap.size;
  }

  reverseEdge(edge: Edge) {
    this.removeEdge(edge);
    const { source, target } = edge;
    edge.source = target;
    edge.target = source;
    this.addEdge(edge);
    if (this.reversedEdgeSet.has(edge)) {
      this.reversedEdgeSet.delete(edge);
    } else {
      this.reversedEdgeSet.add(edge);
    }
  }

  getRank(node: string | Node) {
    return this.rankMap.get(getId(node));
  }

  setRank(node: string | Node, rank: number) {
    return this.rankMap.set(getId(node), rank);
  }
}
