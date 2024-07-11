import { useState, useEffect } from "react";
import ros from "@/lib/ros";

export default function RosConnection() {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    let isMounted = true;

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

    ros.on("connection", handleConnection);
    ros.on("close", handleClose);

    if (ros.isConnected) {
      handleConnection();
    }

    return () => {
      isMounted = false;
      ros.off("connection", handleConnection);
      ros.off("close", handleClose);
    };
  }, []);

  return (
    <div>
      <p>
        ROS Bağlantı Durumu:
        <span
          style={{ color: isConnected ? "green" : "red" }}
          className="fw-bolder"
        >
          {isConnected ? " Bağlandı" : " Bağlanmadı"}
        </span>
      </p>
    </div>
  );
}
