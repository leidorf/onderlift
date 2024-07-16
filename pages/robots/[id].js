import { useRouter } from "next/router";
import Link from "next/link";
import { useState } from "react";
import axios from "axios";

import Layout from "@/components/layout/Layout";
import PageHead from "@/components/layout/PageHead";

import RosConnection from "@/components/RosConnection";
import MapDisplay from "@/components/MapDisplay";
import odomListener from "@/lib/odom";
import { sendTaskToROS } from "@/lib/assign-task";

import { deleteWaypoint, deleteAllWaypoints } from "@/utils/handle-waypoint";
import { deleteRobot } from "@/utils/delete-robot";
import { dijkstra } from "@/utils/dijkstra";
import { addTask, deleteTask } from "@/utils/handle-task";

export default function Robot({ robots, waypoints, tasks }) {
  const router = useRouter(),
    odomData = odomListener();

  const [isDeletionEnabled, setIsDeletionEnabled] = useState(false),
    [dijkstraResult, setDijkstraResult] = useState([]),
    [targetWaypointId, setTargetWaypointId] = useState(null);

  const robot = {
    id: robots.robot_id,
    x_coordinate: parseFloat(odomData.position.x),
    y_coordinate: parseFloat(odomData.position.y),
    z_coordinate: parseFloat(odomData.position.z),
    yaw: parseFloat(odomData.orientation.yaw),
    roll: parseFloat(odomData.orientation.roll),
    pitch: parseFloat(odomData.orientation.pitch),
  };

  const showShortestPath = async () => {
    setDijkstraResult(dijkstra(waypoints, robot, Number(targetWaypointId)));
  };

  const onAddTask = async () => {
    await addTask(robots.robot_id, dijkstraResult);
    router.reload();
  };

  const onDeleteTask = async (task_id) => {
    await deleteTask(task_id);
    router.reload();
  };

  const onDeleteRobot = async () => {
    await deleteRobot(robots.robot_id);
    router.push(`/`);
  };

  const onDeleteWaypoint = async (waypoint_id) => {
    await deleteWaypoint(waypoint_id);
    router.reload();
  };

  const onDeleteAllWaypoints = async () => {
    const confirmDeleteAllWaypoints = confirm("Tüm yollar silinsin mi?");
    if (confirmDeleteAllWaypoints) {
      await deleteAllWaypoints(waypoints);
      router.reload();
    }
  };

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Layout>
        <PageHead headTitle={`Robot ${robots.robot_id}`} />
        <div className="container h6">
          <div className="mb-5">
            <div className="mb-3">
              <h4>
                Robot ID: {robots.robot_id}({robots.ip_address})
              </h4>
              <RosConnection />
              <p>Robot Kayıt Tarihi: {new Date(robots.created_at).toLocaleString("tr-TR")}</p>
            </div>
            <div className="row">
              <div className="mb-3 col">
                <div className="row mb-3">
                  <div className="col-4 bg-light fw-bold">X Pozisyonu</div>
                  <div className="col-4 bg-light fw-bold">Y Pozisyonu</div>
                  <div className="col-4 bg-light fw-bold">Z Pozisyonu</div>
                  <div className="w-100"></div>
                  <div className="col-4">{robot.x_coordinate}</div>
                  <div className="col-4">{robot.y_coordinate}</div>
                  <div className="col-4">{robot.z_coordinate}</div>
                </div>
                <div className="row mb-3">
                  <div className="col-4 bg-light fw-bold">Yaw</div>
                  <div className="col-4 bg-light fw-bold">Roll</div>
                  <div className="col-4 bg-light fw-bold">Pitch</div>
                  <div className="w-100"></div>
                  <div className="col-4">{robot.yaw}</div>
                  <div className="col-4">{robot.roll}</div>
                  <div className="col-4">{robot.pitch}</div>
                </div>
                <div className="col">
                  <MapDisplay
                    waypoints={waypoints}
                    robot={robot}
                  />
                </div>
              </div>
              <div className="col-3">
                <div>
                  <h5>Hareket Noktaları:</h5>
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
                <div>
                  <ul className="mb-3">
                    {waypoints.map((waypoint, index) => (
                      <li key={waypoint.waypoint_id}>
                        <p className="text-wrap">
                          <button
                            style={{ paddingLeft: "0px" }}
                            onClick={() => onDeleteWaypoint(waypoint.waypoint_id)}
                            className={`${isDeletionEnabled ? "text-danger" : "text-muted"} btn btn-link text-decoration-none`}
                            disabled={!isDeletionEnabled}
                          >
                            Nokta {index + 1}-{waypoint.waypoint_id}
                          </button>
                          X: {Number(waypoint.x_coordinate).toFixed(3)}, Y: {Number(waypoint.y_coordinate).toFixed(3)}, Z:{" "}
                          {Number(waypoint.z_coordinate).toFixed(3)}
                        </p>
                      </li>
                    ))}
                  </ul>
                  <div className="d-flex justify-content-end">
                    <button
                      onClick={onDeleteAllWaypoints}
                      className={`btn ${isDeletionEnabled ? "btn-outline-danger" : "btn-outline-secondary"}`}
                      disabled={!isDeletionEnabled}
                    >
                      Hepsini Sil
                    </button>
                  </div>
                  <hr />
                </div>
                <div>
                  <h5>Varış Noktası:</h5>
                  <div className="d-flex mb-3">
                    <div className="me-auto">
                      <select
                        className="form-select"
                        aria-label="Hedef Nokta Seç"
                        onChange={(e) => setTargetWaypointId(e.target.value)}
                        value={targetWaypointId || ""}
                      >
                        <option value="">Seçiniz...</option>
                        {waypoints.map((waypoint) => (
                          <option
                            key={waypoint.waypoint_id}
                            value={waypoint.waypoint_id}
                          >
                            Nokta-
                            {waypoint.waypoint_id}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <button
                        onClick={showShortestPath}
                        className={`btn col ${
                          waypoints.length !== 0 && targetWaypointId && robot.x_coordinate !== 0 ? "btn-success" : "btn-outline-secondary disabled"
                        }`}
                      >
                        Yolu Göster
                      </button>
                    </div>
                  </div>
                  {dijkstraResult && (
                    <>
                      <p>Hedef nokta için bulunan en kısa yol:</p>
                      <p className="fw-lighter text-nowrap">(Görevi kaydetmek için yolun üstüne tıklayın.)</p>
                      <p
                        className="mb-3 text-decoration-underline fw-bold text-primary"
                        onClick={onAddTask}
                        style={{ cursor: "pointer" }}
                      >
                        {dijkstraResult.join(" -> ")}
                      </p>
                    </>
                  )}
                  <div>
                    <h5 className="mb-3">Robotun Görevi:</h5>
                    <ul>
                      {tasks.map((task) => (
                        <li
                          key={task.task_id}
                          className="mb-3"
                        >
                          Görev ID: {task.task_id} ({new Date(task.created_at).toLocaleString("tr-TR")})
                          <br />
                          <div className="d-flex align-items-center hstack gap-1">
                            {task.waypoint_ids.split(",").join(" -> ")}
                            <button
                              className="btn btn-sm btn-success ms-auto"
                              /*                               onClick={() => handleSendTask(task.task_id)}
                               */
                            >
                              ✔
                            </button>
                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() => onDeleteTask(task.task_id)}
                            >
                              ✕
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
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

  const paths = robots.map((robot) => ({
    params: { id: robot.robot_id.toString() },
  }));

  return {
    paths,
    fallback: true,
  };
}

export async function getStaticProps({ params }) {
  const [robotRes, waypointRes, taskRes] = await Promise.all([
    axios.get(`http://localhost:3000/api/robots/${params.id}`),
    axios.get(`http://localhost:3000/api/waypoints?robot_id=${params.id}`),
    axios.get(`http://localhost:3000/api/tasks?robot_id=${params.id}`),
  ]);

  return {
    props: {
      robots: robotRes.data,
      waypoints: waypointRes.data,
      tasks: taskRes.data,
    },
  };
}
