export function calculateDistance(node1, node2) {
    const dx = parseFloat(node2.x_position) - parseFloat(node1.x_position);
    const dy = parseFloat(node2.y_position) - parseFloat(node1.y_position);
    return Math.sqrt(dx * dx + dy * dy);
  }
  