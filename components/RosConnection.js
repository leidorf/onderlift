import { useState, useEffect } from "react";
import ros from "@/lib/ros"; // Adjust the path as necessary

export default function RosConnection() {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const connectRos = async () => {
      try {
        await ros.connect(); // Assuming connect() is a function in ros.js
        setIsConnected(true);
        console.log("ROS bağlandı!");
      } catch (error) {
        setIsConnected(false);
        console.error("ROS bağlantı hatası:", error);
      }
    };

    connectRos();

    return () => {
      ros.close(); // Adjust as per your ros.js implementation
    };
  }, []);

  return (
    <div>
      <p>ROS Bağlantısı Durumu: {isConnected ? "Bağlandı" : "Bağlanmadı"}</p>
    </div>
  );
}
