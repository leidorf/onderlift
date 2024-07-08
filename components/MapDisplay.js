import useMapData from "@/utils/use-map-data";
import { nodeColors } from "@/utils/node-colors";
import React, { useEffect, useState } from "react";

const MapDisplay = ({ robot_id, paths, robotXPos, robotYPos, robotYaw }) => {
  const {
    mapData,
    canvasRef,
    handleMouseMove,
    handleImageClick,
    handleImageLoad,
    isAddingNode,
    setIsAddingNode,
    mousePosition,
    imageSize,
    setImageSize,
  } = useMapData(robot_id);

  const [zoomFactor, setZoomFactor] = useState(1);

  const handleWheel = (event) => {
    const { deltaY } = event;
    const zoomFactor = deltaY > 1 ? 1 : 2.25;
    setZoomFactor(zoomFactor);
    const mapImage = document.querySelector(".map-image");
    const currentWidth = mapImage.offsetWidth;
    const currentHeight = mapImage.offsetHeight;
    const newWidth = currentWidth * zoomFactor;
    const newHeight = currentHeight * zoomFactor;
    setImageSize({ width: newWidth, height: newHeight });
    mapImage.style.transformOrigin = "0 0";
    mapImage.style.transform = `scale(${zoomFactor})`;
  };

  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        setImageSize({
          width: canvasRef.current.offsetWidth,
          height: canvasRef.current.offsetHeight,
        });
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [canvasRef.current]);

  return (
    <div>
      <p>Harita: {isAddingNode && <span> Nokta Ekleme Modu Aktif</span>}</p>
      <div style={{ position: "relative" }}>
        {!mapData ? (
          <div
            className="spinner-border spinner-border-sm"
            role="status"
          >
            <span className="visually-hidden">Loading...</span>
          </div>
        ) : (
          <>
            <div style={{}}>
              <div className="">
                <p>
                  Fare Konumu: X: {((mousePosition.x - 10) / 20).toFixed(5)}, Y:{" "}
                  {((mousePosition.y + 10) / -20).toFixed(5)}, {mousePosition.x}
                </p>
              </div>
              <div>
                <canvas
                  ref={canvasRef}
                  height={mapData.info.height}
                  width={mapData.info.width}
                  onClick={handleImageClick}
                  onMouseMove={handleMouseMove}
                  onLoad={handleImageLoad}
                  onWheel={handleWheel}
                  className="map-image"
                />
              </div>

              <button
                onClick={() => setIsAddingNode(!isAddingNode)}
                className={`point-icon btn hover-up ${isAddingNode ? "active-mode" : ""}`}
              >
                <img
                  src="/assets/imgs/point-icon.png"
                  alt="Point Icon"
                />
              </button>
            </div>
            <div>
              <img
                className="robot-marker"
                style={{
                  left: `${imageSize.width / 2 + (0.3 + robotXPos) * zoomFactor * 20}px`,
                  top: `${imageSize.height / 2 + (-0.3 + robotYPos) * zoomFactor * -20}px`,
                  transform: `rotate(${robotYaw * (180 / Math.PI)}deg) scale(${zoomFactor})`,
                }}
                src="/assets/imgs/onder.png"
              ></img>
            </div>
            {paths.map((path, index) => {
              const color = nodeColors[index % nodeColors.length];
              const xPos = imageSize.width / 2 + parseFloat(path.x_position) * (zoomFactor * 20) + zoomFactor * 10;
              const yPos = imageSize.height / 2 + parseFloat(path.y_position -0.3*zoomFactor) * (zoomFactor * -20);
              return (
                <div
                  key={path.node_id}
                  className="node"
                  style={{
                    top: `${yPos}px`,
                    left: `${xPos}px`,
                    backgroundColor: color,
                  }}
                  title={`Nokta ${index + 1}: X: ${parseFloat(path.x_position).toFixed(5)} - Y: ${parseFloat(
                    path.y_position
                  ).toFixed(5)}`}
                />
              );
            })}
          </>
        )}
      </div>

      {zoomFactor > 1 && (
        <div
          style={{
            width: `${mapData.info.width * (zoomFactor - 1)}px`,
            height: `${mapData.info.height * (zoomFactor - 1)}px`,
          }}
        ></div>
      )}
    </div>
  );
};

export default MapDisplay;
