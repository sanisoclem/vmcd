// ui graph
export interface GraphDefBase {
  nodeTypes: unknown;
  portTypes: unknown;
}

export interface Graph<GraphDef extends GraphDefBase> {
  root: GraphNode<GraphDef>;
  nodes: Array<GraphNode<GraphDef>>;
  edge: GraphEdge[];
}

export interface GraphNode<GraphDef extends GraphDefBase> {
  id: string;
  type: GraphDef['nodeTypes'];
  inputs: Record<string, GraphNodePort<GraphDef>>;
  outpus: Record<string, GraphNodePort<GraphDef>>;
}

export interface GraphNodePort<GraphDef extends GraphDefBase> {
  type: GraphDef['portTypes'];
}

export interface GraphEdge {
  node1: string;
  node2: string;
  node1Port: string;
  node2Port: string;
}
