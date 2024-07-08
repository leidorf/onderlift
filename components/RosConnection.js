import { useState, useEffect } from "react";
import ros from "@/lib/ros"; // Adjust the path as necessary

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

    const connectRos = async () => {
      try {
        await ros.customConnect(); // Assuming customConnect() is a function in ros.js
      } catch (error) {
        if (isMounted) {
          setIsConnected(false);
        }
        console.error(error);
      }
    };

    connectRos();

    return () => {
      isMounted = false;
      ros.off("connection", handleConnection);
      ros.off("close", handleClose);
      // Note: Do not call ros.close() here to avoid closing the connection on unmount
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
