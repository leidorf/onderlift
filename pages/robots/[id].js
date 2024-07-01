import { useRouter } from "next/router";
import axios from "axios";
import Layout from "@/components/layout/Layout";
import PageHead from "@/components/layout/PageHead";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";

import { getMapData, unsubscribeMap } from "@/lib/map";
import odomListener from "@/lib/odom";
import imuListener from "@/lib/imu";

import { deletePath } from "@/utils/delete-path";
import { handleAddPath } from "@/utils/add-path";
import { nodeColors } from "@/utils/node-colors";
import { deleteRobot } from "@/utils/delete-robot";
import RosConnection from "@/components/RosConnection";

export default function Robot({ robot, paths }) {
  const router = useRouter();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const imageRef = useRef(null);
  const odomData = odomListener();
  const imuData = imuListener();
  const [mapData, setMapData] = useState(null);

  //Robot silme fonskiyonu
  const onDeleteRobot = async () => {
    await deleteRobot(robot.id, router);
  };

  //Nokta silme fonksiyonu
  const onDeletePath = async (node_id) => {
    await deletePath(node_id, router);
  };

  //Tüm noktalari silme fonksiyonu
  const deleteAllPaths = async () => {
    const deletePromises = paths.map((path) => onDeletePath(path.node_id));
    await Promise.all(deletePromises);
  };

  //Harita görseli üzerindeki fare konumunun tespit eden fonksiyon
  const handleMouseMove = (event) => {
    const img = event.currentTarget;
    const rect = img.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * img.naturalWidth;
    const y = ((event.clientY - rect.top) / rect.height) * img.naturalHeight;
    const centerX = img.naturalWidth / 2;
    const centerY = img.naturalHeight / 2;
    setMousePosition({ x: x - centerX, y: y - centerY });
  };

  //Sayfa veya harita görselinin boyutunu dinamik olarak tutan fonksiyon
  const handleImageLoad = () => {
    if (imageRef.current) {
      setImageSize({
        width: imageRef.current.offsetWidth,
        height: imageRef.current.offsetHeight,
      });
    }
  };

  //Harita görseli uzerine tiklandiginda nokta ekleyen fonksiyon
  const handleImageClick = async () => {
    const { x, y } = mousePosition;
    await handleAddPath(robot.id, Number(x), Number(y), 0, router);
  };

  //Sayfa veya harita görselinin boyutunu dinamik olarak tutan fonksiyon
  useEffect(() => {
    const handleResize = () => {
      if (imageRef.current) {
        setImageSize({
          width: imageRef.current.offsetWidth,
          height: imageRef.current.offsetHeight,
        });
      }
    };

    // Sayfa boyutu değiştiğinde veya bileşen yüklendiğinde resmin boyutunu güncelle
    window.addEventListener("resize", handleResize);
    handleResize(); // İlk yüklemede de boyutu ayarla

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [imageRef.current]);

  useEffect(() => {
    const fetchData = async () => {
      const map = await getMapData();
      setMapData(map);
    };

    fetchData();

    return () => {
      unsubscribeMap();
    };
  }, []);

  useEffect(() => {
    if (mapData && canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      const { width, height, data } = mapData.info;
      const imageData = ctx.createImageData(width, height);

      for (let i = 0; i < data.length; i++) {
        const value = data[i];
        const color = value === -1 ? 205 : 255 - value;
        imageData.data[i * 4] = color; // Red
        imageData.data[i * 4 + 1] = color; // Green
        imageData.data[i * 4 + 2] = color; // Blue
        imageData.data[i * 4 + 3] = 255; // Alpha
      }

      ctx.putImageData(imageData, 0, 0);
    }
  }, [mapData]);

  const robotXPos = imageSize.width / 2 + parseFloat(odomData.position.x);
  const robotYPos = imageSize.height / 2 + parseFloat(odomData.position.y);
  const robotRotation = `rotate(${imuData.yaw}rad)`;

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Layout>
        <PageHead headTitle={`Robot ${robot.id}`} />
        <div className="container h6">
          <div>
            <h4 className="text-primary">Robot ID: {robot.id}</h4>
            <RosConnection />
            {/*             <p>ROS Bağlantı Durumu: {connected ? "Bağlı." : "Bağlantı Sağlanamadı."}</p>
            <p>{ros}</p> */}
            <br />
            {/* Robota ait konum ve aci bilgileri */}
            <div>
              <div className="row">
                <div className="col-3 bg-light fw-bold">X Pozisyonu</div>
                <div className="col-3 bg-light fw-bold">Y Pozisyonu</div>
                <div className="col-3 bg-light fw-bold">Z Pozisyonu</div>
                <div className="w-100"></div>
                <div className="col-3">{odomData.position.x}</div>
                <div className="col-3">{odomData.position.y}</div>
                <div className="col-3">{odomData.position.z}</div>
              </div>
              <br />
              <div className="row">
                <div className="col-3 bg-light fw-bold">Yaw</div>
                <div className="col-3 bg-light fw-bold">Roll</div>
                <div className="col-3 bg-light fw-bold">Pitch</div>
                <div className="w-100"></div>
                <div className="col-3">{imuData.yaw}</div>
                <div className="col-3">{imuData.roll}</div>
                <div className="col-3">{imuData.pitch}</div>
              </div>
            </div>
            <br />
            <div className="row row-col-auto">
              <div className="col">
                {/* Robota ait harita gorseli */}
                <p>Harita:</p>
                {robot.photo && (
                  <div style={{ position: "relative" }}>
                    <img
                      src={`data:image/jpeg;base64,${robot.photo}`}
                      alt="Robot Harita"
                      onClick={handleImageClick}
                      onMouseMove={handleMouseMove}
                      onLoad={handleImageLoad}
                      ref={imageRef}
                    />

                    {/* Harita gorseli uzerindeki fare bilgilerinin yansitilmasi */}
                    <div className="mouse-info">
                      <p>
                        Fare Konumu: X: {mousePosition.x.toFixed(2)}, Y:{" "}
                        {mousePosition.y.toFixed(2)}
                      </p>
                    </div>
                    {/* Robota ait konum ve yönelim */}
                    <div
                      className="robot-marker"
                      style={{
                        top: `${robotYPos}px`,
                        left: `${robotXPos}px`,
                        transform: robotRotation,
                      }}
                    ></div>

                    {/* Robota ait noktalarin harita gorseli uzerinde gosterilmesi */}
                    {paths.map((path, index) => {
                      const color = nodeColors[index % nodeColors.length];
                      const xPos =
                        imageSize.width / 2 + parseFloat(path.x_position);
                      const yPos =
                        imageSize.height / 2 + parseFloat(path.y_position);
                      return (
                        <div
                          key={path.node_id}
                          className="node"
                          style={{
                            top: `${yPos}px`,
                            left: `${xPos}px`,
                            backgroundColor: color,
                          }}
                          title={`Nokta ${index + 1}: X: ${
                            path.x_position
                          } - Y: ${path.y_position}`}
                        />
                      );
                    })}
                  </div>
                )}
              </div>
              <div className="col-sm-3">
                <br />
                {/* Robota ait noktalarin yansitilmasi */}
                <h5>Robotun Yolları:</h5>
                <p className="fw-lighter">
                  (Silmek istediğiniz noktanın üzerine tıklayın.)
                </p>
                <br />
                <div>
                  <ul>
                    {paths.map((path, index) => (
                      <li key={path.node_id}>
                        <p>
                          <span
                            onClick={() => onDeletePath(path.node_id)}
                            className="text-primary text-decoration-underline"
                          >
                            Nokta {index + 1}
                          </span>
                          , X: {path.x_position}, Y: {path.y_position}, Z:{" "}
                          {path.z_position}
                        </p>
                      </li>
                    ))}
                  </ul>
                  <br />
                  <button
                    onClick={deleteAllPaths}
                    className="btn btn-outline-danger"
                  >
                    Tüm Noktaları Sil
                  </button>
                </div>
              </div>
            </div>
            <p>Robot Kayıt Tarihi: {robot.creation}</p>
          </div>
          <br />

          {/* Butonlar */}
          <div className="row">
            <div className="col">
              <Link href={`/`}>
                <button className="btn btn-primary">Ana Sayfa</button>
              </Link>
            </div>
            <div className="col-3 row">
              <div className="col-sm-6">
                <Link href={`/update-map?id=${robot.id}`}>
                  <button className="btn btn-warning">Haritayı Güncelle</button>
                </Link>
              </div>
              <div className="col-sm-6">
                <button className="btn btn-danger" onClick={onDeleteRobot}>
                  Robotu Sil
                </button>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}

export async function getStaticPaths() {
  const response = await axios.get("http://localhost:3000/api/robots");
  const robots = response.data;

  const paths = robots.map((robot) => ({
    params: { id: robot.id.toString() },
  }));

  return {
    paths,
    fallback: true,
  };
}

export async function getStaticProps({ params }) {
  const [robotRes, pathsRes] = await Promise.all([
    axios.get(`http://localhost:3000/api/robots/${params.id}`), // Robot detaylarını al
    axios.get(`http://localhost:3000/api/paths?robot_id=${params.id}`), // Robotun yollarını al
  ]);

  return {
    props: {
      robot: robotRes.data,
      paths: pathsRes.data,
    },
  };
}
