export function calculateDistance(waypoint1, waypoint2) {
    const dx = parseFloat(waypoint2.x_coordinate) - parseFloat(waypoint1.x_coordinate);
    const dy = parseFloat(waypoint2.y_coordinate) - parseFloat(waypoint1.y_coordinate);
    return Math.sqrt(dx * dx + dy * dy);
  }
  