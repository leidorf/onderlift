import { useRouter } from "next/router";
import Link from "next/link";
import { useState } from "react";
import axios from "axios";
import { Modal, Button } from "react-bootstrap";

import Layout from "@/components/layout/Layout";
import PageHead from "@/components/layout/PageHead";

import RosConnection from "@/components/RosConnection";
import MapDisplay from "@/components/MapDisplay";
import odomListener from "@/lib/odom";

import { deleteWaypoint, deleteAllWaypoints } from "@/utils/handle-waypoint";
import { deleteRobot, updateRobot } from "@/utils/handle-robot";
import { dijkstra } from "@/utils/dijkstra";
import { addTask, assignTask, deleteTask } from "@/utils/handle-task";

export default function Robot({ robots, waypoints, tasks }) {
  const router = useRouter(),
    odomData = odomListener();

  const [isDeletionEnabled, setIsDeletionEnabled] = useState(false),
    [dijkstraResult, setDijkstraResult] = useState([]),
    [targetWaypointId, setTargetWaypointId] = useState(null),
    [showModal, setShowModal] = useState(false),
    [robot_ip, setRobotIp] = useState(robots.ip_address);

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
    router.replace(router.asPath);
  };

  const onDeleteTask = async (task_id) => {
    await deleteTask(task_id);
    router.replace(router.asPath);
  };

  const onDeleteRobot = async () => {
    await deleteRobot(robots.robot_id);
    router.push(`/`);
  };

  const onUpdateRobot = async () => {
    await updateRobot(robots.robot_id, robot_ip);
    setShowModal(false);
    router.replace(router.asPath);
  };

  const showUpdateModal = async () => {
    setShowModal(true);
  };

  const onDeleteWaypoint = async (waypoint_id) => {
    await deleteWaypoint(waypoint_id);
    router.replace(router.asPath);
  };

  const onDeleteAllWaypoints = async () => {
    const confirmDeleteAllWaypoints = confirm("Tüm yollar silinsin mi?");
    if (confirmDeleteAllWaypoints) {
      await deleteAllWaypoints(waypoints);
      router.replace(router.asPath);
    }
  };

  const onAssignTask = async (task_id) => {
    await assignTask(task_id);
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
                Robot ID: {robots.robot_id} ({robots.ip_address})
              </h4>
              <RosConnection ipAddress={robots.ip_address} />
              <p>Robot Kayıt Tarihi: {new Date(robots.created_at).toLocaleString("tr-TR")}</p>
              <hr />
            </div>

            <div className="row">
              <div className="mb-4 col">
                <div className="row mb-3">
                  <div className="col-3">
                    <span className="fw-bolder">X Pozisyonu </span>
                    <br /> {robot.x_coordinate}
                  </div>
                  <div className="col-3">
                    <span className="fw-bolder">Y Pozisyonu</span>
                    <br /> {robot.y_coordinate}
                  </div>
                  <div className="col-3">
                    <span className="fw-bolder">Z Pozisyonu</span>
                    <br /> {robot.z_coordinate}
                  </div>
                </div>
                <div className="row mb-4">
                  <div className="col-3">
                    <span className="fw-bolder">Yaw</span> <br /> {robot.yaw}
                  </div>
                  <div className="col-3">
                    <span className="fw-bolder">Roll</span>
                    <br /> {robot.roll}
                  </div>
                  <div className="col-3">
                    <span className="fw-bolder">Pitch</span>
                    <br /> {robot.pitch}
                  </div>
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
                <div>
                  <ul className="mb-2">
                    {waypoints.map((waypoint) => (
                      <li key={waypoint.waypoint_id}>
                        <p className="text-wrap">
                          <button
                            style={{ paddingLeft: "0px" }}
                            onClick={() => onDeleteWaypoint(waypoint.waypoint_id)}
                            className={`${isDeletionEnabled ? "text-danger" : "text-muted"} btn btn-link`}
                            disabled={!isDeletionEnabled}
                            title={"Noktayı silmek için tıklayın"}
                          >
                            Nokta {waypoint.waypoint_id}
                          </button>
                          X: {Number(waypoint.x_coordinate).toFixed(3)}, Y: {Number(waypoint.y_coordinate).toFixed(3)}, Z: {Number(waypoint.z_coordinate).toFixed(3)}
                        </p>
                      </li>
                    ))}
                  </ul>
                  <div className="d-flex justify-content-end mb-4">
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
                  <h5>Hedef Nokta:</h5>
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
                        className={`btn col ${waypoints.length !== 0 && targetWaypointId && robot.x_coordinate !== 0 ? "btn-outline-primary" : "btn-outline-secondary disabled"}`}
                      >
                        Yolu Göster
                      </button>
                    </div>
                  </div>
                  {dijkstraResult && (
                    <>
                      <p>Hedef nokta için bulunan en kısa yol:</p>
                      <p
                        className="mb-3 text-decoration-underline fw-bold text-primary"
                        onClick={onAddTask}
                        style={{ cursor: "pointer" }}
                        title={`Görevi kaydetmek için tıklayın`}
                      >
                        {dijkstraResult.join(" -> ")}
                      </p>
                    </>
                  )}
                  <div>
                    <h5 className="mb-3">Robotun Görevleri:</h5>
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
                              onClick={() => onAssignTask(task.task_id)}
                              title={`Görevi Başlat`}
                            >
                              ✔
                            </button>
                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() => onDeleteTask(task.task_id)}
                              title={`Görevi Sil`}
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
            <div className="d-flex col-3">
              <div className="me-auto ms-3">
                <button
                  className="btn btn-warning"
                  onClick={showUpdateModal}
                >
                  Robotu Güncelle
                </button>
              </div>
              <div className="">
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

      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Robotu Güncelle</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
            <div className="mb-3">
              <label
                htmlFor="robot_ip"
                className="form-label"
              >
                IP Adresi
              </label>
              <input
                type="text"
                className="form-control"
                id="robot_ip"
                value={robot_ip}
                onChange={(e) => setRobotIp(e.target.value)}
              />
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <div className="d-flex justify-content-between w-100">
            <Button
              variant="success"
              onClick={onUpdateRobot}
            >
              Kaydet
            </Button>
            <Button
              variant="danger"
              onClick={() => setShowModal(false)}
            >
              Kapat
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
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
    axios.get(`http://localhost:3000/api/robot/?robot_id=${params.id}`),
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
