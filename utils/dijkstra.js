// dijkstra.js
import { findClosestNode } from "./closest-node";
import { addNeighbors } from "./add-neighbors";

export function dijkstra(nodes, robotXPos, robotYPos, targetNodeId) {
  // Add neighbors to nodes
  addNeighbors(nodes, 1.0); // 1.0 is an example threshold distance

  console.log("Nodes with neighbors:", nodes); // Düğümleri ve komşularını kontrol etmek için ekledik.

  const closestNodeId = findClosestNode(nodes, robotXPos, robotYPos);
  console.log("Closest Node ID:", closestNodeId);
  console.log("Target Node ID:", targetNodeId);

  const distances = {};
  const previousNodes = {};
  const unvisitedNodes = new Set();

  // Initialize distances and previousNodes
  nodes.forEach((node) => {
    distances[node.node_id] = node.node_id === closestNodeId ? 0 : Infinity;
    previousNodes[node.node_id] = null;
    unvisitedNodes.add(node.node_id);
  });

  console.log("Initial distances:", distances);
  console.log("Initial previous nodes:", previousNodes);
  console.log("Initial unvisited nodes:", unvisitedNodes);

  while (unvisitedNodes.size > 0) {
    let currentNode = null;
    let minDistance = Infinity;

    // Find node with minimum distance
    unvisitedNodes.forEach((nodeId) => {
      if (distances[nodeId] < minDistance) {
        minDistance = distances[nodeId];
        currentNode = nodeId;
      }
    });

    console.log("Current node:", currentNode);

    if (currentNode === null) {
      break; // No reachable nodes left
    }

    unvisitedNodes.delete(currentNode);

    // Explore neighbors of currentNode
    const currentNodeData = nodes.find((node) => node.node_id === currentNode);
    if (currentNodeData && currentNodeData.neighbors) {
      currentNodeData.neighbors.forEach((neighborId) => {
        const neighborNode = nodes.find((node) => node.node_id === neighborId);
        const distanceToNeighbor = calculateDistance(currentNodeData, neighborNode);
        console.log("Exploring neighbor:", neighborNode, "with ID:", neighborId);

        if (distances[currentNode] + distanceToNeighbor < distances[neighborId]) {
          distances[neighborId] = distances[currentNode] + distanceToNeighbor;
          previousNodes[neighborId] = currentNode;
        }
      });
    }
  }

  // Build path from closestNode to targetNode
  const path = [];
  let currentNode = targetNodeId;

  while (currentNode !== null) {
    path.unshift(currentNode);
    currentNode = previousNodes[currentNode];
  }

  console.log("Path found:", path);

  return path.length > 1 ? path : null; // Return path or null if no path found
}

// Helper function to calculate distance between two nodes
function calculateDistance(node1, node2) {
  const dx = parseFloat(node2.x_position) - parseFloat(node1.x_position);
  const dy = parseFloat(node2.y_position) - parseFloat(node1.y_position);
  return Math.sqrt(dx * dx + dy * dy);
}
