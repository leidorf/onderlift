import useMapData from "@/utils/use-map-data";
import { nodeColors } from "@/utils/node-colors";
import React, { useEffect } from "react";

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

  const handleWheel = (event) => {
    const { deltaY } = event;
    const zoomFactor = deltaY > 0 ? 2 : 1;
    const mapImage = document.querySelector('.map-image');
    const currentWidth = mapImage.offsetWidth;
    const currentHeight = mapImage.offsetHeight;
    const newWidth = currentWidth * zoomFactor;
    const newHeight = currentHeight * zoomFactor;
    setImageSize({ width: newWidth, height: newHeight });
    mapImage.style.transformOrigin = '0 0'; // set transform origin to top-left corner
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
            <canvas
              ref={canvasRef}
              width={mapData.info.width} // Örneğin, API'den gelen veriye göre genişlik ve yüksekliği ayarlayın
              height={mapData.info.height}
              onClick={handleImageClick}
              onMouseMove={handleMouseMove}
              onLoad={handleImageLoad}
              onWheel={handleWheel}
              className="map-image"
            />
            <div className="mouse-info">
              <p>
                Fare Konumu: X: {((mousePosition.x - 10) / 20).toFixed(5)}, Y:{" "}
                {((mousePosition.y + 10) / -20).toFixed(5)}
              </p>
            </div>
            <button
              onClick={() => setIsAddingNode(!isAddingNode)}
              className={`point-icon btn ${isAddingNode ? "active-mode" : ""}`}
            >
              <img
                src="/assets/imgs/point-icon.png"
                alt="Point Icon"
              />
            </button>
            <div>
              <img
                className="robot-marker"
                style={{
                  left: `${imageSize.width / 2 + (0.3 + robotXPos) * 20}px`,
                  top: `${imageSize.height / 2 + (-0.3 + robotYPos) * -20}px`,
                  transform: `rotate(${robotYaw * (180 / Math.PI)}deg)`,
                }}
                src="/assets/imgs/onder.png"
              ></img>
            </div>
            {paths.map((path, index) => {
              const color = nodeColors[index % nodeColors.length];
              const xPos = imageSize.width / 2 + parseFloat(path.x_position);
              const yPos = imageSize.height / 2 + parseFloat(path.y_position);
              return (
                <div
                  key={path.node_id}
                  className="node"
                  style={{
                    top: `${yPos}px`,
                    left: `${xPos}px`,
                    backgroundColor: color,
                  }}
                  title={`Nokta ${index + 1}: X: ${((mousePosition.x - 10) / 20).toFixed(5)} - Y: ${(
                    (mousePosition.y + 10) /
                    -20
                  ).toFixed(5)}`}
                />
              );
            })}
          </>
        )}
      </div>
    </div>
  );
};

export default MapDisplay;
