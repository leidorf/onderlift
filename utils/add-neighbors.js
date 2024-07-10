// add-neighbors.js
export function addNeighbors(nodes, thresholdDistance) {
    nodes.forEach(node => {
      node.neighbors = [];
      nodes.forEach(otherNode => {
        if (node.node_id !== otherNode.node_id) {
          const distance = calculateDistance(node, otherNode);
          if (distance <= thresholdDistance) {
            node.neighbors.push(otherNode.node_id);
          }
        }
      });
    });
    console.log("Nodes after adding neighbors:", nodes); // Komşuların eklenip eklenmediğini kontrol etmek için ekledik.
  }
  
  function calculateDistance(node1, node2) {
    const dx = parseFloat(node2.x_position) - parseFloat(node1.x_position);
    const dy = parseFloat(node2.y_position) - parseFloat(node1.y_position);
    return Math.sqrt(dx * dx + dy * dy);
  }
  