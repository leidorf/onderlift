import { useState, useEffect } from "react";
import ROSLIB from "roslib";

export default function useOdomListener(ip_address) {
  const [odomData, setOdomData] = useState({
    position: { x: 0, y: 0, z: 0 },
    orientation: { yaw: 0, roll: 0, pitch: 0 },
  });

  useEffect(() => {
    // Establish ROS connection
    const ros = new ROSLIB.Ros({
      url: `ws://${ip_address}:9090`, // WebSocket connection to ROS
    });

    ros.on("connection", () => {
      console.log("Connected to ROS websocket server.");
    });

    ros.on("error", (error) => {
      console.error("Error connecting to ROS websocket server:", error);
    });

    ros.on("close", () => {
      console.log("Connection to ROS websocket server closed.");
    });

    const odomTopic = new ROSLIB.Topic({
      ros: ros,
      name: "/odom",
      messageType: "nav_msgs/Odometry",
    });

    const handleOdomMessage = (message) => {
      const position = message.pose.pose.position;
      const orientation = message.pose.pose.orientation;

      const qx = orientation.x;
      const qy = orientation.y;
      const qz = orientation.z;
      const qw = orientation.w;

      const yaw = Math.atan2(2 * (qw * qz + qx * qy), 1 - 2 * (qx * qx + qz * qz));
      const roll = Math.asin(2 * (qw * qy - qx * qz));
      const pitch = Math.atan2(2 * (qw * qx + qy * qz), 1 - 2 * (qx * qx + qy * qy));

      setOdomData({
        position: {
          x: position.x,
          y: position.y,
          z: position.z,
        },
        orientation: {
          yaw: yaw,
          roll: roll,
          pitch: pitch,
        },
      });
    };

    // Subscribe to odom topic
    odomTopic.subscribe(handleOdomMessage);

    // Cleanup on component unmount
    return () => {
      odomTopic.unsubscribe();
      ros.close();
    };
  }, [ip_address]);

  return odomData;
}
