import { useState, useEffect } from "react";
import ROSLIB from "roslib";
import ros from "./ros";

const odomListener = () => {
  const [odomData, setOdomData] = useState({
    position: { x: 0, y: 0, z: 0 },
    orientation: { yaw: 0, roll: 0, pitch: 0 },
  });

  useEffect(() => {
    const odomListener = new ROSLIB.Topic({
      ros: ros,
      name: "/odom",
      messageType: "nav_msgs/Odometry",
    });

    odomListener.subscribe((message) => {
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
    });

    return () => {
      odomListener.unsubscribe();
      ros.close();
    };
  }, []);

  return odomData;
};

export default odomListener;