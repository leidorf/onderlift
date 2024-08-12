import { useEffect, useState, useRef } from "react";
import { mapTopic } from "@/lib/map";
import { addWaypoint } from "@/utils/handle-waypoint";
import { useRouter } from "next/router";

const useMapData = (robotId) => {
  const [mapData, setMapData] = useState(null);
  const canvasRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [isAddingWaypoint, setIsAddingWaypoint] = useState(false);
  const router = useRouter();

  useEffect(() => {
    mapTopic.subscribe((message) => {
      setMapData(message);
    });

    return () => {
      mapTopic.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (mapData && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      const { width, height, resolution } = mapData.info;
      const data = mapData.data;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const index = y * width + x;
          const value = data[index];

          let color;
          if (value === -1) {
            color = "#808080"; // Unknown
          } else if (value === 0) {
            color = "#FFFFFF"; // Free
          } else {
            color = "#000000"; // Occupied
          }

          ctx.fillStyle = color;
          ctx.fillRect(x, y, 1, 1);
        }
      }
    }
  }, [mapData]);

  const handleMouseMove = (event) => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * canvas.width;
      const y = ((event.clientY - rect.top) / rect.height) * canvas.height;
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      const rosX = (x - centerX) / 20 - 0.4;
      const rosY = (centerY - y) / 20 + 0.4;

      setMousePosition({ x: rosX, y: rosY });
    }
  };

  const handleImageClick = async () => {
    if (isAddingWaypoint) {
      const { x, y } = mousePosition;
      await addWaypoint(robotId, (Number(x)), (Number(y)), 0);
      setIsAddingWaypoint(!isAddingWaypoint);
      router.replace(router.asPath);
    }
  };

  const handleImageLoad = () => {
    if (canvasRef.current) {
      setImageSize({
        width: canvasRef.current.offsetWidth,
        height: canvasRef.current.offsetHeight,
      });
    }
  };

  return {
    mapData,
    canvasRef,
    handleMouseMove,
    handleImageClick,
    handleImageLoad,
    isAddingWaypoint,
    setIsAddingWaypoint,
    mousePosition,
    imageSize,
    setImageSize,
  };
};

export default useMapData;
