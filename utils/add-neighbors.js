import { calculateDistance } from "./calculate-distance";

const MAX_DISTANCE = 1.25;

export function addNeighbors(nodes) {
  nodes.forEach((node) => {
    node.neighbors = [];
    nodes.forEach((otherNode) => {
      if (node.waypoint_id !== otherNode.waypoint_id) {
        const distance = calculateDistance(node, otherNode);
        if (distance <= MAX_DISTANCE) {
          node.neighbors.push({ id: otherNode.waypoint_id, distance: distance });
        }
      }
    });
  });
}
