import useMapData from "@/utils/use-map-data";
import { waypointColors } from "@/utils/waypoint-colors";
import React, { useEffect, useState } from "react";

const MapDisplay = ({ waypoints, robot }) => {
  const { mapData, canvasRef, handleMouseMove, handleImageClick, handleImageLoad, isAddingWaypoint, setIsAddingWaypoint, mousePosition, imageSize, setImageSize } = useMapData(robot.id);

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
      <p className="fw-bolder">Harita: {isAddingWaypoint && <span className="text-danger"> Nokta Ekleme Modu Aktif</span>}</p>
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
                  Fare Konumu: X: {mousePosition.x.toFixed(5)}, Y: {mousePosition.y.toFixed(5)}
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
                onClick={() => setIsAddingWaypoint(!isAddingWaypoint)}
                className={`point-icon btn hover-up ${isAddingWaypoint ? "active-mode" : ""}`}
              >
                <img
                  src="/assets/imgs/point-icon.png"
                  alt="Point Icon"
                />
              </button>
              <button
                className="btn zoom-btn zoom-in fw-bold hover-up"
                onClick={handleZoomIn}
              >
                +
              </button>
              <button
                className="btn zoom-btn zoom-out fw-bold hover-up"
                onClick={handleZoomOut}
              >
                -
              </button>
            </div>
            <div>
              <img
                className="robot-marker"
                style={{
                  left: `${parseFloat(imageSize.width / 2 + 8 + robot.x_coordinate * 20 * zoomFactor)}px`,
                  top: `${parseFloat(imageSize.height / 2 + 24 - robot.y_coordinate * 20 * zoomFactor)}px`,
                  transform: `rotate(${robot.yaw * (180 / Math.PI)}deg) scale(${zoomFactor})`,
                }}
                src="/assets/imgs/robot-ico.png"
              ></img>
            </div>
            {waypoints.map((waypoint, index) => {
              const color = waypointColors[index % waypointColors.length];
              const xPos = parseFloat(imageSize.width / 2 + 8 + Number(waypoint.x_coordinate) * 20 * zoomFactor);
              const yPos = parseFloat(imageSize.height / 2 + 24 - Number(waypoint.y_coordinate) * 20 * zoomFactor);
              return (
                <div
                  key={waypoint.waypoint_id}
                  className="waypoint"
                  style={{
                    top: `${yPos}px`,
                    left: `${xPos}px`,
                    backgroundColor: color,
                  }}
                  title={`Nokta ${waypoint.waypoint_id}: X: ${parseFloat(waypoint.x_coordinate).toFixed(5)} - Y: ${parseFloat(waypoint.y_coordinate).toFixed(5)}`}
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
