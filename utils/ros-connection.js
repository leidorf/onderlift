import ROSLIB from 'roslib';  // Ensure this line is present at the top

let rosInstance;

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
  console.log(robots);

  // Assuming you want to use the first robot's connection details
  if (robots.length > 0) {
    const robot = robots[0];
    rosInstance = new ROSLIB.Ros({
      url: `ws://${robot.ip_address}:9090`,
    });

    rosInstance.on('connection', () => {
      console.log(`Connected to ROS server at ${robot.ip_address}`);
    });

    rosInstance.on('error', (error) => {
      console.error(`Error connecting to ROS server at ${robot.ip_address}:`, error);
    });

    rosInstance.on('close', () => {
      console.log(`Connection to ROS server at ${robot.ip_address} closed`);
    });
  }

  return rosInstance;
}

export default rosInstance;
