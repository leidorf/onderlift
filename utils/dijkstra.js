import { addNeighbors } from "./add-neighbors";
import { calculateDistance } from "./calculate-distance";

export function dijkstra(nodes, robot, targetNodeId) {
  addNeighbors(nodes);

  const distances = {};
  const previousNodes = {};
  const unvisitedNodes = new Set();

  let robotStartNode = null;
  let minRobotDistance = Infinity;

  nodes.forEach((node) => {
    const distanceToRobot = calculateDistance(robot, node);
    if (distanceToRobot < minRobotDistance) {
      minRobotDistance = distanceToRobot;
      robotStartNode = node.waypoint_id;
    }
    distances[node.waypoint_id] = Infinity;
    previousNodes[node.waypoint_id] = null;
    unvisitedNodes.add(node.waypoint_id);
  });

  distances[robotStartNode] = 0;

  while (unvisitedNodes.size > 0) {
    let currentNode = null;
    let minDistance = Infinity;

    unvisitedNodes.forEach((nodeId) => {
      if (distances[nodeId] < minDistance) {
        minDistance = distances[nodeId];
        currentNode = nodeId;
      }
    });

    if (currentNode === null) {
      break;
    }

    unvisitedNodes.delete(currentNode);

    const currentNodeData = nodes.find((node) => node.waypoint_id === currentNode);
    if (currentNodeData && currentNodeData.neighbors) {
      currentNodeData.neighbors.forEach((neighbor) => {
        const neighborNode = nodes.find((node) => node.waypoint_id === neighbor.id);

        if (neighborNode) {
          const distanceToNeighbor = neighbor.distance;

          if (distances[currentNode] + distanceToNeighbor < distances[neighbor.id]) {
            distances[neighbor.id] = distances[currentNode] + distanceToNeighbor;
            previousNodes[neighbor.id] = currentNode;
          }
        }
      });
    }
  }

  const path = [];
  let currentNode = targetNodeId;

  while (currentNode !== null) {
    path.unshift(currentNode);
    currentNode = previousNodes[currentNode];
  }

  return path.length >= 1 ? path : null;
}
