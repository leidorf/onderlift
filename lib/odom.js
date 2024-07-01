import { useState, useEffect } from "react";
import ROSLIB from "roslib";
import ros from "./ros";

const odomListener = () => {
  const [odomData, setOdomData] = useState({
    position: { x: 0, y: 0, z: 0 },
  });

  useEffect(() => {
    const odomListener = new ROSLIB.Topic({
      ros: ros,
      name: "/odom",
      messageType: "nav_msgs/Odometry",
    });

    odomListener.subscribe((message) => {
      const position = message.pose.pose.position;

      // Check if orientation is defined before accessing its properties
      setOdomData({
        position: {
          x: position.x,
          y: position.y,
          z: position.z,
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
