import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MapDisplay = ({
  isAddingNode,
  setIsAddingNode,
  canvasRef,
  handleImageClick,
  handleMouseMove,
  handleImageLoad,
  mousePosition,
  imageSize,
  robotYPos,
  robotXPos,
  robotRotation,
  paths,
  nodeColors,
  robots
}) => {
  const [mapData, setMapData] = useState(null);

  useEffect(() => {
    const fetchMapData = async () => {
      try {
        const response = await axios.get(`/api/robots/${robots.id}`); // API endpoint'inizin yolunu doğru şekilde ayarlayın
        setMapData(response.data); // API'den gelen harita verisini state'e kaydediyoruz
      } catch (error) {
        console.error('Harita verisini alma hatası:', error);
      }
    };

    fetchMapData(); // useEffect ile bileşen yüklendiğinde harita verisini almak için çağırıyoruz
  }, []);

  return (
    <div>
      <p>Harita: {isAddingNode && <span> Nokta Ekleme Modu Aktif</span>}</p>
      <div style={{ position: "relative" }}>
        {mapData ? (
          <canvas
            ref={canvasRef}
            width={mapData.width} // Örneğin, API'den gelen veriye göre genişlik ve yüksekliği ayarlayın
            height={mapData.height}
            onClick={handleImageClick}
            onMouseMove={handleMouseMove}
            onLoad={handleImageLoad}
          />
        ) : (
          <div className="spinner-border spinner-border-sm" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        )}
        {!mapData ? null : (
          <>
            <div className="mouse-info">
              <p>
                Fare Konumu: X: {mousePosition.x.toFixed(2)}, Y: {mousePosition.y.toFixed(2)}
              </p>
            </div>
            <button
              onClick={() => setIsAddingNode(!isAddingNode)}
              className={`point-icon btn ${isAddingNode ? "active-mode" : ""}`}
            >
              <img src="/assets/imgs/point-icon.png" alt="Point Icon" />
            </button>
            <div
              className="robot-marker"
              style={{
                top: `${robotYPos}px`,
                left: `${robotXPos}px`,
                transform: robotRotation,
              }}
            ></div>
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
                  title={`Nokta ${index + 1}: X: ${path.x_position} - Y: ${path.y_position}`}
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
