import { useEffect, useState, useRef } from "react";
import { mapTopic } from "@/lib/map";
import { addPath } from "@/utils/handle-path";
import { useRouter } from "next/router";

const useMapData = (robotId) => {
  const [mapData, setMapData] = useState(null);
  const canvasRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [isAddingNode, setIsAddingNode] = useState(false);
  const router = useRouter();

  useEffect(() => {
    mapTopic.subscribe((message) => {
      console.log("Received map data:", message);
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

      // Clear the canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw the grid
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const index = y * width + x;
          const value = data[index];

          // Determine the color based on the value
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
      setMousePosition({ x: x - centerX, y: y - centerY });
    }
  };
  
  const handleImageClick = async () => {
    if (isAddingNode) {
      const { x, y } = mousePosition;
      await addPath(robotId, Number(x), Number(y), 0);
      setIsAddingNode(!isAddingNode);
      router.reload();
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
    isAddingNode,
    setIsAddingNode,
    mousePosition,
    imageSize,
    setImageSize, // Ensure setImageSize is returned
  };
};

export default useMapData;
