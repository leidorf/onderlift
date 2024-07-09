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

  const applyZoom = (newZoomFactor) => {
    setZoomFactor(newZoomFactor);
    const mapImage = document.querySelector(".map-image");
    const currentWidth = mapImage.offsetWidth;
    const currentHeight = mapImage.offsetHeight;
    const newWidth = currentWidth * newZoomFactor;
    const newHeight = currentHeight * newZoomFactor;
    setImageSize({ width: newWidth, height: newHeight });
    mapImage.style.transformOrigin = "0 0";
    mapImage.style.transform = `scale(${newZoomFactor})`;
  };

  const handleZoomIn = () => {
    applyZoom(Math.min(zoomFactor + 0.25, 2.5));
  };

  const handleZoomOut = () => {
    applyZoom(Math.max(zoomFactor - 0.25, 1));
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
                  Fare Konumu: X: {((mousePosition.x - 10) / 20).toFixed(5)}, Y: {((mousePosition.y + 10) / -20).toFixed(5)}
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
              <button
                className="btn zoom-btn fw-bold hover-up"
                style={{ top: "52px" }}
                onClick={handleZoomIn}
              >
                +
              </button>
              <button
                className="btn zoom-btn fw-bold hover-up"
                style={{ top: "80px" }}
                onClick={handleZoomOut}
              >
                -
              </button>
            </div>
            <div>
              <img
                className="robot-marker"
                style={{
                  left: `${imageSize.width / 2 + parseFloat(robotXPos * 20 * zoomFactor + 5 * zoomFactor)}px`,
                  top: `${imageSize.height / 2 - parseFloat(robotYPos * 20 * zoomFactor - (zoomFactor * 20) / zoomFactor)}px`,
                  transform: `rotate(${robotYaw * (180 / Math.PI)}deg) scale(${zoomFactor})`,
                }}
                src="/assets/imgs/onder.png"
              ></img>
            </div>
            {paths.map((path, index) => {
              const color = nodeColors[index % nodeColors.length];
              const xPos = imageSize.width / 2 + parseFloat(path.x_position * 20 * zoomFactor + 10 * zoomFactor);
              const yPos = imageSize.height / 2 - parseFloat(path.y_position * 20 * zoomFactor - 10 / zoomFactor);
              return (
                <div
                  key={path.node_id}
                  className="node"
                  style={{
                    top: `${yPos}px`,
                    left: `${xPos}px`,
                    backgroundColor: color,
                  }}
                  title={`Nokta ${index + 1}: X: ${parseFloat(path.x_position).toFixed(5)} - Y: ${parseFloat(path.y_position).toFixed(5)}`}
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
