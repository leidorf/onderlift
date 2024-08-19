import { useState, useEffect } from "react";
import { connectToRobots } from "@/utils/ros-connection";

export default function RosConnection() {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    let isMounted = true;
    let ros;

    const handleConnection = () => {
      if (isMounted) {
        setIsConnected(true);
      }
    };

    const handleClose = () => {
      if (isMounted) {
        setIsConnected(false);
      }
    };

    async function initRos() {
      ros = await connectToRobots();
      if (ros) {
        ros.on("connection", handleConnection);
        ros.on("close", handleClose);

        if (ros.isConnected) {
          handleConnection();
        }
      }
    }

    initRos();

    return () => {
      isMounted = false;
      if (ros) {
        ros.off("connection", handleConnection);
        ros.off("close", handleClose);
      }
    };
  }, []);

  return (
    <div>
      <p>
        ROS Bağlantı Durumu:
        <span
          style={{ color: isConnected ? "green" : "#BE1522" }}
          className="fw-bolder"
        >
          {isConnected ? " Bağlandı" : " Bağlanmadı"}
        </span>
      </p>
    </div>
  );
}
