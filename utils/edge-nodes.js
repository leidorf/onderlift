export function findEdgeNodes(nodes, robotXPos, robotYPos) {
  console.log("Nodes:", nodes);
  console.log("Robot Position:", { x: robotXPos, y: robotYPos });

  const robotCurrentPosition = {
    x: robotXPos,
    y: robotYPos,
  };

  let closestNodeId = null;
  let closestDistance = Infinity;

  nodes.forEach((node) => {
    const nodeX = parseFloat(node.x_position);
    const nodeY = parseFloat(node.y_position);
    const distanceToRobot = Math.sqrt(
      Math.pow(nodeX - robotCurrentPosition.x, 2) + Math.pow(nodeY - robotCurrentPosition.y, 2)
    );

    if (distanceToRobot < closestDistance) {
      closestDistance = distanceToRobot;
      closestNodeId = node.node_id;
    }


  });

  return {
    startNodeId: closestNodeId,
  };
}
