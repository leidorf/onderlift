import ROSLIB from 'roslib';

async function fetchRobotData() {
  try {
    const response = await fetch('/api/robots');
    const data = await response.json();
    if (response.ok) {
      return data;
    } else {
      throw new Error(data.error);
    }
  } catch (error) {
    console.error('Error fetching robot data from API:', error);
    throw error;
  }
}

export async function connectToRobots() {
  const robots = await fetchRobotData();
  console.log(robots);  // This will log the array of robot objects

  const rosConnections = robots.map(robot => {
    const ros = new ROSLIB.Ros({
      url: `ws://${robot.ip_address}:9090`,
    });

    ros.on('connection', () => {
      console.log(`Connected to ROS server at ${robot.ip_address}`);
    });

    ros.on('error', (error) => {
      console.error(`Error connecting to ROS server at ${robot.ip_address}:`, error);
    });

    ros.on('close', () => {
      console.log(`Connection to ROS server at ${robot.ip_address} closed`);
    });

    return { ros, robot };
  });

  return rosConnections;
}
