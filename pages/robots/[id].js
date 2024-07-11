import { useRouter } from "next/router";
import Link from "next/link";
import { useState } from "react";
import axios from "axios";

import Layout from "@/components/layout/Layout";
import PageHead from "@/components/layout/PageHead";

import RosConnection from "@/components/RosConnection";
import MapDisplay from "@/components/MapDisplay";
import odomListener from "@/lib/odom";

import { deletePath, deleteAllPaths } from "@/utils/handle-path";
import { deleteRobot } from "@/utils/delete-robot";
import { dijkstra } from "@/utils/dijkstra";

export default function Robot({ robots, paths }) {
  const router = useRouter(),
    odomData = odomListener();

  const [isDeletionEnabled, setIsDeletionEnabled] = useState(false),
    [pathOutput, setPathOutput] = useState(""),
    [selectedNodeId, setSelectedNodeId] = useState(null);

  const robotXPos = parseFloat(odomData.position.x),
    robotYPos = parseFloat(odomData.position.y),
    robotYaw = parseFloat(odomData.orientation.yaw);

  const robot = { id: robots.robot_id, x_position: robotXPos, y_position: robotYPos, yaw: robotYaw };

  const handlePathButton = () => {
    const path = dijkstra(paths, robotXPos, robotYPos, Number(selectedNodeId));
    setPathOutput(`Robotun Yolu: ${path.join(" -> ")}`);
  };

  const onDeleteRobot = async () => {
    await deleteRobot(robots.id);
    router.push(`/`);
  };

  const onDeletePath = async (node_id) => {
    await deletePath(node_id);
    router.reload();
  };

  const onDeleteAllPaths = async () => {
    const confirmDeleteAllPaths = confirm("Tüm yollar silinsin mi?");
    if (confirmDeleteAllPaths) {
      await deleteAllPaths(paths);
      router.reload();
    }
  };

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Layout>
        <PageHead headTitle={`Robot ${robots.id}`} />
        <div className="container h6">
          <div className="mb-5">
            <div className="mb-3">
              <h4>
                Robot ID: {robots.id}({robots.ip_address})
              </h4>
              <RosConnection />
              <p>Robot Kayıt Tarihi: {new Date(robots.creation).toLocaleString("tr-TR")}</p>
            </div>
            <div className="mb-3">
              <div className="row mb-3">
                <div className="col-3 bg-light fw-bold">X Pozisyonu</div>
                <div className="col-3 bg-light fw-bold">Y Pozisyonu</div>
                <div className="col-3 bg-light fw-bold">Z Pozisyonu</div>
                <div className="w-100"></div>
                <div className="col-3">{odomData.position.x}</div>
                <div className="col-3">{odomData.position.y}</div>
                <div className="col-3">{odomData.position.z}</div>
              </div>
              <div className="row">
                <div className="col-3 bg-light fw-bold">Yaw</div>
                <div className="col-3 bg-light fw-bold">Roll</div>
                <div className="col-3 bg-light fw-bold">Pitch</div>
                <div className="w-100"></div>
                <div className="col-3">{odomData.orientation.yaw}</div>
                <div className="col-3">{odomData.orientation.roll}</div>
                <div className="col-3">{odomData.orientation.pitch}</div>
              </div>
            </div>
            <div className="row row-col-auto">
              <div className="col">
                <MapDisplay
                  paths={paths}
                  robot={robot}
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
                <p className="fw-lighter mb-3">(Silmek istediğiniz noktanın üzerine tıklayın.)</p>
                <div className="mb-4">
                  <ul className="mb-3">
                    {paths.map((path, index) => (
                      <li key={path.node_id}>
                        <p className="text-wrap">
                          <button
                            style={{ paddingLeft: "0px" }}
                            onClick={() => onDeletePath(path.node_id)}
                            className={`text-${isDeletionEnabled ? "danger" : "muted"} btn btn-link text-decoration-none`}
                            disabled={!isDeletionEnabled}
                          >
                            Nokta {index + 1}-{path.node_id}
                          </button>
                          X: {Number(path.x_position).toFixed(3)}, Y: {Number(path.y_position).toFixed(3)}, Z: {Number(path.z_position).toFixed(3)}
                        </p>
                      </li>
                    ))}
                  </ul>
                  <div className="d-flex justify-content-end">
                    <button
                      onClick={onDeleteAllPaths}
                      className={`btn ${isDeletionEnabled ? "btn-outline-danger" : "btn-outline-secondary"}`}
                      disabled={!isDeletionEnabled}
                    >
                      Hepsini Sil
                    </button>
                  </div>
                </div>
                <div>
                  <h5>Varış Noktası:</h5>
                  <div className="d-flex mb-3">
                    <div className="me-auto">
                      <select
                        className="form-select"
                        aria-label="Hedef Nokta Seç"
                        onChange={(e) => setSelectedNodeId(e.target.value)}
                        value={selectedNodeId || ""}
                      >
                        <option value="">Seçiniz...</option>
                        {paths.map((path) => (
                          <option
                            key={path.node_id}
                            value={path.node_id}
                          >
                            Nokta-
                            {path.node_id}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <button
                        onClick={handlePathButton}
                        className={`btn col ${
                          paths.length !== 0 && selectedNodeId && odomData.position.x !== 0 ? "btn-success" : "btn-outline-secondary disabled"
                        }`}
                      >
                        Görevi Başlat
                      </button>
                    </div>
                  </div>
                  <p>{pathOutput}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="d-flex">
            <div className="me-auto">
              <Link href={`/`}>
                <button className="btn btn-primary">Ana Sayfa</button>
              </Link>
            </div>
            <div className="d-flex row row-cols-auto">
              {/*               <div className="col">
                <button
                  className="btn btn-warning"
                                    onClick={onHandleUpdateMap}
                   
                >
                  Haritayı Güncelle
                </button>
              </div>  */}
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
