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
  const router = useRouter();
  const odomData = odomListener();

  const [isDeletionEnabled, setIsDeletionEnabled] = useState(false);

  const robotXPos = parseFloat(odomData.position.x);
  const robotYPos = parseFloat(odomData.position.y);
  const robotYaw = odomData.orientation.yaw;

  const [selectedNodeId, setSelectedNodeId] = useState(null);

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
                <div className="col-3">{odomData.orientation.yaw}</div>
                <div className="col-3">{odomData.orientation.roll}</div>
                <div className="col-3">{odomData.orientation.pitch}</div>
              </div>
            </div>
            <br />
            <div className="row row-col-auto">
              <div className="col">
                <MapDisplay
                  robot_id={robots.id}
                  paths={paths}
                  robotXPos={robotXPos}
                  robotYPos={robotYPos}
                  robotYaw={robotYaw}
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
                  <br />
                  <div className="d-flex">
                    <button
                      onClick={() => {
                        const path = dijkstra(paths, robotXPos, robotYPos, selectedNodeId);
                        console.log(path);
                      }}
                      className={`btn ${
                        paths.length !== 0 && odomData.position && odomData.position.x !== 0 ? "btn-success" : "btn-outline-secondary disabled"
                      }`}
                    >
                      Görevi Başlat
                    </button>
                    <button
                      onClick={onDeleteAllPaths}
                      className={`btn ms-auto ${isDeletionEnabled ? "btn-outline-danger" : "btn-outline-secondary"}`}
                      disabled={!isDeletionEnabled}
                    >
                      Hepsini Sil
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <p>Robot Kayıt Tarihi: {new Date(robots.creation).toLocaleString("tr-TR")}</p>
          </div>
          <p>Robota en yakın noktanın ID'si:</p>
          <div>
            <h5>Hedef Nokta Seç:</h5>
            <select
              className="dropdown"
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
          <br />
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
