import { useState, useEffect } from "react";
import ros from "@/lib/ros"; // Adjust the path as necessary

export default function RosConnection() {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const connectRos = async () => {
      try {
        ros.on("connection", () => {
          setIsConnected(true);
        });

        ros.on("close", () => {
          setIsConnected(false);
        });

        await ros.connect(); // Assuming connect() is a function in ros.js
      } catch (error) {
        setIsConnected(false);
        console.error(error);
      }
    };

    connectRos();

    return () => {
      ros.close(); // Adjust as per your ros.js implementation
    };
  }, []);

  return (
    <div>
      <p>
        ROS Bağlantı Durumu:
        <span style={{ color: isConnected ? "green" : "red" }}>{isConnected ? " Bağlandı" : " Bağlanmadı"}</span>
      </p>
    </div>
  );
}
