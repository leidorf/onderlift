import { useRouter } from "next/router";
import Link from "next/link";
import { useState, useEffect } from "react";
import axios from "axios";

import Layout from "@/components/layout/Layout";
import PageHead from "@/components/layout/PageHead";

import odomListener from "@/lib/odom";
import imuListener from "@/lib/imu";
import useMapData from "@/utils/use-map-data";

import RosConnection from "@/components/RosConnection";
import MapDisplay from "@/components/MapDisplay";

import { deletePath } from "@/utils/handle-path";
import { nodeColors } from "@/utils/node-colors";
import { deleteRobot } from "@/utils/delete-robot";
import { updateMap } from "@/utils/update-map";

export default function Robot({ robots, paths }) {
  const router = useRouter();
  const odomData = odomListener();
  const imuData = imuListener();
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
  } = useMapData(robots.id);

  const [isDeletionEnabled, setIsDeletionEnabled] = useState(false);

  const robotXPos = imageSize.width / 2 + 10 + parseFloat(odomData.position.x) * 20;
  const robotYPos = imageSize.height / 2 - 10 + parseFloat(odomData.position.y) * -20;
  const robotRotation = `rotate(${imuData.yaw}rad)`;

  const onDeleteRobot = async () => {
    await deleteRobot(robots.id);
    router.push(`/`);
  };

  const onDeletePath = async (node_id) => {
    await deletePath(node_id);
    router.reload();
  };

  const deleteAllPaths = async () => {
    const confirmDeleteAllPaths = confirm("Tüm yollar silinsin mi?");
    if (confirmDeleteAllPaths) {
      try {
        const deletePromises = paths.map((path) => deletePath(path.node_id));
        await Promise.all(deletePromises);
        alert("Tüm yollar başarıyla silindi!");
        router.reload();
      } catch (error) {
        console.error("Yolları silme hatası:", error);
        alert("Yolları silme sırasında bir hata oluştu.");
        router.reload();
      }
    }
  };

  const handleUpdateMap = () => {
    updateMap(robots.id, mapData); // robots.id ve mapData değişkenleri mevcut bileşeninizden alınan değerlerdir
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

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Layout>
        <PageHead headTitle={`Robot ${robots.id}`} />
        <div className="container h6">
          <div>
            <h4>
              Robot ID: {robots.id}({robots.ip_address})
            </h4>
            <RosConnection />
            <br />
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
                <MapDisplay
                  isAddingNode={isAddingNode}
                  setIsAddingNode={setIsAddingNode}
                  mapData={mapData}
                  canvasRef={canvasRef}
                  handleImageClick={handleImageClick}
                  handleMouseMove={handleMouseMove}
                  handleImageLoad={handleImageLoad}
                  mousePosition={mousePosition}
                  imageSize={imageSize}
                  robotYPos={robotYPos}
                  robotXPos={robotXPos}
                  robotRotation={robotRotation}
                  paths={paths}
                  nodeColors={nodeColors}
                  robots={robots}
                />
              </div>

              <div className="col-3">
                <br />
                <div>
                  <h5>Robotun Yolları:</h5>
                  <input
                    type="checkbox"
                    checked={isDeletionEnabled}
                    onChange={() => setIsDeletionEnabled(!isDeletionEnabled)}
                  />
                  <label
                    onClick={() => setIsDeletionEnabled(!isDeletionEnabled)}
                    style={{ color: isDeletionEnabled ? "black" : "gray", cursor: "pointer", marginLeft: "5px" }}
                  >
                    Nokta silme modu
                  </label>
                </div>
                <p className="fw-lighter">(Silmek istediğiniz noktanın üzerine tıklayın.)</p>
                <br />
                <div>
                  <ul>
                    {paths.map((path, index) => (
                      <li key={path.node_id}>
                        <p className="text-wrap">
                          <button
                            onClick={() => onDeletePath(path.node_id)}
                            className={`text-${
                              isDeletionEnabled ? "danger" : "muted"
                            } btn btn-link text-decoration-none`}
                            disabled={!isDeletionEnabled}
                          >
                            Nokta {index + 1}
                          </button>
                          X: {path.x_position}, Y: {path.y_position}, Z: {Number(path.z_position).toFixed(2)}
                        </p>
                      </li>
                    ))}
                  </ul>
                  <br />
                  <button
                    onClick={deleteAllPaths}
                    className={`btn ${isDeletionEnabled ? "btn-outline-danger" : "btn-outline-secondary"}`}
                    disabled={!isDeletionEnabled}
                  >
                    Tüm Noktaları Sil
                  </button>
                </div>
              </div>
            </div>
            <p>Robot Kayıt Tarihi: {new Date(robots.creation).toLocaleString("tr-TR")}</p>
          </div>
          <br />
          <div className="d-flex">
            <div className="me-auto">
              <Link href={`/`}>
                <button className="btn btn-primary">Ana Sayfa</button>
              </Link>
            </div>
            <div className="d-flex row row-cols-auto">
              <div className="col">
                <button
                  className="btn btn-warning"
                  onClick={handleUpdateMap}
                >
                  Haritayı Güncelle
                </button>
              </div>
              <div className="col">
                <button
                  className="btn btn-danger"
                  onClick={onDeleteRobot}
                >
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

  const paths = robots.map((robots) => ({
    params: { id: robots.id.toString() },
  }));

  return {
    paths,
    fallback: true,
  };
}

export async function getStaticProps({ params }) {
  const [robotRes, pathsRes] = await Promise.all([
    axios.get(`http://localhost:3000/api/robots/${params.id}`),
    axios.get(`http://localhost:3000/api/paths?robot_id=${params.id}`),
  ]);

  return {
    props: {
      robots: robotRes.data,
      paths: pathsRes.data,
    },
  };
}
