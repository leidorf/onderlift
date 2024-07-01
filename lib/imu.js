import { useState, useEffect } from "react";
import ROSLIB from "roslib";
import ros from "./ros";

const imuListener = () => {
  const [imuData, setImuData] = useState({ roll: 0, pitch: 0, yaw: 0 });

  useEffect(() => {
    const imuListener = new ROSLIB.Topic({
      ros: ros,
      name: "/imu/data",
      messageType: "sensor_msgs/Imu"
    });

    imuListener.subscribe((message) => {
      const { orientation } = message;
      const { x, y, z, w } = orientation;

      // Quaternion to Euler conversion
      const ysqr = y * y;

      // roll (x-axis rotation)
      const t0 = +2.0 * (w * x + y * z);
      const t1 = +1.0 - 2.0 * (x * x + ysqr);
      const roll = Math.atan2(t0, t1);

      // pitch (y-axis rotation)
      let t2 = +2.0 * (w * y - z * x);
      t2 = t2 > +1.0 ? +1.0 : t2;
      t2 = t2 < -1.0 ? -1.0 : t2;
      const pitch = Math.asin(t2);

      // yaw (z-axis rotation)
      const t3 = +2.0 * (w * z + x * y);
      const t4 = +1.0 - 2.0 * (ysqr + z * z);
      const yaw = Math.atan2(t3, t4);

      setImuData({ roll, pitch, yaw });
    });

    return () => imuListener.unsubscribe();
  }, []);

  return imuData;
};

export default imuListener;
