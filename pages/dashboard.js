import { useEffect, useState } from "react";
import { connectToRobots } from "../utils/ros-connection"; // Adjust the path as necessary
import useOdomListener from "../lib/odom"; // Adjust the path as necessary
import Layout from "@/components/layout/Layout";

const RobotsDashboard = () => {
  const [robots, setRobots] = useState([]);

  useEffect(() => {
    const initializeConnections = async () => {
      try {
        const connections = await connectToRobots();
        setRobots(connections);
      } catch (error) {
        console.error('Failed to initialize connections:', error);
      }
    };

    initializeConnections();
  }, []);

  return (
    <Layout>
      <div>
        <h1>Robots Dashboard</h1>
        {robots.length > 0 ? (
          robots.map(({ ros, robot }, index) => {
            // Each robot should use its own instance of the hook
            const odomData = useOdomListener(ros);

            return (
              <div key={index}>
                <h2>Robot {index + 1}</h2>
                <p>IP: {robot.ip_address}</p>
                <p>Position - X: {odomData.position.x}, Y: {odomData.position.y}, Z: {odomData.position.z}</p>
                <p>Orientation - Yaw: {odomData.orientation.yaw}, Roll: {odomData.orientation.roll}, Pitch: {odomData.orientation.pitch}</p>
                {/* Render additional details and controls for each robot here */}
              </div>
            );
          })
        ) : (
          <p>No robots connected or invalid IP addresses</p>
        )}
      </div>
    </Layout>
  );
};

export default RobotsDashboard;
