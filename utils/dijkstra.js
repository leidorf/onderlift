import { findClosestNode } from "./closest-node";

export function dijkstra(nodes, robotXPos, robotYPos, targetNodeId) {
  const closestNodeId = findClosestNode(nodes, robotXPos, robotYPos);

  const distances = {};
  const previousNodes = {};
  const unvisitedNodes = new Set();

  // Initialize distances and previousNodes
  nodes.forEach(node => {
    distances[node.node_id] = node.id === closestNodeId ? 0 : Infinity;
    previousNodes[node.node_id] = null;
    unvisitedNodes.add(node.node_id);
  });

  while (unvisitedNodes.size > 0) {
    let currentNode = null;
    let minDistance = Infinity;

    // Find node with minimum distance
    unvisitedNodes.forEach(nodeId => {
      if (distances[nodeId] < minDistance) {
        minDistance = distances[nodeId];
        currentNode = nodeId;
      }
    });

    if (currentNode === null) {
      break; // No reachable nodes left
    }

    unvisitedNodes.delete(currentNode);

    // Explore neighbors of currentNode
    nodes.forEach(node => {
      if (node.node_id === currentNode) {
        node.neighbors.forEach(neighbor => {
          const distanceToNeighbor = calculateDistance(node, nodes.find(n => n.node_id === neighbor));

          if (distances[currentNode] + distanceToNeighbor < distances[neighbor]) {
            distances[neighbor] = distances[currentNode] + distanceToNeighbor;
            previousNodes[neighbor] = currentNode;
          }
        });
      }
    });
  }

  // Build path from closestNode to targetNode
  const path = [];
  let currentNode = targetNodeId;

  while (currentNode !== null) {
    path.unshift(currentNode);
    currentNode = previousNodes[currentNode];
  }

  return path.length > 1 ? path : null; // Return path or null if no path found
}

// Helper function to calculate distance between two nodes
function calculateDistance(node1, node2) {
  const dx = node2.x_position - node1.x_position;
  const dy = node2.y_position - node1.y_position;
  return Math.sqrt(dx * dx + dy * dy);
}