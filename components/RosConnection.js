import { useState, useEffect } from "react";
import ROSLIB from "roslib"; // Ensure ROSLIB is imported

export default function RosConnection({ ipAddress }) {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    let ros;

    const handleConnection = () => {
      if (isMounted) {
        setIsConnected(true);
        setError(null); // Clear any previous errors
      }
    };

    const handleClose = () => {
      if (isMounted) {
        setIsConnected(false);
      }
    };

    const handleError = (err) => {
      if (isMounted) {
        setIsConnected(false);
      }
    };

    // Initialize ROS connection
    ros = new ROSLIB.Ros({
      url: `ws://${ipAddress}:9090`,
    });

    ros.on("connection", handleConnection);
    ros.on("close", handleClose);
    ros.on("error", handleError);

    // Check if already connected
    if (ros.isConnected) {
      handleConnection();
    }

    return () => {
      isMounted = false;
      if (ros) {
        ros.off("connection", handleConnection);
        ros.off("close", handleClose);
        ros.off("error", handleError);
      }
    };
  }, [ipAddress]);

  return (
    <div>
      <p>
        Bağlantı Durumu:{" "}
        <span
          style={{ color: isConnected ? "green" : "#BE1522" }}
          className="fw-bolder"
        >
          {isConnected ? "Bağlandı" : error ? error : "Bağlanmadı"}
        </span>
      </p>
    </div>
  );
}
