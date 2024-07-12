import axios from "axios";

export const deleteTask = async (task_id) => {
  try {
    await axios.delete(`/api/delete-task?task_id=${task_id}`);
  } catch (error) {
    console.error("Yol silme hatası:", error);
  }
};

export const addTask = async (robot_id, waypoint_ids) => {
  try {
    const response = await axios.post("/api/add-task", {
      robot_id,
      waypoint_ids,
    });

    if (response.status === 200) {
      alert("Görev başarıyla kaydedildi");
    }
  } catch (error) {
    alert("Görev kaydedilirken bir hata oluştu");
  }
};

export const deleteWaypointConf = async (waypoint_id) => {
  try {
    const confirmDeleteWaypoint = confirm(`Yol silinsin mi?`);
    if (confirmDeleteWaypoint) {
      await axios.delete(`/api/delete-waypoint?waypoint_id=${waypoint_id}`);
      alert("Yol başarıyla silindi!");
    }
  } catch (error) {
    console.error("Yol silme hatası:", error);
    alert("Yol silme sırasında bir hata oluştu.");
  }
};

export const deleteAllWaypoints = async (waypoints) => {
  try {
    const deletePromises = waypoints.map((waypoint) => deleteWaypoint(waypoint.waypoint_id));
    await Promise.all(deletePromises);
  } catch (error) {
    console.error("Tüm yolları silerken hatayla karşılaşıldı:", error);
  }
};

export const addWaypoint = async (robotId, x, y, z) => {
  try {
    await axios.post("/api/add-waypoint", {
      robot_id: robotId,
      x_coordinate: x,
      y_coordinate: y,
      z_coordinate: z,
    });
  } catch (error) {
    console.error("Yol ekleme hatası:", error);
  }
};
