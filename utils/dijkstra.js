import { findEdgeNodes } from "./edge-nodes";

export function dijkstra(nodes, edges, startNodeId) {
    const distances = {};
    const visited = new Set();
    const queue = new PriorityQueue();
  
    nodes.forEach(node => {
      distances[node.id] = node.id === startNodeId ? 0 : Infinity;
      queue.enqueue(node.id, distances[node.id]);
    });
  
    while (!queue.isEmpty()) {
      const currentNodeId = queue.dequeue();
  
      if (visited.has(currentNodeId)) continue;
      visited.add(currentNodeId);
  
      edges.filter(edge => edge.source === currentNodeId).forEach(edge => {
        const distanceToNeighbor = distances[currentNodeId] + edge.weight;
        if (distanceToNeighbor < distances[edge.target]) {
          distances[edge.target] = distanceToNeighbor;
          queue.enqueue(edge.target, distanceToNeighbor);
        }
      });
    }
  
    return distances;
  }